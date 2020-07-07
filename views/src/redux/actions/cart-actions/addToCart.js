import { ADD_TO_CART_SUCCESS, ADD_TO_CART_FAILURE } from "./../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";

export const addToCart = (productId, orderQuantity = null) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { productId };
    axios
      //api/cart/addToCart?productId=123123132
      .put("/api/cart/addToCart", orderQuantity, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let cart = res.data.cart.items;

        dispatch(addToCartSuccess(cart, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(addToCartFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const addToCartSuccess = (cart, message) => {
  return {
    type: ADD_TO_CART_SUCCESS,
    payload: { cart, message }
  };
};

const addToCartFailure = error => {
  return {
    type: ADD_TO_CART_FAILURE,
    payload: { error }
  };
};
