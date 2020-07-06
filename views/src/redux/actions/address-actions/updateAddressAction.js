import { EDIT_ADDRESS_SUCCESS, EDIT_ADDRESS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const editAddress = (address, id) => (dispatch, getState) => {
  let params = {
    action: "edit",
    address: id
  };
  // Hit /api/address/addresses?action=edit&address=id
  return new Promise((resolve, reject) => {
    axios
      .put("/api/address", address, tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let address = res.data.address;
        dispatch(editAddressSuccess(address, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(editAddressFailure(error.response.data.message));
        reject(error.response.data.message);
      });
  });
};

const editAddressSuccess = (address, successMessage) => {
  return {
    type: EDIT_ADDRESS_SUCCESS,
    payload: {
      address,
      successMessage
    }
  };
};

const editAddressFailure = error => {
  return {
    type: EDIT_ADDRESS_FAILURE,
    payload: {
      error
    }
  };
};
