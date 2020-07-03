const User = require("./../models/UsersModel");
const Product = require("./../models/ProductModel");
const Address = require("./../models/Addresses");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { v4: uuidv4 } = require("uuid");

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
  body("firstName").isLength({
    min: 2
  }),
  body("lastName")
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
              // the user is a customer by default and can update himself to seller
              const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                isAdmin: false,
                isSeller: false,
                isCustomer: true
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
                        {
                          id: user.id,
                          isAdmin: user.isAdmin,
                          isSeller: user.isSeller,
                          isCustomer: user.isCustomer
                        },
                        config.get("jwtSecret"),
                        { expiresIn: 3600 },
                        (err, token) => {
                          if (err) throw err;
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
                              cart: user.cart,
                              wishList: user.cart
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
exports.login = [
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

  (req, res, next) => {
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
              {
                id: user.id,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
                isCustomer: user.isCustomer
              },
              config.get("jwtSecret"),
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
                      cart: user.cart,
                      wishList: user.cart
                    }
                  });
                }
              }
            );
          }
        });
    });
  }
];

// handle get request at "/api/users/user"
exports.getUser = (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
};

// handle PUT at api/users/edit_account to edit user data
exports.editUser = [
  // validate our user inputs
  body("password")
    .isLength({
      min: 8
    })
    .withMessage("must be at least 8 characters")
    .trim()
    .escape(),
  body("firstName")
    .isLength({
      min: 2
    })
    .trim()
    .escape(),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("email").isEmail().withMessage("isn't vaild").trim().escape(),
  body("gender").optional().trim().escape(),
  body("nationality").optional().trim().escape(),
  body("birthDate").optional().trim().escape(),
  body("isSeller").optional().isBoolean().trim().escape(),

  // proceed with the operation
  (req, res) => {
    console.log(req.user);

    User.findById(req.user.id, (err, userToUpdate) => {
      if (err) {
        res.status(400).json({ message: "Error getting user try gain" });
      } else {
        //create user with the new data
        let updatedUser = {
          password: req.body.password === "" ? userToUpdate.password : req.body.password,
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
                          isCustomer: user.isCustomer
                        },
                        config.get("jwtSecret"),
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
                            isCustomer: user.isCustomer
                          },
                          config.get("jwtSecret"),
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
          //check is the 2 passwords match
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
              User.findOne(
                { username: req.body.username },
                (err, userWithSameUsername) => {
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
                                isCustomer: user.isCustomer
                              },
                              config.get("jwtSecret"),
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
                                  isCustomer: user.isCustomer
                                },
                                config.get("jwtSecret"),
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
                }
              );
            }
          });
        }
      }
    });
  }
];

// handle get request at "/api/users/user"
exports.addToCart = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    let duplicate = false;

    user.cart.forEach(item => {
      if (item._id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user.id, "cart._id": req.query.productId },
        { $inc: { "cart.$.orderQuantity": 1 } },
        { new: true, useFindAndModify: false },
        (err, user) => {
          if (err) {
            res.status(400).json({ message: "Couldn't add, Please try again later" });
          } else {
            res.status(200).json({ user, message: "Added to cart" });
          }
        }
      );
    } else if (err) res.status(400).json({ message: "Couldn't find Item" });
    else {
      User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            cart: {
              _id: req.query.productId,
              orderQuantity: 1,
              orderState: {
                pending: true,
                shipped: false,
                delivered: false,
                returned: false
              }
            }
          }
        },
        { new: true, useFindAndModify: false },
        (err, user) => {
          if (err) return res.json({ message: "couldn't add", err });
          res.status(200).json({ user, message: "Added to cart" });
        }
      );
    }
  });
};

// handle GET at api/users/userCartInfo
exports.userCartInfo = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      res.status(400).json({ message: "Couldn't get user" }, err);
    } else {
      // get the cart from the user
      let cart = user.cart;

      let array = cart.map(item => {
        return item._id;
      });

      Product.find({ _id: { $in: array } })
        .sort({ _id: 1 })
        .exec((err, cartDetails) => {
          if (err) {
            res.status(400).json({ message: "Couldn't get cart", err });
          } else {
            res.status(200).json({ message: "User cart info", cart, cartDetails });
          }
        });
    }
  });
};

//handle GET at api/users/removeFromCart?productId=
exports.removeFromCart = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { cart: { _id: req.query.productId } } },
    { new: true, useFindAndModify: false },
    (err, userInfo) => {
      if (err) {
        res.status(400).json({ message: "Couldn't get cart", err });
      } else {
        let cart = userInfo.cart;

        let array = cart.map(item => {
          return item._id;
        });

        Product.find({ _id: { $in: array } }).exec((err, cartDetails) => {
          if (err) {
            res.status(400).json({ message: "Couldn't get cart", err });
          } else {
            res.status(200).json({ message: "deleted successfully", cart, cartDetails });
          }
        });
      }
    }
  );
};

