/**
 * Типы действий для управления ингредиентами
 * Включают загрузку данных, управление состоянием загрузки и счетчиками ингредиентов
 */
export const FETCH_INGREDIENTS_REQUEST = 'FETCH_INGREDIENTS_REQUEST' as const;    // Запрос на загрузку ингредиентов
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS' as const;    // Успешная загрузка ингредиентов
export const FETCH_INGREDIENTS_ERROR = 'FETCH_INGREDIENTS_ERROR' as const;        // Ошибка при загрузке ингредиентов
export const SET_INGREDIENTS = 'SET_INGREDIENTS' as const;                        // Установка списка ингредиентов
export const SET_INGREDIENTS_LOADING = 'SET_INGREDIENTS_LOADING' as const;        // Установка состояния загрузки
export const SET_INGREDIENTS_ERROR = 'SET_INGREDIENTS_ERROR' as const;            // Установка ошибки загрузки
export const INCREMENT_INGREDIENT_COUNT = 'INCREMENT_INGREDIENT_COUNT' as const;  // Увеличение счетчика ингредиента
export const DECREMENT_INGREDIENT_COUNT = 'DECREMENT_INGREDIENT_COUNT' as const;  // Уменьшение счетчика ингредиента
export const RESTORE_INGREDIENT_COUNTERS = 'RESTORE_INGREDIENT_COUNTERS' as const;  // Восстановление счетчиков ингредиентов

/**
 * Типы действий для управления конструктором бургера
 * Включают добавление/удаление ингредиентов, установку булки и перемещение элементов
 */
export const ADD_INGREDIENT_TO_CONSTRUCTOR = 'ADD_INGREDIENT_TO_CONSTRUCTOR' as const;               // Добавление ингредиента в конструктор
export const REMOVE_INGREDIENT_FROM_CONSTRUCTOR = 'REMOVE_INGREDIENT_FROM_CONSTRUCTOR' as const;     // Удаление ингредиента из конструктора
export const SET_BUN = 'SET_BUN' as const;                                                           // Установка булки в конструктор
export const MOVE_INGREDIENT = 'MOVE_INGREDIENT' as const;                                           // Перемещение ингредиента в конструкторе
export const CLEAR_CONSTRUCTOR = 'CLEAR_CONSTRUCTOR' as const;                                       // Очистка конструктора
export const SAVE_CONSTRUCTOR_STATE = 'SAVE_CONSTRUCTOR_STATE' as const;                               // Сохранение состояния конструктора
export const RESTORE_CONSTRUCTOR_STATE = 'RESTORE_CONSTRUCTOR_STATE' as const;                        // Восстановление состояния конструктора
export const RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS = 'RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS' as const;  // Восстановление конструктора без изменения счетчиков

/**
 * Типы действий для управления деталями ингредиента
 * Используются для отображения модального окна с информацией об ингредиенте
 */
export const SET_CURRENT_INGREDIENT = 'SET_CURRENT_INGREDIENT' as const;           // Установка текущего просматриваемого ингредиента
export const CLEAR_CURRENT_INGREDIENT = 'CLEAR_CURRENT_INGREDIENT' as const;       // Очистка данных о текущем ингредиенте

/**
 * Типы действий для управления заказами
 * Включают создание заказа, управление состоянием загрузки и ошибками
 */
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST' as const;               // Запрос на создание заказа
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS' as const;               // Успешное создание заказа
export const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR' as const;                   // Ошибка при создании заказа
export const SET_ORDER_NUMBER = 'SET_ORDER_NUMBER' as const;                       // Установка номера заказа
export const SET_ORDER_LOADING = 'SET_ORDER_LOADING' as const;                     // Установка состояния загрузки заказа
export const SET_ORDER_ERROR = 'SET_ORDER_ERROR' as const;                         // Установка ошибки заказа
export const CLEAR_ORDER = 'CLEAR_ORDER' as const;                                 // Очистка данных заказа

/**
 * Типы действий для управления аутентификацией пользователя
 * Включают регистрацию, авторизацию, выход и обновление токена
 */
