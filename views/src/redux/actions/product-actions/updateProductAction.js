import { UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILURE } from "./../types";
import axios from "axios";
import { tokenConfig } from "./../auth-actions/tokenConfig";

export const updateProduct = (id, product) => (dispatch, getState) => {
  return new Promise((reslove, reject) => {
    const form = Object.keys(product).reduce((f, k) => {
      f.append(k, product[k]);
      return f;
    }, new FormData());

    axios
      .post(`/api/product/${id}/update`, form, tokenConfig(getState))
      .then(res => {
        let product = res.data.product;
        let successMessage = res.data.message;

        dispatch(updateProductSuccess(id, product, successMessage));
        reslove(successMessage);
      })
      .catch(error => {
        let errorMessage = error.response.data.message;

        dispatch(updateProductFailure(errorMessage));
        reject(errorMessage);
      });
  });
};

const updateProductSuccess = (id, newProduct, successMessage) => {
  return {
    type: UPDATE_PRODUCT_SUCCESS,
    payload: {
      id,
      newProduct,
      successMessage
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
