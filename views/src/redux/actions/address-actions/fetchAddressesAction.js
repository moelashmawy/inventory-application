import {
  FETCH_ADDRESSES_STARTED,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE
} from "../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";

export const fetchAddresses = () => {
  return (dispatch, getState) => {
    dispatch(fetchAddressesStarted());
    axios
      .get("/api/address", tokenConfig(getState))
      .then(res => {
        dispatch(fetchAddressesSuccess(res.data.address));
      })
      .catch(err => {
        dispatch(fetchAddressesFailure(err.message));
      });
  };
};

const fetchAddressesStarted = () => {
  return {
    type: FETCH_ADDRESSES_STARTED
  };
};

const fetchAddressesSuccess = addresses => {
  return {
    type: FETCH_ADDRESSES_SUCCESS,
    payload: {
      addresses
    }
  };
};

const fetchAddressesFailure = error => {
  return {
    type: FETCH_ADDRESSES_FAILURE,
    payload: {
      error
    }
  };
};
