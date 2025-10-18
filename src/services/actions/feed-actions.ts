import { ThunkAction } from 'redux-thunk';
import { 
  FETCH_FEED_REQUEST,
  FETCH_FEED_SUCCESS,
  FETCH_FEED_ERROR,
  SET_FEED_ORDERS,
  SET_FEED_STATS,
  SET_FEED_WEBSOCKET_STATUS,
  SET_FEED_WEBSOCKET_ERROR,
  CLEAR_FEED
} from './action-types';
import { IRootState, TAllActions, IOrder, TWebSocketStatus } from '../../utils/types';
import { parseWebSocketMessage, createWebSocketConnection } from '../middleware/websocket-middleware';

/**
 * Action creators для ленты заказов
 */

/** Запрос на загрузку ленты заказов */
export const fetchFeedRequest = () => ({
  type: FETCH_FEED_REQUEST
});

/** Успешная загрузка ленты заказов */
export const fetchFeedSuccess = (orders: IOrder[]) => ({
  type: FETCH_FEED_SUCCESS,
  payload: orders
});

/** Ошибка при загрузке ленты заказов */
export const fetchFeedError = (error: string) => ({
  type: FETCH_FEED_ERROR,
  payload: error
});

/** Установка заказов в ленте */
export const setFeedOrders = (orders: IOrder[]) => ({
  type: SET_FEED_ORDERS,
  payload: orders
});

/** Установка статистики ленты */
export const setFeedStats = (stats: { total: number; totalToday: number; ready: number[]; inProgress: number[] }) => ({
  type: SET_FEED_STATS,
  payload: stats
});

/** Установка статуса WebSocket соединения ленты */
export const setFeedWebSocketStatus = (status: TWebSocketStatus) => ({
  type: SET_FEED_WEBSOCKET_STATUS,
  payload: status
});

/** Установка ошибки WebSocket соединения ленты */
export const setFeedWebSocketError = (error: string | null) => ({
  type: SET_FEED_WEBSOCKET_ERROR,
  payload: error
});

/** Очистка ленты заказов */
export const clearFeed = () => ({
  type: CLEAR_FEED
});

/**
 * Thunk actions для ленты заказов
 */

/** Подключение к WebSocket для получения ленты заказов */
export const connectFeedWebSocket = (): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return async (dispatch, getState) => {
    const state = getState();
    
    // Если уже подключены, не подключаемся повторно
    if (state.feed.status === 'OPEN' || state.feed.status === 'CONNECTING') {
      return;
    }

    dispatch(setFeedWebSocketStatus('CONNECTING'));
    dispatch(setFeedWebSocketError(null));
    dispatch(fetchFeedRequest()); // Устанавливаем состояние загрузки

    const wsUrl = 'wss://norma.nomoreparties.space/orders/all';
    
    // Создаем WebSocket соединение с помощью универсального middleware
    const wsConnection = createWebSocketConnection(
      wsUrl,
      dispatch,
      setFeedWebSocketStatus,
      setFeedWebSocketError,
      loadFeedDataViaHTTP
    );

    // Настраиваем обработчики событий
    wsConnection.onopen(() => {
      console.log('WebSocket соединение установлено для ленты заказов');
    });

    wsConnection.onmessage((event) => {
      // Используем переиспользуемую функцию парсинга и валидации
      const parsedData = parseWebSocketMessage(event.data);
      
      if (!parsedData.success) {
        if (parsedData.error) {
          dispatch(setFeedWebSocketError(parsedData.error));
        }
        return;
      }
      
      // Полная замена ленты заказов при каждом обновлении
      dispatch(setFeedOrders(parsedData.orders));
      dispatch(fetchFeedSuccess(parsedData.orders)); // Завершаем загрузку
      
      // Обновляем статистику если есть данные
      if (parsedData.total !== undefined && parsedData.totalToday !== undefined) {
        // Группируем заказы по статусам
        const ready: number[] = [];
        const inProgress: number[] = [];
        
        parsedData.orders.forEach((order: IOrder) => {
          if (order.status === 'done') {
            ready.push(order.number);
          } else if (order.status === 'pending' || order.status === 'created') {
            inProgress.push(order.number);
          }
        });
        
        dispatch(setFeedStats({
          total: parsedData.total,
          totalToday: parsedData.totalToday,
          ready,
          inProgress
        }));
      }
    });

    wsConnection.onclose(() => {
      console.log('WebSocket соединение закрыто, используем HTTP fallback');
    });

    // Сохраняем WebSocket соединение для возможности закрытия
    (window as any).feedWebSocket = wsConnection;
    
    // Подключаемся
    await wsConnection.connect();
  };
};

/** Отключение от WebSocket ленты заказов */
export const disconnectFeedWebSocket = (): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return (dispatch) => {
    const wsConnection = (window as any).feedWebSocket;
    
    if (wsConnection) {
      wsConnection.disconnect();
      (window as any).feedWebSocket = null;
    }
    
    dispatch(setFeedWebSocketStatus('CLOSED'));
    dispatch(setFeedWebSocketError(null));
  };
};

/** Загрузка данных ленты заказов через HTTP как fallback */
export const loadFeedDataViaHTTP = (): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return async (dispatch) => {
    try {
      console.log('Загружаем данные ленты заказов через HTTP...');
      
      // Пытаемся загрузить данные через HTTP API
      const response = await fetch('https://norma.nomoreparties.space/api/orders/all');
      
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
          dispatch(setFeedOrders(validOrders));
          dispatch(fetchFeedSuccess(validOrders)); // Завершаем загрузку
          
          // Обновляем статистику если есть данные
          if (data.total !== undefined && data.totalToday !== undefined) {
            // Группируем заказы по статусам
            const ready: number[] = [];
            const inProgress: number[] = [];
            
            validOrders.forEach((order: IOrder) => {
              if (order.status === 'done') {
                ready.push(order.number);
              } else if (order.status === 'pending' || order.status === 'created') {
                inProgress.push(order.number);
              }
            });
            
            dispatch(setFeedStats({
              total: data.total,
              totalToday: data.totalToday,
              ready,
              inProgress
            }));
          }
          
          console.log('Данные ленты заказов загружены через HTTP');
        } else {
          throw new Error('Некорректные данные заказов');
        }
      } else {
        throw new Error('Некорректный ответ сервера');
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных через HTTP:', error);
      dispatch(setFeedWebSocketError('Не удалось загрузить данные'));
      dispatch(fetchFeedError('Не удалось загрузить данные'));
    }
  };
};

/** Получение конкретного заказа по номеру */
export const fetchOrderById = (orderNumber: number): ThunkAction<void, IRootState, unknown, TAllActions> => {
  return async (dispatch) => {
    try {
      const response = await fetch(`https://norma.nomoreparties.space/api/orders/${orderNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.orders && data.orders.length > 0) {
        const order = data.orders[0];
        dispatch(setFeedOrders([order]));
      }
    } catch (error) {
      console.error('Ошибка получения заказа:', error);
      dispatch(setFeedWebSocketError('Ошибка получения заказа'));
    }
  };
};
