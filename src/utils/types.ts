

// ============================================================================
// БАЗОВЫЕ ТИПЫ И УТИЛИТЫ
// ============================================================================

/**
 * Базовые типы для часто используемых полей
 */
export type TEmailField = { email: string };
export type TPasswordField = { password: string };
export type TNameField = { name: string };
export type TTokenField<T extends boolean = false> = T extends true 
  ? { accessToken: string | null; refreshToken: string | null }
  : { accessToken: string; refreshToken: string };

/**
 * Базовые типы состояний
 */
export interface IBaseState {
  loading: boolean;
  error: string | null;
}

/**
 * Utility Types для комбинирования полей
 */
export type TWithEmail<T = {}> = T & TEmailField;
export type TWithPassword<T = {}> = T & TPasswordField;
export type TWithName<T = {}> = T & TNameField;
export type TWithEmailAndPassword<T = {}> = T & TEmailField & TPasswordField;
export type TWithEmailPasswordAndName<T = {}> = T & TEmailField & TPasswordField & TNameField;
export type TWithOptionalPassword<T = {}> = T & TEmailField & TNameField & { password?: string };

// ============================================================================
// API И СЕТЕВЫЕ ТИПЫ
// ============================================================================

/**
 * Базовые типы для работы с API
 */

/** Базовый тип для успешных ответов API */
export interface IBaseApiResponse {
  success: boolean;
}

/** Универсальный ответ от API сервера */
export interface IApiResponse<T = unknown> extends IBaseApiResponse {
  data?: T;
  message?: string;
}

/** Расширенная ошибка API с HTTP статусом */
export interface IApiError extends Error {
  status?: number;
}

/** Заголовки HTTP запроса */
export interface IRequestHeaders {
  [key: string]: string;
}

/** Опции для HTTP запроса */
export interface IRequestOptions {
  method: string;
  headers?: IRequestHeaders;
  body?: string;
}

// ============================================================================
// АУТЕНТИФИКАЦИЯ И ПОЛЬЗОВАТЕЛИ
// ============================================================================

/**
 * Типы для аутентификации
 */

/** Заголовки с авторизацией для HTTP запросов */
export interface IAuthHeaders {
  Authorization?: string;
  'Content-Type'?: string;
  [key: string]: string | undefined;
}

/** Информация о пользователе */
export interface IUserData {
  email: string;
  name: string;
}

/** Операции аутентификации */
export type TAuthOperations = 'register' | 'login' | 'logout' | 'refreshToken' | 'getUser' | 'updateUser';

/** Mapped Types для состояний загрузки и ошибок */
export type TLoadingStates = {
  [K in TAuthOperations as `${K}Loading`]: boolean;
};

export type TErrorStates = {
  [K in TAuthOperations as `${K}Error`]: string | null;
};

/** Ответ сервера при успешной аутентификации */
export interface IAuthResponse extends TTokenField<false>, IBaseApiResponse {
  user: IUserData;
}

