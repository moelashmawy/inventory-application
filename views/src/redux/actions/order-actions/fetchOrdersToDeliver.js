import {
  FETCH_ORDERS_TO_DELIVER_STARTED,
  FETCH_ORDERS_TO_DELIVER_SUCCESS,
  FETCH_ORDERS_TO_DELIVER_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const fetchOrdersToDeliver = () => (dispatch, getState) => {
  dispatch(fetchOrdersToDeliverStarted());

  axios
    .get("/api/order/ordersToDeliver", tokenConfig(getState))
    .then(res => {
      let ordersToDeliver = res.data.areaOrders;
      dispatch(fetchOrdersToDeliverSuccess(ordersToDeliver));
    })
    .catch(err => {
      dispatch(fetchOrdersToDeliverFailure(err.response.data.message));
    });
};

const fetchOrdersToDeliverStarted = () => {
  return {
    type: FETCH_ORDERS_TO_DELIVER_STARTED
  };
};

const fetchOrdersToDeliverSuccess = areaOrders => {
  return {
    type: FETCH_ORDERS_TO_DELIVER_SUCCESS,
    payload: { areaOrders }
  };
};

const fetchOrdersToDeliverFailure = error => {
  return {
    type: FETCH_ORDERS_TO_DELIVER_FAILURE,
    payload: { error }
  };
};
