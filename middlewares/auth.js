const config = require("config");
const jwt = require("jsonwebtoken");

/**
 * this method to fetch the token from the frontend
 * the token will be attached to the header
 * and if it's availble we attach the token to the req.user
 */
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  // check for token
  if (!token)
    return res.status(401).json({ message: "Authorization denied, please login" });

  try {
    //verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // add user from token payload which contains the user id we attached to the token
    req.user = decoded;

    next();
  } catch (e) {
    res.status(400).json({ message: "Token isn't valid" });
  }
};

module.exports = auth;
