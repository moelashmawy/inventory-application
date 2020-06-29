import { UPDATE_CATEGORY_SUCCESS, UPDATE_CATEGORY_FAILURE } from "./../types";
import axios from "axios";
import { tokenConfig } from "../auth-actions/tokenConfig";

export const updateCategory = (id, category) => (dispatch, getState) => {
  // will return Promise so we can handle success and error message
  return new Promise((resolve, reject) => {
    axios
      .put(`/api/category/${id}/update`, category, tokenConfig(getState))
      .then(res => {
        let updatedCategory = res.data.category;
        let successMessage = res.data.message;

        dispatch(updateCategorySuccess(id, updatedCategory, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        let errorMessage = error.response.data.message;

        dispatch(updateCategoryFailure(errorMessage));
        reject(errorMessage);
      });
  });
};

const updateCategorySuccess = (id, newCategory, successMessage) => {
  return {
    type: UPDATE_CATEGORY_SUCCESS,
    payload: {
      id,
      newCategory,
      successMessage
    }
  };
};

const updateCategoryFailure = error => {
  return {
    type: UPDATE_CATEGORY_FAILURE,
    payload: {
      error
    }
  };
};
