import { 
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  SET_ORDER_NUMBER,
  SET_ORDER_LOADING,
  SET_ORDER_ERROR,
  CLEAR_ORDER
} from '../actions/action-types';
import { 
  IOrderState,
  TOrderActions
} from '../../utils/types';

/**
 * Начальное состояние для reducer заказа
 * Содержит номер заказа, состояние загрузки и ошибки
 */
export const initialState: IOrderState = {
  orderNumber: null,
  loading: false,
  error: null
};

/**
 * Reducer для управления состоянием заказа
 * Обрабатывает создание заказа, управление состоянием загрузки и ошибками
 * 
 * @param state - текущее состояние
 * @param action - действие для обработки
 * @returns новое состояние
 */
const orderReducer = (state: IOrderState = initialState, action: TOrderActions): IOrderState => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orderNumber: action.payload,
        loading: false,
        error: null
      };

    case CREATE_ORDER_ERROR:
      return {
        ...initialState,
        error: action.payload
      };

    case SET_ORDER_NUMBER:
      return {
        ...state,
        orderNumber: action.payload,
        loading: false,
        error: null
      };

    case SET_ORDER_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case SET_ORDER_ERROR:
      return {
        ...initialState,
        error: action.payload
      };

    case CLEAR_ORDER:
      return {
        ...state,
        orderNumber: null,
        error: null
      };
      
    default:
      return state;
  }
};

export default orderReducer;