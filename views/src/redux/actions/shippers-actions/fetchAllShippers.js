import {
  FETCH_SHIPPERS_STARTED,
  FETCH_SHIPPERS_SUCCESS,
  FETCH_SHIPPERS_FAILURE
} from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

// to fetch each user's all orders he placed
export const fetchAllShippers = () => (dispatch, getState) => {
  dispatch(fetchShippersStarted());

  axios
    .get("/api/permissions/allShippers", tokenConfig(getState))
    .then(res => {
      let shippers = res.data.shippers;
      dispatch(fetchShippersSuccess(shippers));
    })
    .catch(err => {
      dispatch(fetchShippersFailure(err.response.data.message));
    });
};

const fetchShippersStarted = () => {
  return {
    type: FETCH_SHIPPERS_STARTED
  };
};

const fetchShippersSuccess = shippers => {
  return {
    type: FETCH_SHIPPERS_SUCCESS,
    payload: { shippers }
  };
};

const fetchShippersFailure = error => {
  return {
    type: FETCH_SHIPPERS_FAILURE,
    payload: { error }
  };
};
