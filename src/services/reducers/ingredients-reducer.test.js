import ingredientsReducer from './ingredients-reducer';
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

describe('ingredientsReducer', () => {
  // Тестовые данные
  const mockIngredient1 = {
    _id: 'ingredient-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const mockIngredient2 = {
    _id: 'ingredient-2',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  const mockIngredient3 = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const mockIngredients = [mockIngredient1, mockIngredient2, mockIngredient3];

  // Начальное состояние
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при неизвестном action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = ingredientsReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = ingredientsReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Загрузка ингредиентов', () => {

    it('должен обрабатывать FETCH_INGREDIENTS_SUCCESS', () => {
      const action = {
        type: FETCH_INGREDIENTS_SUCCESS,
        payload: mockIngredients
      };
      const result = ingredientsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        ingredients: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('должен обрабатывать FETCH_INGREDIENTS_ERROR', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: FETCH_INGREDIENTS_ERROR,
        payload: errorMessage
      };
      const result = ingredientsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('должен очищать предыдущую ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      
      const action = { type: FETCH_INGREDIENTS_REQUEST };
      const result = ingredientsReducer(stateWithError, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });
  });

  describe('Управление ингредиентами', () => {
    it('должен обрабатывать SET_INGREDIENTS', () => {
      const action = {
        type: SET_INGREDIENTS,
        payload: mockIngredients
      };
      const result = ingredientsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        ingredients: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('должен заменять существующие ингредиенты', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1]
      };
      
      const action = {
        type: SET_INGREDIENTS,
        payload: [mockIngredient2, mockIngredient3]
      };
      const result = ingredientsReducer(stateWithIngredients, action);
      
      expect(result).toEqual({
        ...initialState,
        ingredients: [mockIngredient2, mockIngredient3],
        loading: false,
        error: null
      });
    });

    it('должен устанавливать пустой массив ингредиентов', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredients
      };
      
      const action = {
        type: SET_INGREDIENTS,
        payload: []
      };
      const result = ingredientsReducer(stateWithIngredients, action);
      
      expect(result).toEqual({
        ...initialState,
        ingredients: [],
        loading: false,
        error: null
      });
    });
  });

  describe('Управление состоянием загрузки и ошибок', () => {
    it('должен обрабатывать SET_INGREDIENTS_LOADING', () => {
      const action = {
        type: SET_INGREDIENTS_LOADING,
        payload: true
      };
      const result = ingredientsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        loading: true
      });
    });

    it('должен обрабатывать SET_INGREDIENTS_ERROR', () => {
      const errorMessage = 'Ошибка установки ингредиентов';
      const action = {
        type: SET_INGREDIENTS_ERROR,
        payload: errorMessage
      };
      const result = ingredientsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        error: errorMessage
      });
    });

    it('должен сбрасывать состояние при ошибке', () => {
      const stateWithData = {
        ...initialState,
        ingredients: mockIngredients,
        loading: true
      };
      
      const errorMessage = 'Ошибка';
      const action = {
        type: SET_INGREDIENTS_ERROR,
        payload: errorMessage
      };
      const result = ingredientsReducer(stateWithData, action);
      
      expect(result).toEqual({
        ...initialState,
        error: errorMessage
      });
    });
  });

  describe('Управление счетчиками ингредиентов', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: mockIngredients
    };

    it('должен увеличивать счетчик ингредиента', () => {
      const action = {
        type: INCREMENT_INGREDIENT_COUNT,
        payload: 'ingredient-1'
      };
      const result = ingredientsReducer(stateWithIngredients, action);
      
      expect(result.ingredients[0]).toEqual({
        ...mockIngredient1,
        count: 1
      });
      expect(result.ingredients[1]).toEqual(mockIngredient2);
      expect(result.ingredients[2]).toEqual(mockIngredient3);
    });

    it('должен увеличивать счетчик существующего ингредиента', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 2 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const action = {
        type: INCREMENT_INGREDIENT_COUNT,
        payload: 'ingredient-1'
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual({
        ...mockIngredient1,
        count: 3
      });
    });

    it('должен уменьшать счетчик ингредиента', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 2 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: 'ingredient-1'
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual({
        ...mockIngredient1,
        count: 1
      });
    });

    it('должен удалять свойство count при уменьшении до 0', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 1 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: 'ingredient-1'
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual(mockIngredient1);
      expect(result.ingredients[0]).not.toHaveProperty('count');
    });

    it('должен удалять свойство count при уменьшении ниже 0', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 0 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: 'ingredient-1'
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual(mockIngredient1);
      expect(result.ingredients[0]).not.toHaveProperty('count');
    });

    it('должен корректно обрабатывать ингредиент без счетчика', () => {
      const action = {
        type: DECREMENT_INGREDIENT_COUNT,
        payload: 'ingredient-1'
      };
      const result = ingredientsReducer(stateWithIngredients, action);
      
      expect(result.ingredients[0]).toEqual(mockIngredient1);
      expect(result.ingredients[0]).not.toHaveProperty('count');
    });

    it('должен корректно обрабатывать null/undefined массив ингредиентов', () => {
      const testCases = [
        { ingredients: null, actionType: INCREMENT_INGREDIENT_COUNT },
        { ingredients: null, actionType: DECREMENT_INGREDIENT_COUNT },
        { ingredients: undefined, actionType: DECREMENT_INGREDIENT_COUNT }
      ];

      testCases.forEach(({ ingredients, actionType }) => {
        const stateWithNullIngredients = {
          ...initialState,
          ingredients
        };
        
        const action = {
          type: actionType,
          payload: 'ingredient-1'
        };
        const result = ingredientsReducer(stateWithNullIngredients, action);
        
        expect(result.ingredients).toEqual([]);
      });
    });
  });

  describe('Восстановление счетчиков ингредиентов', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: mockIngredients
    };

    it('должен восстанавливать счетчики ингредиентов', () => {
      const counters = {
        'ingredient-1': 2,
        'ingredient-2': 1,
        'bun-1': 3
      };
      
      const action = {
        type: RESTORE_INGREDIENT_COUNTERS,
        payload: counters
      };
      const result = ingredientsReducer(stateWithIngredients, action);
      
      expect(result.ingredients[0]).toEqual({
        ...mockIngredient1,
        count: 2
      });
      expect(result.ingredients[1]).toEqual({
        ...mockIngredient2,
        count: 1
      });
      expect(result.ingredients[2]).toEqual({
        ...mockIngredient3,
        count: 3
      });
    });

    it('должен удалять свойство count для ингредиентов без счетчика', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 2 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const counters = {
        'ingredient-2': 1
      };
      
      const action = {
        type: RESTORE_INGREDIENT_COUNTERS,
        payload: counters
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual(mockIngredient1);
      expect(result.ingredients[0]).not.toHaveProperty('count');
      expect(result.ingredients[1]).toEqual({
        ...mockIngredient2,
        count: 1
      });
      expect(result.ingredients[2]).toEqual(mockIngredient3);
      expect(result.ingredients[2]).not.toHaveProperty('count');
    });

    it('должен удалять свойство count для счетчиков равных 0', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 2 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const counters = {
        'ingredient-1': 0,
        'ingredient-2': 1
      };
      
      const action = {
        type: RESTORE_INGREDIENT_COUNTERS,
        payload: counters
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual(mockIngredient1);
      expect(result.ingredients[0]).not.toHaveProperty('count');
      expect(result.ingredients[1]).toEqual({
        ...mockIngredient2,
        count: 1
      });
    });

    it('должен корректно обрабатывать пустой объект счетчиков', () => {
      const stateWithCount = {
        ...initialState,
        ingredients: [
          { ...mockIngredient1, count: 2 },
          mockIngredient2,
          mockIngredient3
        ]
      };
      
      const action = {
        type: RESTORE_INGREDIENT_COUNTERS,
        payload: {}
      };
      const result = ingredientsReducer(stateWithCount, action);
      
      expect(result.ingredients[0]).toEqual(mockIngredient1);
      expect(result.ingredients[0]).not.toHaveProperty('count');
      expect(result.ingredients[1]).toEqual(mockIngredient2);
      expect(result.ingredients[2]).toEqual(mockIngredient3);
    });

    it('должен корректно обрабатывать null массив ингредиентов', () => {
      const stateWithNullIngredients = {
        ...initialState,
        ingredients: null
      };
      
      const counters = {
        'ingredient-1': 2
      };
      
      const action = {
        type: RESTORE_INGREDIENT_COUNTERS,
        payload: counters
      };
      const result = ingredientsReducer(stateWithNullIngredients, action);
      
      expect(result.ingredients).toEqual([]);
    });
  });

});