export const REGISTER_REQUEST = 'REGISTER_REQUEST' as const;                       // Запрос на регистрацию
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS' as const;                       // Успешная регистрация
export const REGISTER_ERROR = 'REGISTER_ERROR' as const;                           // Ошибка при регистрации

export const LOGIN_REQUEST = 'LOGIN_REQUEST' as const;                             // Запрос на авторизацию
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' as const;                             // Успешная авторизация
export const LOGIN_ERROR = 'LOGIN_ERROR' as const;                                 // Ошибка при авторизации

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST' as const;                           // Запрос на выход
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS' as const;                           // Успешный выход
export const LOGOUT_ERROR = 'LOGOUT_ERROR' as const;                               // Ошибка при выходе

export const REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST' as const;             // Запрос на обновление токена
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS' as const;             // Успешное обновление токена
export const REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR' as const;                 // Ошибка при обновлении токена

export const SET_USER_DATA = 'SET_USER_DATA' as const;                             // Установка данных пользователя
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA' as const;                         // Очистка данных пользователя
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING' as const;                       // Установка состояния загрузки аутентификации
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR' as const;                           // Установка ошибки аутентификации
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR' as const;                       // Очистка ошибки аутентификации

export const GET_USER_REQUEST = 'GET_USER_REQUEST' as const;                       // Запрос на получение данных пользователя
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS' as const;                       // Успешное получение данных пользователя
export const GET_USER_ERROR = 'GET_USER_ERROR' as const;                           // Ошибка при получении данных пользователя

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST' as const;                  // Запрос на обновление данных пользователя
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS' as const;                 // Успешное обновление данных пользователя
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR' as const;                     // Ошибка при обновлении данных пользователя

/**
 * Типы действий для управления лентой заказов
 */
export const FETCH_FEED_REQUEST = 'FETCH_FEED_REQUEST' as const;                   // Запрос на загрузку ленты заказов
export const FETCH_FEED_SUCCESS = 'FETCH_FEED_SUCCESS' as const;                   // Успешная загрузка ленты заказов
export const FETCH_FEED_ERROR = 'FETCH_FEED_ERROR' as const;                       // Ошибка при загрузке ленты заказов
export const SET_FEED_ORDERS = 'SET_FEED_ORDERS' as const;                         // Установка заказов в ленте
export const SET_FEED_STATS = 'SET_FEED_STATS' as const;                           // Установка статистики ленты
export const SET_FEED_WEBSOCKET_STATUS = 'SET_FEED_WEBSOCKET_STATUS' as const;     // Установка статуса WebSocket соединения ленты
export const SET_FEED_WEBSOCKET_ERROR = 'SET_FEED_WEBSOCKET_ERROR' as const;       // Установка ошибки WebSocket соединения ленты
export const CLEAR_FEED = 'CLEAR_FEED' as const;                                   // Очистка ленты заказов

/**
 * Типы действий для управления историей заказов пользователя
 */
export const FETCH_PROFILE_ORDERS_REQUEST = 'FETCH_PROFILE_ORDERS_REQUEST' as const; // Запрос на загрузку истории заказов
export const FETCH_PROFILE_ORDERS_SUCCESS = 'FETCH_PROFILE_ORDERS_SUCCESS' as const; // Успешная загрузка истории заказов
export const FETCH_PROFILE_ORDERS_ERROR = 'FETCH_PROFILE_ORDERS_ERROR' as const;     // Ошибка при загрузке истории заказов
export const SET_PROFILE_ORDERS = 'SET_PROFILE_ORDERS' as const;                     // Установка заказов в истории
export const SET_PROFILE_ORDERS_WEBSOCKET_STATUS = 'SET_PROFILE_ORDERS_WEBSOCKET_STATUS' as const; // Установка статуса WebSocket соединения истории
export const SET_PROFILE_ORDERS_WEBSOCKET_ERROR = 'SET_PROFILE_ORDERS_WEBSOCKET_ERROR' as const; // Установка ошибки WebSocket соединения истории
export const CLEAR_PROFILE_ORDERS = 'CLEAR_PROFILE_ORDERS' as const;                 // Очистка истории заказов

