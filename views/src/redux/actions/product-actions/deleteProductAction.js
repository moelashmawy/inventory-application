import { DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAILURE } from "../types";
import axios from "axios";
import { tokenConfig } from "../auth-actions/tokenConfig";

export const deleteProduct = id => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/product/${id}/delete`, tokenConfig(getState))
      .then(res => {
        let successMessage = res.data.message;
        dispatch(deleteProductSuccess(id, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let error = err.response.data.message;
        dispatch(deleteProductFailure(error));
        reject(error);
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
