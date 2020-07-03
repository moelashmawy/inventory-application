import {
  FETCH_HISTORY_STARTED,
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const fetchOrdersHistory = () => (dispatch, getState) => {
  dispatch(fetchHistoryStarted());

  axios
    .get("/api/users/userOrdersHistory", tokenConfig(getState))
    .then(res => {
      dispatch(fetchHistorySuccess(res.data.allOrdersArray));
    })
    .catch(err => {
      dispatch(fetchHistoryFailure(err.response.data.message));
    });
};

const fetchHistoryStarted = () => {
  return {
    type: FETCH_HISTORY_STARTED
  };
};

const fetchHistorySuccess = historyOrders => {
  return {
    type: FETCH_HISTORY_SUCCESS,
    payload: { historyOrders }
  };
};

const fetchHistoryFailure = error => {
  return {
    type: FETCH_HISTORY_FAILURE,
    payload: { error }
  };
};
