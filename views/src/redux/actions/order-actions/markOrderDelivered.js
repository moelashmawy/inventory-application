import { ORDER_DELIVERED_SUCCESS, ORDER_DELIVERED_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const markOrderDelivered = orderId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { orderId };

    axios
      .get("/api/order/ordersToDeliver/markAsDelivered", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let order = res.data.order;
        let deliveredItem = res.data.deliveredItem;

        dispatch(markDeliveredSuccess(order, deliveredItem, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(markDeliveredFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const markDeliveredSuccess = (order, deliveredItem, message) => {
  return {
    type: ORDER_DELIVERED_SUCCESS,
    payload: { order, deliveredItem, message }
  };
};

const markDeliveredFailure = error => {
  return {
    type: ORDER_DELIVERED_FAILURE,
    payload: { error }
  };
};
