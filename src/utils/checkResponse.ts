import { API_BASE_URL } from './constants';
import { authUtils, refreshTokenUtils } from './tokenUtils';
import { IApiError, IApiResponse, ITokenResponse, IRequestOptions } from './types';

/**
 * Функция для проверки ответа от сервера на ok
 * Проверяет статус ответа и выбрасывает ошибку если ответ не успешный
 * @param res - объект ответа от fetch
 * @returns промис с данными ответа
 */
const checkResponse = (res: Response): Promise<IApiResponse> => {
  if (res.ok) {
    return res.json();
  }
  // Выкидываем ошибку с объектом, содержащим статус
  const error: IApiError = new Error(`Ошибка ${res.status}`) as IApiError;
  error.status = res.status;
  return Promise.reject(error);
};

/**
 * Функция для проверки ответа на success
 * Проверяет поле success в ответе от сервера
 * @param res - объект ответа от сервера
 * @returns данные ответа если success = true
 */
const checkSuccess = (res: IApiResponse): Promise<IApiResponse> => {
  if (res && res.success) {
    return Promise.resolve(res);
  }
  // Выкидываем ошибку, чтобы она попала в `catch`
  return Promise.reject(new Error(`Ответ не success: ${JSON.stringify(res)}`));
};

/**
 * Функция для обновления токена доступа
 * @returns промис с новыми токенами
 */
const refreshAccessToken = async (): Promise<ITokenResponse> => {
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

  const data: ITokenResponse = await response.json();
  
  if (!data.success) {
    throw new Error('Token refresh response not successful');
  }

  const { accessToken, refreshToken: newRefreshToken } = data;
  
  // Обновляем токены в localStorage
  authUtils.setTokens(accessToken, newRefreshToken);
  
  return { success: true, accessToken, refreshToken: newRefreshToken };
};

/**
 * Функция для выполнения запроса с автоматическим обновлением токена
 * @param endpoint - эндпоинт API
 * @param options - опции для fetch
 * @param isRetry - флаг повторного запроса
 * @returns промис с данными ответа
 */
const requestWithTokenRefresh = async (
  endpoint: string, 
  options: IRequestOptions, 
  isRetry: boolean = false
): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Если получили 401 и это не повторный запрос, пытаемся обновить токен
    if (response.status === 401 && !isRetry && options.headers?.Authorization) {
      try {
        await refreshAccessToken();
        
        // Обновляем заголовок Authorization с новым токеном
        const newToken = authUtils.getTokens().accessToken;
        if (!newToken) {
          throw new Error('Failed to get new access token');
        }
        
        const newOptions: IRequestOptions = {
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
 * @param endpoint - эндпоинт API (без базового URL)
 * @param options - опции для fetch (method, headers, body и т.д.)
 * @returns промис с данными ответа
 */
const request = (endpoint: string, options: IRequestOptions): Promise<IApiResponse> => {
  return requestWithTokenRefresh(endpoint, options)
    .then(checkResponse)
    .then(checkSuccess);
};

export { request, checkResponse };
