import { REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS } from "./../types";
import axios from "axios";

export const registerNewUser = user => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/users/signup", user)
      .then(res => {
        const user = res.data.user;
        const message = res.data.message;
        const token = res.data.token;

        dispatch(registerUserSuccess(user, message, token));
        resolve(message);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;

        dispatch(registerUserFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const registerUserSuccess = (user, successMessage, token) => {
  return {
    type: REGISTER_USER_SUCCESS,
    payload: {
      user,
      successMessage,
      token
    }
  };
};

const registerUserFailure = error => {
  return {
    type: REGISTER_USER_FAILURE,
    payload: {
      error
    }
  };
};
