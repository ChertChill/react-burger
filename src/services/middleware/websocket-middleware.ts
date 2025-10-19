import { Middleware } from 'redux';
import { IRootState, TWebSocketStatus } from '../../utils/types';
import { tokenUtils, refreshTokenUtils } from '../../utils/tokenUtils';
import { API_BASE_URL } from '../../utils/constants';

/**
 * Интерфейс для WebSocket соединения
 */
export interface IWebSocketConnection {
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (message: string) => void;
  onmessage: (handler: (event: MessageEvent) => void) => void;
  onclose: (handler: (event: CloseEvent) => void) => void;
  onerror: (handler: (event: Event) => void) => void;
  onopen: (handler: () => void) => void;
}

/**
 * Создает универсальное WebSocket соединение с заданным URL
 * @param url - URL для WebSocket соединения
 * @param dispatch - функция dispatch для отправки actions
 * @param statusAction - action для установки статуса соединения
 * @param errorAction - action для установки ошибки соединения
 * @param fallbackAction - action для fallback загрузки данных
 * @returns объект с методами управления соединением
 */
export const createWebSocketConnection = (
  url: string,
  dispatch: any,
  statusAction: (status: TWebSocketStatus) => any,
  errorAction: (error: string | null) => any,
  fallbackAction: () => any
): IWebSocketConnection => {
  let ws: WebSocket | null = null;
  let connectionTimeout: NodeJS.Timeout | null = null;
  let messageHandler: ((event: MessageEvent) => void) | null = null;
  let closeHandler: ((event: CloseEvent) => void) | null = null;
  let errorHandler: ((event: Event) => void) | null = null;
  let openHandler: (() => void) | null = null;

  const connect = async (): Promise<void> => {
    // Проверяем доступность сервера
    const isServerAvailable = await checkWebSocketAvailability(url);
    
    if (!isServerAvailable) {
      console.log('WebSocket сервер недоступен, используем HTTP fallback');
      dispatch(statusAction('CLOSED' as TWebSocketStatus));
      dispatch(errorAction('Сервер недоступен'));
      dispatch(fallbackAction());
      return;
    }

    try {
      ws = new WebSocket(url);
      
      // Устанавливаем таймаут для соединения
      connectionTimeout = setTimeout(() => {
        if (ws && ws.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket соединение превысило таймаут, переключаемся на HTTP');
          ws.close();
          dispatch(errorAction('Таймаут соединения'));
          dispatch(statusAction('CLOSED' as TWebSocketStatus));
          dispatch(fallbackAction());
        }
      }, 5000);
      
      ws.onopen = () => {
        if (connectionTimeout) clearTimeout(connectionTimeout);
        dispatch(statusAction('OPEN' as TWebSocketStatus));
        dispatch(errorAction(null));
        if (openHandler) openHandler();
      };

      ws.onmessage = (event) => {
        if (messageHandler) messageHandler(event);
      };

      ws.onerror = (error) => {
        if (connectionTimeout) clearTimeout(connectionTimeout);
        dispatch(errorAction('Ошибка соединения'));
        dispatch(statusAction('CLOSED' as TWebSocketStatus));
        if (errorHandler) errorHandler(error);
        dispatch(fallbackAction());
      };

      ws.onclose = (event) => {
        if (connectionTimeout) clearTimeout(connectionTimeout);
        dispatch(statusAction('CLOSED' as TWebSocketStatus));
        if (closeHandler) closeHandler(event);
      };
      
    } catch (error) {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      dispatch(errorAction('Ошибка создания соединения'));
      dispatch(statusAction('CLOSED' as TWebSocketStatus));
      dispatch(fallbackAction());
    }
  };

  const disconnect = (): void => {
    if (ws) {
      ws.close();
      ws = null;
    }
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      connectionTimeout = null;
    }
    dispatch(statusAction('CLOSED' as TWebSocketStatus));
    dispatch(errorAction(null));
  };

  const send = (message: string): void => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  const onmessage = (handler: (event: MessageEvent) => void): void => {
    messageHandler = handler;
  };

  const onclose = (handler: (event: CloseEvent) => void): void => {
    closeHandler = handler;
  };

  const onerror = (handler: (event: Event) => void): void => {
    errorHandler = handler;
  };

  const onopen = (handler: () => void): void => {
    openHandler = handler;
  };

  return {
    connect,
    disconnect,
    send,
    onmessage,
    onclose,
    onerror,
    onopen
  };
};

/**
 * Проверка доступности WebSocket сервера
 */
const checkWebSocketAvailability = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const testWs = new WebSocket(url);
    let resolved = false;
    
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        testWs.close();
      }
    };
    
    testWs.onopen = () => {
      cleanup();
      resolve(true);
    };
    
    testWs.onerror = () => {
      cleanup();
      resolve(false);
    };
    
    testWs.onclose = () => {
      cleanup();
      resolve(false);
    };
    
    // Таймаут для проверки
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 3000);
  });
};

/**
 * Переиспользуемый middleware для обработки WebSocket соединений
 * Обеспечивает автоматическое обновление токенов и восстановление соединений
 */
