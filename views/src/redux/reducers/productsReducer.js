import {
    FETCH_PRODUCTS_STARTED,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
    ADD_PRODUCT_SUCCESS,
    ADD_PRODUCT_FAILURE,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE
} from '../actions/types';

const initialState = {
    products: [],
    loading: false,
    error: null
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_STARTED:
            return {
                ...state,
                loading: true
            }
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                products: action.payload.products
            }
        case FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.errors
            }
        case ADD_PRODUCT_SUCCESS:
            return {
                ...state,
                products: [action.payload.product, ...state.products],
                error: null
            }
        case ADD_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.payload.error
            }
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                products: state.products.filter(product => product._id !== action.payload.id),
                error: null
            }
        case DELETE_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.payload.error
            }
        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                products: state.products.map(item => {
                    if (item._id === action.payload.id) {
                        return action.payload.newProduct
                    }
                    return item
                })
            }
        case UPDATE_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.payload.error
            }

        default:
            return state;

    }

}

export default productReducer;