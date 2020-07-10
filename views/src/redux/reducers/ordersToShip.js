import {
  FETCH_ORDERS_TO_SHIP_STARTED,
  FETCH_ORDERS_TO_SHIP_SUCCESS,
  FETCH_ORDERS_TO_SHIP_FAILURE,
  ORDER_SHIPPED_SUCCESS,
  ORDER_SHIPPED_FAILURE
} from "../actions/types";

const initialState = {
  ordersToShip: [],
  shippedOrders: [],
  loading: false,
  success: null,
  error: null
};

const ordersToShip = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS_TO_SHIP_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_ORDERS_TO_SHIP_SUCCESS:
      return {
        ...state,
        ordersToShip: action.payload.ordersToShip.filter(
          order => order.orderState.shipped === false
        ),
        shippedOrders: action.payload.ordersToShip.filter(
          order => order.orderState.shipped !== false
        ),
        loading: false,
        error: null
      };
    case FETCH_ORDERS_TO_SHIP_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case ORDER_SHIPPED_SUCCESS:
      return {
        ...state,
        ordersToShip: state.ordersToShip.filter(
          order => order._id !== action.payload.shippedOrder._id
        ),
        shippedOrders: state.ordersToShip.filter(
          order => order.orderState.shipped !== false
        ),
        loading: false,
        error: null,
        success: action.payload.message
      };
    case ORDER_SHIPPED_FAILURE:
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

export default ordersToShip;
