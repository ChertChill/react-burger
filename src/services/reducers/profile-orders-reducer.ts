import { 
  FETCH_PROFILE_ORDERS_REQUEST,
  FETCH_PROFILE_ORDERS_SUCCESS,
  FETCH_PROFILE_ORDERS_ERROR,
  SET_PROFILE_ORDERS,
  SET_PROFILE_ORDERS_WEBSOCKET_STATUS,
  SET_PROFILE_ORDERS_WEBSOCKET_ERROR,
  CLEAR_PROFILE_ORDERS
} from '../actions/action-types';
import { IProfileOrdersState, TProfileOrdersActions } from '../../utils/types';

/**
 * Начальное состояние истории заказов пользователя
 */
const initialState: IProfileOrdersState = {
  loading: false,
  error: null,
  orders: [],
  status: 'CLOSED',
  reconnectAttempts: 0,
  maxReconnectAttempts: 5
};

/**
 * Редьюсер для управления состоянием истории заказов пользователя
 * Обрабатывает загрузку заказов пользователя и WebSocket соединение
 */
export const profileOrdersReducer = (state = initialState, action: TProfileOrdersActions): IProfileOrdersState => {
  switch (action.type) {
    case FETCH_PROFILE_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PROFILE_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        orders: action.payload
      };

    case FETCH_PROFILE_ORDERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SET_PROFILE_ORDERS:
      return {
        ...state,
        orders: action.payload
      };

    case SET_PROFILE_ORDERS_WEBSOCKET_STATUS:
      return {
        ...state,
        status: action.payload,
        error: action.payload === 'OPEN' ? null : state.error
      };

    case SET_PROFILE_ORDERS_WEBSOCKET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case CLEAR_PROFILE_ORDERS:
      return {
        ...initialState,
        status: 'CLOSED'
      };

    default:
      return state;
  }
};
