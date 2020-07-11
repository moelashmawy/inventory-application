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
        ordersToDeliver: action.payload.areaOrders.filter(order => {
          return order.products.some(product => product.orderState.delivered === false);
        }),
        deliveredOrders: action.payload.areaOrders.filter(order => {
          return order.products.every(product => product.orderState.delivered === true);
        }),
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
        ordersToDeliver: state.ordersToDeliver.map(order => {
          return order._id === action.payload.order._id
            ? {
                ...order,
                products: order.products.map(product => {
                  return product._id === action.payload.deliveredItem._id
                    ? {
                        ...product,
                        orderState: {
                          ...product.orderState,
                          delivered: true
                        }
                      }
                    : product;
                })
              }
            : order;
        }),
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