export const websocketMiddleware: Middleware<{}, IRootState, any> = (store) => (next) => (action: any) => {
  const result = next(action);
  
  // Обрабатываем ошибки WebSocket соединений
  if (action.type === 'SET_FEED_WEBSOCKET_ERROR' || action.type === 'SET_PROFILE_ORDERS_WEBSOCKET_ERROR') {
    const error = action.payload;
    
    // Если ошибка связана с токеном, пытаемся обновить токен
    if (error && (error.includes('токен') || error.includes('token') || error.includes('авторизац') || error.includes('Invalid'))) {
      handleTokenRefresh(store);
    }
  }
  
  return result;
};

/**
 * Валидация данных заказа
 * Проверяет корректность всех полей заказа
 */
export const validateOrderData = (order: any): boolean => {
  if (!order || typeof order !== 'object') {
    return false;
  }
  
  // Проверяем обязательные поля
  const requiredFields = ['_id', 'number', 'status', 'name', 'ingredients', 'createdAt', 'updatedAt'];
  for (const field of requiredFields) {
    if (!(field in order)) {
      console.warn(`Заказ пропущен: отсутствует поле ${field}`, order);
      return false;
    }
  }
  
  // Проверяем типы полей
  if (typeof order._id !== 'string' || order._id.length === 0) {
    console.warn('Заказ пропущен: некорректный _id', order);
    return false;
  }
  
  if (typeof order.number !== 'number' || order.number <= 0) {
    console.warn('Заказ пропущен: некорректный номер', order);
    return false;
  }
  
  if (typeof order.status !== 'string' || !['created', 'pending', 'done', 'cancelled'].includes(order.status)) {
    console.warn('Заказ пропущен: некорректный статус', order);
    return false;
  }
  
  if (typeof order.name !== 'string' || order.name.length === 0) {
    console.warn('Заказ пропущен: некорректное название', order);
    return false;
  }
  
  if (!Array.isArray(order.ingredients)) {
    console.warn('Заказ пропущен: некорректные ингредиенты', order);
    return false;
  }
  
  if (typeof order.createdAt !== 'string' || isNaN(Date.parse(order.createdAt))) {
    console.warn('Заказ пропущен: некорректная дата создания', order);
    return false;
  }
  
  if (typeof order.updatedAt !== 'string' || isNaN(Date.parse(order.updatedAt))) {
    console.warn('Заказ пропущен: некорректная дата обновления', order);
    return false;
  }
  
  return true;
};

/**
 * Парсинг и валидация WebSocket сообщения
 * Обрабатывает JSON строку и валидирует данные заказов
 */
export const parseWebSocketMessage = (message: string) => {
  try {
    const data = JSON.parse(message);
    
    if (!data || typeof data !== 'object') {
      throw new Error('Некорректный формат данных');
    }
    
    // Проверяем на ошибку авторизации
    if (!data.success && data.message === 'Invalid or missing token') {
      return {
        success: false,
        error: 'Токен устарел или недействителен',
        orders: []
      };
    }
    
    if (data.success && data.orders && Array.isArray(data.orders)) {
      // Валидируем каждый заказ
      const validOrders = data.orders.filter(validateOrderData);
      
      return {
        success: true,
        orders: validOrders,
        total: data.total,
        totalToday: data.totalToday
      };
    }
    
    return {
      success: false,
      error: 'Некорректные данные заказов',
      orders: []
    };
    
  } catch (error) {
    console.error('Ошибка парсинга WebSocket сообщения:', error);
    return {
      success: false,
      error: 'Ошибка обработки данных',
      orders: []
    };
  }
};

/**
 * Обработка обновления токена доступа
 */
const handleTokenRefresh = async (store: any) => {
  try {
    const refreshToken = refreshTokenUtils.getRefreshToken();
    
    if (!refreshToken) {
      console.error('Нет refresh токена для обновления');
      return;
    }
    
    const response = await fetch(`${API_BASE_URL}auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Ошибка обновления токена');
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Сохраняем новые токены
      tokenUtils.setAccessToken(data.accessToken);
      refreshTokenUtils.setRefreshToken(data.refreshToken);
      
      // Переподключаемся к WebSocket соединениям
      reconnectWebSockets(store);
    }
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    // Если не удалось обновить токен, очищаем данные авторизации
    tokenUtils.removeAccessToken();
    refreshTokenUtils.removeRefreshToken();
  }
};

/**
 * Переподключение к WebSocket соединениям
 */
const reconnectWebSockets = (store: any) => {
  const state = store.getState();
  
  // Переподключаемся к ленте заказов если она была подключена
  if (state.feed.status === 'CLOSED' && state.feed.error) {
    // Импортируем action динамически чтобы избежать циклических зависимостей
    import('../actions/feed-actions').then(({ connectFeedWebSocket }) => {
      store.dispatch(connectFeedWebSocket());
    });
  }
  
  // Переподключаемся к истории заказов если она была подключена
  if (state.profileOrders.status === 'CLOSED' && state.profileOrders.error) {
    import('../actions/profile-orders-actions').then(({ connectProfileOrdersWebSocket }) => {
      store.dispatch(connectProfileOrdersWebSocket());
    });
  }
};
