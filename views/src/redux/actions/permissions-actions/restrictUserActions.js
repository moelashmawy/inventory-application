import { STRICT_USER_SUCCESS, STRICT_USER_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const restrictUserPermission = (userId, isRestricted = null) => (
  dispatch,
  getState
) => {
  return new Promise((resolve, reject) => {
    //let params = { userId, isRestricted };
    axios
      //api/permissions/restrictUser?userId=
      .put(
        "/api/permissions/restrictUser",
        { userId, isRestricted },
        tokenConfig(getState)
      )
      .then(res => {
        let successMessage = res.data.message;
        let user = res.data.user;

        dispatch(strictUserPermissionSuccess(user, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(strictUserPermissionFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const strictUserPermissionSuccess = (user, message) => {
  return {
    type: STRICT_USER_SUCCESS,
    payload: { user, message }
  };
};

const strictUserPermissionFailure = error => {
  return {
    type: STRICT_USER_FAILURE,
    payload: { error }
  };
};
