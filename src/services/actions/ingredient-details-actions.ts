import { 
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT
} from './action-types';
import { 
  IIngredient,
  ISetCurrentIngredientAction
} from '../../utils/types';

/**
 * Action creators для управления деталями ингредиента
 */

/**
 * Установка текущего просматриваемого ингредиента
 * Используется для отображения модального окна с деталями
 * @param ingredient - объект ингредиента для отображения
 * @returns action для установки текущего ингредиента
 */
export const setCurrentIngredient = (ingredient: IIngredient): ISetCurrentIngredientAction => ({
  type: SET_CURRENT_INGREDIENT,
  payload: ingredient
});

/**
 * Очистка данных о текущем ингредиенте
 * Вызывается при закрытии модального окна с деталями
 * @returns action для очистки текущего ингредиента
 */
export const clearCurrentIngredient = (): { type: typeof CLEAR_CURRENT_INGREDIENT } => ({
  type: CLEAR_CURRENT_INGREDIENT
});