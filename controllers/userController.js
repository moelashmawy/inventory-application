const User = require("./../models/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// handle post requests at "api/users/signup"
exports.createUser = (req, res) => {
  // create a new user after validating and sanitzing
  // the user is a customer by default and can update himself to seller
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    isAdmin: false,
    isSeller: false,
    isCustomer: true,
    isShipper: false,
    isRestricted: false
  });

  // 1- Check is the username is taken
  checkUsernameTaken();
  // 2- Check is the email name is taken
  // 3- verify the password
  // 4- encrypt the password and save the new user

  // 1- check if the Username is already taken
  // throw a message to the user if so
  function checkUsernameTaken() {
    User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
      if (err) {
        return res.status(400).json({
          message: "Error getting username"
        });
      } else if (userWithSameUsername) {
        return res.status(400).json({ message: "Username is taken" });
      } else {
        checkEmailTaken();
      }
    });
  }
  // 2- check if the email address is already taken
  // throw a message to the user if so
  function checkEmailTaken() {
    User.findOne({ email: req.body.email }, (err, userWithSameEmail) => {
      if (err) {
        res.status(400).json({
          message: "Error getting email try gain"
        });
      } else if (userWithSameEmail) {
        res.status(400).json({ message: "This email is taken" });
      } else {
        verifyPassword();
      }
    });
  }

  // 3- verify the Password the user entered
  function verifyPassword() {
    if (req.body.password !== req.body.verifyPassword) {
      res.status(400).json({
        message: "Passwords don't match"
      });
    } else {
      encryptDataAndSave();
    }
  }

  // 4- encrypt the password using bcryptjs and save the new user with hashed pass
  const encryptDataAndSave = function () {
    //create slat and hash
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;

      // hash the password along with our new salt
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;

        // override the cleartext password in the user with the hashed one
        newUser.password = hash;

        // if the email and the username are available, create a new user
        // with the hashed password and save it
        newUser
          .save()
          .then(user => {
            generateNewToken(user);
          })
          .catch(err => {
            res.status(400).json({
              message: "Error registering",
              err
            });
          });
      });
    });
  };

  // generate and json token and send it with the user
  function generateNewToken(user) {
    jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isCustomer: user.isCustomer,
        isShipper: user.isShipper,
        isRestricted: user.isRestricted
      },
      jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        else
          res.json({
            token,
            message: "Registered Succefully",
            user: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              gender: user.gender,
              nationality: user.nationality,
              birthDate: user.birthDate,
              creationDate: user.creationDate,
              isAdmin: user.isAdmin,
              isSeller: user.isSeller,
              isCustomer: user.isCustomer,
              isShipper: user.isShipper,
              isRestricted: user.isRestricted,
              cart: user.cart,
              wishList: user.cart
            }
          });
      }
    );
  }
};

// handle POST request at "api/users/login"
exports.login = (req, res) => {
  User.findOne({ username: req.body.username }).exec((err, foundUser) => {
    if (err) {
      res.json(err);
    }
    if (!foundUser) {
      res.status(400).json({ message: "Invalid username" });
    }
    // compare the encryptic password with the entered password
    else {
      comparePassword(foundUser);
    }

    // compare the encrypted password with one the user provided
    function comparePassword(user) {
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        // if the password doesn't match, return a message
        if (!isMatch) {
          return res.status(400).json({
            message: "Invalid password"
          });
          // if it matches generate a new token and send everything is json
        } else {
          generateNewToken(user);
        }
      });
    }

    // generate new token with the new data
    function generateNewToken(user) {
      jwt.sign(
        {
          id: user.id,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          isCustomer: user.isCustomer,
          isShipper: user.isShipper,
          isRestricted: user.isRestricted
        },
        jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) res.json({ err });
          else {
            res.json({
              token,
              message: "Logged in Succefully",
              user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                nationality: user.nationality,
                birthDate: user.birthDate,
                creationDate: user.creationDate,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
                isCustomer: user.isCustomer,
                isShipper: user.isShipper,
                isRestricted: user.isRestricted
              }
            });
          }
        }
      );
    }
  });
};

// handle get request at "/api/users/user"
exports.getUser = (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
};

