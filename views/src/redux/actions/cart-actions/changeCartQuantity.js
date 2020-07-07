import { CHANGE_CART_QUANTITY_SUCCESS, CHANGE_CART_QUANTITY_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const changeCartQuantity = (productId, orderQuantity = null) => (
  dispatch,
  getState
) => {
  return new Promise((resolve, reject) => {
    let params = { productId };
    axios
      //api/cart/changeQuantityFromCart?productId=
      .put(
        "/api/cart/changeQuantityFromCart",
        orderQuantity,
        tokenConfig(getState, params)
      )
      .then(res => {
        let successMessage = res.data.message;
        let cart = res.data.cart;

        dispatch(changeCartQuantitySuccess(cart, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(changeCartQuantityFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const changeCartQuantitySuccess = (cart, message) => {
  return {
    type: CHANGE_CART_QUANTITY_SUCCESS,
    payload: { cart, message }
  };
};

const changeCartQuantityFailure = error => {
  return {
    type: CHANGE_CART_QUANTITY_FAILURE,
    payload: { error }
  };
};
