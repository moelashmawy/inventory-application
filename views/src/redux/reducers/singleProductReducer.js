import {
    FETCH_SINGLE_PRODUCT_STARTED,
    FETCH_SINGLE_PRODUCT_SUCCESS,
    FETCH_SINGLE_PRODUCT_FAILURE
} from '../actions/types';

const initialState = {
    product: {},
    loading: false,
    error: null
}

const singleProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SINGLE_PRODUCT_STARTED:
            return {
                ...state,
                loading: true
            }
        case FETCH_SINGLE_PRODUCT_SUCCESS:
            return {
                ...state,
                product: action.payload.product,
                loading: false,
                error: null
            }
        case FETCH_SINGLE_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            }

        default:
            return state;
    }
}

export default singleProductReducer;