// handle PUT at api/users/edit_account to edit user data
exports.editUser = (req, res) => {
  User.findById(req.user.id, (err, userToUpdate) => {
    if (err) {
      res.status(400).json({ message: "Error getting user try gain" });
    } else {
      //create user with the new data
      let updatedUser = {
        password: req.body.password ? req.body.password : userToUpdate.password,
        firstName: req.body.firstName ? req.body.firstName : userToUpdate.firstName,
        lastName: req.body.lastName ? req.body.lastName : userToUpdate.lastName,
        email: req.body.email ? req.body.email : userToUpdate.email,
        gender: req.body.gender ? req.body.gender : userToUpdate.gender,
        nationality: req.body.nationality
          ? req.body.nationality
          : userToUpdate.nationality,
        birthDate: req.body.birthDate ? req.body.birthDate : userToUpdate.birthDate,
        isSeller: req.body.isSeller ? req.body.isSeller : userToUpdate.isSeller
      };

      // get the old email and check if it's the same as the user provided
      // if it's the same, the user can update the rest of the information
      // if it isn't the same so we check in the database if there's the same email
      // so we don't duplicate 2 users with the same email
      if (userToUpdate.email === req.body.email) {
        // check if the Username is already taken in case we want to edit it
        // throw a message to the user if so
        User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
          if (err) {
            res.status(400).json({
              message: "Error getting username"
            });
          } else if (userWithSameUsername) {
            res.status(400).json({
              message: "Username is taken"
            });
          } else {
            //check is the 2 passwords match
            if (req.body.password !== req.body.verifyPassword) {
              return res.status(400).json({ message: "Password doesn't match" });
            }
            // generate a hashed password
            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;
              // if the user doesn't change the password we keep updating without touching the password
              if (req.body.password === "") {
                User.findByIdAndUpdate(req.user.id, updatedUser, {
                  new: true,
                  useFindAndModify: false
                })
                  .select("-password")
                  .then(user => {
                    // in case the user switched the account to a seller account
                    // we need to generate a new token with the new seller auth
                    jwt.sign(
                      {
                        id: user.id,
                        isAdmin: user.isAdmin,
                        isSeller: user.isSeller,
                        isCustomer: user.isCustomer,
                        isShipper: user.isShipper,
                        isRestricted: user.isRestricted
                      },
                      jwtSecret,
                      { expiresIn: 3600 },
                      (err, token) => {
                        if (err) throw err;
                        res.status(200).json({
                          token,
                          message: "Account settings updated",
                          user
                        });
                      }
                    );
                  })
                  .catch(err => {
                    res.status(400).json({
                      message: "Couldn't update",
                      err
                    });
                  });
                // if the user changes the password we hash the new password
                // and change its value in the new user object with data
              } else {
                bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                  if (err) throw err;

                  updatedUser.password = hash;

                  User.findByIdAndUpdate(req.user.id, updatedUser, {
                    new: true,
                    useFindAndModify: false
                  })
                    .select("-password")
                    .then(user => {
                      // in case the user switched the account to a seller account
                      // we need to generate a new token with the new seller auth
                      jwt.sign(
                        {
                          id: user.id,
                          isAdmin: user.isAdmin,
                          isSeller: user.isSeller,
                          isCustomer: user.isCustomer,
                          isShipper: user.isShipper,
                          isRestricted: user.isRestricted
                        },
                        jwtSecret,
                        { expiresIn: 3600 },
                        (err, token) => {
                          if (err) throw err;
                          res.status(200).json({
                            token,
                            message: "Account settings updated",
                            user
                          });
                        }
                      );
                    })
                    .catch(err => {
                      res.status(400).json({
                        message: "Couldn't update",
                        err
                      });
                    });
                });
              }
            });
          }
        });
      } else {
        //check if the 2 passwords match
        if (req.body.password !== req.body.verifyPassword) {
          return res.status(400).json({ message: "Password doesn't match" });
        }

        // if the email the user provided doesn't match the one in the DB
        // we check if the email address is already taken
        User.findOne({ email: req.body.email }, (err, userWithSameEmail) => {
          if (err) {
            res.status(400).json({
              message: "Error getting email try gain"
            });
          } else if (userWithSameEmail) {
            res.status(400).json({ message: "This email is taken" });
          } else {
            // check if the Username is already taken in case we want to edit it
            // throw a message to the user if so
            User.findOne({ username: req.body.username }, (err, userWithSameUsername) => {
              if (err) {
                res.status(400).json({
                  message: "Error getting username"
                });
              } else if (userWithSameUsername) {
                res.status(400).json({ message: "Username is taken" });
              } else {
                bcrypt.genSalt(10, (err, salt) => {
                  if (err) throw err;

                  // if the user doesn't change the password we jeep updating without touching the password
                  if (req.body.password === "") {
                    User.findByIdAndUpdate(req.user.id, updatedUser, {
                      new: true,
                      useFindAndModify: false
                    })
                      .select("-password")
                      .then(user => {
                        // in case the user switched the account to a seller account
                        // we need to generate a new token with the new seller auth
                        jwt.sign(
                          {
                            id: user.id,
                            isAdmin: user.isAdmin,
                            isSeller: user.isSeller,
                            isCustomer: user.isCustomer,
                            isShipper: user.isShipper,
                            isRestricted: user.isRestricted
                          },
                          jwtSecret,
                          { expiresIn: 3600 },
                          (err, token) => {
                            if (err) throw err;
                            res.status(200).json({
                              token,
                              message: "Account settings updated",
                              user
                            });
                          }
                        );
                      })
                      .catch(err => {
                        res.status(400).json({
                          message: "Couldn't update",
                          err
                        });
                      });
                    // if the user changes the password we hash the new password
                    // and change its value in the new user object with data
                  } else {
                    bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                      if (err) throw err;

                      updatedUser.password = hash;

                      User.findByIdAndUpdate(req.user.id, updatedUser, {
                        new: true,
                        useFindAndModify: false
                      })
                        .select("-password")
                        .then(user => {
                          // in case the user switched the account to a seller account
                          // we need to generate a new token with the new seller auth
                          jwt.sign(
                            {
                              id: user.id,
                              isAdmin: user.isAdmin,
                              isSeller: user.isSeller,
                              isCustomer: user.isCustomer,
                              isShipper: user.isShipper,
                              isRestricted: user.isRestricted
                            },
                            jwtSecret,
                            { expiresIn: 3600 },
                            (err, token) => {
                              if (err) throw err;
                              res.status(200).json({
                                token,
                                message: "Account settings updated",
                                user
                              });
                            }
                          );
                        })
                        .catch(err => {
                          res.status(400).json({
                            message: "Couldn't update",
                            err
                          });
                        });
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
};
