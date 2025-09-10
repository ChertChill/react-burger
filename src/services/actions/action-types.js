/**
 * Типы действий для управления ингредиентами
 * Включают загрузку данных, управление состоянием загрузки и счетчиками ингредиентов
 */
export const FETCH_INGREDIENTS_REQUEST = 'FETCH_INGREDIENTS_REQUEST';    // Запрос на загрузку ингредиентов
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS';    // Успешная загрузка ингредиентов
export const FETCH_INGREDIENTS_ERROR = 'FETCH_INGREDIENTS_ERROR';        // Ошибка при загрузке ингредиентов
export const SET_INGREDIENTS = 'SET_INGREDIENTS';                        // Установка списка ингредиентов
export const SET_INGREDIENTS_LOADING = 'SET_INGREDIENTS_LOADING';        // Установка состояния загрузки
export const SET_INGREDIENTS_ERROR = 'SET_INGREDIENTS_ERROR';            // Установка ошибки загрузки
export const INCREMENT_INGREDIENT_COUNT = 'INCREMENT_INGREDIENT_COUNT';  // Увеличение счетчика ингредиента
export const DECREMENT_INGREDIENT_COUNT = 'DECREMENT_INGREDIENT_COUNT';  // Уменьшение счетчика ингредиента

/**
 * Типы действий для управления конструктором бургера
 * Включают добавление/удаление ингредиентов, установку булки и перемещение элементов
 */
export const ADD_INGREDIENT_TO_CONSTRUCTOR = 'ADD_INGREDIENT_TO_CONSTRUCTOR';               // Добавление ингредиента в конструктор
export const REMOVE_INGREDIENT_FROM_CONSTRUCTOR = 'REMOVE_INGREDIENT_FROM_CONSTRUCTOR';     // Удаление ингредиента из конструктора
export const SET_BUN = 'SET_BUN';                                                           // Установка булки в конструктор
export const MOVE_INGREDIENT = 'MOVE_INGREDIENT';                                           // Перемещение ингредиента в конструкторе
export const CLEAR_CONSTRUCTOR = 'CLEAR_CONSTRUCTOR';                                       // Очистка конструктора

/**
 * Типы действий для управления деталями ингредиента
 * Используются для отображения модального окна с информацией об ингредиенте
 */
export const SET_CURRENT_INGREDIENT = 'SET_CURRENT_INGREDIENT';           // Установка текущего просматриваемого ингредиента
export const CLEAR_CURRENT_INGREDIENT = 'CLEAR_CURRENT_INGREDIENT';       // Очистка данных о текущем ингредиенте

/**
 * Типы действий для управления заказами
 * Включают создание заказа, управление состоянием загрузки и ошибками
 */
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';               // Запрос на создание заказа
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';               // Успешное создание заказа
export const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR';                   // Ошибка при создании заказа
export const SET_ORDER_NUMBER = 'SET_ORDER_NUMBER';                       // Установка номера заказа
export const SET_ORDER_LOADING = 'SET_ORDER_LOADING';                     // Установка состояния загрузки заказа
export const SET_ORDER_ERROR = 'SET_ORDER_ERROR';                         // Установка ошибки заказа
export const CLEAR_ORDER = 'CLEAR_ORDER';                                 // Очистка данных заказа
