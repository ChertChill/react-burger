import { 
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT
} from '../actions/action-types';

/**
 * Начальное состояние для reducer деталей ингредиента
 * Содержит данные о текущем просматриваемом ингредиенте
 */
const initialState = {
  currentIngredient: null
};

/**
 * Reducer для управления состоянием деталей ингредиента
 * Обрабатывает установку и очистку данных о текущем ингредиенте
 * Используется для отображения модального окна с информацией об ингредиенте
 * 
 * @param {Object} state - текущее состояние
 * @param {Object} action - действие для обработки
 * @returns {Object} новое состояние
 */
const ingredientDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_INGREDIENT:
      return {
        ...state,
        currentIngredient: action.payload
      };

    case CLEAR_CURRENT_INGREDIENT:
      return {
        ...state,
        currentIngredient: null
      };
      
    default:
      return state;
  }
};

export default ingredientDetailsReducer;
