import {
  FETCH_ORDERS_TO_SHIP_STARTED,
  FETCH_ORDERS_TO_SHIP_SUCCESS,
  FETCH_ORDERS_TO_SHIP_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const fetchordersToShip = () => (dispatch, getState) => {
  dispatch(fetchordersToShipStarted());

  axios
    .get("/api/order/ordersToShip", tokenConfig(getState))
    .then(res => {
      let ordersToShip = res.data.ordersToShip;
      dispatch(fetchordersToShipSuccess(ordersToShip));
    })
    .catch(err => {
      dispatch(fetchordersToShipFailure(err.response.data.message));
    });
};

const fetchordersToShipStarted = () => {
  return {
    type: FETCH_ORDERS_TO_SHIP_STARTED
  };
};

const fetchordersToShipSuccess = ordersToShip => {
  return {
    type: FETCH_ORDERS_TO_SHIP_SUCCESS,
    payload: { ordersToShip }
  };
};

const fetchordersToShipFailure = error => {
  return {
    type: FETCH_ORDERS_TO_SHIP_FAILURE,
    payload: { error }
  };
};
