import {
  FETCH_HISTORY_STARTED,
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_FAILURE
} from "../actions/types";

const initialState = {
  historyOrders: [],
  loading: false,
  success: null,
  error: null
};

const ordersHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HISTORY_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_HISTORY_SUCCESS:
      return {
        ...state,
        historyOrders: action.payload.historyOrders,
        loading: false,
        error: null
      };
    case FETCH_HISTORY_FAILURE:
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

export default ordersHistoryReducer;
