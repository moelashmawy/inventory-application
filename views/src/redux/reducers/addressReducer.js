import {
  FETCH_ADDRESSES_STARTED,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE,
  EDIT_ADDRESS_SUCCESS,
  EDIT_ADDRESS_FAILURE
} from "./../actions/types";

const initialState = {
  addresses: [],
  loading: false,
  success: null,
  error: null
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESSES_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_ADDRESSES_SUCCESS:
      return {
        ...state,
        addresses: action.payload.addresses,
        loading: false,
        error: null
      };
    case FETCH_ADDRESSES_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: [action.payload.address, ...state.addresses],
        loading: false,
        error: null,
        success: action.payload.message
      };
    case ADD_ADDRESS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: state.addresses.filter(
          address => address._id !== action.payload.address._id
        ),
        loading: false,
        error: null,
        success: action.payload.message
      };
    case DELETE_ADDRESS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null,
        loading: false
      };
    case EDIT_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: state.addresses.map(item => {
          if (item._id === action.payload.address._id) {
            return action.payload.address;
          }
          return item;
        }),
        loading: false,
        error: null,
        success: action.payload.message
      };
    case EDIT_ADDRESS_FAILURE:
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

export default addressReducer;
