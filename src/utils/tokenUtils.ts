import { ITokenUtils, IRefreshTokenUtils, IAuthUtils, IResetPasswordUtils, IAuthHeadersUtils, ITokens, IAuthHeaders, IRequestHeaders } from './types';

/**
 * Утилиты для работы с токенами аутентификации
 * Централизованное управление токенами в localStorage
 */

// Ключи для localStorage
const ACCESS_TOKEN_KEY: string = 'accessToken';
const REFRESH_TOKEN_KEY: string = 'refreshToken';
const RESET_PASSWORD_FLAG_KEY: string = 'resetPasswordAllowed';

/**
 * Утилиты для работы с access токеном
 */
export const tokenUtils: ITokenUtils = {
  /**
   * Сохраняет access токен в localStorage
   * @param token - Токен доступа
   */
  setAccessToken: (token: string): void => {
    // Удаляем "Bearer " префикс если он есть
    const cleanToken = token.replace('Bearer ', '');
    localStorage.setItem(ACCESS_TOKEN_KEY, cleanToken);
  },

  /**
   * Получает access токен из localStorage
   * @returns Токен доступа или null
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Удаляет access токен из localStorage
   */
  removeAccessToken: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Проверяет наличие access токена
   * @returns true если токен существует
   */
  hasAccessToken: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * Утилиты для работы с refresh токеном
 */
export const refreshTokenUtils: IRefreshTokenUtils = {
  /**
   * Сохраняет refresh токен в localStorage
   * @param token - Refresh токен
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Получает refresh токен из localStorage
   * @returns Refresh токен или null
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Удаляет refresh токен из localStorage
   */
  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Проверяет наличие refresh токена
   * @returns true если токен существует
   */
  hasRefreshToken: (): boolean => {
    return !!localStorage.getItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Утилиты для работы с обоими токенами
 */
export const authUtils: IAuthUtils = {
  /**
   * Сохраняет оба токена в localStorage
   * @param accessToken - Токен доступа
   * @param refreshToken - Refresh токен
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenUtils.setAccessToken(accessToken);
    refreshTokenUtils.setRefreshToken(refreshToken);
  },

  /**
   * Получает оба токена из localStorage
   * @returns Объект с токенами
   */
  getTokens: (): ITokens => {
    return {
      accessToken: tokenUtils.getAccessToken(),
      refreshToken: refreshTokenUtils.getRefreshToken()
    };
  },

  /**
   * Удаляет оба токена из localStorage
   */
  removeTokens: (): void => {
    tokenUtils.removeAccessToken();
    refreshTokenUtils.removeRefreshToken();
  },

  /**
   * Проверяет наличие обоих токенов
   * @returns true если оба токена существуют
   */
  hasTokens: (): boolean => {
    return tokenUtils.hasAccessToken() && refreshTokenUtils.hasRefreshToken();
  },

  /**
   * Проверяет, авторизован ли пользователь
   * @returns true если пользователь авторизован
   */
  isAuthenticated: (): boolean => {
    return authUtils.hasTokens();
  },

  /**
   * Очищает все данные аутентификации
   * Удаляет все токены и флаги
   */
  clearAllAuthData: (): void => {
    authUtils.removeTokens();
    resetPasswordUtils.removeResetPasswordFlag();
  }
};

/**
 * Утилиты для работы с флагом доступа к странице ResetPassword
 */
export const resetPasswordUtils: IResetPasswordUtils = {
  /**
   * Устанавливает флаг разрешения доступа к странице ResetPassword
   */
  setResetPasswordAllowed: (): void => {
    localStorage.setItem(RESET_PASSWORD_FLAG_KEY, 'true');
  },

  /**
   * Проверяет, разрешен ли доступ к странице ResetPassword
   * @returns true если доступ разрешен
   */
  isResetPasswordAllowed: (): boolean => {
    return localStorage.getItem(RESET_PASSWORD_FLAG_KEY) === 'true';
  },

  /**
   * Удаляет флаг разрешения доступа к странице ResetPassword
   */
  removeResetPasswordFlag: (): void => {
    localStorage.removeItem(RESET_PASSWORD_FLAG_KEY);
  }
};

/**
 * Утилиты для работы с заголовками авторизации
 */
export const authHeaders: IAuthHeadersUtils = {
  /**
   * Создает заголовок Authorization с access токеном
   * @returns Объект с заголовком Authorization
   */
  getAuthHeader: (): IAuthHeaders => {
    const token = tokenUtils.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * Создает заголовки для запросов с авторизацией
   * @param additionalHeaders - Дополнительные заголовки
   * @returns Объект с заголовками
   */
  getHeaders: (additionalHeaders: IRequestHeaders = {}): IRequestHeaders => {
    const authHeader = authHeaders.getAuthHeader();
    return {
      'Content-Type': 'application/json',
      ...authHeader,
      ...additionalHeaders
    };
  }
};
