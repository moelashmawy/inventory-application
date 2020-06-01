import {
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE
} from './types';
import axios from 'axios';

export const deleteProduct = id => {
    return dispatch => {
        axios
            .delete(`/api/product/${id}/delete`)
            .then(() => dispatch(deleteProductSuccess(id)))
            .catch(error => dispatch(deleteProductFailure(error.message)))
    }
}

const deleteProductSuccess = id => {
    return {
        type: DELETE_PRODUCT_SUCCESS,
        payload: {
            id
        }
    }
}

const deleteProductFailure = error => {
    return {
        type: DELETE_PRODUCT_FAILURE,
        payload: {
            error
        }
    }
}