import {
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILURE
} from './types';
import axios from 'axios';

export const updateCategory = (id, category) => {
    return dispatch => {
        axios
            .put(`/api/category/${id}/update`, category)
            .then(res => {
                dispatch(updateCategorySuccess(id, res.data))
            })
            .catch(error => {
                dispatch(updateCategoryFailure(error.message))
            })
    }
}

const updateCategorySuccess = (id, newCategory) => {
    return {
        type: UPDATE_CATEGORY_SUCCESS,
        payload: {
            id,
            newCategory
        }
    }
}

const updateCategoryFailure = error => {
    return {
        type: UPDATE_CATEGORY_FAILURE,
        payload: {
            error
        }
    }
}