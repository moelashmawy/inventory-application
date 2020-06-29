import { UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from "./../types";
import axios from "axios";
import { tokenConfig } from "./tokenConfig";

export const editUser = user => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .put("/api/users/edit_account", user, tokenConfig(getState))
      .then(res => {
        const user = res.data.user;
        const message = res.data.message;
        const token = res.data.token;

        dispatch(updateUserSuccess(user, message, token));
        resolve(message);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(updateUserFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const updateUserSuccess = (user, message, token) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: {
      user,
      message,
      token
    }
  };
};

const updateUserFailure = error => {
  return {
    type: UPDATE_USER_FAILURE,
    payload: {
      error
    }
  };
};
