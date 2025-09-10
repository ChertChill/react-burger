import { 
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  SET_BUN,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR
} from './action-types';
import { 
  incrementIngredientCount, 
  decrementIngredientCount,
  incrementIngredientCountMultiple,
  decrementIngredientCountMultiple
} from './ingredients-actions';
import { v4 as uuidv4 } from 'uuid';

/**
 * Action creators для управления конструктором бургера
 */

/**
 * Добавление ингредиента в конструктор
 * Создает уникальный ID для ингредиента и увеличивает его счетчик
 * @param {Object} ingredient - объект ингредиента для добавления
 * @returns {Function} thunk функция для добавления ингредиента
 */
export const addIngredientToConstructor = (ingredient) => (dispatch) => {
  dispatch({
    type: ADD_INGREDIENT_TO_CONSTRUCTOR,
    payload: {
      ...ingredient,
      id: uuidv4()    // Уникальный ID для каждого ингредиента
    }
  });
  dispatch(incrementIngredientCount(ingredient._id));
};

/**
 * Удаление ингредиента из конструктора
 * Удаляет ингредиент по индексу и уменьшает его счетчик
 * @param {number} index - индекс ингредиента в конструкторе
 * @param {string} ingredientId - идентификатор ингредиента
 * @returns {Function} thunk функция для удаления ингредиента
 */
export const removeIngredientFromConstructor = (index, ingredientId) => (dispatch) => {
  dispatch({
    type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
    payload: { index, ingredientId }
  });
  dispatch(decrementIngredientCount(ingredientId));
};

/**
 * Установка булки в конструктор
 * Управляет счетчиками булок (учитывается дважды - верх и низ)
 * @param {Object} bun - объект булки для установки
 * @returns {Function} thunk функция для установки булки
 */
export const setBun = (bun) => (dispatch, getState) => {
  const state = getState();
  const currentBun = state.constructor.bun;
  
  // Если уже есть булка, уменьшаем её счетчик на 2 (верх и низ)
  if (currentBun) {
    dispatch(decrementIngredientCountMultiple(currentBun._id, 2));
  }
  
  // Увеличиваем счетчик новой булки на 2 (верх и низ)
  dispatch(incrementIngredientCountMultiple(bun._id, 2));
  
  dispatch({
    type: SET_BUN,
    payload: bun
  });
};

/**
 * Перемещение ингредиента в конструкторе
 * Используется для drag & drop функциональности
 * @param {number} dragIndex - индекс перетаскиваемого элемента
 * @param {number} hoverIndex - индекс элемента, на который наведен курсор
 * @returns {Object} action для перемещения ингредиента
 */
export const moveIngredient = (dragIndex, hoverIndex) => ({
  type: MOVE_INGREDIENT,
  payload: { dragIndex, hoverIndex }
});

/**
 * Очистка конструктора
 * Удаляет все ингредиенты и сбрасывает счетчики
 * @returns {Function} thunk функция для очистки конструктора
 */
export const clearConstructor = () => (dispatch, getState) => {
  const state = getState();
  const { bun, constructorIngredients } = state.constructor;
  
  // Уменьшаем счетчики всех ингредиентов
  if (bun) {
    // Уменьшаем счетчик булки на 2 (верх и низ)
    dispatch(decrementIngredientCountMultiple(bun._id, 2));
  }
  
  // Уменьшаем счетчики всех начинок
  constructorIngredients.forEach(ingredient => {
    dispatch(decrementIngredientCount(ingredient._id));
  });
  
  dispatch({
    type: CLEAR_CONSTRUCTOR
  });
};
