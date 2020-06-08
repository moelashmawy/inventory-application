import { ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE } from "./types";
import axios from "axios";

export const addProduct = product => {
    return dispatch => {
        axios
            .post("/api/product/create", product)
            .then(res => {
                dispatch(addProductSuccess(res.data));
            })
            .catch(error => {
                dispatch(addProductFailure(error.message));
            });
    };
};

const addProductSuccess = product => {
    return {
        type: ADD_PRODUCT_SUCCESS,
        payload: {
            product
        }
    };
};

const addProductFailure = error => {
    return {
        type: ADD_PRODUCT_FAILURE,
        payload: {
            error
        }
    };
};
