import { ADD_ADDRESS_SUCCESS, ADD_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const addAddress = address => (dispatch, getState) => {
  let params = { action: "add" };
  //api/address?action=add
  return new Promise((resolve, reject) => {
    axios
      .post("/api/address", address, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let address = res.data.address;
        dispatch(addAddressSuccess(address, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(addAddressFailure(error.response.data.message));
        reject(error.response.data.message);
      });
  });
};

const addAddressSuccess = (address, successMessage) => {
  return {
    type: ADD_ADDRESS_SUCCESS,
    payload: {
      address,
      successMessage
    }
  };
};

const addAddressFailure = error => {
  return {
    type: ADD_ADDRESS_FAILURE,
    payload: {
      error
    }
  };
};
