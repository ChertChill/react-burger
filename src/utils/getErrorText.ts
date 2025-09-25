import { IApiError } from './types';

/**
 * Простая функция для определения типа ошибки
 * @param error - ошибка от API или строка
 * @returns понятное сообщение об ошибке
 */
export const getErrorText = (error: IApiError | string | null): string => {
    if (!error) return '';
    
    const errorStr = typeof error === 'string' ? error : (error.message || error.toString());
    
    // Если ошибка связана с данными (401, 403, 404, 409)
    if (errorStr.includes('401') || errorStr.includes('403') || errorStr.includes('404') || errorStr.includes('409')) {
        return 'Проверьте правильность введенных данных';
    }
    
    // Если ошибка сервера (500) или сети
    if (errorStr.includes('500') || errorStr.includes('Network')) {
        return 'Ошибка сервера. Попробуйте позже';
    }
    
    return 'Произошла ошибка. Попробуйте еще раз';
};
