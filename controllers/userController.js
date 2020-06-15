const User = require("./../models/UsersModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// handle post requests at "api/users/signup"
exports.createUser = [
  // validate our user inputs
  body("username")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("password")
    .isLength({
      min: 8
    })
    .withMessage("must be at least 8 characters")
    .trim()
    .escape(),
  body("name")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("email").isEmail().withMessage("isn't vaild").trim().escape(),

  // continue the proccess after validation
  (req, res) => {
    const errors = validationResult(req);

    // check if the validation passes, if not
    // return a json respond with an error message
    if (!errors.isEmpty()) {
      let field = errors.errors[0].param;
      let message = errors.errors[0].msg;
      let errorMessage = field + " " + message;

      res.status(400).json({
        message: errorMessage,
        errors: errors
      });
    } else {
      // check if the email address is already taken
      // throw a message to the user if so
      User.findOne({ email: req.body.email }, (err, userWithSameEmail) => {
        if (err) {
          res.status(400).json({ message: "Error getting email try gain" });
        } else if (userWithSameEmail) {
          res.status(400).json({ message: "This email is taken" });
        } else {
          // check if the Username is already taken
          // throw a message to the user if so
          User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
            if (err) {
              res.status(400).json({ message: "Error getting username" });
            } else if (userWithSameUsername) {
              res.status(400).json({ message: "Username is taken" });
            } else {
              // create a new user after validating and sanitzing
              const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                email: req.body.email
              });

              // encrypt the password using bcryptjs
              //create slat and hash
              bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;

                // hash the password along with our new salt
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;

                  // override the cleartext password in the user with the hashed one
                  newUser.password = hash;

                  // if the email and the username are available, create a new user
                  // with the hashed password
                  newUser
                    .save()
                    .then(user => {
                      // generate and json token and send it with the user
                      jwt.sign(
                        { id: user.id },
                        config.get("jwtSecret"),
                        { expiresIn: 3600 },
                        (err, token) => {
                          if (err) throw err;
                          res.json({
                            token,
                            message: "Registered Succefully",
                            user: {
                              id: user.id,
                              name: user.name,
                              email: user.email
                            }
                          });
                        }
                      );
                    })
                    .catch(err => {
                      res.status(400).json({
                        message: "Error registering",
                        err
                      });
                    });
                });
              });
            }
          });
        }
      });
    }
  }
];

// handle POST request at "api/users/login"
exports.login = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.json(err);
    }
    if (!user) {
      res.status(400).json({ message: "Invalid username" });
    }
    // compare the encryptic password with the entered password
    else
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        // if the password doesn't match, return a message
        if (!isMatch) {
          return res.status(400).json({
            message: "Invalid password"
          });
          // if it matches return a json with some data
        } else {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                message: "Logged in Succefully",
                user: {
                  id: user.id,
                  name: user.name,
                  username: user.username,
                  email: user.email
                }
              });
            }
          );
        }
      });
  });
};

// handle get request at "/api/users/user"
exports.getUser = (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
};
