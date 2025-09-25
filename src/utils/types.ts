

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

/** Состояние заказа в Redux store */
export interface IOrderState extends IBaseState {
  orderNumber: number | null;
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
