import {
  FETCH_SHIPPED_ORDERS_STARTED,
  FETCH_SHIPPED_ORDERS_SUCCESS,
  FETCH_SHIPPED_ORDERS_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const fetchShippedOrders = () => (dispatch, getState) => {
  dispatch(fetchShippedOrdersStarted());

  axios
    .get("/api/order/shippedOrders", tokenConfig(getState))
    .then(res => {
      let shippedOrders = res.data.shippedOrders;
      dispatch(fetchShippedOrdersSuccess(shippedOrders));
    })
    .catch(err => {
      dispatch(fetchShippedOrdersFailure(err.response.data.message));
    });
};

const fetchShippedOrdersStarted = () => {
  return {
    type: FETCH_SHIPPED_ORDERS_STARTED
  };
};

const fetchShippedOrdersSuccess = shippedOrders => {
  return {
    type: FETCH_SHIPPED_ORDERS_SUCCESS,
    payload: { shippedOrders }
  };
};

const fetchShippedOrdersFailure = error => {
  return {
    type: FETCH_SHIPPED_ORDERS_FAILURE,
    payload: { error }
  };
};
