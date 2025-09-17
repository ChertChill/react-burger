import { request } from './checkResponse';
import { authHeaders } from './tokenUtils';

/**
 * Отправляет запрос на восстановление пароля
 * @param {string} email - Email пользователя
 * @returns {Promise} - Ответ сервера
 */
export const forgotPassword = async (email) => {
    return request('password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
};

/**
 * Отправляет запрос на сброс пароля с токеном
 * @param {string} password - Новый пароль
 * @param {string} token - Токен из email
 * @returns {Promise} - Ответ сервера
 */
export const resetPassword = async (password, token) => {
    return request('password-reset/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
    });
};

/**
 * Регистрирует нового пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @param {string} name - Имя пользователя
 * @returns {Promise} - Ответ сервера
 */
export const registerUser = async (email, password, name) => {
    return request('auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
    });
};

/**
 * Авторизует пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @returns {Promise} - Ответ сервера
 */
export const loginUser = async (email, password) => {
    return request('auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
};

/**
 * Выход из системы
 * @param {string} token - Refresh токен
 * @returns {Promise} - Ответ сервера
 */
export const logoutUser = async (token) => {
    return request('auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
};

/**
 * Обновляет токен доступа
 * @param {string} token - Refresh токен
 * @returns {Promise} - Ответ сервера
 */
export const refreshUserToken = async (token) => {
    return request('auth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
};

/**
 * Получает данные пользователя
 * Автоматически обновляет токен при необходимости
 * @returns {Promise} - Ответ сервера
 */
export const getUserData = async () => {
    return request('auth/user', {
        method: 'GET',
        headers: authHeaders.getHeaders(),
    });
};

/**
 * Обновляет данные пользователя
 * Автоматически обновляет токен при необходимости
 * @param {Object} userData - Данные пользователя для обновления
 * @returns {Promise} - Ответ сервера
 */
export const updateUserData = async (userData) => {
    return request('auth/user', {
        method: 'PATCH',
        headers: authHeaders.getHeaders(),
        body: JSON.stringify(userData),
    });
};
