import { combineReducers } from 'redux';
import ingredientsReducer from './ingredients-reducer';
import constructorReducer from './constructor-reducer';
import ingredientDetailsReducer from './ingredient-details-reducer';
import orderReducer from './order-reducer';
import authReducer from './auth-reducer';

/**
 * Корневой reducer приложения
 * Объединяет все отдельные reducers в единое дерево состояния
 * Каждый reducer управляет своей частью состояния приложения
 */
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,                // Управление данными об ингредиентах
  constructor: constructorReducer,                // Управление состоянием конструктора бургера
  ingredientDetails: ingredientDetailsReducer,    // Управление деталями ингредиента в модальном окне
  order: orderReducer,                            // Управление состоянием заказа
  auth: authReducer                               // Управление состоянием аутентификации пользователя
});

export default rootReducer;
