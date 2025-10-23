import orderReducer from './order-reducer';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  SET_ORDER_NUMBER,
  SET_ORDER_LOADING,
  SET_ORDER_ERROR,
  CLEAR_ORDER
} from '../actions/action-types';

describe('orderReducer', () => {
  // Тестовые данные
  const mockOrderNumber = 12345;
  const mockOrderNumber2 = 67890;
  const mockError = 'Ошибка создания заказа';

  // Начальное состояние
  const initialState = {
    orderNumber: null,
    loading: false,
    error: null
  };

  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при неизвестном action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = orderReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = orderReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

  });

  describe('Создание заказа', () => {

    it('должен обрабатывать CREATE_ORDER_SUCCESS', () => {
      const action = {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrderNumber
      };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: false,
        error: null
      });
    });

    it('должен обрабатывать CREATE_ORDER_ERROR', () => {
      const action = {
        type: CREATE_ORDER_ERROR,
        payload: mockError
      };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: mockError
      });
    });

    it('должен очищать предыдущую ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      
      const action = { type: CREATE_ORDER_REQUEST };
      const result = orderReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен сбрасывать состояние при ошибке создания заказа', () => {
      const stateWithData = {
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: true
      };
      
      const action = {
        type: CREATE_ORDER_ERROR,
        payload: mockError
      };
      const result = orderReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        error: mockError
      });
    });
  });

  describe('Управление номером заказа', () => {
    it('должен обрабатывать SET_ORDER_NUMBER', () => {
      const action = {
        type: SET_ORDER_NUMBER,
        payload: mockOrderNumber
      };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: false,
        error: null
      });
    });

    it('должен заменять существующий номер заказа', () => {
      const stateWithOrder = {
        ...initialState,
        orderNumber: mockOrderNumber
      };
      
      const action = {
        type: SET_ORDER_NUMBER,
        payload: mockOrderNumber2
      };
      const result = orderReducer(stateWithOrder, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: mockOrderNumber2,
        loading: false,
        error: null
      });
    });

    it('должен устанавливать null как номер заказа', () => {
      const stateWithOrder = {
        ...initialState,
        orderNumber: mockOrderNumber
      };
      
      const action = {
        type: SET_ORDER_NUMBER,
        payload: null
      };
      const result = orderReducer(stateWithOrder, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: null,
        loading: false,
        error: null
      });
    });

    it('должен устанавливать 0 как номер заказа', () => {
      const action = {
        type: SET_ORDER_NUMBER,
        payload: 0
      };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: 0,
        loading: false,
        error: null
      });
    });
  });

  describe('Управление состоянием загрузки', () => {
    it('должен обрабатывать SET_ORDER_LOADING - true', () => {
      const action = {
        type: SET_ORDER_LOADING,
        payload: true
      };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true
      });
    });

    it('должен обрабатывать SET_ORDER_LOADING - false', () => {
      const stateWithLoading = {
        ...initialState,
        loading: true
      };
      
      const action = {
        type: SET_ORDER_LOADING,
        payload: false
      };
      const result = orderReducer(stateWithLoading, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: false
      });
    });

    it('должен сохранять номер заказа при изменении состояния загрузки', () => {
      const stateWithOrder = {
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: false
      };
      
      const action = {
        type: SET_ORDER_LOADING,
        payload: true
      };
      const result = orderReducer(stateWithOrder, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: true
      });
    });
  });

  describe('Управление ошибками', () => {
    it('должен обрабатывать SET_ORDER_ERROR', () => {
      const action = {
        type: SET_ORDER_ERROR,
        payload: mockError
      };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: mockError
      });
    });

    it('должен заменять существующую ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      
      const action = {
        type: SET_ORDER_ERROR,
        payload: mockError
      };
      const result = orderReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        error: mockError
      });
    });

    it('должен очищать ошибку при установке null', () => {
      const stateWithError = {
        ...initialState,
        error: mockError
      };
      
      const action = {
        type: SET_ORDER_ERROR,
        payload: null
      };
      const result = orderReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        error: null
      });
    });

    it('должен сбрасывать состояние при ошибке', () => {
      const stateWithData = {
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: true
      };
      
      const action = {
        type: SET_ORDER_ERROR,
        payload: mockError
      };
      const result = orderReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        error: mockError
      });
    });
  });

  describe('Очистка заказа', () => {
    it('должен очищать заказ с данными', () => {
      const stateWithData = {
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: true,
        error: mockError
      };
      
      const action = { type: CLEAR_ORDER };
      const result = orderReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: null,
        loading: true,
        error: null
      });
    });

    it('должен очищать пустой заказ', () => {
      const action = { type: CLEAR_ORDER };
      const result = orderReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: null,
        error: null
      });
    });

    it('должен сохранять состояние загрузки при очистке', () => {
      const stateWithLoading = {
        ...initialState,
        orderNumber: mockOrderNumber,
        loading: true,
        error: mockError
      };
      
      const action = { type: CLEAR_ORDER };
      const result = orderReducer(stateWithLoading, action);
      
      expect(result).toEqual({
        ...initialState,
        orderNumber: null,
        loading: true,
        error: null
      });
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий при создании заказа', () => {
      let state = orderReducer(undefined, { type: CREATE_ORDER_REQUEST });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderNumber).toBeNull();

      state = orderReducer(state, {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrderNumber
      });
      expect(state.loading).toBe(false);
      expect(state.orderNumber).toBe(mockOrderNumber);
      expect(state.error).toBeNull();
    });

    it('должен корректно обрабатывать ошибку создания заказа', () => {
      let state = orderReducer(undefined, { type: CREATE_ORDER_REQUEST });
      expect(state.loading).toBe(true);

      state = orderReducer(state, {
        type: CREATE_ORDER_ERROR,
        payload: mockError
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockError);
      expect(state.orderNumber).toBeNull();
    });

    it('должен корректно обрабатывать повторное создание заказа', () => {
      let state = orderReducer(undefined, {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrderNumber
      });
      expect(state.orderNumber).toBe(mockOrderNumber);

      // Создаем новый заказ
      state = orderReducer(state, { type: CREATE_ORDER_REQUEST });
      expect(state.loading).toBe(true);
      expect(state.orderNumber).toBe(mockOrderNumber); // Номер сохраняется до успешного создания

      state = orderReducer(state, {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrderNumber2
      });
      expect(state.orderNumber).toBe(mockOrderNumber2);
      expect(state.loading).toBe(false);
    });

    it('должен корректно обрабатывать очистку и повторное создание', () => {
      let state = orderReducer(undefined, {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrderNumber
      });
      expect(state.orderNumber).toBe(mockOrderNumber);

      state = orderReducer(state, { type: CLEAR_ORDER });
      expect(state.orderNumber).toBeNull();
      expect(state.error).toBeNull();

      state = orderReducer(state, { type: CREATE_ORDER_REQUEST });
      expect(state.loading).toBe(true);

      state = orderReducer(state, {
        type: CREATE_ORDER_SUCCESS,
        payload: mockOrderNumber2
      });
      expect(state.orderNumber).toBe(mockOrderNumber2);
      expect(state.loading).toBe(false);
    });

    it('должен корректно обрабатывать установку номера заказа вручную', () => {
      let state = orderReducer(undefined, {
        type: SET_ORDER_NUMBER,
        payload: mockOrderNumber
      });
      expect(state.orderNumber).toBe(mockOrderNumber);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();

      state = orderReducer(state, {
        type: SET_ORDER_LOADING,
        payload: true
      });
      expect(state.loading).toBe(true);
      expect(state.orderNumber).toBe(mockOrderNumber);

      state = orderReducer(state, {
        type: SET_ORDER_ERROR,
        payload: mockError
      });
      expect(state.error).toBe(mockError);
      expect(state.orderNumber).toBeNull(); // Сбрасывается при ошибке
    });

    it('должен корректно обрабатывать управление состоянием загрузки', () => {
      let state = orderReducer(undefined, {
        type: SET_ORDER_LOADING,
        payload: true
      });
      expect(state.loading).toBe(true);

      state = orderReducer(state, {
        type: SET_ORDER_NUMBER,
        payload: mockOrderNumber
      });
      expect(state.loading).toBe(false);
      expect(state.orderNumber).toBe(mockOrderNumber);

      state = orderReducer(state, {
        type: SET_ORDER_LOADING,
        payload: true
      });
      expect(state.loading).toBe(true);
      expect(state.orderNumber).toBe(mockOrderNumber);
    });
  });

});
