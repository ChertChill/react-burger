import { 
  ADD_INGREDIENT_TO_CONSTRUCTOR,
  REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
  SET_BUN,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR,
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
import { 
  IIngredient, 
  IConstructorIngredient,
  TConstructorActions,
  TIngredientsActions,
  IAddIngredientToConstructorAction,
  IRemoveIngredientFromConstructorAction,
  ISetBunAction,
  IMoveIngredientAction,
  IRestoreConstructorWithoutCountersAction
} from '../../utils/types';
import { ThunkAction } from 'redux-thunk';
import { IRootState } from '../../utils/types';

/**
 * Action creators для управления конструктором бургера
 */

/**
 * Добавление ингредиента в конструктор
 * Создает уникальный ID для ингредиента и увеличивает его счетчик
 * @param ingredient - объект ингредиента для добавления
 * @returns thunk функция для добавления ингредиента
 */
export const addIngredientToConstructor = (ingredient: IIngredient): ThunkAction<void, IRootState, unknown, TConstructorActions | TIngredientsActions> => (dispatch) => {
  const constructorIngredient: IConstructorIngredient = {
    ...ingredient,
    id: uuidv4()    // Уникальный ID для каждого ингредиента
  };

  dispatch({
    type: ADD_INGREDIENT_TO_CONSTRUCTOR,
    payload: constructorIngredient
  } as IAddIngredientToConstructorAction);
  dispatch(incrementIngredientCount(ingredient._id));
};

/**
 * Удаление ингредиента из конструктора
 * Удаляет ингредиент по индексу и уменьшает его счетчик
 * @param index - индекс ингредиента в конструкторе
 * @param ingredientId - идентификатор ингредиента
 * @returns thunk функция для удаления ингредиента
 */
export const removeIngredientFromConstructor = (
  index: number, 
  ingredientId: string
): ThunkAction<void, IRootState, unknown, TConstructorActions | TIngredientsActions> => (dispatch) => {
  dispatch({
    type: REMOVE_INGREDIENT_FROM_CONSTRUCTOR,
    payload: { index, ingredientId }
  } as IRemoveIngredientFromConstructorAction);
  dispatch(decrementIngredientCount(ingredientId));
};

/**
 * Установка булки в конструктор
 * Управляет счетчиками булок (учитывается дважды - верх и низ)
 * @param bun - объект булки для установки
 * @returns thunk функция для установки булки
 */
export const setBun = (bun: IIngredient): ThunkAction<void, IRootState, unknown, TConstructorActions | TIngredientsActions> => (dispatch, getState) => {
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
  } as ISetBunAction);
};

/**
 * Перемещение ингредиента в конструкторе
 * Используется для drag & drop функциональности
 * @param dragIndex - индекс перетаскиваемого элемента
 * @param hoverIndex - индекс элемента, на который наведен курсор
 * @returns action для перемещения ингредиента
 */
export const moveIngredient = (dragIndex: number, hoverIndex: number): IMoveIngredientAction => ({
  type: MOVE_INGREDIENT,
  payload: { dragIndex, hoverIndex }
});

/**
 * Очистка конструктора
 * Удаляет все ингредиенты и сбрасывает счетчики
 * @param clearStorage - нужно ли очистить localStorage (по умолчанию false)
 * @returns thunk функция для очистки конструктора
 */
export const clearConstructor = (clearStorage: boolean = false): ThunkAction<void, IRootState, unknown, TConstructorActions | TIngredientsActions> => (dispatch, getState) => {
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
 * @param isAuthenticated - статус авторизации пользователя
 * @returns thunk функция для сохранения состояния
 */
export const saveConstructorState = (isAuthenticated: boolean): ThunkAction<void, IRootState, unknown, TConstructorActions> => (dispatch, getState) => {
  if (isAuthenticated) {
    const state = getState();
    const { bun, constructorIngredients } = state.constructor;
    const { ingredients } = state.ingredients;
    
    // Создаем карту счетчиков ингредиентов
    const ingredientCounters: Record<string, number> = {};
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
 * @param bun - объект булки
 * @param constructorIngredients - массив ингредиентов конструктора
 * @returns action для восстановления конструктора
 */
export const restoreConstructorWithoutCounters = (
  bun: IIngredient | null, 
  constructorIngredients: IConstructorIngredient[]
): IRestoreConstructorWithoutCountersAction => ({
  type: RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS,
  payload: {
    bun,
    constructorIngredients: constructorIngredients || []
  }
});

/**
 * Восстановление состояния конструктора из localStorage
 * Восстанавливает состояние только для авторизованных пользователей
 * @param isAuthenticated - статус авторизации пользователя
 * @returns thunk функция для восстановления состояния
 */
export const restoreConstructorState = (isAuthenticated: boolean): ThunkAction<void, IRootState, unknown, TConstructorActions | TIngredientsActions> => (dispatch, getState) => {
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