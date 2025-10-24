import { 
  FETCH_FEED_REQUEST,
  FETCH_FEED_SUCCESS,
  FETCH_FEED_ERROR,
  SET_FEED_ORDERS,
  SET_FEED_STATS,
  SET_FEED_WEBSOCKET_STATUS,
  SET_FEED_WEBSOCKET_ERROR,
  CLEAR_FEED
} from '../actions/action-types';
import { IFeedState, TFeedActions } from '../../utils/types';

/**
 * Начальное состояние ленты заказов
 */
export const initialState: IFeedState = {
  loading: false,
  error: null,
  orders: [],
  total: 0,
  totalToday: 0,
  ready: [],
  inProgress: [],
  status: 'CLOSED',
  reconnectAttempts: 0,
  maxReconnectAttempts: 5
};

/**
 * Редьюсер для управления состоянием ленты заказов
 * Обрабатывает загрузку заказов, WebSocket соединение и статистику
 */
export const feedReducer = (state = initialState, action: TFeedActions): IFeedState => {
  switch (action.type) {
    case FETCH_FEED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        orders: action.payload
      };

    case FETCH_FEED_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case SET_FEED_ORDERS:
      return {
        ...state,
        orders: action.payload
      };

    case SET_FEED_STATS:
      return {
        ...state,
        total: action.payload.total,
        totalToday: action.payload.totalToday,
        ready: action.payload.ready,
        inProgress: action.payload.inProgress
      };

    case SET_FEED_WEBSOCKET_STATUS:
      return {
        ...state,
        status: action.payload,
        error: action.payload === 'OPEN' ? null : state.error
      };

    case SET_FEED_WEBSOCKET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case CLEAR_FEED:
      return {
        ...initialState,
        status: 'CLOSED'
      };

    default:
      return state;
  }
};
