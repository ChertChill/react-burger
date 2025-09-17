import { API_BASE_URL } from './constants';
import { authUtils, refreshTokenUtils } from './tokenUtils';

/**
 * Функция для проверки ответа от сервера на ok
 * Проверяет статус ответа и выбрасывает ошибку если ответ не успешный
 * @param {Response} res - объект ответа от fetch
 * @returns {Promise} - промис с данными ответа
 */
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  // Выкидываем ошибку с объектом, содержащим статус
  const error = new Error(`Ошибка ${res.status}`);
  error.status = res.status;
  return Promise.reject(error);
};

/**
 * Функция для проверки ответа на success
 * Проверяет поле success в ответе от сервера
 * @param {Object} res - объект ответа от сервера
 * @returns {Object} - данные ответа если success = true
 */
const checkSuccess = (res) => {
  if (res && res.success) {
    return res;
  }
  // Выкидываем ошибку, чтобы она попала в `catch`
  return Promise.reject(`Ответ не success: ${res}`);
};

/**
 * Функция для обновления токена доступа
 * @returns {Promise} - промис с новыми токенами
 */
const refreshAccessToken = async () => {
  const refreshToken = refreshTokenUtils.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await fetch(`${API_BASE_URL}auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error('Token refresh response not successful');
  }

  const { accessToken, refreshToken: newRefreshToken } = data;
  
  // Обновляем токены в localStorage
  authUtils.setTokens(accessToken, newRefreshToken);
  
  return { accessToken, refreshToken: newRefreshToken };
};

/**
 * Функция для выполнения запроса с автоматическим обновлением токена
 * @param {string} endpoint - эндпоинт API
 * @param {Object} options - опции для fetch
 * @param {boolean} isRetry - флаг повторного запроса
 * @returns {Promise} - промис с данными ответа
 */
const requestWithTokenRefresh = async (endpoint, options, isRetry = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Если получили 401 и это не повторный запрос, пытаемся обновить токен
    if (response.status === 401 && !isRetry && options.headers?.Authorization) {
      try {
        await refreshAccessToken();
        
        // Обновляем заголовок Authorization с новым токеном
        const newToken = authUtils.getTokens().accessToken;
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          }
        };
        
        // Повторяем запрос с новым токеном
        return requestWithTokenRefresh(endpoint, newOptions, true);
      } catch (refreshError) {
        // Если обновление токена не удалось, очищаем все данные аутентификации
        authUtils.clearAllAuthData();
        throw refreshError;
      }
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Универсальная функция для выполнения запросов к API
 * Автоматически добавляет базовый URL, проверяет ответ на ok и success
 * Поддерживает автоматическое обновление токена при ошибке 401
 * @param {string} endpoint - эндпоинт API (без базового URL)
 * @param {Object} options - опции для fetch (method, headers, body и т.д.)
 * @returns {Promise} - промис с данными ответа
 */
const request = (endpoint, options) => {
  return requestWithTokenRefresh(endpoint, options)
    .then(checkResponse)
    .then(checkSuccess);
};

export { request, checkResponse };
