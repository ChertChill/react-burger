import { 
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  SET_BUN,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR
} from '../actions/action-types';

/**
 * Начальное состояние для reducer конструктора
 * Содержит массив ингредиентов конструктора и выбранную булку
 */
const initialState = {
  constructorIngredients: [],
  bun: null
};

/**
 * Reducer для управления состоянием конструктора бургера
 * Обрабатывает добавление/удаление ингредиентов, установку булки и перемещение элементов
 * 
 * @param {Object} state - текущее состояние
 * @param {Object} action - действие для обработки
 * @returns {Object} новое состояние
 */
const constructorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INGREDIENT_TO_CONSTRUCTOR:
      return {
        ...state,
        constructorIngredients: [...(state.constructorIngredients || []), action.payload]
      };

    case REMOVE_INGREDIENT_FROM_CONSTRUCTOR:
      return {
        ...state,
        constructorIngredients: (state.constructorIngredients || []).filter(
          (_, index) => index !== action.payload.index
        )
      };

    case SET_BUN:
      return {
        ...state,
        bun: action.payload
      };

    case MOVE_INGREDIENT:
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = [...(state.constructorIngredients || [])];
      const draggedItem = ingredients[dragIndex];
      ingredients.splice(dragIndex, 1);
      ingredients.splice(hoverIndex, 0, draggedItem);
      return {
        ...state,
        constructorIngredients: ingredients
      };

    case CLEAR_CONSTRUCTOR:
      return {
        ...state,
        constructorIngredients: [],
        bun: null
      };
      
    default:
      return state;
  }
};

export default constructorReducer;
