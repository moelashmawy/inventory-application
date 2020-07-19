import {
  FETCH_USER_PRODUCTS_STARTED,
  FETCH_USER_PRODUCTS_SUCCESS,
  FETCH_USER_PRODUCTS_FAILURE,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE
} from "../actions/types";

const initialState = {
  products: [],
  pagesCount: null,
  loading: false,
  error: null,
  success: null
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_PRODUCTS_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_USER_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: null,
        products: action.payload.products,
        pagesCount: action.payload.pagesCount
      };
    case FETCH_USER_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        success: null
      };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [action.payload.product, ...state.products],
        error: null,
        success: action.payload.successMessage
      };
    case ADD_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload.id),
        error: null,
        success: action.payload.successMessage
      };
    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.map(item => {
          if (item._id === action.payload.id) {
            return action.payload.newProduct;
          }
          return item;
        }),
        error: null,
        success: action.payload.successMessage
      };
    case UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null
      };
    default:
      return state;
  }
};

export default productReducer;
