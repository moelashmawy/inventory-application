import { ADD_CATEGORY_SUCCESS, ADD_CATEGORY_FAILURE } from "./types";
import axios from "axios";

export const addCategory = category => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/category/create", category)
            .then(res => {
                let successMessage = res.data.message;

                dispatch(addCategorySuccess(category, successMessage));
                resolve(successMessage);
            })
            .catch(error => {
                dispatch(addCategoryFailure(error.response.data.message));
                reject(error.response.data.message);
            });
    });
};

const addCategorySuccess = (category, successMessage) => {
    return {
        type: ADD_CATEGORY_SUCCESS,
        payload: {
            category,
            successMessage
        }
    };
};

const addCategoryFailure = error => {
    return {
        type: ADD_CATEGORY_FAILURE,
        payload: {
            error
        }
    };
};