/** Состояние аутентификации в Redux store */
export interface IAuthState extends TLoadingStates, TErrorStates {
  user: IUserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Ответ сервера с данными пользователя */
export interface IUserResponse extends IBaseApiResponse {
  user: IUserData;
}

/**
 * Типы для восстановления пароля
 */

/** Запрос на сброс пароля с токеном */
export interface IResetPasswordRequest extends TWithPassword {
  token: string;
}

/** Запрос на выход из системы */
export interface ILogoutRequest {
  token: string;
}

/**
 * Типы для токенов
 */

/** Пара токенов доступа и обновления */
export interface ITokens extends TTokenField<true> {}

/** Ответ сервера с новыми токенами */
export interface ITokenResponse extends TTokenField<false>, IBaseApiResponse {}

/**
 * Утилиты для работы с токенами
 */

/** Утилиты для работы с заголовками авторизации */
export interface IAuthHeadersUtils {
  getAuthHeader: () => IAuthHeaders;
  getHeaders: (additionalHeaders?: IRequestHeaders) => IRequestHeaders;
}

/** Основные утилиты для работы с аутентификацией */
export interface IAuthUtils {
  setTokens: (accessToken: string, refreshToken: string) => void;
  getTokens: () => ITokens;
  removeTokens: () => void;
  hasTokens: () => boolean;
  isAuthenticated: () => boolean;
  clearAllAuthData: () => void;
}

/** Утилиты для работы с refresh токеном */
export interface IRefreshTokenUtils {
  setRefreshToken: (token: string) => void;
  getRefreshToken: () => string | null;
  removeRefreshToken: () => void;
  hasRefreshToken: () => boolean;
}

/** Утилиты для работы с флагом сброса пароля */
export interface IResetPasswordUtils {
  setResetPasswordAllowed: () => void;
  isResetPasswordAllowed: () => boolean;
  removeResetPasswordFlag: () => void;
}

/** Утилиты для работы с access токеном */
export interface ITokenUtils {
  setAccessToken: (token: string) => void;
  getAccessToken: () => string | null;
  removeAccessToken: () => void;
  hasAccessToken: () => boolean;
}

// ============================================================================
// ИНГРЕДИЕНТЫ И КОНСТРУКТОР
// ============================================================================

/**
 * Типы для ингредиентов
 */

/** Тип ингредиента и вкладки */
export type TIngredientType = 'bun' | 'main' | 'sauce';

/** Ингредиент бургера с полной информацией */
export interface IIngredient {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large?: string;
  count?: number;
}

/** Состояние списка ингредиентов в Redux store */
export interface IIngredientsState extends IBaseState {
  ingredients: IIngredient[];
}

/**
 * Типы для конструктора бургера
 */

/** Ингредиент в конструкторе с уникальным ID */
export interface IConstructorIngredient extends IIngredient {
  id: string; // Уникальный ID для каждого ингредиента в конструкторе
}

/** Состояние конструктора бургера в Redux store */
export interface IConstructorState {
  constructorIngredients: IConstructorIngredient[];
  bun: IIngredient | null;
}

/** Состояние деталей ингредиента в Redux store */
export interface IIngredientDetailsState {
  currentIngredient: IIngredient | null;
}

/**
 * Типы для drag & drop
 */

/** Элемент для перетаскивания в конструкторе */
export interface IDragItem {
  id: string;
  index: number;
  type?: string;
  _id?: string;
  name?: string;
  price?: number;
  image?: string;
  // Используем any для совместимости с react-dnd и различными типами элементов
  // react-dnd требует гибкую типизацию для работы с различными drag элементами
  [key: string]: any;
}

/** Результат операции перетаскивания */
export interface IDropResult {
  isOver: boolean;
}

// ============================================================================
// ЗАКАЗЫ
// ============================================================================

/**
 * Типы для заказов
 */

/** Статус заказа */
export type TOrderStatus = 'created' | 'pending' | 'done' | 'cancelled';

/** Статус WebSocket соединения */
export type TWebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

/** Состояние WebSocket соединения */
export interface IWebSocketState {
  status: TWebSocketStatus;
  error: string | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

/** Ингредиент в заказе */
export interface IOrderIngredient {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large?: string;
  count?: number;
}

/** Заказ с полной информацией */
export interface IOrder {
  _id: string;
  number: number;
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  ingredients: string[];
  price?: number;
}

/** Заказ с детальной информацией об ингредиентах */
export interface IOrderWithIngredients extends Omit<IOrder, 'ingredients'> {
  ingredients: IOrderIngredient[];
  totalPrice: number;
}

/** Статистика заказов */
export interface IOrderStats {
  total: number;
  totalToday: number;
  ready: number[];
  inProgress: number[];
}

/** Состояние заказа в Redux store */
export interface IOrderState extends IBaseState {
  orderNumber: number | null;
}

/**
 * Типы для ленты заказов (все заказы)
 */

/** Состояние ленты заказов в Redux store */
export interface IFeedState extends IBaseState, IWebSocketState {
  orders: IOrder[];
  total: number;
  totalToday: number;
  ready: number[];
  inProgress: number[];
}

/**
 * Типы для истории заказов пользователя
 */

/** Состояние истории заказов в Redux store */
export interface IProfileOrdersState extends IBaseState, IWebSocketState {
  orders: IOrder[];
}


// ============================================================================
// REDUX STORE
// ============================================================================

/** Корневое состояние Redux store приложения */
export interface IRootState {
  auth: IAuthState;
  constructor: IConstructorState;
  order: IOrderState;
  ingredients: IIngredientsState;
  ingredientDetails: IIngredientDetailsState;
  feed: IFeedState;
  profileOrders: IProfileOrdersState;
}

// ============================================================================
// КОМПОНЕНТЫ И UI
// ============================================================================

/**
 * Базовые типы для UI компонентов
 */

/** Базовые типы для UI компонентов */
export type TSize = 'small' | 'medium' | 'large';

/** Базовые типы для кнопок и иконок */
export type TBaseButtonType = 'primary' | 'secondary';
export type TIconType = TBaseButtonType | 'error';

/** Базовые пропсы для компонентов с размером */
export interface IBaseComponentProps {
  size?: TSize;
  className?: string;
}

/** Базовые пропсы для компонентов с children */
export interface IComponentWithChildren {
  children: React.ReactNode;
}

/**
 * Базовые типы для компонентов
 */

/** Базовый тип для обработчиков клика по ингредиенту */
export type TIngredientClickHandler = TSingleParamFunction<IIngredient>;

/** Базовый тип для обработчиков удаления элемента */
export type TRemoveItemHandler = (index: number, ingredientId: string) => void;

/** Пропсы для блока категории ингредиентов */
export interface ICategoryBlockProps {
  title: string;
  items: IIngredient[];
  onIngredientClick: TIngredientClickHandler;
}

/** Пропсы для элемента категории ингредиентов */
export interface ICategoryItemProps {
  item: IIngredient;
  onIngredientClick: TIngredientClickHandler;
}

/** Рефы для категорий ингредиентов */
export interface ICategoryRefs {
  bun: React.RefObject<HTMLDivElement | null>;
  sauce: React.RefObject<HTMLDivElement | null>;
  main: React.RefObject<HTMLDivElement | null>;
}

/** Пропсы для перетаскиваемого элемента конструктора */
export interface IDraggableConstructorItemProps {
  ingredient: IConstructorIngredient;
  index: number;
  onRemove: TRemoveItemHandler;
}


/** Пропсы для оверлея модального окна */
export interface IModalOverlayProps extends IComponentWithChildren {
  handleClose: TVoidFunction;
}

/** Пропсы для модального окна */
export interface IModalProps extends IComponentWithChildren {
  title?: string;
  handleClose: TVoidFunction;
}

/** Пропсы для элемента пищевой ценности */
export interface INutritionItemProps {
  label: string;
  value: number;
}

/** Пропсы для защищенного маршрута */
export interface IProtectedRouteProps extends IComponentWithChildren {
  requireAuth?: boolean;
  requireGuest?: boolean;
  requireResetFlag?: boolean;
  redirectTo?: string | null;
}

/**
 * Типы для табов и навигации
 */

/** Состояние location в React Router */
export interface ILocationState {
  from?: string;
}

// ============================================================================
// ФОРМЫ И ВАЛИДАЦИЯ
// ============================================================================

/**
 * Базовые типы для данных форм
 */


/** Данные формы профиля пользователя */
export interface IProfileFormData extends TWithEmailPasswordAndName {
  [key: string]: string; // Для совместимости с FormValues
}

/** Оригинальные данные профиля пользователя */
export interface IProfileOriginalData extends TWithEmailPasswordAndName {
  [key: string]: string; // Для совместимости с FormValues
}


/** Данные формы сброса пароля */
export interface IResetPasswordFormData extends TWithPassword {
  token: string;
}

/**
 * Базовые типы для обработчиков форм
 */

/** Базовый тип для обработчиков событий формы */
export type TFormEventHandler<T = HTMLFormElement> = (e: React.FormEvent<T>) => Promise<void>;

/** Базовый тип для обработчиков изменения полей */
export type TFormChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

/** Базовый тип для обработчиков изменения полей ввода */
export type TInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

/** Базовый тип для функций без параметров */
export type TVoidFunction = () => void;

/** Базовый тип для функций с одним параметром */
export type TSingleParamFunction<T> = (param: T) => void;

/**
 * Типы для функций компонентов профиля
 */

/** Функция получения текста подсказки */
export type TGetTooltipTextFunction = () => string;

/** Функция выхода из системы */
export type THandleLogoutFunction = () => Promise<void>;

/** Функция проверки активности ссылки */
export type TIsLinkActiveFunction = (path: string) => boolean;

// ============================================================================
// REDUX ACTIONS
// ============================================================================

/**
 * Базовые типы для Redux actions
 */

/** Базовый интерфейс для action */
export interface IBaseAction<T = string> {
  type: T;
}

/** Action с payload */
export interface IActionWithPayload<T = string, P = any> extends IBaseAction<T> {
  payload: P;
}

/**
 * Типы для actions ингредиентов
 */

/** Action для установки ингредиентов */
export interface ISetIngredientsAction extends IActionWithPayload<'SET_INGREDIENTS', IIngredient[]> {}

/** Action для установки состояния загрузки ингредиентов */
export interface ISetIngredientsLoadingAction extends IActionWithPayload<'SET_INGREDIENTS_LOADING', boolean> {}

/** Action для установки ошибки ингредиентов */
export interface ISetIngredientsErrorAction extends IActionWithPayload<'SET_INGREDIENTS_ERROR', string> {}

/** Action для увеличения счетчика ингредиента */
export interface IIncrementIngredientCountAction extends IActionWithPayload<'INCREMENT_INGREDIENT_COUNT', string> {}

/** Action для уменьшения счетчика ингредиента */
export interface IDecrementIngredientCountAction extends IActionWithPayload<'DECREMENT_INGREDIENT_COUNT', string> {}

/** Action для восстановления счетчиков ингредиентов */
export interface IRestoreIngredientCountersAction extends IActionWithPayload<'RESTORE_INGREDIENT_COUNTERS', Record<string, number>> {}

/** Union тип для всех actions ингредиентов */
export type TIngredientsActions = 
  | IBaseAction<'FETCH_INGREDIENTS_REQUEST'>
  | IActionWithPayload<'FETCH_INGREDIENTS_SUCCESS', IIngredient[]>
  | IActionWithPayload<'FETCH_INGREDIENTS_ERROR', string>
  | ISetIngredientsAction
  | ISetIngredientsLoadingAction
  | ISetIngredientsErrorAction
  | IIncrementIngredientCountAction
  | IDecrementIngredientCountAction
  | IRestoreIngredientCountersAction;

/**
 * Типы для actions конструктора
 */

/** Action для добавления ингредиента в конструктор */
export interface IAddIngredientToConstructorAction extends IActionWithPayload<'ADD_INGREDIENT_TO_CONSTRUCTOR', IConstructorIngredient> {}

/** Action для удаления ингредиента из конструктора */
export interface IRemoveIngredientFromConstructorAction extends IActionWithPayload<'REMOVE_INGREDIENT_FROM_CONSTRUCTOR', { index: number; ingredientId: string }> {}

/** Action для установки булки */
export interface ISetBunAction extends IActionWithPayload<'SET_BUN', IIngredient> {}

/** Action для перемещения ингредиента */
export interface IMoveIngredientAction extends IActionWithPayload<'MOVE_INGREDIENT', { dragIndex: number; hoverIndex: number }> {}

/** Action для восстановления конструктора без счетчиков */
export interface IRestoreConstructorWithoutCountersAction extends IActionWithPayload<'RESTORE_CONSTRUCTOR_WITHOUT_COUNTERS', { bun: IIngredient | null; constructorIngredients: IConstructorIngredient[] }> {}

/** Union тип для всех actions конструктора */
export type TConstructorActions = 
  | IAddIngredientToConstructorAction
  | IRemoveIngredientFromConstructorAction
  | ISetBunAction
  | IMoveIngredientAction
  | IBaseAction<'CLEAR_CONSTRUCTOR'>
  | IBaseAction<'SAVE_CONSTRUCTOR_STATE'>
  | IBaseAction<'RESTORE_CONSTRUCTOR_STATE'>
  | IRestoreConstructorWithoutCountersAction;

/**
 * Типы для actions деталей ингредиента
 */

/** Action для установки текущего ингредиента */
export interface ISetCurrentIngredientAction extends IActionWithPayload<'SET_CURRENT_INGREDIENT', IIngredient> {}

/** Union тип для всех actions деталей ингредиента */
export type TIngredientDetailsActions = 
  | ISetCurrentIngredientAction
  | IBaseAction<'CLEAR_CURRENT_INGREDIENT'>;

/**
 * Типы для actions заказов
 */

/** Action для установки номера заказа */
export interface ISetOrderNumberAction extends IActionWithPayload<'SET_ORDER_NUMBER', number> {}

/** Action для установки состояния загрузки заказа */
export interface ISetOrderLoadingAction extends IActionWithPayload<'SET_ORDER_LOADING', boolean> {}

/** Action для установки ошибки заказа */
export interface ISetOrderErrorAction extends IActionWithPayload<'SET_ORDER_ERROR', string> {}

/** Union тип для всех actions заказов */
export type TOrderActions = 
  | IBaseAction<'CREATE_ORDER_REQUEST'>
  | IActionWithPayload<'CREATE_ORDER_SUCCESS', number>
  | IActionWithPayload<'CREATE_ORDER_ERROR', string>
  | ISetOrderNumberAction
  | ISetOrderLoadingAction
  | ISetOrderErrorAction
  | IBaseAction<'CLEAR_ORDER'>;

/**
 * Типы для actions аутентификации
 */

/** Action для успешной регистрации */
export interface IRegisterSuccessAction extends IActionWithPayload<'REGISTER_SUCCESS', { user: IUserData; accessToken: string; refreshToken: string }> {}

/** Action для ошибки регистрации */
export interface IRegisterErrorAction extends IActionWithPayload<'REGISTER_ERROR', string> {}

/** Action для успешной авторизации */
export interface ILoginSuccessAction extends IActionWithPayload<'LOGIN_SUCCESS', { user: IUserData; accessToken: string; refreshToken: string }> {}

/** Action для ошибки авторизации */
export interface ILoginErrorAction extends IActionWithPayload<'LOGIN_ERROR', string> {}

/** Action для ошибки выхода */
export interface ILogoutErrorAction extends IActionWithPayload<'LOGOUT_ERROR', string> {}

/** Action для успешного обновления токена */
export interface IRefreshTokenSuccessAction extends IActionWithPayload<'REFRESH_TOKEN_SUCCESS', { accessToken: string; refreshToken: string }> {}

/** Action для ошибки обновления токена */
export interface IRefreshTokenErrorAction extends IActionWithPayload<'REFRESH_TOKEN_ERROR', string> {}

/** Action для установки данных пользователя */
export interface ISetUserDataAction extends IActionWithPayload<'SET_USER_DATA', IUserData> {}

/** Action для установки состояния загрузки аутентификации */
export interface ISetAuthLoadingAction extends IActionWithPayload<'SET_AUTH_LOADING', boolean> {}

/** Action для установки ошибки аутентификации */
export interface ISetAuthErrorAction extends IActionWithPayload<'SET_AUTH_ERROR', string | null> {}

/** Action для успешного получения данных пользователя */
export interface IGetUserSuccessAction extends IActionWithPayload<'GET_USER_SUCCESS', IUserData> {}

/** Action для ошибки получения данных пользователя */
export interface IGetUserErrorAction extends IActionWithPayload<'GET_USER_ERROR', string> {}

/** Action для успешного обновления данных пользователя */
export interface IUpdateUserSuccessAction extends IActionWithPayload<'UPDATE_USER_SUCCESS', IUserData> {}

/** Action для ошибки обновления данных пользователя */
export interface IUpdateUserErrorAction extends IActionWithPayload<'UPDATE_USER_ERROR', string> {}

/** Union тип для всех actions аутентификации */
export type TAuthActions = 
  | IBaseAction<'REGISTER_REQUEST'>
  | IRegisterSuccessAction
  | IRegisterErrorAction
  | IBaseAction<'LOGIN_REQUEST'>
  | ILoginSuccessAction
  | ILoginErrorAction
  | IBaseAction<'LOGOUT_REQUEST'>
  | IBaseAction<'LOGOUT_SUCCESS'>
  | ILogoutErrorAction
  | IBaseAction<'REFRESH_TOKEN_REQUEST'>
  | IRefreshTokenSuccessAction
  | IRefreshTokenErrorAction
  | ISetUserDataAction
  | IBaseAction<'CLEAR_USER_DATA'>
  | ISetAuthLoadingAction
  | ISetAuthErrorAction
  | IBaseAction<'CLEAR_AUTH_ERROR'>
  | IBaseAction<'GET_USER_REQUEST'>
  | IGetUserSuccessAction
  | IGetUserErrorAction
  | IBaseAction<'UPDATE_USER_REQUEST'>
  | IUpdateUserSuccessAction
  | IUpdateUserErrorAction;

/**
 * Типы для actions ленты заказов
 */

/** Action для запроса загрузки ленты заказов */
export interface IFetchFeedRequestAction extends IBaseAction<'FETCH_FEED_REQUEST'> {}

/** Action для успешной загрузки ленты заказов */
export interface IFetchFeedSuccessAction extends IActionWithPayload<'FETCH_FEED_SUCCESS', IOrder[]> {}

/** Action для ошибки загрузки ленты заказов */
export interface IFetchFeedErrorAction extends IActionWithPayload<'FETCH_FEED_ERROR', string> {}

/** Action для установки заказов в ленте */
export interface ISetFeedOrdersAction extends IActionWithPayload<'SET_FEED_ORDERS', IOrder[]> {}

/** Action для установки статистики ленты */
export interface ISetFeedStatsAction extends IActionWithPayload<'SET_FEED_STATS', IOrderStats> {}

/** Action для установки статуса WebSocket соединения ленты */
export interface ISetFeedWebSocketStatusAction extends IActionWithPayload<'SET_FEED_WEBSOCKET_STATUS', TWebSocketStatus> {}

/** Action для установки ошибки WebSocket соединения ленты */
export interface ISetFeedWebSocketErrorAction extends IActionWithPayload<'SET_FEED_WEBSOCKET_ERROR', string | null> {}

/** Action для очистки ленты заказов */
export interface IClearFeedAction extends IBaseAction<'CLEAR_FEED'> {}

/** Union тип для всех actions ленты заказов */
export type TFeedActions = 
  | IFetchFeedRequestAction
  | IFetchFeedSuccessAction
  | IFetchFeedErrorAction
  | ISetFeedOrdersAction
  | ISetFeedStatsAction
  | ISetFeedWebSocketStatusAction
  | ISetFeedWebSocketErrorAction
  | IClearFeedAction;

/**
 * Типы для actions истории заказов пользователя
 */

/** Action для запроса загрузки истории заказов */
export interface IFetchProfileOrdersRequestAction extends IBaseAction<'FETCH_PROFILE_ORDERS_REQUEST'> {}

/** Action для успешной загрузки истории заказов */
export interface IFetchProfileOrdersSuccessAction extends IActionWithPayload<'FETCH_PROFILE_ORDERS_SUCCESS', IOrder[]> {}

/** Action для ошибки загрузки истории заказов */
export interface IFetchProfileOrdersErrorAction extends IActionWithPayload<'FETCH_PROFILE_ORDERS_ERROR', string> {}

/** Action для установки заказов в истории */
export interface ISetProfileOrdersAction extends IActionWithPayload<'SET_PROFILE_ORDERS', IOrder[]> {}

/** Action для установки статуса WebSocket соединения истории */
export interface ISetProfileOrdersWebSocketStatusAction extends IActionWithPayload<'SET_PROFILE_ORDERS_WEBSOCKET_STATUS', TWebSocketStatus> {}

/** Action для установки ошибки WebSocket соединения истории */
export interface ISetProfileOrdersWebSocketErrorAction extends IActionWithPayload<'SET_PROFILE_ORDERS_WEBSOCKET_ERROR', string | null> {}

/** Action для очистки истории заказов */
export interface IClearProfileOrdersAction extends IBaseAction<'CLEAR_PROFILE_ORDERS'> {}

/** Union тип для всех actions истории заказов */
export type TProfileOrdersActions = 
  | IFetchProfileOrdersRequestAction
  | IFetchProfileOrdersSuccessAction
  | IFetchProfileOrdersErrorAction
  | ISetProfileOrdersAction
  | ISetProfileOrdersWebSocketStatusAction
  | ISetProfileOrdersWebSocketErrorAction
  | IClearProfileOrdersAction;

/**
 * Union тип для всех actions приложения
 */
export type TAllActions = 
  | TIngredientsActions
  | TConstructorActions
  | TIngredientDetailsActions
  | TOrderActions
  | TAuthActions
  | TFeedActions
  | TProfileOrdersActions;

// ============================================================================
// КАСТОМНЫЕ ХУКИ
// ============================================================================

/**
 * Типы для хука useForm
 */

/** Значения полей формы (объект с произвольными строковыми ключами и значениями) */
export type TFormValues = Record<string, string>;

/** Функция установки значений формы */
export type TSetFormValuesFunction = TSingleParamFunction<TFormValues>;

/** Возвращаемое значение хука useForm */
export type TUseFormReturn = [
  TFormValues,
  TFormChangeHandler,
  TSetFormValuesFunction,
  TVoidFunction
];

/**
 * Типы для хука useModal
 */

/** Возвращаемое значение хука useModal */
export interface IUseModalReturn {
  isModalOpen: boolean;
  openModal: TVoidFunction;
  closeModal: TVoidFunction;
}
