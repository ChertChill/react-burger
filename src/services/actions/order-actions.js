import { 
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  SET_ORDER_NUMBER,
  SET_ORDER_LOADING,
  SET_ORDER_ERROR,
  CLEAR_ORDER
} from './action-types';
import { request } from '../../utils/checkResponse';

/**
 * Синхронные action creators для управления заказами
 */

/**
 * Установка номера заказа
 * @param {number} orderNumber - номер созданного заказа
 * @returns {Object} action для установки номера заказа
 */
export const setOrderNumber = (orderNumber) => ({
  type: SET_ORDER_NUMBER,
  payload: orderNumber
});

/**
 * Установка состояния загрузки заказа
 * @param {boolean} loading - состояние загрузки
 * @returns {Object} action для установки состояния загрузки
 */
export const setOrderLoading = (loading) => ({
  type: SET_ORDER_LOADING,
  payload: loading
});

/**
 * Установка ошибки при создании заказа
 * @param {string} error - сообщение об ошибке
 * @returns {Object} action для установки ошибки
 */
export const setOrderError = (error) => ({
  type: SET_ORDER_ERROR,
  payload: error
});

/**
 * Очистка данных заказа
 * Сбрасывает номер заказа, состояние загрузки и ошибки
 * @returns {Object} action для очистки заказа
 */
export const clearOrder = () => ({
  type: CLEAR_ORDER
});

/**
 * Асинхронный action creator для создания заказа
 * Отправляет запрос на сервер с данными о выбранных ингредиентах
 * Включает валидацию наличия булки и начинки
 * @param {Object} bun - объект выбранной булки
 * @param {Array} constructorIngredients - массив ингредиентов конструктора
 * @returns {Function} thunk функция для создания заказа
 */
export const createOrder = (bun, constructorIngredients) => {
  return async (dispatch) => {
    try {
      dispatch({ type: CREATE_ORDER_REQUEST });
      
      // Проверяем, что у нас есть и булка, и начинка
      if (!bun) {
        throw new Error('Необходимо выбрать булку');
      }
      
      if (!constructorIngredients || constructorIngredients.length === 0) {
        throw new Error('Необходимо добавить начинку');
      }
      
      // Формируем массив идентификаторов в формате [bun_id1, ing_id1, ing_id2, ing_id3, bun_id1]
      const ingredientIds = [
        bun._id, // Первая булка
        ...constructorIngredients.map(ingredient => ingredient._id), // Начинка
        bun._id // Вторая булка (та же самая)
      ];
      
      const data = await request('orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: ingredientIds
        })
      });
      
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data.order.number });
    } catch (error) {
      dispatch({ type: CREATE_ORDER_ERROR, payload: error.message });
    }
  };
};
