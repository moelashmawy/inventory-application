import {
  FETCH_WISHLIST_STARTED,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAILURE,
  DELETE_FROM_WISHLIST_SUCCESS,
  DELETE_FROM_WISHLIST_FAILURE
} from "./../actions/types";

const initialState = {
  wishlistItems: [],
  loading: false,
  success: null,
  error: null
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlistItems: action.payload.wishlist,
        loading: false
      };
    case FETCH_WISHLIST_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlistItems: action.payload.wishlist,
        loading: false,
        success: action.payload.message,
        error: null
      };
    case ADD_TO_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        success: null,
        error: action.payload.error
      };
    case DELETE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlistItems: action.payload.wishlist,
        loading: false,
        success: action.payload.message,
        error: null
      };
    case DELETE_FROM_WISHLIST_FAILURE:
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

export default wishlistReducer;
