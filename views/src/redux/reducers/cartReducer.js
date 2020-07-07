import {
  FETCH_CART_STARTED,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  DELETE_FROM_CART_SUCCESS,
  DELETE_FROM_CART_FAILURE,
  CHANGE_CART_QUANTITY_SUCCESS,
  CHANGE_CART_QUANTITY_FAILURE,
  PLACED_ORDER_SUCCESS,
  PLACED_ORDER_FAILURE
} from "./../actions/types";

const initialState = {
  cart: [],
  totalPrice: 0,
  loading: false,
  success: null,
  error: null
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        cart: action.payload.cart.items,
        totalPrice: action.payload.cart.totalPrice,
        loading: false
      };
    case FETCH_CART_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        cart: action.payload.cart,
        loading: false,
        success: action.payload.message,
        error: null
      };
    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload.error
      };
    case DELETE_FROM_CART_SUCCESS:
      return {
        ...state,
        cart: action.payload.cart.items,
        totalPrice: action.payload.cart.totalPrice,
        loading: false,
        success: action.payload.message,
        error: null
      };
    case DELETE_FROM_CART_FAILURE:
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload.error
      };
    case CHANGE_CART_QUANTITY_SUCCESS:
      return {
        ...state,
        cart: action.payload.cart.items,
        totalPrice: action.payload.cart.totalPrice,
        loading: false,
        success: action.payload.message,
        error: null
      };
    case CHANGE_CART_QUANTITY_FAILURE:
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload.error
      };
    case PLACED_ORDER_SUCCESS:
      return {
        ...state,
        cart: action.payload.cart.items,
        totalPrice: action.payload.cart.totalPrice,
        loading: false,
        success: action.payload.message,
        error: null
      };
    case PLACED_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload.error
      };

    default:
      return state;
  }
};

export default cartReducer;
