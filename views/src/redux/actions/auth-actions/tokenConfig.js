/**
 * This function to Setup config/headers and token
 * it gets the token from our main state and attach it to the header
 */
export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().userrr.token;

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
