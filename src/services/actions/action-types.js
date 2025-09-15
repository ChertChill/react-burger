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
export const RESTORE_INGREDIENT_COUNTERS = 'RESTORE_INGREDIENT_COUNTERS';  // Восстановление счетчиков ингредиентов

/**
 * Типы действий для управления конструктором бургера
 * Включают добавление/удаление ингредиентов, установку булки и перемещение элементов
 */
export const ADD_INGREDIENT_TO_CONSTRUCTOR = 'ADD_INGREDIENT_TO_CONSTRUCTOR';               // Добавление ингредиента в конструктор
export const REMOVE_INGREDIENT_FROM_CONSTRUCTOR = 'REMOVE_INGREDIENT_FROM_CONSTRUCTOR';     // Удаление ингредиента из конструктора
export const SET_BUN = 'SET_BUN';                                                           // Установка булки в конструктор
export const MOVE_INGREDIENT = 'MOVE_INGREDIENT';                                           // Перемещение ингредиента в конструкторе
export const CLEAR_CONSTRUCTOR = 'CLEAR_CONSTRUCTOR';                                       // Очистка конструктора
export const SAVE_CONSTRUCTOR_STATE = 'SAVE_CONSTRUCTOR_STATE';                               // Сохранение состояния конструктора
export const RESTORE_CONSTRUCTOR_STATE = 'RESTORE_CONSTRUCTOR_STATE';                        // Восстановление состояния конструктора
export const RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS = 'RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS';  // Восстановление конструктора без изменения счетчиков

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

/**
 * Типы действий для управления аутентификацией пользователя
 * Включают регистрацию, авторизацию, выход и обновление токена
 */
export const REGISTER_REQUEST = 'REGISTER_REQUEST';                       // Запрос на регистрацию
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';                       // Успешная регистрация
export const REGISTER_ERROR = 'REGISTER_ERROR';                           // Ошибка при регистрации

export const LOGIN_REQUEST = 'LOGIN_REQUEST';                             // Запрос на авторизацию
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';                             // Успешная авторизация
export const LOGIN_ERROR = 'LOGIN_ERROR';                                 // Ошибка при авторизации

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';                           // Запрос на выход
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';                           // Успешный выход
export const LOGOUT_ERROR = 'LOGOUT_ERROR';                               // Ошибка при выходе

export const REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST';             // Запрос на обновление токена
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';             // Успешное обновление токена
export const REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR';                 // Ошибка при обновлении токена

export const SET_USER_DATA = 'SET_USER_DATA';                             // Установка данных пользователя
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';                         // Очистка данных пользователя
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING';                       // Установка состояния загрузки аутентификации
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';                           // Установка ошибки аутентификации
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';                       // Очистка ошибки аутентификации

export const GET_USER_REQUEST = 'GET_USER_REQUEST';                       // Запрос на получение данных пользователя
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';                       // Успешное получение данных пользователя
export const GET_USER_ERROR = 'GET_USER_ERROR';                           // Ошибка при получении данных пользователя

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';                  // Запрос на обновление данных пользователя
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';                 // Успешное обновление данных пользователя
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';                     // Ошибка при обновлении данных пользователя
