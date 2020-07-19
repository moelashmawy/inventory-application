import {
  FETCH_USER_PRODUCTS_STARTED,
  FETCH_USER_PRODUCTS_SUCCESS,
  FETCH_USER_PRODUCTS_FAILURE
} from "./../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const fetchUserProducts = (pageNumber, perPage) => {
  let params = { page: pageNumber, perPage };

  return (dispatch, getState) => {
    dispatch(fetchUserProductsStarted());

    axios
      .get(`/api/product/my_products`, tokenConfig(getState, params))
      .then(res => {
        let products = res.data.products;
        let pagesCount = res.data.pagesCount;

        dispatch(fetchUserProductsSuccess(products, pagesCount));
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

const fetchUserProductsSuccess = (products, pagesCount) => {
  return {
    type: FETCH_USER_PRODUCTS_SUCCESS,
    payload: {
      products,
      pagesCount
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
