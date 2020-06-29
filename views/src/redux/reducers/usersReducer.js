import {
  REGISTER_USER_FAILURE,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER_SUCCESS,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE
} from "../actions/types";

let initialState = {
  token: localStorage.getItem("token"),
  user: null,
  auth: {
    isAdmin: false,
    isSeller: false,
    isCustomer: false
  },
  isLoading: false,
  success: null,
  error: null
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        auth: {
          isAdmin: action.payload.user.isAdmin,
          isSeller: action.payload.user.isSeller,
          isCustomer: action.payload.user.isCustomer
        },
        error: null
      };
    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        auth: {
          isAdmin: action.payload.user.isAdmin,
          isSeller: action.payload.user.isSeller,
          isCustomer: action.payload.user.isCustomer
        },
        isLoading: false,
        error: null,
        success: action.payload.successMessage
      };
    case REGISTER_USER_FAILURE:
    case LOGIN_USER_FAILURE:
    case AUTH_ERROR:
    case LOGOUT_USER_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        error: null,
        success: null,
        isLoading: false,
        auth: {
          isAdmin: false,
          isSeller: false,
          isCustomer: false
        }
      };
    case UPDATE_USER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,

        auth: {
          isAdmin: action.payload.user.isAdmin,
          isSeller: action.payload.user.isSeller,
          isCustomer: action.payload.user.isCustomer
        },
        isLoading: false,
        error: null,
        success: action.payload.successMessage
      };
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        success: null
      };

    default:
      return state;
  }
};

export default usersReducer;
