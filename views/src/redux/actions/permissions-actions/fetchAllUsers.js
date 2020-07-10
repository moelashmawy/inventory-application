import {
  FETCH_ALL_USERS_STARTED,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAILURE
} from "./../types";
import { tokenConfig } from "./../auth-actions/tokenConfig";
import axios from "axios";

export const fetchAllUsers = () => (dispatch, getState) => {
  dispatch(fetchAllUsersStarted());

  axios
    .get("/api/permissions/allUsers", tokenConfig(getState))
    .then(res => {
      let users = res.data.users;
      dispatch(fetchAllUsersSuccess(users));
    })
    .catch(err => {
      dispatch(fetchAllUsersFailure(err.response.data.message));
    });
};

const fetchAllUsersStarted = () => {
  return {
    type: FETCH_ALL_USERS_STARTED
  };
};

const fetchAllUsersSuccess = allUsers => {
  return {
    type: FETCH_ALL_USERS_SUCCESS,
    payload: { allUsers }
  };
};

const fetchAllUsersFailure = error => {
  return {
    type: FETCH_ALL_USERS_FAILURE,
    payload: { error }
  };
};
