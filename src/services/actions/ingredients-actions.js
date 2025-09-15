import { 
  FETCH_INGREDIENTS_REQUEST,
  FETCH_INGREDIENTS_SUCCESS,
  FETCH_INGREDIENTS_ERROR,
  SET_INGREDIENTS, 
  SET_INGREDIENTS_LOADING, 
  SET_INGREDIENTS_ERROR,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESTORE_INGREDIENT_COUNTERS
} from './action-types';
import { request } from '../../utils/checkResponse';

/**
 * Синхронные action creators для управления ингредиентами
 */

/**
 * Установка списка ингредиентов в store
 * @param {Array} ingredients - массив ингредиентов
 * @returns {Object} action для установки ингредиентов
 */
export const setIngredients = (ingredients) => ({
  type: SET_INGREDIENTS,
  payload: ingredients
});

/**
 * Установка состояния загрузки ингредиентов
 * @param {boolean} loading - состояние загрузки
 * @returns {Object} action для установки состояния загрузки
 */
export const setIngredientsLoading = (loading) => ({
  type: SET_INGREDIENTS_LOADING,
  payload: loading
});

/**
 * Установка ошибки при загрузке ингредиентов
 * @param {string} error - сообщение об ошибке
 * @returns {Object} action для установки ошибки
 */
export const setIngredientsError = (error) => ({
  type: SET_INGREDIENTS_ERROR,
  payload: error
});

/**
 * Увеличение счетчика ингредиента
 * Используется при добавлении ингредиента в конструктор
 * @param {string} ingredientId - идентификатор ингредиента
 * @returns {Object} action для увеличения счетчика
 */
export const incrementIngredientCount = (ingredientId) => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: ingredientId
});

/**
 * Увеличение счетчика ингредиента на указанное количество раз
 * Используется для булок, которые учитываются дважды (верх и низ)
 * @param {string} ingredientId - идентификатор ингредиента
 * @param {number} count - количество увеличений (по умолчанию 1)
 * @returns {Function} thunk функция для множественного увеличения счетчика
 */
export const incrementIngredientCountMultiple = (ingredientId, count = 1) => (dispatch) => {
  for (let i = 0; i < count; i++) {
    dispatch(incrementIngredientCount(ingredientId));
  }
};

/**
 * Уменьшение счетчика ингредиента
 * Используется при удалении ингредиента из конструктора
 * @param {string} ingredientId - идентификатор ингредиента
 * @returns {Object} action для уменьшения счетчика
 */
export const decrementIngredientCount = (ingredientId) => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: ingredientId
});

/**
 * Уменьшение счетчика ингредиента на указанное количество раз
 * Используется для булок, которые учитываются дважды (верх и низ)
 * @param {string} ingredientId - идентификатор ингредиента
 * @param {number} count - количество уменьшений (по умолчанию 1)
 * @returns {Function} thunk функция для множественного уменьшения счетчика
 */
export const decrementIngredientCountMultiple = (ingredientId, count = 1) => (dispatch) => {
  for (let i = 0; i < count; i++) {
    dispatch(decrementIngredientCount(ingredientId));
  }
};

/**
 * Восстановление счетчиков ингредиентов из сохраненного состояния
 * Используется при восстановлении состояния конструктора из localStorage
 * @param {Object} ingredientCounters - объект с счетчиками ингредиентов {ingredientId: count}
 * @returns {Object} action для восстановления счетчиков
 */
export const restoreIngredientCounters = (ingredientCounters) => ({
  type: RESTORE_INGREDIENT_COUNTERS,
  payload: ingredientCounters
});

/**
 * Асинхронный action creator для получения ингредиентов от API
 * Загружает данные об ингредиентах с сервера и обновляет store
 * Включает проверку на уже загруженные данные для предотвращения повторных запросов
 * @returns {Function} thunk функция для асинхронной загрузки
 */
export const fetchIngredients = () => {
  return async (dispatch, getState) => {
    // Проверяем, не загружаются ли уже ингредиенты
    const { loading, ingredients } = getState().ingredients;
    
    // Не делаем запрос, если уже загружаем или данные есть
    if (loading || (ingredients && ingredients.length > 0)) {
      return;
    }
    
    try {
      dispatch({ type: FETCH_INGREDIENTS_REQUEST });
      
      const data = await request('ingredients');
      
      dispatch({ type: FETCH_INGREDIENTS_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: FETCH_INGREDIENTS_ERROR, payload: error.message });
    }
  };
};
