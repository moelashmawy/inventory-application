import {
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_FAILURE
} from './types';
import axios from 'axios';

export const addCategory = category => {
    return dispatch => {
        axios
            .post('/api/category/create', category)
            .then(res => {
                dispatch(addCategorySuccess(res.data))
            })
            .catch(error => {
                dispatch(addCategoryFailure(error.message))
            })
    }
}

const addCategorySuccess = category => {
    return {
        type: ADD_CATEGORY_SUCCESS,
        payload: {
            category
        }
    }
}

const addCategoryFailure = error => {
    return {
        type: ADD_CATEGORY_FAILURE,
        payload: {
            error
        }
    }
}