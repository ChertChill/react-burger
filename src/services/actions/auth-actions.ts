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
import { 
  IUserData,
  TAuthActions,
  IRegisterSuccessAction,
  IRegisterErrorAction,
  ILoginSuccessAction,
  ILoginErrorAction,
  ILogoutErrorAction,
  IRefreshTokenSuccessAction,
  IRefreshTokenErrorAction,
  ISetUserDataAction,
  ISetAuthLoadingAction,
  ISetAuthErrorAction,
  IGetUserSuccessAction,
  IGetUserErrorAction,
  IUpdateUserSuccessAction,
  IUpdateUserErrorAction
} from '../../utils/types';
import { ThunkAction } from 'redux-thunk';
import { IRootState } from '../../utils/types';

/**
 * Экшены для регистрации пользователя
 */
export const registerRequest = (): { type: typeof REGISTER_REQUEST } => ({
  type: REGISTER_REQUEST
});

export const registerSuccess = (user: IUserData, accessToken: string, refreshToken: string): IRegisterSuccessAction => ({
  type: REGISTER_SUCCESS,
  payload: {
    user,
    accessToken,
    refreshToken
  }
});

export const registerError = (error: string): IRegisterErrorAction => ({
  type: REGISTER_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для регистрации пользователя
 * @param email - Email пользователя
 * @param password - Пароль
 * @param name - Имя пользователя
 * @returns Thunk функция
 */
export const register = (email: string, password: string, name: string): ThunkAction<void, IRootState, unknown, TAuthActions> => {
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
      }) as unknown as { user: IUserData; accessToken: string; refreshToken: string };

      const { user, accessToken, refreshToken } = response;
      
      // Сохраняем токены
      authUtils.setTokens(accessToken, refreshToken);
      
      dispatch(registerSuccess(user, accessToken, refreshToken));
      dispatch(setUserData(user));
      
    } catch (error) {
      dispatch(registerError((error as Error).message));
      dispatch(setAuthError((error as Error).message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для авторизации пользователя
 */
export const loginRequest = (): { type: typeof LOGIN_REQUEST } => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (user: IUserData, accessToken: string, refreshToken: string): ILoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: {
    user,
    accessToken,
    refreshToken
  }
});

export const loginError = (error: string): ILoginErrorAction => ({
  type: LOGIN_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для авторизации пользователя
 * @param email - Email пользователя
 * @param password - Пароль
 * @returns Thunk функция
 */
export const login = (email: string, password: string): ThunkAction<void, IRootState, unknown, TAuthActions> => {
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
      }) as unknown as { user: IUserData; accessToken: string; refreshToken: string };

      const { user, accessToken, refreshToken } = response;
      
      // Сохраняем токены
      authUtils.setTokens(accessToken, refreshToken);
      
      dispatch(loginSuccess(user, accessToken, refreshToken));
      dispatch(setUserData(user));
      
    } catch (error) {
      dispatch(loginError((error as Error).message));
      dispatch(setAuthError((error as Error).message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для выхода из системы
 */
export const logoutRequest = (): { type: typeof LOGOUT_REQUEST } => ({
  type: LOGOUT_REQUEST
});

export const logoutSuccess = (): { type: typeof LOGOUT_SUCCESS } => ({
  type: LOGOUT_SUCCESS
});

export const logoutError = (error: string): ILogoutErrorAction => ({
  type: LOGOUT_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для выхода из системы
 * @returns Thunk функция
 */
export const logout = (): ThunkAction<void, IRootState, unknown, TAuthActions> => {
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
      dispatch(logoutError((error as Error).message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для обновления токена
 */
export const refreshTokenRequest = (): { type: typeof REFRESH_TOKEN_REQUEST } => ({
  type: REFRESH_TOKEN_REQUEST
});

export const refreshTokenSuccess = (accessToken: string, refreshToken: string): IRefreshTokenSuccessAction => ({
  type: REFRESH_TOKEN_SUCCESS,
  payload: {
    accessToken,
    refreshToken
  }
});

export const refreshTokenError = (error: string): IRefreshTokenErrorAction => ({
  type: REFRESH_TOKEN_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для обновления токена
 * @returns Thunk функция
 */
export const refreshToken = (): ThunkAction<void, IRootState, unknown, TAuthActions> => {
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
      }) as unknown as { accessToken: string; refreshToken: string };

      const { accessToken, refreshToken: newRefreshToken } = response;
      
      // Обновляем токены
      authUtils.setTokens(accessToken, newRefreshToken);
      
      dispatch(refreshTokenSuccess(accessToken, newRefreshToken));
      
    } catch (error) {
      // Если обновление токена не удалось, очищаем все данные
      authUtils.removeTokens();
      dispatch(clearUserData());
      dispatch(refreshTokenError((error as Error).message));
      dispatch(setAuthError((error as Error).message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

/**
 * Экшены для управления данными пользователя
 */
export const setUserData = (user: IUserData): ISetUserDataAction => ({
  type: SET_USER_DATA,
  payload: user
});

export const clearUserData = (): { type: typeof CLEAR_USER_DATA } => ({
  type: CLEAR_USER_DATA
});

/**
 * Экшены для управления состоянием загрузки и ошибок
 */
export const setAuthLoading = (loading: boolean): ISetAuthLoadingAction => ({
  type: SET_AUTH_LOADING,
  payload: loading
});

export const setAuthError = (error: string | null): ISetAuthErrorAction => ({
  type: SET_AUTH_ERROR,
  payload: error
});

/**
 * Экшены для получения данных пользователя
 */
export const getUserRequest = (): { type: typeof GET_USER_REQUEST } => ({
  type: GET_USER_REQUEST
});

export const getUserSuccess = (user: IUserData): IGetUserSuccessAction => ({
  type: GET_USER_SUCCESS,
  payload: user
});

export const getUserError = (error: string): IGetUserErrorAction => ({
  type: GET_USER_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для получения данных пользователя
 * @returns Thunk функция
 */
export const fetchUserData = (): ThunkAction<void, IRootState, unknown, TAuthActions> => {
  return async (dispatch) => {
    dispatch(getUserRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await getUserData();
      
      dispatch(getUserSuccess(response.user));
      dispatch(setUserData(response.user));
      
    } catch (error) {
      dispatch(getUserError((error as Error).message));
      dispatch(setAuthError((error as Error).message));
      
      // Если ошибка связана с токенами, очищаем данные авторизации
      if ((error as Error).message?.includes('Token') || (error as Error).message?.includes('refresh')) {
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
export const updateUserRequest = (): { type: typeof UPDATE_USER_REQUEST } => ({
  type: UPDATE_USER_REQUEST
});

export const updateUserSuccess = (user: IUserData): IUpdateUserSuccessAction => ({
  type: UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserError = (error: string): IUpdateUserErrorAction => ({
  type: UPDATE_USER_ERROR,
  payload: error
});

/**
 * Асинхронный экшен для обновления данных пользователя
 * @param userData - Данные пользователя для обновления
 * @returns Thunk функция
 */
export const updateUserProfile = (userData: Partial<IUserData>): ThunkAction<void, IRootState, unknown, TAuthActions> => {
  return async (dispatch) => {
    dispatch(updateUserRequest());
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await updateUserData(userData);
      
      dispatch(updateUserSuccess(response.user));
      dispatch(setUserData(response.user));
      
    } catch (error) {
      dispatch(updateUserError((error as Error).message));
      dispatch(setAuthError((error as Error).message));
      
      // Если ошибка связана с токенами, очищаем данные авторизации
      if ((error as Error).message?.includes('Token') || (error as Error).message?.includes('refresh')) {
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
 * @returns Action объект
 */
export const clearAuthError = (): { type: typeof CLEAR_AUTH_ERROR } => ({
  type: CLEAR_AUTH_ERROR
});
