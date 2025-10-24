import { feedReducer, initialState } from './feed-reducer';
import {
  FETCH_FEED_REQUEST,
  FETCH_FEED_SUCCESS,
  FETCH_FEED_ERROR,
  SET_FEED_ORDERS,
  SET_FEED_STATS,
  SET_FEED_WEBSOCKET_STATUS,
  SET_FEED_WEBSOCKET_ERROR,
  CLEAR_FEED
} from '../actions/action-types';

describe('feedReducer', () => {
  // Тестовые данные
  const mockOrder = {
    _id: 'order-1',
    number: 12345,
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-12-01T10:00:00.000Z',
    updatedAt: '2023-12-01T10:30:00.000Z',
    ingredients: ['ingredient-1', 'ingredient-2'],
    price: 2055
  };

  const mockOrder2 = {
    _id: 'order-2',
    number: 12346,
    status: 'pending',
    name: 'Краторный бургер',
    createdAt: '2023-12-01T11:00:00.000Z',
    updatedAt: '2023-12-01T11:15:00.000Z',
    ingredients: ['ingredient-3', 'ingredient-4'],
    price: 1800
  };

  const mockOrders = [mockOrder, mockOrder2];

  const mockStats = {
    total: 100,
    totalToday: 15,
    ready: [12345, 12347, 12349],
    inProgress: [12346, 12348]
  };


  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при неизвестном action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = feedReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = feedReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Загрузка ленты заказов', () => {

    it('должен обрабатывать FETCH_FEED_SUCCESS', () => {
      const action = {
        type: FETCH_FEED_SUCCESS,
        payload: mockOrders
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: false,
        error: null,
        orders: mockOrders
      });
    });

    it('должен обрабатывать FETCH_FEED_ERROR', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = {
        type: FETCH_FEED_ERROR,
        payload: errorMessage
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });

    it('должен очищать предыдущую ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      
      const action = { type: FETCH_FEED_REQUEST };
      const result = feedReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });
  });

  describe('Управление заказами в ленте', () => {
    it('должен обрабатывать SET_FEED_ORDERS', () => {
      const action = {
        type: SET_FEED_ORDERS,
        payload: mockOrders
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        orders: mockOrders
      });
    });

    it('должен заменять существующие заказы', () => {
      const stateWithOrders = {
        ...initialState,
        orders: [mockOrder]
      };
      
      const action = {
        type: SET_FEED_ORDERS,
        payload: [mockOrder2]
      };
      const result = feedReducer(stateWithOrders, action);
      
      expect(result).toEqual({
        ...initialState,
        orders: [mockOrder2]
      });
    });

    it('должен устанавливать пустой массив заказов', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrders
      };
      
      const action = {
        type: SET_FEED_ORDERS,
        payload: []
      };
      const result = feedReducer(stateWithOrders, action);
      
      expect(result).toEqual({
        ...initialState,
        orders: []
      });
    });
  });

  describe('Управление статистикой ленты', () => {
    it('должен обрабатывать SET_FEED_STATS', () => {
      const action = {
        type: SET_FEED_STATS,
        payload: mockStats
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        total: mockStats.total,
        totalToday: mockStats.totalToday,
        ready: mockStats.ready,
        inProgress: mockStats.inProgress
      });
    });

    it('должен обновлять статистику с нулевыми значениями', () => {
      const zeroStats = {
        total: 0,
        totalToday: 0,
        ready: [],
        inProgress: []
      };
      
      const action = {
        type: SET_FEED_STATS,
        payload: zeroStats
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        total: 0,
        totalToday: 0,
        ready: [],
        inProgress: []
      });
    });

    it('должен заменять существующую статистику', () => {
      const stateWithStats = {
        ...initialState,
        total: 50,
        totalToday: 10,
        ready: [1, 2, 3],
        inProgress: [4, 5]
      };
      
      const action = {
        type: SET_FEED_STATS,
        payload: mockStats
      };
      const result = feedReducer(stateWithStats, action);
      
      expect(result).toEqual({
        ...initialState,
        total: mockStats.total,
        totalToday: mockStats.totalToday,
        ready: mockStats.ready,
        inProgress: mockStats.inProgress
      });
    });
  });

  describe('Управление WebSocket соединением', () => {
    it('должен обрабатывать SET_FEED_WEBSOCKET_STATUS - CONNECTING', () => {
      const action = {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'CONNECTING'
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CONNECTING'
      });
    });

    it('должен обрабатывать SET_FEED_WEBSOCKET_STATUS - OPEN', () => {
      const stateWithError = {
        ...initialState,
        error: 'WebSocket ошибка'
      };
      
      const action = {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'OPEN'
      };
      const result = feedReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'OPEN',
        error: null
      });
    });

    it('должен обрабатывать SET_FEED_WEBSOCKET_STATUS - CLOSING', () => {
      const action = {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'CLOSING'
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSING'
      });
    });

    it('должен обрабатывать SET_FEED_WEBSOCKET_STATUS - CLOSED', () => {
      const action = {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'CLOSED'
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSED'
      });
    });

    it('должен обрабатывать SET_FEED_WEBSOCKET_ERROR', () => {
      const errorMessage = 'WebSocket соединение потеряно';
      const action = {
        type: SET_FEED_WEBSOCKET_ERROR,
        payload: errorMessage
      };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('должен очищать ошибку WebSocket при установке null', () => {
      const stateWithError = {
        ...initialState,
        error: 'WebSocket ошибка'
      };
      
      const action = {
        type: SET_FEED_WEBSOCKET_ERROR,
        payload: null
      };
      const result = feedReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        error: null
      });
    });
  });

  describe('Очистка ленты заказов', () => {
    it('должен очищать ленту заказов', () => {
      const stateWithData = {
        ...initialState,
        loading: true,
        error: 'Ошибка',
        orders: mockOrders,
        total: 100,
        totalToday: 15,
        ready: [1, 2, 3],
        inProgress: [4, 5],
        status: 'OPEN',
        reconnectAttempts: 3
      };
      
      const action = { type: CLEAR_FEED };
      const result = feedReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSED'
      });
    });

    it('должен очищать пустую ленту заказов', () => {
      const action = { type: CLEAR_FEED };
      const result = feedReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSED'
      });
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий при загрузке ленты', () => {
      let state = feedReducer(undefined, { type: FETCH_FEED_REQUEST });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = feedReducer(state, {
        type: FETCH_FEED_SUCCESS,
        payload: mockOrders
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('должен корректно обрабатывать ошибку загрузки', () => {
      let state = feedReducer(undefined, { type: FETCH_FEED_REQUEST });
      expect(state.loading).toBe(true);

      const errorMessage = 'Ошибка сети';
      state = feedReducer(state, {
        type: FETCH_FEED_ERROR,
        payload: errorMessage
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });

    it('должен корректно обрабатывать WebSocket соединение', () => {
      let state = feedReducer(undefined, {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'CONNECTING'
      });
      expect(state.status).toBe('CONNECTING');

      state = feedReducer(state, {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'OPEN'
      });
      expect(state.status).toBe('OPEN');

      state = feedReducer(state, {
        type: SET_FEED_ORDERS,
        payload: mockOrders
      });
      expect(state.orders).toEqual(mockOrders);

      state = feedReducer(state, {
        type: SET_FEED_STATS,
        payload: mockStats
      });
      expect(state.total).toBe(mockStats.total);
      expect(state.totalToday).toBe(mockStats.totalToday);

      state = feedReducer(state, {
        type: SET_FEED_WEBSOCKET_ERROR,
        payload: 'Соединение потеряно'
      });
      expect(state.error).toBe('Соединение потеряно');

      state = feedReducer(state, { type: CLEAR_FEED });
      expect(state.status).toBe('CLOSED');
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
    });

    it('должен корректно обрабатывать восстановление соединения', () => {
      let state = feedReducer(undefined, {
        type: SET_FEED_WEBSOCKET_ERROR,
        payload: 'Соединение потеряно'
      });
      expect(state.error).toBe('Соединение потеряно');

      state = feedReducer(state, {
        type: SET_FEED_WEBSOCKET_STATUS,
        payload: 'OPEN'
      });
      expect(state.status).toBe('OPEN');
      expect(state.error).toBeNull();
    });

    it('должен корректно обрабатывать обновление статистики без изменения заказов', () => {
      let state = feedReducer(undefined, {
        type: SET_FEED_ORDERS,
        payload: mockOrders
      });
      expect(state.orders).toEqual(mockOrders);

      state = feedReducer(state, {
        type: SET_FEED_STATS,
        payload: mockStats
      });
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(mockStats.total);
      expect(state.ready).toEqual(mockStats.ready);
    });
  });
});
