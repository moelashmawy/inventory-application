/**
 * This function to Setup config/headers and token
 * it gets the token from our main state and attach it to the header
 */
export const tokenConfig = (getState, optionalParams = null) => {
  // Get token from localstorage
  const token = getState().userrr.token;

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
