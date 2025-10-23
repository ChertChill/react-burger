import { profileOrdersReducer } from './profile-orders-reducer';
import {
  FETCH_PROFILE_ORDERS_REQUEST,
  FETCH_PROFILE_ORDERS_SUCCESS,
  FETCH_PROFILE_ORDERS_ERROR,
  SET_PROFILE_ORDERS,
  SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
  SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
  CLEAR_PROFILE_ORDERS
} from '../actions/action-types';

describe('profileOrdersReducer', () => {
  // Тестовые данные
  const mockOrder1 = {
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

  const mockOrder3 = {
    _id: 'order-3',
    number: 12347,
    status: 'created',
    name: 'Био-марсианский бургер',
    createdAt: '2023-12-01T12:00:00.000Z',
    updatedAt: '2023-12-01T12:05:00.000Z',
    ingredients: ['ingredient-5', 'ingredient-6'],
    price: 2200
  };

  const mockOrders = [mockOrder1, mockOrder2, mockOrder3];

  // Начальное состояние
  const initialState = {
    loading: false,
    error: null,
    orders: [],
    status: 'CLOSED',
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  };

  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при неизвестном action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = profileOrdersReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = profileOrdersReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

  });

  describe('Загрузка истории заказов', () => {

    it('должен обрабатывать FETCH_PROFILE_ORDERS_SUCCESS', () => {
      const action = {
        type: FETCH_PROFILE_ORDERS_SUCCESS,
        payload: mockOrders
      };
      const result = profileOrdersReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: false,
        error: null,
        orders: mockOrders
      });
    });

    it('должен обрабатывать FETCH_PROFILE_ORDERS_ERROR', () => {
      const errorMessage = 'Ошибка загрузки истории заказов';
      const action = {
        type: FETCH_PROFILE_ORDERS_ERROR,
        payload: errorMessage
      };
      const result = profileOrdersReducer(initialState, action);
      
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
      
      const action = { type: FETCH_PROFILE_ORDERS_REQUEST };
      const result = profileOrdersReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен сохранять существующие заказы при ошибке', () => {
      const stateWithOrders = {
        ...initialState,
        orders: [mockOrder1]
      };
      
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: FETCH_PROFILE_ORDERS_ERROR,
        payload: errorMessage
      };
      const result = profileOrdersReducer(stateWithOrders, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage,
        orders: [mockOrder1]
      });
    });
  });

  describe('Управление заказами в истории', () => {
    it('должен обрабатывать SET_PROFILE_ORDERS', () => {
      const action = {
        type: SET_PROFILE_ORDERS,
        payload: mockOrders
      };
      const result = profileOrdersReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        orders: mockOrders
      });
    });

    it('должен заменять существующие заказы', () => {
      const stateWithOrders = {
        ...initialState,
        orders: [mockOrder1]
      };
      
      const action = {
        type: SET_PROFILE_ORDERS,
        payload: [mockOrder2, mockOrder3]
      };
      const result = profileOrdersReducer(stateWithOrders, action);
      
      expect(result).toEqual({
        ...initialState,
        orders: [mockOrder2, mockOrder3]
      });
    });

    it('должен устанавливать пустой массив заказов', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrders
      };
      
      const action = {
        type: SET_PROFILE_ORDERS,
        payload: []
      };
      const result = profileOrdersReducer(stateWithOrders, action);
      
      expect(result).toEqual({
        ...initialState,
        orders: []
      });
    });

    it('должен сохранять другие свойства состояния при установке заказов', () => {
      const stateWithData = {
        ...initialState,
        loading: true,
        status: 'OPEN',
        reconnectAttempts: 3
      };
      
      const action = {
        type: SET_PROFILE_ORDERS,
        payload: mockOrders
      };
      const result = profileOrdersReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true,
        status: 'OPEN',
        reconnectAttempts: 3,
        orders: mockOrders
      });
    });
  });

  describe('Управление WebSocket соединением', () => {
    it('должен обрабатывать SET_PROFILE_ORDERS_WEBSOCKET_STATUS - CONNECTING', () => {
      const action = {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CONNECTING'
      };
      const result = profileOrdersReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CONNECTING'
      });
    });

    it('должен обрабатывать SET_PROFILE_ORDERS_WEBSOCKET_STATUS - OPEN', () => {
      const stateWithError = {
        ...initialState,
        error: 'WebSocket ошибка'
      };
      
      const action = {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'OPEN'
      };
      const result = profileOrdersReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'OPEN',
        error: null
      });
    });

    it('должен обрабатывать SET_PROFILE_ORDERS_WEBSOCKET_STATUS - CLOSING', () => {
      const action = {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CLOSING'
      };
      const result = profileOrdersReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSING'
      });
    });

    it('должен обрабатывать SET_PROFILE_ORDERS_WEBSOCKET_STATUS - CLOSED', () => {
      const action = {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CLOSED'
      };
      const result = profileOrdersReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSED'
      });
    });

    it('должен обрабатывать SET_PROFILE_ORDERS_WEBSOCKET_ERROR', () => {
      const errorMessage = 'WebSocket соединение потеряно';
      const action = {
        type: SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
        payload: errorMessage
      };
      const result = profileOrdersReducer(initialState, action);
      
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
        type: SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
        payload: null
      };
      const result = profileOrdersReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        error: null
      });
    });

    it('должен сохранять ошибку при статусе не OPEN', () => {
      const stateWithError = {
        ...initialState,
        error: 'WebSocket ошибка'
      };
      
      const action = {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CLOSING'
      };
      const result = profileOrdersReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSING',
        error: 'WebSocket ошибка'
      });
    });
  });

  describe('Очистка истории заказов', () => {
    it('должен очищать историю заказов', () => {
      const stateWithData = {
        ...initialState,
        loading: true,
        error: 'Ошибка',
        orders: mockOrders,
        status: 'OPEN',
        reconnectAttempts: 3
      };
      
      const action = { type: CLEAR_PROFILE_ORDERS };
      const result = profileOrdersReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSED'
      });
    });

    it('должен очищать пустую историю заказов', () => {
      const action = { type: CLEAR_PROFILE_ORDERS };
      const result = profileOrdersReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        status: 'CLOSED'
      });
    });

    it('должен устанавливать статус CLOSED при очистке', () => {
      const stateWithOpenStatus = {
        ...initialState,
        status: 'OPEN',
        orders: mockOrders
      };
      
      const action = { type: CLEAR_PROFILE_ORDERS };
      const result = profileOrdersReducer(stateWithOpenStatus, action);
      
      expect(result.status).toBe('CLOSED');
      expect(result.orders).toEqual([]);
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий при загрузке истории', () => {
      let state = profileOrdersReducer(undefined, { type: FETCH_PROFILE_ORDERS_REQUEST });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = profileOrdersReducer(state, {
        type: FETCH_PROFILE_ORDERS_SUCCESS,
        payload: mockOrders
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('должен корректно обрабатывать ошибку загрузки', () => {
      let state = profileOrdersReducer(undefined, { type: FETCH_PROFILE_ORDERS_REQUEST });
      expect(state.loading).toBe(true);

      const errorMessage = 'Ошибка сети';
      state = profileOrdersReducer(state, {
        type: FETCH_PROFILE_ORDERS_ERROR,
        payload: errorMessage
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });

    it('должен корректно обрабатывать WebSocket соединение', () => {
      let state = profileOrdersReducer(undefined, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CONNECTING'
      });
      expect(state.status).toBe('CONNECTING');

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'OPEN'
      });
      expect(state.status).toBe('OPEN');

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS,
        payload: mockOrders
      });
      expect(state.orders).toEqual(mockOrders);

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
        payload: 'Соединение потеряно'
      });
      expect(state.error).toBe('Соединение потеряно');

      state = profileOrdersReducer(state, { type: CLEAR_PROFILE_ORDERS });
      expect(state.status).toBe('CLOSED');
      expect(state.orders).toEqual([]);
    });

    it('должен корректно обрабатывать восстановление соединения', () => {
      let state = profileOrdersReducer(undefined, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
        payload: 'Соединение потеряно'
      });
      expect(state.error).toBe('Соединение потеряно');

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'OPEN'
      });
      expect(state.status).toBe('OPEN');
      expect(state.error).toBeNull();
    });

    it('должен корректно обрабатывать обновление заказов через WebSocket', () => {
      let state = profileOrdersReducer(undefined, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'OPEN'
      });
      expect(state.status).toBe('OPEN');

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS,
        payload: [mockOrder1]
      });
      expect(state.orders).toEqual([mockOrder1]);

      // Добавляем новый заказ
      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS,
        payload: [mockOrder1, mockOrder2]
      });
      expect(state.orders).toEqual([mockOrder1, mockOrder2]);

      // Обновляем статус заказа
      const updatedOrder1 = { ...mockOrder1, status: 'done' };
      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS,
        payload: [updatedOrder1, mockOrder2]
      });
      expect(state.orders[0].status).toBe('done');
    });

    it('должен корректно обрабатывать закрытие соединения', () => {
      let state = profileOrdersReducer(undefined, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'OPEN'
      });
      expect(state.status).toBe('OPEN');

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS,
        payload: mockOrders
      });
      expect(state.orders).toEqual(mockOrders);

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CLOSING'
      });
      expect(state.status).toBe('CLOSING');
      expect(state.orders).toEqual(mockOrders);

      state = profileOrdersReducer(state, {
        type: SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
        payload: 'CLOSED'
      });
      expect(state.status).toBe('CLOSED');
      expect(state.orders).toEqual(mockOrders);
    });
  });

});
