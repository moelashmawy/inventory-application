import { DELETE_ADDRESS_SUCCESS, DELETE_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const deleteAddress = addressId => (dispatch, getState) => {
  // request quert params attached to the req header
  let params = { action: "delete", address: addressId };

  return new Promise((resolve, reject) => {
    // Hit /api/address?action=delete&address=addressId
    axios
      .delete("/api/address", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let address = res.data.address;
        dispatch(deleteAddressSuccess(address, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(deleteAddressFailure(error.response.data.message));
        reject(error.response.data.message);
      });
  });
};

const deleteAddressSuccess = (address, successMessage) => {
  return {
    type: DELETE_ADDRESS_SUCCESS,
    payload: {
      address,
      successMessage
    }
  };
};

const deleteAddressFailure = error => {
  return {
    type: DELETE_ADDRESS_FAILURE,
    payload: {
      error
    }
  };
};
