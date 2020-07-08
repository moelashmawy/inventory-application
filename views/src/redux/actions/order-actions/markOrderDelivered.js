import { ORDER_DELIVERED_SUCCESS, ORDER_DELIVERED_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const markOrderDelivered = orderId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { orderId };
    axios
      .get("/api/order/ordersToDeliver/markAsShipped", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let deliveredOrder = res.data.deliveredOrder;

        dispatch(markDeliveredSuccess(deliveredOrder, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(markDeliveredFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const markDeliveredSuccess = (deliveredOrder, message) => {
  return {
    type: ORDER_DELIVERED_SUCCESS,
    payload: { deliveredOrder, message }
  };
};

const markDeliveredFailure = error => {
  return {
    type: ORDER_DELIVERED_FAILURE,
    payload: { error }
  };
};
