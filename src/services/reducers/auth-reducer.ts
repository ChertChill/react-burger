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
import { 
  IAuthState,
  TAuthActions
} from '../../utils/types';

/**
 * Начальное состояние для аутентификации пользователя
 */
export const initialState: IAuthState = {
  // Данные пользователя
  user: null,
  
  // Токены
  accessToken: null,
  refreshToken: null,
  
  // Состояние аутентификации
  isAuthenticated: false,
  
  // Состояние загрузки
  isLoading: false,
  
  // Ошибки
  error: null,
  
  // Статусы операций
  registerLoading: false,
  loginLoading: false,
  logoutLoading: false,
  refreshTokenLoading: false,
  getUserLoading: false,
  updateUserLoading: false,
  
  // Ошибки операций
  registerError: null,
  loginError: null,
  logoutError: null,
  refreshTokenError: null,
  getUserError: null,
  updateUserError: null
};

/**
 * Редьюсер для управления состоянием аутентификации
 * @param state - Текущее состояние
 * @param action - Экшен
 * @returns - Новое состояние
 */
const authReducer = (state: IAuthState = initialState, action: TAuthActions): IAuthState => {
  switch (action.type) {
    // Регистрация
    case REGISTER_REQUEST:
      return {
        ...state,
        registerLoading: true,
        registerError: null,
        error: null
      };
      
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        registerError: null,
        error: null
      };
      
    case REGISTER_ERROR:
      return {
        ...state,
        registerLoading: false,
        registerError: action.payload,
        error: action.payload,
        isAuthenticated: false
      };

    // Авторизация
    case LOGIN_REQUEST:
      return {
        ...state,
        loginLoading: true,
        loginError: null,
        error: null
      };
      
    case LOGIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loginError: null,
        error: null
      };
      
    case LOGIN_ERROR:
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload,
        error: action.payload,
        isAuthenticated: false
      };

    // Выход из системы
    case LOGOUT_REQUEST:
      return {
        ...state,
        logoutLoading: true,
        logoutError: null,
        error: null
      };
      
    case LOGOUT_SUCCESS:
      return {
        ...state,
        logoutLoading: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        logoutError: null,
        error: null
      };
      
    case LOGOUT_ERROR:
      return {
        ...state,
        logoutLoading: false,
        logoutError: action.payload,
        error: action.payload
      };

    // Обновление токена
    case REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        refreshTokenLoading: true,
        refreshTokenError: null,
        error: null
      };
      
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        refreshTokenLoading: false,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        refreshTokenError: null,
        error: null
      };
      
    case REFRESH_TOKEN_ERROR:
      return {
        ...state,
        refreshTokenLoading: false,
        refreshTokenError: action.payload,
        error: action.payload,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      };

    // Управление данными пользователя
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
      
    case CLEAR_USER_DATA:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null
      };

    // Управление состоянием загрузки и ошибок
    case SET_AUTH_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case SET_AUTH_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };

    // Получение данных пользователя
    case GET_USER_REQUEST:
      return {
        ...state,
        getUserLoading: true,
        getUserError: null,
        error: null
      };
      
    case GET_USER_SUCCESS:
      return {
        ...state,
        getUserLoading: false,
        user: action.payload,
        isAuthenticated: true,
        getUserError: null,
        error: null
      };
      
    case GET_USER_ERROR:
      return {
        ...state,
        getUserLoading: false,
        getUserError: action.payload,
        error: action.payload
      };

    // Обновление данных пользователя
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        updateUserLoading: true,
        updateUserError: null,
        error: null
      };
      
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUserLoading: false,
        user: action.payload,
        isAuthenticated: true,
        updateUserError: null,
        error: null
      };
      
    case UPDATE_USER_ERROR:
      return {
        ...state,
        updateUserLoading: false,
        updateUserError: action.payload,
        error: action.payload
      };

    default:
      return state;
  }
};

export default authReducer;
