import { 
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT
} from '../actions/action-types';
import { 
  IIngredientDetailsState,
  TIngredientDetailsActions
} from '../../utils/types';

/**
 * Начальное состояние для reducer деталей ингредиента
 * Содержит данные о текущем просматриваемом ингредиенте
 */
const initialState: IIngredientDetailsState = {
  currentIngredient: null
};

/**
 * Reducer для управления состоянием деталей ингредиента
 * Обрабатывает установку и очистку данных о текущем ингредиенте
 * Используется для отображения модального окна с информацией об ингредиенте
 * 
 * @param state - текущее состояние
 * @param action - действие для обработки
 * @returns новое состояние
 */
const ingredientDetailsReducer = (state: IIngredientDetailsState = initialState, action: TIngredientDetailsActions): IIngredientDetailsState => {
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