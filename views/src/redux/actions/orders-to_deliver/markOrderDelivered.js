import { ORDER_DELIVERED_SUCCESS, ORDER_DELIVERED_FAILURE } from "./../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";

export const markOrderDelivered = orderId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { orderId };
    axios
      .get("/api/users/ordersToDeliver/markAsShipped", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let ordersToDeliver = res.data.user.ordersToDeliver;

        dispatch(markDeliveredSuccess(ordersToDeliver, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(markDeliveredFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const markDeliveredSuccess = (ordersToDeliver, message) => {
  return {
    type: ORDER_DELIVERED_SUCCESS,
    payload: { ordersToDeliver, message }
  };
};

const markDeliveredFailure = error => {
  return {
    type: ORDER_DELIVERED_FAILURE,
    payload: { error }
  };
};
