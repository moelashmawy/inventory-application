import {
  REGISTER_USER_FAILURE,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER_SUCCESS,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR
} from "../actions/types";

let initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: false,
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
        isAuthenticated: true,
        user: action.payload.user
      };
    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
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
        isAuthenticated: false,
        user: null,
        error: null,
        success: null
      };

    default:
      return state;
  }
};

export default usersReducer;
