import { 
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  SET_BUN,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR,
  SAVE_CONSTRUCTOR_STATE,
  RESTORE_CONSTRUCTOR_STATE,
  RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS
} from '../actions/action-types';
import { 
  IConstructorState,
  TConstructorActions
} from '../../utils/types';

/**
 * Начальное состояние для reducer конструктора
 * Содержит массив ингредиентов конструктора и выбранную булку
 */
const initialState: IConstructorState = {
  constructorIngredients: [],
  bun: null
};

/**
 * Reducer для управления состоянием конструктора бургера
 * Обрабатывает добавление/удаление ингредиентов, установку булки и перемещение элементов
 * 
 * @param state - текущее состояние
 * @param action - действие для обработки
 * @returns новое состояние
 */
const constructorReducer = (state: IConstructorState = initialState, action: TConstructorActions): IConstructorState => {
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

    case SAVE_CONSTRUCTOR_STATE:
      // Сохранение состояния обрабатывается в action creator
      return state;

    case RESTORE_CONSTRUCTOR_STATE:
      // Восстановление состояния обрабатывается в action creator
      return state;

    case RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS:
      return {
        ...state,
        bun: action.payload.bun,
        constructorIngredients: action.payload.constructorIngredients
      };
      
    default:
      return state;
  }
};

export default constructorReducer;