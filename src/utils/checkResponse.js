import { API_BASE_URL } from './constants';

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
  // Выкидываем ошибку, чтобы она попала в `catch`
  return Promise.reject(`Ошибка ${res.status}`);
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
 * Универсальная функция для выполнения запросов к API
 * Автоматически добавляет базовый URL, проверяет ответ на ok и success
 * @param {string} endpoint - эндпоинт API (без базового URL)
 * @param {Object} options - опции для fetch (method, headers, body и т.д.)
 * @returns {Promise} - промис с данными ответа
 */
const request = (endpoint, options) => {
  return fetch(`${API_BASE_URL}${endpoint}`, options)
    .then(checkResponse)
    .then(checkSuccess);
};

export { request };
