import { ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE } from "./types";
import axios from "axios";

export const addProduct = product => dispatch => {
    return new Promise((resolve, reject) => {
        // send our data as a multipart/form-data instead of application/json
        const form = Object.keys(product).reduce((f, k) => {
            f.append(k, product[k]);
            return f;
        }, new FormData());

        axios
            .post("/api/product/create", form)
            .then(res => {
                let newProduct = res.data.product;
                let successMessage = res.data.message;

                dispatch(addProductSuccess(newProduct, successMessage));
                resolve(successMessage);
            })
            .catch(error => {
                dispatch(addProductFailure(error.response));
                reject(error.response.data.message);
            });
    });
};

const addProductSuccess = (product, successMessage) => {
    return {
        type: ADD_PRODUCT_SUCCESS,
        payload: {
            product,
            successMessage
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
