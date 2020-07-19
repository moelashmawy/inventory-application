/**
 * This function to Setup config/headers and token
 * it gets the token from our main state and attach it to the header
 */
export const tokenConfig = (getState = null, optionalParams = null) => {
  // Get token from localstorage
  const token = getState ? getState().userrr.token : null;

  const config = {
    headers: {
      "Content-type": "application/json"
    },
    params: {}
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  if (optionalParams) {
    config.params = optionalParams;
  }

  return config;
};
