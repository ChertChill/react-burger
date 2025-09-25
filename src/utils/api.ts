import { request } from './checkResponse';
import { authHeaders } from './tokenUtils';
import { 
  TWithEmail, 
  IResetPasswordRequest, 
  TWithEmailPasswordAndName, 
  TWithEmailAndPassword, 
  ILogoutRequest, 
  IUserData,
  IApiResponse,
  IAuthResponse,
  IUserResponse
} from './types';

/**
 * Отправляет запрос на восстановление пароля
 * @param email - Email пользователя
 * @returns Ответ сервера
 */
export const forgotPassword = async (email: string): Promise<IApiResponse> => {
    const requestData: TWithEmail = { email };
    return request('password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });
};

/**
 * Отправляет запрос на сброс пароля с токеном
 * @param password - Новый пароль
 * @param token - Токен из email
 * @returns Ответ сервера
 */
export const resetPassword = async (password: string, token: string): Promise<IApiResponse> => {
    const requestData: IResetPasswordRequest = { password, token };
    return request('password-reset/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });
};

/**
 * Регистрирует нового пользователя
 * @param email - Email пользователя
 * @param password - Пароль
 * @param name - Имя пользователя
 * @returns Ответ сервера
 */
export const registerUser = async (email: string, password: string, name: string): Promise<IAuthResponse> => {
    const requestData: TWithEmailPasswordAndName = { email, password, name };
    return request('auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    }) as Promise<IAuthResponse>;
};

/**
 * Авторизует пользователя
 * @param email - Email пользователя
 * @param password - Пароль
 * @returns Ответ сервера
 */
export const loginUser = async (email: string, password: string): Promise<IAuthResponse> => {
    const requestData: TWithEmailAndPassword = { email, password };
    return request('auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    }) as Promise<IAuthResponse>;
};

/**
 * Выход из системы
 * @param token - Refresh токен
 * @returns Ответ сервера
 */
export const logoutUser = async (token: string): Promise<IApiResponse> => {
    const requestData: ILogoutRequest = { token };
    return request('auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });
};

/**
 * Обновляет токен доступа
 * @param token - Refresh токен
 * @returns Ответ сервера
 */
export const refreshUserToken = async (token: string): Promise<IApiResponse> => {
    const requestData: ILogoutRequest = { token };
    return request('auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });
};

/**
 * Получает данные пользователя
 * Автоматически обновляет токен при необходимости
 * @returns Ответ сервера
 */
export const getUserData = async (): Promise<IUserResponse> => {
    return request('auth/user', {
        method: 'GET',
        headers: authHeaders.getHeaders(),
    }) as Promise<IUserResponse>;
};

/**
 * Обновляет данные пользователя
 * Автоматически обновляет токен при необходимости
 * @param userData - Данные пользователя для обновления
 * @returns Ответ сервера
 */
export const updateUserData = async (userData: Partial<IUserData>): Promise<IUserResponse> => {
    return request('auth/user', {
        method: 'PATCH',
        headers: authHeaders.getHeaders(),
        body: JSON.stringify(userData),
    }) as Promise<IUserResponse>;
};