//handle POST at api/users/addresses?action=add to add a new address
exports.addAddress = [
  // validate our user inputs
  body("firstName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address1")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address2").optional().trim().escape(),
  body("country")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("state")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("city")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("street")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("building").optional().trim().escape(),
  body("floor").optional().trim().escape(),
  body("apartment").optional().trim().escape(),
  body("phoneNumber")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("postalCode")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("isPrimary")
    .optional()
    .isBoolean()
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),

  // continue the proccess after validation
  (req, res, next) => {
    if (req.query.action !== "add") {
      return next();
    }
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
      // create new Address with the validated data
      const newAddress = new Address({
        user: req.user.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address1: req.body.address1,
        address2: req.body.address2,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        building: req.body.building,
        floor: req.body.floor,
        apartment: req.body.apartment,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
        isPrimary: false
      });

      newAddress
        .save()
        .then(address => {
          res.status(200).json({ message: "Address added", address });
        })
        .catch(err => {
          res.status(400).json({ message: "Couldn't add address", err });
        });
    }
  }
];

//handle POST at api/users/addresses?action=add to add a new address
exports.editAddress = [
  // validate our user inputs
  body("firstName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("lastName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address1")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 charachers")
    .trim()
    .escape(),
  body("address2").optional().trim().escape(),
  body("country")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("state")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("city")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("street")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("building").optional().trim().escape(),
  body("floor").optional().trim().escape(),
  body("apartment").optional().trim().escape(),
  body("phoneNumber")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("postalCode")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),
  body("isPrimary")
    .optional()
    .isBoolean()
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
    .trim()
    .escape(),

  // continue the proccess after validation
  (req, res, next) => {
    // check the req query action equlas edit to proceseed with the operation
    if (req.query.action !== "edit") return next();

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
      Address.findById(req.query.address, (err, address) => {
        if (err) res.status(400).json({ message: "couldn't find address", err });
        else {
          Address.findByIdAndUpdate(
            req.query.address,
            { $set: req.body },
            {
              new: true,
              useFindAndModify: false
            }
          )
            .then(address => {
              res.status(200).json({ message: "Updated Successfully", address });
            })
            .catch(err => {
              res.status(400).json({ message: "Couldn't update", err });
            });
        }
      });
    }
  }
];

// handle DELETE api/users/addresses?action=delete&address=12313123123
exports.deleteAddress = (req, res, next) => {
  if (req.query.action !== "delete") return next();

  Address.findByIdAndDelete(req.query.address)
    .then(address => {
      res.status(200).json({ message: "Deleted Successfully", address });
    })
    .catch(err => {
      res.status(400).json({ message: "Couldn't delete", err });
    });
};

// handle GET api/users/addresses to get user addresses
exports.getAddresses = (req, res) => {
  Address.find({ user: req.user.id })
    .then(address => {
      res.status(200).json({ message: "user addresses", address });
    })
    .catch(err => {
      res.status(400).json({ message: "Couldn't get addresses", err });
    });
};

// handle get request at "/api/users/addToWishlist?productId="
exports.addToWishlist = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    let duplicate = false;

    user.wishList.forEach(item => {
      if (item.id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      res.status(400).json({ message: "You already added this item" });
    } else if (err) res.status(400).json({ message: "Couldn't find Item" });
    else {
      User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            wishList: {
              id: req.query.productId,
              date: Date.now()
            }
          }
        },
        { new: true, useFindAndModify: false },
        (err, user) => {
          if (err) return res.json({ message: "couldn't add", err });
          res.status(200).json({ user, message: "Added to your wish list" });
        }
      );
    }
  });
};

// handle GET at api/users/userWishlist
exports.userWishlist = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      res.status(400).json({ message: "Couldn't get user" }, err);
    } else {
      let wishList = user.wishList;

      let array = wishList.map(item => {
        return item.id;
      });

      Product.find({ _id: { $in: array } })
        .sort({ _id: 1 })
        .exec((err, wishListItems) => {
          if (err) {
            res.status(400).json({ message: "Couldn't get wishlist", err });
          } else {
            res
              .status(200)
              .json({ message: "User wishlist info", wishList, wishListItems });
          }
        });
    }
  });
};

//handle GET at api/users/removeFromWishlist?productId=12313213213
exports.removeFromWishlist = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { wishList: { id: req.query.productId } } },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.status(400).json({ message: "Couldn't get wish List", err });
      } else {
        let wishList = user.wishList;
        let array = wishList.map(item => {
          return item.id;
        });

        Product.find({ _id: { $in: array } }).exec((err, wishListItems) => {
          if (err) {
            res.status(400).json({ message: "Couldn't get cart", err });
          } else {
            res
              .status(200)
              .json({ message: "Deleted successfully", wishList, wishListItems });
          }
        });
      }
    }
  );
};

