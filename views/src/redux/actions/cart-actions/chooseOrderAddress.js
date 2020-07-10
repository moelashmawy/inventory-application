import { CHOOSE_ORDER_ADDRESS_SUCCESS, CHOOSE_ORDER_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const chooseOrderAddress = address => (dispatch, getState) => {
  axios
    //api/cart/chooseOrderAddress
    .put("/api/cart/chooseOrderAddress", address, tokenConfig(getState))
    .then(res => {
      let successMessage = res.data.message;
      let cart = res.data.cart;

      dispatch(chooseOrderAddressSuccess(cart, successMessage));
    })
    .catch(err => {
      let errorMessge = err.response.data.message;

      dispatch(chooseOrderAddressFailure(errorMessge));
    });
};

const chooseOrderAddressSuccess = (cart, message) => {
  return {
    type: CHOOSE_ORDER_ADDRESS_SUCCESS,
    payload: { cart, message }
  };
};

const chooseOrderAddressFailure = error => {
  return {
    type: CHOOSE_ORDER_ADDRESS_FAILURE,
    payload: { error }
  };
};
