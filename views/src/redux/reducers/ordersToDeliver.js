import {
  FETCH_ORDERS_TO_DELIVER_STARTED,
  FETCH_ORDERS_TO_DELIVER_SUCCESS,
  FETCH_ORDERS_TO_DELIVER_FAILURE,
  ORDER_DELIVERED_SUCCESS,
  ORDER_DELIVERED_FAILURE
} from "../actions/types";

const initialState = {
  ordersToDeliver: [],
  deliveredOrders: [],
  loading: false,
  success: null,
  error: null
};

const ordersToDeliver = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS_TO_DELIVER_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_ORDERS_TO_DELIVER_SUCCESS:
      return {
        ...state,
        ordersToDeliver: action.payload.ordersToDeliver.filter(
          order => order.orderState.shipped === false
        ),
        deliveredOrders: action.payload.ordersToDeliver.filter(
          order => order.orderState.shipped !== false
        ),
        loading: false,
        error: null
      };
    case FETCH_ORDERS_TO_DELIVER_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case ORDER_DELIVERED_SUCCESS:
      return {
        ...state,
        ordersToDeliver: state.ordersToDeliver.filter(
          order => order._id !== action.payload.deliveredOrder._id
        ),
        deliveredOrders: state.ordersToDeliver.filter(
          order => order.orderState.shipped !== false
        ),
        loading: false,
        error: null,
        success: action.payload.message
      };
    case ORDER_DELIVERED_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };

    default:
      return state;
  }
};

export default ordersToDeliver;
