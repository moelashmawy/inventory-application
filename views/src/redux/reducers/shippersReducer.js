import {
  FETCH_SHIPPERS_STARTED,
  FETCH_SHIPPERS_SUCCESS,
  FETCH_SHIPPERS_FAILURE,
  EDIT_SHIPPERS_SUCCESS,
  EDIT_SHIPPERS_FAILURE,
  SHIPPER_PERMISSION_SUCCESS,
  SHIPPER_PERMISSION_FAILURE
} from "../actions/types";

const initialState = {
  shippers: [],
  loading: false,
  error: null,
  success: null
};

const shippersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SHIPPERS_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_SHIPPERS_SUCCESS:
      return {
        ...state,
        shippers: action.payload.shippers,
        loading: false,
        error: null
      };
    case FETCH_SHIPPERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        success: null
      };
    case EDIT_SHIPPERS_SUCCESS:
      return {
        ...state,
        shippers: state.shippers.map(shipper => {
          if (shipper._id === action.payload.shipper._id) {
            return action.payload.shipper;
          }
          return shipper;
        }),
        loading: false,
        error: null,
        success: action.payload.message
      };
    case EDIT_SHIPPERS_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null
      };
    case SHIPPER_PERMISSION_SUCCESS:
      return {
        ...state,
        shippers: state.shippers.map(shipper => {
          return shipper.user._id === action.payload.user._id
            ? {
                ...shipper,
                isActiveShipper: action.payload.user.isShipper
              }
            : shipper;
        }),
        loading: false,
        error: null,
        success: action.payload.message
      };
    case SHIPPER_PERMISSION_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        success: null
      };

    default:
      return state;
  }
};

export default shippersReducer;

/* return {
  ...state,
  photos: state.photos.map(photo =>
    photo.id === action.data.selectedPhotoId
      ? {
          ...photo,
          comments: photo.comments.map(comment => {
            console.log(comment);
            return comment.id === action.data.commentId
              ? { ...comment, comment: action.data.fullComment }
              : comment;
          })
        }
      : photo
  )
};
 */
