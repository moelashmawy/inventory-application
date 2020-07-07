import { FETCH_CART_STARTED, FETCH_CART_SUCCESS, FETCH_CART_FAILURE } from "./../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";

export const fetchCartProducts = () => (dispatch, getState) => {
  dispatch(fetchCartStarted());

  axios
    .get("/api/cart/userCartInfo", tokenConfig(getState))
    .then(res => {
      let cart = res.data.cart;
      dispatch(fetchCartSuccess(cart));
    })
    .catch(err => {
      dispatch(fetchCartFailure(err.response.data.message));
    });
};

const fetchCartStarted = () => {
  return {
    type: FETCH_CART_STARTED
  };
};

const fetchCartSuccess = cart => {
  return {
    type: FETCH_CART_SUCCESS,
    payload: { cart }
  };
};

const fetchCartFailure = error => {
  return {
    type: FETCH_CART_FAILURE,
    payload: { error }
  };
};
