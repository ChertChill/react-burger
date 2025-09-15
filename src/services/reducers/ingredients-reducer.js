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
} from '../actions/action-types';

/**
 * Начальное состояние для reducer ингредиентов
 * Содержит массив ингредиентов, состояние загрузки и ошибки
 */
const initialState = {
  ingredients: [],
  loading: false,
  error: null
};

/**
 * Reducer для управления состоянием ингредиентов
 * Обрабатывает загрузку данных, управление счетчиками и ошибками
 * 
 * @param {Object} state - текущее состояние
 * @param {Object} action - действие для обработки
 * @returns {Object} новое состояние
 */
const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INGREDIENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_INGREDIENTS_SUCCESS:
      return {
        ...state,
        ingredients: action.payload,
        loading: false,
        error: null
      };

    case FETCH_INGREDIENTS_ERROR:
      return {
        ...initialState,
        error: action.payload
      };

    case SET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
        loading: false,
        error: null
      };

    case SET_INGREDIENTS_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case SET_INGREDIENTS_ERROR:
      return {
        ...initialState,
        error: action.payload
      };

    case INCREMENT_INGREDIENT_COUNT:
      return {
        ...state,
        ingredients: (state.ingredients || []).map(ingredient => 
          ingredient._id === action.payload 
            ? { ...ingredient, count: (ingredient.count || 0) + 1 }
            : ingredient
        )
      };

    case DECREMENT_INGREDIENT_COUNT:
      return {
        ...state,
        ingredients: (state.ingredients || []).map(ingredient => {
          if (ingredient._id === action.payload) {
            const newCount = (ingredient.count || 0) - 1;
            if (newCount <= 0) {
              // Удаляем свойство count если оно 0 или меньше
              const { count, ...ingredientWithoutCount } = ingredient;
              return ingredientWithoutCount;
            } else {
              return { ...ingredient, count: newCount };
            }
          }
          return ingredient;
        })
      };
      
    case RESTORE_INGREDIENT_COUNTERS:
      return {
        ...state,
        ingredients: (state.ingredients || []).map(ingredient => {
          const savedCount = action.payload[ingredient._id];
          if (savedCount && savedCount > 0) {
            return { ...ingredient, count: savedCount };
          } else {
            // Удаляем свойство count если счетчик не сохранен или равен 0
            const { count, ...ingredientWithoutCount } = ingredient;
            return ingredientWithoutCount;
          }
        })
      };
      
    default:
      return state;
  }
};

export default ingredientsReducer;
