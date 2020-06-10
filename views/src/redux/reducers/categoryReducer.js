import {
    FETCH_CATEGORIES_STARTED,
    FETCH_CATEGORIES_FAILURE,
    FETCH_CATEGORIES_SUCCESS,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_FAILURE,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAILURE,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILURE
} from "../actions/types";

const initialState = {
    categories: [],
    loading: false,
    error: null,
    success: null
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORIES_STARTED:
            return {
                ...state,
                loading: true
            };
        case FETCH_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload.categories,
                loading: false,
                error: null
            };
        case FETCH_CATEGORIES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                success: null
            };
        case ADD_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: [action.payload.category, ...state.categories],
                error: null,
                success: action.payload.successMessage
            };
        case ADD_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                success: null
            };
        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: state.categories.filter(
                    cat => cat._id !== action.payload.id
                ),
                error: null,
                success: action.payload.successMessage
            };
        case DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                success: null
            };
        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: state.categories.map(item => {
                    if (item._id === action.payload.id) {
                        return action.payload.newCategory;
                    }
                    return item;
                }),
                error: null,
                success: action.payload.successMessage
            };
        case UPDATE_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                success: null
            };

        default:
            return state;
    }
};

export default categoryReducer;
