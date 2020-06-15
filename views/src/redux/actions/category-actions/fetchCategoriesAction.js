import {
  FETCH_CATEGORIES_STARTED,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORIES_SUCCESS
} from "./../types";
import axios from "axios";

export const fetchCategories = () => {
  return dispatch => {
    dispatch(fetchCategoriesStarted());
    axios
      .get("/api/category")
      .then(res => {
        dispatch(fetchCategoriesSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchCategoriesFailure(err.message));
      });
  };
};

const fetchCategoriesStarted = () => {
  return {
    type: FETCH_CATEGORIES_STARTED
  };
};

const fetchCategoriesSuccess = categories => {
  return {
    type: FETCH_CATEGORIES_SUCCESS,
    payload: {
      categories
    }
  };
};

const fetchCategoriesFailure = error => {
  return {
    type: FETCH_CATEGORIES_FAILURE,
    payload: {
      error
    }
  };
};
