import { 
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  SET_BUN,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR,
  SAVE_CONSTRUCTOR_STATE,
  RESTORE_CONSTRUCTOR_STATE,
  RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS
} from './action-types';
import { 
  incrementIngredientCount, 
  decrementIngredientCount,
  incrementIngredientCountMultiple,
  decrementIngredientCountMultiple,
  restoreIngredientCounters
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
 * @param {boolean} clearStorage - нужно ли очистить localStorage (по умолчанию false)
 * @returns {Function} thunk функция для очистки конструктора
 */
export const clearConstructor = (clearStorage = false) => (dispatch, getState) => {
  const state = getState();
  const { bun, constructorIngredients } = state.constructor;
  
  // Уменьшаем счетчики всех ингредиентов
  if (bun) {
    // Уменьшаем счетчик булки на 2 (верх и низ)
    dispatch(decrementIngredientCountMultiple(bun._id, 2));
  }
  
  // Уменьшаем счетчики всех начинок
  if (constructorIngredients && Array.isArray(constructorIngredients)) {
    constructorIngredients.forEach(ingredient => {
      dispatch(decrementIngredientCount(ingredient._id));
    });
  }
  
  // Очищаем localStorage если нужно
  if (clearStorage) {
    localStorage.removeItem('constructorState');
  }
  
  dispatch({
    type: CLEAR_CONSTRUCTOR
  });
};

/**
 * Сохранение состояния конструктора в localStorage
 * Сохраняет состояние только для авторизованных пользователей
 * @param {boolean} isAuthenticated - статус авторизации пользователя
 * @returns {Function} thunk функция для сохранения состояния
 */
export const saveConstructorState = (isAuthenticated) => (dispatch, getState) => {
  if (isAuthenticated) {
    const state = getState();
    const { bun, constructorIngredients } = state.constructor;
    const { ingredients } = state.ingredients;
    
    // Создаем карту счетчиков ингредиентов
    const ingredientCounters = {};
    if (ingredients && Array.isArray(ingredients)) {
      ingredients.forEach(ingredient => {
        if (ingredient.count && ingredient.count > 0) {
          ingredientCounters[ingredient._id] = ingredient.count;
        }
      });
    }
    
    const constructorState = {
      bun,
      constructorIngredients,
      ingredientCounters,
      timestamp: Date.now()
    };
    
    localStorage.setItem('constructorState', JSON.stringify(constructorState));
  }
};

/**
 * Восстановление конструктора без изменения счетчиков ингредиентов
 * Используется при восстановлении состояния из localStorage
 * @param {Object} bun - объект булки
 * @param {Array} constructorIngredients - массив ингредиентов конструктора
 * @returns {Object} action для восстановления конструктора
 */
export const restoreConstructorWithoutCounters = (bun, constructorIngredients) => ({
  type: RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS,
  payload: {
    bun,
    constructorIngredients: constructorIngredients || []
  }
});

/**
 * Восстановление состояния конструктора из localStorage
 * Восстанавливает состояние только для авторизованных пользователей
 * @param {boolean} isAuthenticated - статус авторизации пользователя
 * @returns {Function} thunk функция для восстановления состояния
 */
export const restoreConstructorState = (isAuthenticated) => (dispatch, getState) => {
  if (isAuthenticated) {
    try {
      const savedState = localStorage.getItem('constructorState');
      
      if (savedState) {
        const constructorState = JSON.parse(savedState);
        
        // Проверяем, что сохраненное состояние не слишком старое (например, не старше 24 часов)
        const maxAge = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
        const isStateValid = constructorState.timestamp && 
          (Date.now() - constructorState.timestamp) < maxAge;
        
        if (isStateValid && constructorState.bun) {
          // Восстанавливаем состояние БЕЗ изменения счетчиков
          dispatch(restoreConstructorWithoutCounters(
            constructorState.bun,
            constructorState.constructorIngredients
          ));
          
          // Восстанавливаем счетчики ингредиентов из сохраненного состояния
          if (constructorState.ingredientCounters) {
            dispatch(restoreIngredientCounters(constructorState.ingredientCounters));
          }
        } else {
          // Если состояние невалидно, очищаем localStorage
          localStorage.removeItem('constructorState');
        }
      }
    } catch (error) {
      console.error('Ошибка при восстановлении состояния конструктора:', error);
      localStorage.removeItem('constructorState');
    }
  }
};
