import {
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAILURE
} from './types';
import axios from 'axios';

export const deleteCategory = id => {
    return dispatch => {
        axios.delete(`/api/category/${id}/delete`)
            .then(res => {
                dispatch(deleteCategorySuccess(id))
            })
            .catch(error => {
                dispatch(deleteCategoryFailure(error.message))
            })
    }
}

const deleteCategorySuccess = id => {
    return {
        type: DELETE_CATEGORY_SUCCESS,
        payload: {
            id
        }
    }
}

const deleteCategoryFailure = error => {
    return {
        type: DELETE_CATEGORY_FAILURE,
        payload: {
            error
        }
    }
}