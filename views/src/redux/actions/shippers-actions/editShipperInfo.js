import { EDIT_SHIPPERS_SUCCESS, EDIT_SHIPPERS_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const editShipperInfo = newShipper => (dispatch, getState) => {
  // Hit /api/permissions/addShipperInfo
  return new Promise((resolve, reject) => {
    axios
      .put("/api/permissions/addShipperInfo", newShipper, tokenConfig(getState))
      .then(res => {
        let successMessage = res.data.message;
        let shipper = res.data.shipper;
        dispatch(editShipperInfoSuccess(shipper, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(editShipperInfoFailure(error.response.data.message));
        reject(error.response.data.message);
      });
  });
};

const editShipperInfoSuccess = (shipper, successMessage) => {
  return {
    type: EDIT_SHIPPERS_SUCCESS,
    payload: {
      shipper,
      successMessage
    }
  };
};

const editShipperInfoFailure = error => {
  return {
    type: EDIT_SHIPPERS_FAILURE,
    payload: {
      error
    }
  };
};
