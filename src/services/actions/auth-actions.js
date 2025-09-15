import { request } from '../../utils/checkResponse';
import { authUtils, refreshTokenUtils } from '../../utils/tokenUtils';
import { getUserData, updateUserData } from '../../utils/api';
import { clearConstructor } from './constructor-actions';
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
} from './action-types';

/**
 * Экшены для регистрации пользователя
 */
export const registerRequest = () => ({
  type: REGISTER_REQUEST
});

export const registerSuccess = (user, accessToken, refreshToken) => ({
  type: REGISTER_SUCCESS,
  payload: {
    user,
    accessToken,
    refreshToken
  }
});

export const registerError = (error) => ({
  type: REGISTER_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для регистрации пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @param {string} name - Имя пользователя
 * @returns {Function} - Thunk функция
 */
export const register = (email, password, name) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await request('auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const { user, accessToken, refreshToken } = response;
      
      // Сохраняем токены
      authUtils.setTokens(accessToken, refreshToken);
      
      dispatch(registerSuccess(user, accessToken, refreshToken));
      dispatch(setUserData(user));
      
    } catch (error) {
      dispatch(registerError(error));
      dispatch(setAuthError(error));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для авторизации пользователя
 */
export const loginRequest = () => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (user, accessToken, refreshToken) => ({
  type: LOGIN_SUCCESS,
  payload: {
    user,
    accessToken,
    refreshToken
  }
});

export const loginError = (error) => ({
  type: LOGIN_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для авторизации пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @returns {Function} - Thunk функция
 */
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await request('auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const { user, accessToken, refreshToken } = response;
      
      // Сохраняем токены
      authUtils.setTokens(accessToken, refreshToken);
      
      dispatch(loginSuccess(user, accessToken, refreshToken));
      dispatch(setUserData(user));
      
    } catch (error) {
      dispatch(loginError(error));
      dispatch(setAuthError(error));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для выхода из системы
 */
export const logoutRequest = () => ({
  type: LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
});

export const logoutError = (error) => ({
  type: LOGOUT_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для выхода из системы
 * @returns {Function} - Thunk функция
 */
export const logout = () => {
  return async (dispatch) => {
    dispatch(logoutRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const refreshToken = refreshTokenUtils.getRefreshToken();
      
      if (refreshToken) {
        await request('auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: refreshToken }),
        });
      }
      
      // Очищаем все данные аутентификации независимо от результата запроса
      authUtils.clearAllAuthData();
      
      // Очищаем состояние конструктора при выходе
      dispatch(clearConstructor(true));
      
      dispatch(logoutSuccess());
      dispatch(clearUserData());
      
    } catch (error) {
      // Даже если запрос не удался, очищаем все данные аутентификации
      authUtils.clearAllAuthData();
      
      // Очищаем состояние конструктора при выходе
      dispatch(clearConstructor(true));
      
      dispatch(logoutSuccess());
      dispatch(clearUserData());
      dispatch(logoutError(error));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для обновления токена
 */
export const refreshTokenRequest = () => ({
  type: REFRESH_TOKEN_REQUEST
});

export const refreshTokenSuccess = (accessToken, refreshToken) => ({
  type: REFRESH_TOKEN_SUCCESS,
  payload: {
    accessToken,
    refreshToken
  }
});

export const refreshTokenError = (error) => ({
  type: REFRESH_TOKEN_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для обновления токена
 * @returns {Function} - Thunk функция
 */
export const refreshToken = () => {
  return async (dispatch) => {
    dispatch(refreshTokenRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const refreshTokenValue = refreshTokenUtils.getRefreshToken();
      
      if (!refreshTokenValue) {
        throw new Error('Refresh token not found');
      }

      const response = await request('auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshTokenValue }),
      });

      const { accessToken, refreshToken: newRefreshToken } = response;
      
      // Обновляем токены
      authUtils.setTokens(accessToken, newRefreshToken);
      
      dispatch(refreshTokenSuccess(accessToken, newRefreshToken));
      
    } catch (error) {
      // Если обновление токена не удалось, очищаем все данные
      authUtils.removeTokens();
      dispatch(clearUserData());
      dispatch(refreshTokenError(error));
      dispatch(setAuthError(error));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для управления данными пользователя
 */
export const setUserData = (user) => ({
  type: SET_USER_DATA,
  payload: user
});

export const clearUserData = () => ({
  type: CLEAR_USER_DATA
});

/**
 * Экшены для управления состоянием загрузки и ошибок
 */
export const setAuthLoading = (loading) => ({
  type: SET_AUTH_LOADING,
  payload: loading
});

export const setAuthError = (error) => ({
  type: SET_AUTH_ERROR,
  payload: error
});

/**
 * Экшены для получения данных пользователя
 */
export const getUserRequest = () => ({
  type: GET_USER_REQUEST
});

export const getUserSuccess = (user) => ({
  type: GET_USER_SUCCESS,
  payload: user
});

export const getUserError = (error) => ({
  type: GET_USER_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для получения данных пользователя
 * @returns {Function} - Thunk функция
 */
export const fetchUserData = () => {
  return async (dispatch) => {
    dispatch(getUserRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await getUserData();
      
      dispatch(getUserSuccess(response.user));
      dispatch(setUserData(response.user));
      
    } catch (error) {
      dispatch(getUserError(error));
      dispatch(setAuthError(error));
      
      // Если ошибка связана с токенами, очищаем данные авторизации
      if (error.message?.includes('Token') || error.message?.includes('refresh')) {
        authUtils.clearAllAuthData();
        dispatch(clearUserData());
      }
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для обновления данных пользователя
 */
export const updateUserRequest = () => ({
  type: UPDATE_USER_REQUEST
});

export const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserError = (error) => ({
  type: UPDATE_USER_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для обновления данных пользователя
 * @param {Object} userData - Данные пользователя для обновления
 * @returns {Function} - Thunk функция
 */
export const updateUserProfile = (userData) => {
  return async (dispatch) => {
    dispatch(updateUserRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await updateUserData(userData);
      
      dispatch(updateUserSuccess(response.user));
      dispatch(setUserData(response.user));
      
    } catch (error) {
      dispatch(updateUserError(error));
      dispatch(setAuthError(error));
      
      // Если ошибка связана с токенами, очищаем данные авторизации
      if (error.message?.includes('Token') || error.message?.includes('refresh')) {
        authUtils.clearAllAuthData();
        dispatch(clearUserData());
      }
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшен для очистки ошибки аутентификации
 * @returns {Object} - Action объект
 */
export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR
});