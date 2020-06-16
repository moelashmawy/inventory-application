import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE } from "./../types";
import axios from "axios";

export const login = user => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/users/login", user)
      .then(res => {
        let user = res.data.user;
        let message = res.data.message;
        let token = res.data.token;
        dispatch(loginUserSuccess(user, message, token));
        resolve(message);
      })
      .catch(err => {
        let error = err.response.data.message;
        dispatch(loginUserFailure(error));
        reject(error);
      });
  });
};

const loginUserSuccess = (user, message, token) => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      user,
      message,
      token
    }
  };
};

const loginUserFailure = error => {
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      error
    }
  };
};
