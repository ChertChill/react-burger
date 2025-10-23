import authReducer from './auth-reducer';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_ERROR,
  SET_USER_DATA,
  CLEAR_USER_DATA,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR
} from '../actions/action-types';

describe('authReducer', () => {
  // Тестовые данные
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockTokens = {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456'
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: mockTokens.accessToken,
    refreshToken: mockTokens.refreshToken
  };

  // Начальное состояние
  const initialState = {
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
  };

  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при неизвестном action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = authReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = authReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Регистрация пользователя', () => {

    it('должен обрабатывать REGISTER_SUCCESS', () => {
      const action = {
        type: REGISTER_SUCCESS,
        payload: mockAuthResponse
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        registerLoading: false,
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        isAuthenticated: true,
        registerError: null,
        error: null
      });
    });

    it('должен обрабатывать REGISTER_ERROR', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: REGISTER_ERROR,
        payload: errorMessage
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        registerLoading: false,
        registerError: errorMessage,
        error: errorMessage,
        isAuthenticated: false
      });
    });
  });

  describe('Авторизация пользователя', () => {

    it('должен обрабатывать LOGIN_SUCCESS', () => {
      const action = {
        type: LOGIN_SUCCESS,
        payload: mockAuthResponse
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loginLoading: false,
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        isAuthenticated: true,
        loginError: null,
        error: null
      });
    });

    it('должен обрабатывать LOGIN_ERROR', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: LOGIN_ERROR,
        payload: errorMessage
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loginLoading: false,
        loginError: errorMessage,
        error: errorMessage,
        isAuthenticated: false
      });
    });
  });

  describe('Выход из системы', () => {
    const authenticatedState = {
      ...initialState,
      user: mockUser,
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
      isAuthenticated: true
    };


    it('должен обрабатывать LOGOUT_SUCCESS', () => {
      const action = { type: LOGOUT_SUCCESS };
      const result = authReducer(authenticatedState, action);
      
      expect(result).toEqual({
        ...initialState,
        logoutLoading: false,
        logoutError: null,
        error: null
      });
    });

    it('должен обрабатывать LOGOUT_ERROR', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: LOGOUT_ERROR,
        payload: errorMessage
      };
      const result = authReducer(authenticatedState, action);
      
      expect(result).toEqual({
        ...authenticatedState,
        logoutLoading: false,
        logoutError: errorMessage,
        error: errorMessage
      });
    });
  });

  describe('Обновление токена', () => {
    it('должен обрабатывать REFRESH_TOKEN_REQUEST', () => {
      const action = { type: REFRESH_TOKEN_REQUEST };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        refreshTokenLoading: true,
        refreshTokenError: null,
        error: null
      });
    });

    it('должен обрабатывать REFRESH_TOKEN_SUCCESS', () => {
      const action = {
        type: REFRESH_TOKEN_SUCCESS,
        payload: mockTokens
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        refreshTokenLoading: false,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        refreshTokenError: null,
        error: null
      });
    });

    it('должен обрабатывать REFRESH_TOKEN_ERROR', () => {
      const errorMessage = 'Ошибка обновления токена';
      const action = {
        type: REFRESH_TOKEN_ERROR,
        payload: errorMessage
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        refreshTokenLoading: false,
        refreshTokenError: errorMessage,
        error: errorMessage,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      });
    });
  });

  describe('Управление данными пользователя', () => {
    it('должен обрабатывать SET_USER_DATA', () => {
      const action = {
        type: SET_USER_DATA,
        payload: mockUser
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      });
    });

    it('должен обрабатывать CLEAR_USER_DATA', () => {
      const authenticatedState = {
        ...initialState,
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        isAuthenticated: true,
        error: 'Some error'
      };
      
      const action = { type: CLEAR_USER_DATA };
      const result = authReducer(authenticatedState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: null
      });
    });
  });

  describe('Управление состоянием загрузки и ошибок', () => {
    it('должен обрабатывать SET_AUTH_LOADING', () => {
      const action = {
        type: SET_AUTH_LOADING,
        payload: true
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        isLoading: true
      });
    });

    it('должен обрабатывать SET_AUTH_ERROR', () => {
      const errorMessage = 'Общая ошибка аутентификации';
      const action = {
        type: SET_AUTH_ERROR,
        payload: errorMessage
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('должен обрабатывать CLEAR_AUTH_ERROR', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };
      
      const action = { type: CLEAR_AUTH_ERROR };
      const result = authReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        error: null
      });
    });
  });

  describe('Получение данных пользователя', () => {
    it('должен обрабатывать GET_USER_REQUEST', () => {
      const action = { type: GET_USER_REQUEST };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        getUserLoading: true,
        getUserError: null,
        error: null
      });
    });

    it('должен обрабатывать GET_USER_SUCCESS', () => {
      const action = {
        type: GET_USER_SUCCESS,
        payload: mockUser
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        getUserLoading: false,
        user: mockUser,
        isAuthenticated: true,
        getUserError: null,
        error: null
      });
    });

    it('должен обрабатывать GET_USER_ERROR', () => {
      const errorMessage = 'Ошибка получения данных пользователя';
      const action = {
        type: GET_USER_ERROR,
        payload: errorMessage
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        getUserLoading: false,
        getUserError: errorMessage,
        error: errorMessage
      });
    });
  });

  describe('Обновление данных пользователя', () => {
    it('должен обрабатывать UPDATE_USER_REQUEST', () => {
      const action = { type: UPDATE_USER_REQUEST };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        updateUserLoading: true,
        updateUserError: null,
        error: null
      });
    });

    it('должен обрабатывать UPDATE_USER_SUCCESS', () => {
      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };
      
      const action = {
        type: UPDATE_USER_SUCCESS,
        payload: updatedUser
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        updateUserLoading: false,
        user: updatedUser,
        isAuthenticated: true,
        updateUserError: null,
        error: null
      });
    });

    it('должен обрабатывать UPDATE_USER_ERROR', () => {
      const errorMessage = 'Ошибка обновления данных пользователя';
      const action = {
        type: UPDATE_USER_ERROR,
        payload: errorMessage
      };
      const result = authReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        updateUserLoading: false,
        updateUserError: errorMessage,
        error: errorMessage
      });
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий при регистрации', () => {
      let state = authReducer(undefined, { type: REGISTER_REQUEST });
      expect(state.registerLoading).toBe(true);
      expect(state.isAuthenticated).toBe(false);

      state = authReducer(state, {
        type: REGISTER_SUCCESS,
        payload: mockAuthResponse
      });
      expect(state.registerLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockTokens.accessToken);
    });

    it('должен корректно обрабатывать последовательность действий при авторизации', () => {
      let state = authReducer(undefined, { type: LOGIN_REQUEST });
      expect(state.loginLoading).toBe(true);

      state = authReducer(state, {
        type: LOGIN_SUCCESS,
        payload: mockAuthResponse
      });
      expect(state.loginLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('должен корректно обрабатывать выход из системы', () => {
      const authenticatedState = {
        ...initialState,
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        isAuthenticated: true
      };

      let state = authReducer(authenticatedState, { type: LOGOUT_REQUEST });
      expect(state.logoutLoading).toBe(true);

      state = authReducer(state, { type: LOGOUT_SUCCESS });
      expect(state.logoutLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });
});
