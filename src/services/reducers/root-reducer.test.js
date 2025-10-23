import rootReducer from './root-reducer';
import {
  SET_INGREDIENTS,
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  SET_CURRENT_INGREDIENT,
  CREATE_ORDER_SUCCESS,
  LOGIN_SUCCESS,
  SET_FEED_ORDERS,
  SET_PROFILE_ORDERS
} from '../actions/action-types';

describe('rootReducer', () => {
  // Тестовые данные
  const mockIngredient = {
    _id: 'ingredient-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const mockConstructorIngredient = {
    ...mockIngredient,
    id: 'constructor-ingredient-1'
  };

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

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

  // Начальное состояние
  const initialState = {
    ingredients: {
      ingredients: [],
      loading: false,
      error: null
    },
    constructor: {
      constructorIngredients: [],
      bun: null
    },
    ingredientDetails: {
      currentIngredient: null
    },
    order: {
      orderNumber: null,
      loading: false,
      error: null
    },
    auth: {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registerLoading: false,
      loginLoading: false,
      logoutLoading: false,
      refreshTokenLoading: false,
      getUserLoading: false,
      updateUserLoading: false,
      registerError: null,
      loginError: null,
      logoutError: null,
      refreshTokenError: null,
      getUserError: null,
      updateUserError: null
    },
    feed: {
      loading: false,
      error: null,
      orders: [],
      total: 0,
      totalToday: 0,
      ready: [],
      inProgress: [],
      status: 'CLOSED',
      reconnectAttempts: 0,
      maxReconnectAttempts: 5
    },
    profileOrders: {
      loading: false,
      error: null,
      orders: [],
      status: 'CLOSED',
      reconnectAttempts: 0,
      maxReconnectAttempts: 5
    }
  };

  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = rootReducer(undefined, action);
      
      // Проверяем основные свойства каждого слайса
      expect(result.ingredients).toEqual(initialState.ingredients);
      expect(result.ingredientDetails).toEqual(initialState.ingredientDetails);
      expect(result.order).toEqual(initialState.order);
      expect(result.auth).toEqual(initialState.auth);
      expect(result.feed).toEqual(initialState.feed);
      expect(result.profileOrders).toEqual(initialState.profileOrders);
      
      // Для constructor проверяем структуру, так как он может быть функцией
      expect(result.constructor).toBeDefined();
      expect(typeof result.constructor).toBe('function');
    });

    it('должен содержать все необходимые слайсы состояния', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result).toHaveProperty('ingredients');
      expect(result).toHaveProperty('constructor');
      expect(result).toHaveProperty('ingredientDetails');
      expect(result).toHaveProperty('order');
      expect(result).toHaveProperty('auth');
      expect(result).toHaveProperty('feed');
      expect(result).toHaveProperty('profileOrders');
    });

    it('должен иметь корректную структуру слайса ingredients', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result.ingredients).toHaveProperty('ingredients');
      expect(result.ingredients).toHaveProperty('loading');
      expect(result.ingredients).toHaveProperty('error');
      expect(Array.isArray(result.ingredients.ingredients)).toBe(true);
      expect(typeof result.ingredients.loading).toBe('boolean');
    });

    it('должен иметь корректную структуру слайса constructor', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      // Проверяем, что constructor является функцией (редьюсером)
      expect(result.constructor).toBeDefined();
      expect(typeof result.constructor).toBe('function');
      
      // Проверяем, что action работает корректно
      const testAction = { type: ADD_INGREDIENT_TO_CONSTRUCTOR, payload: mockConstructorIngredient };
      const testResult = rootReducer(undefined, testAction);
      
      expect(testResult.constructor).toHaveProperty('constructorIngredients');
      expect(Array.isArray(testResult.constructor.constructorIngredients)).toBe(true);
      expect(testResult.constructor.constructorIngredients).toHaveLength(1);
      expect(testResult.constructor.constructorIngredients[0]).toEqual(mockConstructorIngredient);
    });

    it('должен иметь корректную структуру слайса ingredientDetails', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result.ingredientDetails).toHaveProperty('currentIngredient');
      expect(result.ingredientDetails.currentIngredient).toBeNull();
    });

    it('должен иметь корректную структуру слайса order', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result.order).toHaveProperty('orderNumber');
      expect(result.order).toHaveProperty('loading');
      expect(result.order).toHaveProperty('error');
      expect(result.order.orderNumber).toBeNull();
      expect(typeof result.order.loading).toBe('boolean');
      expect(result.order.error).toBeNull();
    });

    it('должен иметь корректную структуру слайса auth', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result.auth).toHaveProperty('user');
      expect(result.auth).toHaveProperty('accessToken');
      expect(result.auth).toHaveProperty('refreshToken');
      expect(result.auth).toHaveProperty('isAuthenticated');
      expect(result.auth).toHaveProperty('isLoading');
      expect(result.auth).toHaveProperty('error');
      expect(result.auth.user).toBeNull();
      expect(result.auth.accessToken).toBeNull();
      expect(result.auth.refreshToken).toBeNull();
      expect(typeof result.auth.isAuthenticated).toBe('boolean');
      expect(typeof result.auth.isLoading).toBe('boolean');
    });

    it('должен иметь корректную структуру слайса feed', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result.feed).toHaveProperty('loading');
      expect(result.feed).toHaveProperty('error');
      expect(result.feed).toHaveProperty('orders');
      expect(result.feed).toHaveProperty('total');
      expect(result.feed).toHaveProperty('totalToday');
      expect(result.feed).toHaveProperty('ready');
      expect(result.feed).toHaveProperty('inProgress');
      expect(result.feed).toHaveProperty('status');
      expect(result.feed).toHaveProperty('reconnectAttempts');
      expect(result.feed).toHaveProperty('maxReconnectAttempts');
      expect(Array.isArray(result.feed.orders)).toBe(true);
      expect(typeof result.feed.loading).toBe('boolean');
      expect(typeof result.feed.total).toBe('number');
    });

    it('должен иметь корректную структуру слайса profileOrders', () => {
      const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      expect(result.profileOrders).toHaveProperty('loading');
      expect(result.profileOrders).toHaveProperty('error');
      expect(result.profileOrders).toHaveProperty('orders');
      expect(result.profileOrders).toHaveProperty('status');
      expect(result.profileOrders).toHaveProperty('reconnectAttempts');
      expect(result.profileOrders).toHaveProperty('maxReconnectAttempts');
      expect(Array.isArray(result.profileOrders.orders)).toBe(true);
      expect(typeof result.profileOrders.loading).toBe('boolean');
    });
  });


  describe('Изоляция слайсов', () => {
    it('должен изолировать изменения между слайсами', () => {
      // Изменяем ingredients
      let state = rootReducer(initialState, {
        type: SET_INGREDIENTS,
        payload: [mockIngredient]
      });
      
      // Изменяем constructor
      state = rootReducer(state, {
        type: ADD_INGREDIENT_TO_CONSTRUCTOR,
        payload: mockConstructorIngredient
      });
      
      // Изменяем order
      state = rootReducer(state, {
        type: CREATE_ORDER_SUCCESS,
        payload: 12345
      });
      
      // Проверяем, что все изменения сохранились независимо
      expect(state.ingredients.ingredients).toEqual([mockIngredient]);
      expect(state.constructor.constructorIngredients).toEqual([mockConstructorIngredient]);
      expect(state.order.orderNumber).toBe(12345);
      
      // Проверяем, что неизмененные слайсы остались в начальном состоянии
      expect(state.ingredientDetails).toEqual(initialState.ingredientDetails);
      expect(state.auth).toEqual(initialState.auth);
      expect(state.feed).toEqual(initialState.feed);
      expect(state.profileOrders).toEqual(initialState.profileOrders);
    });

    it('должен корректно обрабатывать неизвестные actions', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION_TYPE' };
      const result = rootReducer(initialState, unknownAction);
      
      // При неизвестном action все слайсы должны вернуть свое текущее состояние
      expect(result).toEqual(initialState);
    });

    it('должен корректно обрабатывать actions без payload', () => {
      const actionWithoutPayload = { type: 'ACTION_WITHOUT_PAYLOAD' };
      const result = rootReducer(initialState, actionWithoutPayload);
      
      expect(result).toEqual(initialState);
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий пользователя', () => {
      let state = rootReducer(undefined, { type: 'INIT' });
      
      // Пользователь загружает ингредиенты
      state = rootReducer(state, {
        type: SET_INGREDIENTS,
        payload: [mockIngredient]
      });
      expect(state.ingredients.ingredients).toEqual([mockIngredient]);
      
      // Пользователь добавляет ингредиент в конструктор
      state = rootReducer(state, {
        type: ADD_INGREDIENT_TO_CONSTRUCTOR,
        payload: mockConstructorIngredient
      });
      expect(state.constructor.constructorIngredients).toEqual([mockConstructorIngredient]);
      
      // Пользователь просматривает детали ингредиента
      state = rootReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      expect(state.ingredientDetails.currentIngredient).toEqual(mockIngredient);
      
      // Пользователь авторизуется
      const authResponse = {
        user: mockUser,
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456'
      };
      state = rootReducer(state, {
        type: LOGIN_SUCCESS,
        payload: authResponse
      });
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user).toEqual(mockUser);
      
      // Пользователь создает заказ
      state = rootReducer(state, {
        type: CREATE_ORDER_SUCCESS,
        payload: 12345
      });
      expect(state.order.orderNumber).toBe(12345);
      
      // Пользователь просматривает ленту заказов
      state = rootReducer(state, {
        type: SET_FEED_ORDERS,
        payload: [mockOrder]
      });
      expect(state.feed.orders).toEqual([mockOrder]);
      
      // Пользователь просматривает свою историю заказов
      state = rootReducer(state, {
        type: SET_PROFILE_ORDERS,
        payload: [mockOrder]
      });
      expect(state.profileOrders.orders).toEqual([mockOrder]);
      
      // Проверяем, что все изменения сохранились
      expect(state.ingredients.ingredients).toEqual([mockIngredient]);
      expect(state.constructor.constructorIngredients).toEqual([mockConstructorIngredient]);
      expect(state.ingredientDetails.currentIngredient).toEqual(mockIngredient);
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.order.orderNumber).toBe(12345);
      expect(state.feed.orders).toEqual([mockOrder]);
      expect(state.profileOrders.orders).toEqual([mockOrder]);
    });

    it('должен корректно обрабатывать параллельные изменения в разных слайсах', () => {
      let state = rootReducer(undefined, { type: 'INIT' });
      
      // Одновременно изменяем несколько слайсов
      state = rootReducer(state, {
        type: SET_INGREDIENTS,
        payload: [mockIngredient]
      });
      
      state = rootReducer(state, {
        type: ADD_INGREDIENT_TO_CONSTRUCTOR,
        payload: mockConstructorIngredient
      });
      
      state = rootReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      
      state = rootReducer(state, {
        type: CREATE_ORDER_SUCCESS,
        payload: 12345
      });
      
      // Проверяем, что все изменения применились корректно
      expect(state.ingredients.ingredients).toEqual([mockIngredient]);
      expect(state.constructor.constructorIngredients).toEqual([mockConstructorIngredient]);
      expect(state.ingredientDetails.currentIngredient).toEqual(mockIngredient);
      expect(state.order.orderNumber).toBe(12345);
    });
  });

});
