import {
  FETCH_ALL_USERS_STARTED,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAILURE,
  SHIPPER_PERMISSION_SUCCESS,
  SHIPPER_PERMISSION_FAILURE,
  ADMIN_PERMISSION_SUCCESS,
  ADMIN_PERMISSION_FAILURE,
  STRICT_USER_SUCCESS,
  STRICT_USER_FAILURE
} from "../actions/types";

let initialState = {
  allUsers: [],
  loading: null,
  success: null,
  error: null
};

const permissionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_USERS_STARTED:
      return {
        ...state,
        loading: true,
        success: null,
        error: null
      };
    case FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        allUsers: action.payload.allUsers,
        success: null,
        error: null
      };
    case FETCH_ALL_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        success: null
      };
    case SHIPPER_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        allUsers: state.allUsers.map(user => {
          if (user._id === action.payload.user._id) {
            return action.payload.user;
          }
          return user;
        }),
        success: action.payload.message,
        error: null
      };
    case SHIPPER_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        success: null
      };
    case ADMIN_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        allUsers: state.allUsers.map(user => {
          if (user._id === action.payload.user._id) {
            return action.payload.user;
          }
          return user;
        }),
        success: action.payload.message,
        error: null
      };
    case ADMIN_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        success: null
      };
    case STRICT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        allUsers: state.allUsers.map(user => {
          if (user._id === action.payload.user._id) {
            return action.payload.user;
          }
          return user;
        }),
        success: action.payload.message,
        error: null
      };
    case STRICT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        success: null
      };

    default:
      return state;
  }
};

export default permissionsReducer;
