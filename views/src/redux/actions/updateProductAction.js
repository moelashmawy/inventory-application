import { UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILURE } from "./types";
import axios from "axios";

export const updateProduct = (id, product) => {
    return dispatch => {
        axios
            .post(`/api/product/${id}/update`, product)
            .then(res => {
                if (res.status === 400) {
                    throw new Error("your custom message");
                } else dispatch(updateProductSuccess(id, res.data));
            })
            .catch(error => {
                dispatch(updateProductFailure(error.message));
            });
    };
};

const updateProductSuccess = (id, newProduct) => {
    return {
        type: UPDATE_PRODUCT_SUCCESS,
        payload: {
            id,
            newProduct
        }
    };
};

const updateProductFailure = error => {
    return {
        type: UPDATE_PRODUCT_FAILURE,
        payload: {
            error
        }
    };
};