//handle GET at api/users/orderSuccess to finish the order and move the cart to history
let orderId = 4000;
exports.orderSuccess = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) res.status(400).json({ message: "Couldn't find user", err });
    else {
      // get the cart from the user
      let cartInfo = user.cart;

      // if the cart is empty throw a message to the user telling him the cart is empty
      if (cartInfo.length == 0)
        return res.status(400).json({ message: "Your cart is empty" });

      // everytime we make an order we increase the order id by one
      orderId++;

      // Then we need to notify each seller about the purchased products
      // we have the cart informations about each product and quantity
      // 1- go to each item the user purchased
      // 2- find its seller
      // 3- edit the seller's ordersToDeliver
      // by adding the products and amount
      cartInfo.forEach(item => {
        Product.findOne({ _id: item._id })
          .populate("seller", "ordersToDeliver")
          .exec((err, product) => {
            if (err) {
              res.status(400).json({ message: "Couldn't get items", err });
            } else {
              User.findOneAndUpdate(
                { _id: product.seller._id },
                { $push: { ordersToDeliver: item } },
                { new: true, useFindAndModify: false },
                (err, productSeller) => {
                  if (err) {
                    return res.status(400).json({
                      message: "Couldn't update orders to deliver",
                      err
                    });
                  }
                }
              );
            }
          });
      });

      // we need to decreament the item's number in stock
      cartInfo.forEach(item => {
        Product.updateOne(
          { _id: item._id },
          {
            $inc: {
              numberInStock: -item.orderQuantity
            }
          },
          { new: true },
          (err, item) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "Couldn't decrease item's quantity", err });
            }
          }
        );
      });

      //if the cart isn't empty
      // we will make each order as an object,
      // so we can add id and purchase date to each order
      let newOrder = {};
      newOrder.products = cartInfo;
      newOrder.dateOfPurchase = Date.now();
      newOrder.orderId = orderId;

      // 1- find the user who will place the order
      // 2- push the cart items to his history and empty the cart
      // 3- decrease each product the user purchased by the quantity
      User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { history: newOrder },
          $set: { cart: [] }
        },
        { new: true, useFindAndModify: false },
        (err, user) => {
          if (err) res.status(400).json({ message: "Couldn't complete order", err });
          else {
            res.status(200).json({ message: "Order completed successfully", user });
          }
        }
      );
    }
  });
};

//handle GET at api/users/userOrdersHistory to finish the order and move the cart to history
exports.userOrdersHistory = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) res.status(400).json({ message: "Couldn't find user", err });
    else {
      // get the history from the user which is array of objects
      let history = user.history; //[ { 0, [{},{}] },{ 1, [{}] } ]

      let ordersArrayLength = history.length;
      let orderCurrIndex = 0;
      let productCurrIndex = 0;
      let allOrdersArray = [];

      //  [ { id=0, products=[{},{}] },{ id=1, products=[{}] } ]
      history.forEach(order => {
        order.products.forEach(singleItem => {
          // singleOrderObject = { id=0, products=[{_id, Q}, {_id, Q}] }
          let singleOrderProductsLength = order.products.length; //2

          Product.findOne({ _id: singleItem._id })
            .populate("seller", "username")
            .exec(function (err, product) {
              if (err) {
                res.status(400).json({
                  message: "Couldn't get cart",
                  err
                });
              } else {
                singleItem.product = product.toJSON();
                ++productCurrIndex;

                if (productCurrIndex == singleOrderProductsLength) {
                  allOrdersArray.push(order);
                  ++orderCurrIndex;
                  productCurrIndex = 0;
                }
                if (orderCurrIndex == ordersArrayLength) {
                  res.status(200).json({ message: "Finally all orders", allOrdersArray });
                }
              }
            });
        });
      });
    }
  });
};

//handle GET at api/users/ordersToDeliver to all seller's orders to be delivered
exports.ordersToDeliver = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) res.status(400).json({ message: "Couldn't find user", err });
    else {
      // get the ordersToDeliver from the user which is array of products info objects
      let orders = user.ordersToDeliver; //[ { },{ } ]

      let ordersArrayLength = orders.length;
      let productCurrIndex = 0;
      let ordersToDeliver = [];

      // will iterate through the whole products info
      // so we get each item details and combine the 2 objects
      orders.forEach(order => {
        Product.findOne({ _id: order._id }).exec(function (err, product) {
          if (err || ordersArrayLength == 0) {
            res.status(400).json({
              message: "No items to deliver",
              err
            });
          } else {
            order.product = product.toJSON();
            ordersToDeliver.push(order);
            ++productCurrIndex;

            if (productCurrIndex == ordersArrayLength) {
              res
                .status(200)
                .json({ message: "All the orders to deliver", ordersToDeliver });
            }
          }
        });
      });
    }
  });
};
