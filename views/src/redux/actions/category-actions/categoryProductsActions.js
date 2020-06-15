import {
  FETCH_CATEGORY_PRODUCTS_STARTED,
  FETCH_CATEGORY_PRODUCTS_SUCCESS,
  FETCH_CATEGORY_PRODUCTS_FAILURE
} from "./../types";
import axios from "axios";

export const fetchCategoryProducts = id => {
  return dispatch => {
    dispatch(fetchCategoriesProductsStarted());
    axios
      .get(`/api/category/${id}`)
      .then(res => {
        dispatch(fetchCategoriesProductsSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchCategoriesProductsFailure(err.message));
      });
  };
};

const fetchCategoriesProductsStarted = () => {
  return {
    type: FETCH_CATEGORY_PRODUCTS_STARTED
  };
};

const fetchCategoriesProductsSuccess = products => {
  return {
    type: FETCH_CATEGORY_PRODUCTS_SUCCESS,
    payload: {
      products
    }
  };
};

const fetchCategoriesProductsFailure = error => {
  return {
    type: FETCH_CATEGORY_PRODUCTS_FAILURE,
    payload: {
      error
    }
  };
};
