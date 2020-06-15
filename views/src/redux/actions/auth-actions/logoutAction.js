import { LOGOUT_USER_SUCCESS } from "./../types";

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT_USER_SUCCESS });
};
