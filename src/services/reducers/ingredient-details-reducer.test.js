import ingredientDetailsReducer, { initialState } from './ingredient-details-reducer';
import {
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT
} from '../actions/action-types';

describe('ingredientDetailsReducer', () => {
  // Тестовые данные
  const mockIngredient = {
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

  const mockBunIngredient = {
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

  const mockSauceIngredient = {
    _id: 'sauce-1',
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


  describe('Начальное состояние', () => {
    it('должен возвращать начальное состояние при неизвестном action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = ingredientDetailsReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

    it('должен возвращать начальное состояние при undefined state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = ingredientDetailsReducer(undefined, action);
      expect(result).toEqual(initialState);
    });

  });

  describe('Установка текущего ингредиента', () => {
    it('должен устанавливать основной ингредиент', () => {
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      };
      const result = ingredientDetailsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        currentIngredient: mockIngredient
      });
    });

    it('должен устанавливать булку как текущий ингредиент', () => {
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: mockBunIngredient
      };
      const result = ingredientDetailsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        currentIngredient: mockBunIngredient
      });
    });

    it('должен устанавливать соус как текущий ингредиент', () => {
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: mockSauceIngredient
      };
      const result = ingredientDetailsReducer(initialState, action);
      
      expect(result).toEqual({
        ...initialState,
        currentIngredient: mockSauceIngredient
      });
    });

    it('должен заменять существующий ингредиент новым', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: mockBunIngredient
      };
      const result = ingredientDetailsReducer(stateWithIngredient, action);
      
      expect(result).toEqual({
        ...initialState,
        currentIngredient: mockBunIngredient
      });
    });


    it('должен сохранять все свойства ингредиента', () => {
      const action = {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      };
      const result = ingredientDetailsReducer(initialState, action);
      
      expect(result.currentIngredient).toEqual(mockIngredient);
      expect(result.currentIngredient._id).toBe(mockIngredient._id);
      expect(result.currentIngredient.name).toBe(mockIngredient.name);
      expect(result.currentIngredient.type).toBe(mockIngredient.type);
      expect(result.currentIngredient.proteins).toBe(mockIngredient.proteins);
      expect(result.currentIngredient.fat).toBe(mockIngredient.fat);
      expect(result.currentIngredient.carbohydrates).toBe(mockIngredient.carbohydrates);
      expect(result.currentIngredient.calories).toBe(mockIngredient.calories);
      expect(result.currentIngredient.price).toBe(mockIngredient.price);
      expect(result.currentIngredient.image).toBe(mockIngredient.image);
      expect(result.currentIngredient.image_large).toBe(mockIngredient.image_large);
    });
  });

  describe('Очистка текущего ингредиента', () => {
    it('должен очищать текущий ингредиент', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      
      const action = { type: CLEAR_CURRENT_INGREDIENT };
      const result = ingredientDetailsReducer(stateWithIngredient, action);
      
      expect(result).toEqual(initialState);
    });

    it('должен очищать булку как текущий ингредиент', () => {
      const stateWithBun = {
        ...initialState,
        currentIngredient: mockBunIngredient
      };
      
      const action = { type: CLEAR_CURRENT_INGREDIENT };
      const result = ingredientDetailsReducer(stateWithBun, action);
      
      expect(result).toEqual(initialState);
    });

    it('должен очищать соус как текущий ингредиент', () => {
      const stateWithSauce = {
        ...initialState,
        currentIngredient: mockSauceIngredient
      };
      
      const action = { type: CLEAR_CURRENT_INGREDIENT };
      const result = ingredientDetailsReducer(stateWithSauce, action);
      
      expect(result).toEqual(initialState);
    });


    it('должен устанавливать currentIngredient в null', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      
      const action = { type: CLEAR_CURRENT_INGREDIENT };
      const result = ingredientDetailsReducer(stateWithIngredient, action);
      
      expect(result.currentIngredient).toBeNull();
    });
  });

  describe('Комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий с ингредиентом', () => {
      let state = ingredientDetailsReducer(undefined, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      expect(state.currentIngredient).toEqual(mockIngredient);

      state = ingredientDetailsReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockBunIngredient
      });
      expect(state.currentIngredient).toEqual(mockBunIngredient);
      expect(state.currentIngredient).not.toEqual(mockIngredient);

      state = ingredientDetailsReducer(state, { type: CLEAR_CURRENT_INGREDIENT });
      expect(state.currentIngredient).toBeNull();
    });

    it('должен корректно обрабатывать повторную установку того же ингредиента', () => {
      let state = ingredientDetailsReducer(undefined, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      expect(state.currentIngredient).toEqual(mockIngredient);

      // Устанавливаем тот же ингредиент повторно
      state = ingredientDetailsReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      expect(state.currentIngredient).toEqual(mockIngredient);
    });

    it('должен корректно обрабатывать очистку и повторную установку', () => {
      let state = ingredientDetailsReducer(undefined, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      expect(state.currentIngredient).toEqual(mockIngredient);

      state = ingredientDetailsReducer(state, { type: CLEAR_CURRENT_INGREDIENT });
      expect(state.currentIngredient).toBeNull();

      state = ingredientDetailsReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockBunIngredient
      });
      expect(state.currentIngredient).toEqual(mockBunIngredient);
    });

    it('должен корректно обрабатывать переключение между разными типами ингредиентов', () => {
      let state = ingredientDetailsReducer(undefined, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockIngredient
      });
      expect(state.currentIngredient.type).toBe('main');

      state = ingredientDetailsReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockBunIngredient
      });
      expect(state.currentIngredient.type).toBe('bun');

      state = ingredientDetailsReducer(state, {
        type: SET_CURRENT_INGREDIENT,
        payload: mockSauceIngredient
      });
      expect(state.currentIngredient.type).toBe('sauce');
    });

    it('должен сохранять неизменным состояние при неизвестном action', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      
      const action = { type: 'UNKNOWN_ACTION' };
      const result = ingredientDetailsReducer(stateWithIngredient, action);
      
      expect(result).toEqual(stateWithIngredient);
    });
  });

});
