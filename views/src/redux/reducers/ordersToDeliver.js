import {
  FETCH_ORDERS_TO_DELIVER_STARTED,
  FETCH_ORDERS_TO_DELIVER_SUCCESS,
  FETCH_ORDERS_TO_DELIVER_FAILURE
} from "../actions/types";

const initialState = {
  ordersToDeliver: [],
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
        ordersToDeliver: action.payload.ordersToDeliver,
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

    default:
      return state;
  }
};

export default ordersToDeliver;
