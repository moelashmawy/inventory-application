import { ORDER_SHIPPED_SUCCESS, ORDER_SHIPPED_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const markOrderShipped = orderId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { orderId };

    axios
      .get("/api/order/ordersToShip/markAsShipped", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let shippedOrder = res.data.shippedOrder;

        dispatch(markShippedSuccess(shippedOrder, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(markShippedFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const markShippedSuccess = (shippedOrder, message) => {
  return {
    type: ORDER_SHIPPED_SUCCESS,
    payload: { shippedOrder, message }
  };
};

const markShippedFailure = error => {
  return {
    type: ORDER_SHIPPED_FAILURE,
    payload: { error }
  };
};
