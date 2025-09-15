import { 
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT
} from './action-types';

/**
 * Action creators для управления деталями ингредиента
 */

/**
 * Установка текущего просматриваемого ингредиента
 * Используется для отображения модального окна с деталями
 * @param {Object} ingredient - объект ингредиента для отображения
 * @returns {Object} action для установки текущего ингредиента
 */
export const setCurrentIngredient = (ingredient) => ({
  type: SET_CURRENT_INGREDIENT,
  payload: ingredient
});

/**
 * Очистка данных о текущем ингредиенте
 * Вызывается при закрытии модального окна с деталями
 * @returns {Object} action для очистки текущего ингредиента
 */
export const clearCurrentIngredient = () => ({
  type: CLEAR_CURRENT_INGREDIENT
});
