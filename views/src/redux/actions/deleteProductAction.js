import { DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAILURE } from "./types";
import axios from "axios";

export const deleteProduct = id => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .delete(`/api/product/${id}/delete`)
            .then(res => {
                let successMessage = res.data.message;
                dispatch(deleteProductSuccess(id, successMessage));
                resolve(successMessage);
            })
            .catch(error => {
                dispatch(deleteProductFailure(error.data.message));
                reject(error.data.message);
            });
    });
};

const deleteProductSuccess = (id, successMessage) => {
    return {
        type: DELETE_PRODUCT_SUCCESS,
        payload: {
            id,
            successMessage
        }
    };
};

const deleteProductFailure = error => {
    return {
        type: DELETE_PRODUCT_FAILURE,
        payload: {
            error
        }
    };
};
