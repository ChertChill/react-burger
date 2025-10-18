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
import { 
  IIngredient, 
  TIngredientsActions,
  ISetIngredientsAction,
  ISetIngredientsLoadingAction,
  ISetIngredientsErrorAction,
  IIncrementIngredientCountAction,
  IDecrementIngredientCountAction,
  IRestoreIngredientCountersAction
} from '../../utils/types';
import { ThunkAction } from 'redux-thunk';
import { IRootState } from '../../utils/types';

/**
 * Синхронные action creators для управления ингредиентами
 */

/**
 * Установка списка ингредиентов в store
 * @param ingredients - массив ингредиентов
 * @returns action для установки ингредиентов
 */
export const setIngredients = (ingredients: IIngredient[]): ISetIngredientsAction => ({
  type: SET_INGREDIENTS,
  payload: ingredients
});

/**
 * Установка состояния загрузки ингредиентов
 * @param loading - состояние загрузки
 * @returns action для установки состояния загрузки
 */
export const setIngredientsLoading = (loading: boolean): ISetIngredientsLoadingAction => ({
  type: SET_INGREDIENTS_LOADING,
  payload: loading
});

/**
 * Установка ошибки при загрузке ингредиентов
 * @param error - сообщение об ошибке
 * @returns action для установки ошибки
 */
export const setIngredientsError = (error: string): ISetIngredientsErrorAction => ({
  type: SET_INGREDIENTS_ERROR,
  payload: error
});

/**
 * Увеличение счетчика ингредиента
 * Используется при добавлении ингредиента в конструктор
 * @param ingredientId - идентификатор ингредиента
 * @returns action для увеличения счетчика
 */
export const incrementIngredientCount = (ingredientId: string): IIncrementIngredientCountAction => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: ingredientId
});

/**
 * Увеличение счетчика ингредиента на указанное количество раз
 * Используется для булок, которые учитываются дважды (верх и низ)
 * @param ingredientId - идентификатор ингредиента
 * @param count - количество увеличений (по умолчанию 1)
 * @returns thunk функция для множественного увеличения счетчика
 */
export const incrementIngredientCountMultiple = (
  ingredientId: string, 
  count: number = 1
): ThunkAction<void, IRootState, unknown, TIngredientsActions> => (dispatch) => {
  for (let i = 0; i < count; i++) {
    dispatch(incrementIngredientCount(ingredientId));
  }
};

/**
 * Уменьшение счетчика ингредиента
 * Используется при удалении ингредиента из конструктора
 * @param ingredientId - идентификатор ингредиента
 * @returns action для уменьшения счетчика
 */
export const decrementIngredientCount = (ingredientId: string): IDecrementIngredientCountAction => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: ingredientId
});

/**
 * Уменьшение счетчика ингредиента на указанное количество раз
 * Используется для булок, которые учитываются дважды (верх и низ)
 * @param ingredientId - идентификатор ингредиента
 * @param count - количество уменьшений (по умолчанию 1)
 * @returns thunk функция для множественного уменьшения счетчика
 */
export const decrementIngredientCountMultiple = (
  ingredientId: string, 
  count: number = 1
): ThunkAction<void, IRootState, unknown, TIngredientsActions> => (dispatch) => {
  for (let i = 0; i < count; i++) {
    dispatch(decrementIngredientCount(ingredientId));
  }
};

/**
 * Восстановление счетчиков ингредиентов из сохраненного состояния
 * Используется при восстановлении состояния конструктора из localStorage
 * @param ingredientCounters - объект с счетчиками ингредиентов {ingredientId: count}
 * @returns action для восстановления счетчиков
 */
export const restoreIngredientCounters = (ingredientCounters: Record<string, number>): IRestoreIngredientCountersAction => ({
  type: RESTORE_INGREDIENT_COUNTERS,
  payload: ingredientCounters
});

/**
 * Асинхронный action creator для получения ингредиентов от API
 * Загружает данные об ингредиентах с сервера и обновляет store
 * Включает проверку на уже загруженные данные для предотвращения повторных запросов
 * @returns thunk функция для асинхронной загрузки
 */
export const fetchIngredients = (): ThunkAction<void, IRootState, unknown, TIngredientsActions> => {
  return async (dispatch, getState) => {
    // Проверяем, не загружаются ли уже ингредиенты
    const { loading, ingredients } = getState().ingredients;
    
    // Не делаем запрос, если уже загружаем или данные есть
    if (loading || (ingredients && ingredients.length > 0)) {
      return;
    }
    
    try {
      dispatch({ type: FETCH_INGREDIENTS_REQUEST });
      
      const data = await request('ingredients', { method: 'GET' }) as unknown as { data: IIngredient[] };
      
      dispatch({ type: FETCH_INGREDIENTS_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: FETCH_INGREDIENTS_ERROR, payload: (error as Error).message });
    }
  };
};