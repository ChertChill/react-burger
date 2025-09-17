/**
 * Утилиты для работы с токенами аутентификации
 * Централизованное управление токенами в localStorage
 */

// Ключи для localStorage
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const RESET_PASSWORD_FLAG_KEY = 'resetPasswordAllowed';

/**
 * Утилиты для работы с access токеном
 */
export const tokenUtils = {
  /**
   * Сохраняет access токен в localStorage
   * @param {string} token - Токен доступа
   */
  setAccessToken: (token) => {
    // Удаляем "Bearer " префикс если он есть
    const cleanToken = token.replace('Bearer ', '');
    localStorage.setItem(ACCESS_TOKEN_KEY, cleanToken);
  },

  /**
   * Получает access токен из localStorage
   * @returns {string|null} - Токен доступа или null
   */
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Удаляет access токен из localStorage
   */
  removeAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Проверяет наличие access токена
   * @returns {boolean} - true если токен существует
   */
  hasAccessToken: () => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * Утилиты для работы с refresh токеном
 */
export const refreshTokenUtils = {
  /**
   * Сохраняет refresh токен в localStorage
   * @param {string} token - Refresh токен
   */
  setRefreshToken: (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Получает refresh токен из localStorage
   * @returns {string|null} - Refresh токен или null
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Удаляет refresh токен из localStorage
   */
  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Проверяет наличие refresh токена
   * @returns {boolean} - true если токен существует
   */
  hasRefreshToken: () => {
    return !!localStorage.getItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Утилиты для работы с обоими токенами
 */
export const authUtils = {
  /**
   * Сохраняет оба токена в localStorage
   * @param {string} accessToken - Токен доступа
   * @param {string} refreshToken - Refresh токен
   */
  setTokens: (accessToken, refreshToken) => {
    tokenUtils.setAccessToken(accessToken);
    refreshTokenUtils.setRefreshToken(refreshToken);
  },

  /**
   * Получает оба токена из localStorage
   * @returns {Object} - Объект с токенами
   */
  getTokens: () => {
    return {
      accessToken: tokenUtils.getAccessToken(),
      refreshToken: refreshTokenUtils.getRefreshToken()
    };
  },

  /**
   * Удаляет оба токена из localStorage
   */
  removeTokens: () => {
    tokenUtils.removeAccessToken();
    refreshTokenUtils.removeRefreshToken();
  },

  /**
   * Проверяет наличие обоих токенов
   * @returns {boolean} - true если оба токена существуют
   */
  hasTokens: () => {
    return tokenUtils.hasAccessToken() && refreshTokenUtils.hasRefreshToken();
  },

  /**
   * Проверяет, авторизован ли пользователь
   * @returns {boolean} - true если пользователь авторизован
   */
  isAuthenticated: () => {
    return authUtils.hasTokens();
  },

  /**
   * Очищает все данные аутентификации
   * Удаляет все токены и флаги
   */
  clearAllAuthData: () => {
    authUtils.removeTokens();
    resetPasswordUtils.removeResetPasswordFlag();
  }
};

/**
 * Утилиты для работы с флагом доступа к странице ResetPassword
 */
export const resetPasswordUtils = {
  /**
   * Устанавливает флаг разрешения доступа к странице ResetPassword
   */
  setResetPasswordAllowed: () => {
    localStorage.setItem(RESET_PASSWORD_FLAG_KEY, 'true');
  },

  /**
   * Проверяет, разрешен ли доступ к странице ResetPassword
   * @returns {boolean} - true если доступ разрешен
   */
  isResetPasswordAllowed: () => {
    return localStorage.getItem(RESET_PASSWORD_FLAG_KEY) === 'true';
  },

  /**
   * Удаляет флаг разрешения доступа к странице ResetPassword
   */
  removeResetPasswordFlag: () => {
    localStorage.removeItem(RESET_PASSWORD_FLAG_KEY);
  }
};

/**
 * Утилиты для работы с заголовками авторизации
 */
export const authHeaders = {
  /**
   * Создает заголовок Authorization с access токеном
   * @returns {Object} - Объект с заголовком Authorization
   */
  getAuthHeader: () => {
    const token = tokenUtils.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * Создает заголовки для запросов с авторизацией
   * @param {Object} additionalHeaders - Дополнительные заголовки
   * @returns {Object} - Объект с заголовками
   */
  getHeaders: (additionalHeaders = {}) => {
    return {
      'Content-Type': 'application/json',
      ...authHeaders.getAuthHeader(),
      ...additionalHeaders
    };
  }
};
