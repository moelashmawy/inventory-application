import { DELETE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const deleteCategory = id => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/category/${id}/delete`, tokenConfig(getState))
      .then(res => {
        let successMessage = res.data.message;

        dispatch(deleteCategorySuccess(id, successMessage));
        resolve(res);
      })
      .catch(error => {
        dispatch(deleteCategoryFailure(error.message));
        reject(error);
      });
  });
};

const deleteCategorySuccess = (id, successMessage) => {
  return {
    type: DELETE_CATEGORY_SUCCESS,
    payload: {
      id,
      successMessage
    }
  };
};

const deleteCategoryFailure = error => {
  return {
    type: DELETE_CATEGORY_FAILURE,
    payload: {
      error
    }
  };
};
