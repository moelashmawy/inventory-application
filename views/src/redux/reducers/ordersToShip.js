import {
  FETCH_ORDERS_TO_SHIP_STARTED,
  FETCH_ORDERS_TO_SHIP_SUCCESS,
  FETCH_ORDERS_TO_SHIP_FAILURE,
  FETCH_SHIPPED_ORDERS_STARTED,
  FETCH_SHIPPED_ORDERS_SUCCESS,
  FETCH_SHIPPED_ORDERS_FAILURE,
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
        ordersToShip: action.payload.ordersToShip,
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
    case FETCH_SHIPPED_ORDERS_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_SHIPPED_ORDERS_SUCCESS:
      return {
        ...state,
        shippedOrders: action.payload.shippedOrders,
        loading: false,
        error: null
      };
    case FETCH_SHIPPED_ORDERS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case ORDER_SHIPPED_SUCCESS:
      return {
        ...state,
        ordersToShip: state.ordersToShip.map(order => {
          return order.products._id === action.payload.shippedOrder._id
            ? {
                ...order,
                products: {
                  ...order.products,
                  orderState: {
                    ...order.products.orderState,
                    shipped: true
                  }
                }
              }
            : order;
        }),
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
