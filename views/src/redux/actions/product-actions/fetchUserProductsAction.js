import {
  FETCH_USER_PRODUCTS_STARTED,
  FETCH_USER_PRODUCTS_SUCCESS,
  FETCH_USER_PRODUCTS_FAILURE
} from "./../types";
import axios from "axios";

export const fetchUserProducts = userId => {
  return dispatch => {
    dispatch(fetchUserProductsStarted());

    axios
      .get(`/api/product/${userId}/products`)
      .then(res => {
        dispatch(fetchUserProductsSuccess(res.data));
      })
      .catch(error => {
        dispatch(fetchUserProductsFailure(error.message));
      });
  };
};

const fetchUserProductsStarted = () => {
  return {
    type: FETCH_USER_PRODUCTS_STARTED
  };
};

const fetchUserProductsSuccess = products => {
  return {
    type: FETCH_USER_PRODUCTS_SUCCESS,
    payload: {
      products
    }
  };
};

const fetchUserProductsFailure = error => {
  return {
    type: FETCH_USER_PRODUCTS_FAILURE,
    payload: {
      error
    }
  };
};