/**
 * Union типы для всех action types
 */
export type TIngredientsActionTypes = 
  | typeof FETCH_INGREDIENTS_REQUEST
  | typeof FETCH_INGREDIENTS_SUCCESS
  | typeof FETCH_INGREDIENTS_ERROR
  | typeof SET_INGREDIENTS
  | typeof SET_INGREDIENTS_LOADING
  | typeof SET_INGREDIENTS_ERROR
  | typeof INCREMENT_INGREDIENT_COUNT
  | typeof DECREMENT_INGREDIENT_COUNT
  | typeof RESTORE_INGREDIENT_COUNTERS;

export type TConstructorActionTypes = 
  | typeof ADD_INGREDIENT_TO_CONSTRUCTOR
  | typeof REMOVE_INGREDIENT_FROM_CONSTRUCTOR
  | typeof SET_BUN
  | typeof MOVE_INGREDIENT
  | typeof CLEAR_CONSTRUCTOR
  | typeof SAVE_CONSTRUCTOR_STATE
  | typeof RESTORE_CONSTRUCTOR_STATE
  | typeof RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS;

export type TIngredientDetailsActionTypes = 
  | typeof SET_CURRENT_INGREDIENT
  | typeof CLEAR_CURRENT_INGREDIENT;

export type TOrderActionTypes = 
  | typeof CREATE_ORDER_REQUEST
  | typeof CREATE_ORDER_SUCCESS
  | typeof CREATE_ORDER_ERROR
  | typeof SET_ORDER_NUMBER
  | typeof SET_ORDER_LOADING
  | typeof SET_ORDER_ERROR
  | typeof CLEAR_ORDER;

export type TAuthActionTypes = 
  | typeof REGISTER_REQUEST
  | typeof REGISTER_SUCCESS
  | typeof REGISTER_ERROR
  | typeof LOGIN_REQUEST
  | typeof LOGIN_SUCCESS
  | typeof LOGIN_ERROR
  | typeof LOGOUT_REQUEST
  | typeof LOGOUT_SUCCESS
  | typeof LOGOUT_ERROR
  | typeof REFRESH_TOKEN_REQUEST
  | typeof REFRESH_TOKEN_SUCCESS
  | typeof REFRESH_TOKEN_ERROR
  | typeof SET_USER_DATA
  | typeof CLEAR_USER_DATA
  | typeof SET_AUTH_LOADING
  | typeof SET_AUTH_ERROR
  | typeof CLEAR_AUTH_ERROR
  | typeof GET_USER_REQUEST
  | typeof GET_USER_SUCCESS
  | typeof GET_USER_ERROR
  | typeof UPDATE_USER_REQUEST
  | typeof UPDATE_USER_SUCCESS
  | typeof UPDATE_USER_ERROR;

export type TFeedActionTypes = 
  | typeof FETCH_FEED_REQUEST
  | typeof FETCH_FEED_SUCCESS
  | typeof FETCH_FEED_ERROR
  | typeof SET_FEED_ORDERS
  | typeof SET_FEED_STATS
  | typeof SET_FEED_WEBSOCKET_STATUS
  | typeof SET_FEED_WEBSOCKET_ERROR
  | typeof CLEAR_FEED;

export type TProfileOrdersActionTypes = 
  | typeof FETCH_PROFILE_ORDERS_REQUEST
  | typeof FETCH_PROFILE_ORDERS_SUCCESS
  | typeof FETCH_PROFILE_ORDERS_ERROR
  | typeof SET_PROFILE_ORDERS
  | typeof SET_PROFILE_ORDERS_WEBSOCKET_STATUS
  | typeof SET_PROFILE_ORDERS_WEBSOCKET_ERROR
  | typeof CLEAR_PROFILE_ORDERS;

export type TAllActionTypes = 
  | TIngredientsActionTypes
  | TConstructorActionTypes
  | TIngredientDetailsActionTypes
  | TOrderActionTypes
  | TAuthActionTypes
  | TFeedActionTypes
  | TProfileOrdersActionTypes;