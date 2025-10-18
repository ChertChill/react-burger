import { ThunkAction } from 'redux-thunk';
import { 
  FETCH_PROFILE_ORDERS_REQUEST,
  FETCH_PROFILE_ORDERS_SUCCESS,
  FETCH_PROFILE_ORDERS_ERROR,
  SET_PROFILE_ORDERS,
  SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
  SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
  CLEAR_PROFILE_ORDERS
} from './action-types';
import { IRootState, TAllActions, IOrder, TWebSocketStatus } from '../../utils/types';
import { tokenUtils } from '../../utils/tokenUtils';
import { parseWebSocketMessage, createWebSocketConnection } from '../middleware/websocket-middleware';

/**
 * Action creators для истории заказов пользователя
 */

/** Запрос на загрузку истории заказов */
export const fetchProfileOrdersRequest = () => ({
  type: FETCH_PROFILE_ORDERS_REQUEST
});

/** Успешная загрузка истории заказов */
export const fetchProfileOrdersSuccess = (orders: IOrder[]) => ({
  type: FETCH_PROFILE_ORDERS_SUCCESS,
  payload: orders
});

/** Ошибка при загрузке истории заказов */
export const fetchProfileOrdersError = (error: string) => ({
  type: FETCH_PROFILE_ORDERS_ERROR,
  payload: error
});

/** Установка заказов в истории */
export const setProfileOrders = (orders: IOrder[]) => ({
  type: SET_PROFILE_ORDERS,
  payload: orders
});

/** Установка статуса WebSocket соединения истории */
export const setProfileOrdersWebSocketStatus = (status: TWebSocketStatus) => ({
  type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
  payload: status
});

/** Установка ошибки WebSocket соединения истории */
export const setProfileOrdersWebSocketError = (error: string | null) => ({
  type: SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
  payload: error
});

/** Очистка истории заказов */
export const clearProfileOrders = () => ({
  type: CLEAR_PROFILE_ORDERS
});

/**
 * Thunk actions для истории заказов пользователя
 */

/** Подключение к WebSocket для получения истории заказов пользователя */
export const connectProfileOrdersWebSocket = (): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return async (dispatch, getState) => {
    const state = getState();
    
    // Если уже подключены, не подключаемся повторно
    if (state.profileOrders.status === 'OPEN' || state.profileOrders.status === 'CONNECTING') {
      return;
    }

    // Проверяем наличие токена доступа
    const accessToken = tokenUtils.getAccessToken();
    if (!accessToken) {
      dispatch(setProfileOrdersWebSocketError('Требуется авторизация'));
      return;
    }

    dispatch(setProfileOrdersWebSocketStatus('CONNECTING'));
    dispatch(setProfileOrdersWebSocketError(null));
    dispatch(fetchProfileOrdersRequest()); // Устанавливаем состояние загрузки

    const wsUrl = `wss://norma.nomoreparties.space/orders?token=${accessToken}`;
    
    // Создаем WebSocket соединение с помощью универсального middleware
    const wsConnection = createWebSocketConnection(
      wsUrl,
      dispatch,
      setProfileOrdersWebSocketStatus,
      setProfileOrdersWebSocketError,
      loadProfileOrdersDataViaHTTP
    );

    // Настраиваем обработчики событий
    wsConnection.onopen(() => {
      console.log('WebSocket соединение установлено для истории заказов');
    });

    wsConnection.onmessage((event) => {
      // Используем переиспользуемую функцию парсинга и валидации
      const parsedData = parseWebSocketMessage(event.data);
      
      if (!parsedData.success) {
        if (parsedData.error) {
          dispatch(setProfileOrdersWebSocketError(parsedData.error));
          // Если ошибка связана с токеном, закрываем соединение
          if (parsedData.error.includes('токен') || parsedData.error.includes('Invalid')) {
            wsConnection.disconnect();
          }
        }
        return;
      }
      
      // Полная замена истории заказов при каждом обновлении
      dispatch(setProfileOrders(parsedData.orders));
      dispatch(fetchProfileOrdersSuccess(parsedData.orders)); // Завершаем загрузку
    });

    wsConnection.onclose(() => {
      console.log('WebSocket соединение закрыто, используем HTTP fallback');
    });

    // Сохраняем WebSocket соединение для возможности закрытия
    (window as any).profileOrdersWebSocket = wsConnection;
    
    // Подключаемся
    await wsConnection.connect();
  };
};

/** Отключение от WebSocket истории заказов */
export const disconnectProfileOrdersWebSocket = (): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return (dispatch) => {
    const wsConnection = (window as any).profileOrdersWebSocket;
    
    if (wsConnection) {
      wsConnection.disconnect();
      (window as any).profileOrdersWebSocket = null;
    }
    
    dispatch(setProfileOrdersWebSocketStatus('CLOSED'));
    dispatch(setProfileOrdersWebSocketError(null));
  };
};

/** Загрузка данных истории заказов через HTTP как fallback */
export const loadProfileOrdersDataViaHTTP = (): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return async (dispatch) => {
    try {
      console.log('Загружаем данные истории заказов через HTTP...');
      
      const accessToken = tokenUtils.getAccessToken();
      if (!accessToken) {
        throw new Error('Требуется авторизация');
      }
      
      // Пытаемся загрузить данные через HTTP API
      const response = await fetch('https://norma.nomoreparties.space/api/orders', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.orders && Array.isArray(data.orders)) {
        // Валидируем данные заказов
        const validOrders = data.orders.filter((order: any) => {
          return order && 
                 typeof order._id === 'string' &&
                 typeof order.number === 'number' &&
                 typeof order.status === 'string' &&
                 typeof order.name === 'string' &&
                 Array.isArray(order.ingredients) &&
                 typeof order.createdAt === 'string' &&
                 typeof order.updatedAt === 'string';
        });
        
        if (validOrders.length > 0) {
          dispatch(setProfileOrders(validOrders));
          dispatch(fetchProfileOrdersSuccess(validOrders)); // Завершаем загрузку
          console.log('Данные истории заказов загружены через HTTP');
        } else {
          throw new Error('Некорректные данные заказов');
        }
      } else {
        throw new Error('Некорректный ответ сервера');
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных через HTTP:', error);
      dispatch(setProfileOrdersWebSocketError('Не удалось загрузить данные'));
      dispatch(fetchProfileOrdersError('Не удалось загрузить данные'));
    }
  };
};

/** Получение конкретного заказа пользователя по номеру */
export const fetchProfileOrderById = (orderNumber: number): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return async (dispatch) => {
    try {
      const accessToken = tokenUtils.getAccessToken();
      if (!accessToken) {
        dispatch(setProfileOrdersWebSocketError('Требуется авторизация'));
        return;
      }

      const response = await fetch(`https://norma.nomoreparties.space/api/orders/${orderNumber}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.orders && data.orders.length > 0) {
        const order = data.orders[0];
        dispatch(setProfileOrders([order]));
      }
    } catch (error) {
      console.error('Ошибка получения заказа пользователя:', error);
      dispatch(setProfileOrdersWebSocketError('Ошибка получения заказа'));
    }
  };
};
