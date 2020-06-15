import {
  FETCH_PRODUCTS_STARTED,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE
} from "./../types";
import axios from "axios";

export const fetchProducts = () => {
  return dispatch => {
    dispatch(fetchProductsStarted());

    axios
      .get("/api/product")
      .then(res => {
        dispatch(fetchProductsSuccess(res.data));
      })
      .catch(error => {
        dispatch(fetchProductsFailure(error.message));
      });
  };
};

const fetchProductsStarted = () => {
  return {
    type: FETCH_PRODUCTS_STARTED
  };
};

const fetchProductsSuccess = products => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: {
      products
    }
  };
};

const fetchProductsFailure = error => {
  return {
    type: FETCH_PRODUCTS_FAILURE,
    payload: {
      error
    }
  };
};
