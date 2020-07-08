const { body, validationResult } = require("express-validator");

// validate our user inputs for registration
exports.validateRegister = [
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

  // after we validate the inputs we check for errors
  //if there are any. just throw them to the user
  // if no errors, call next, for the next middleware
  (req, res, next) => {
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
      next();
    }
  }
];

// validate our user inputs for registration
exports.validateLogin = [
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

  // after we validate the inputs we check for errors
  //if there are any. just throw them to the user
  // if no errors, call next, for the next middleware
  (req, res, next) => {
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
      next();
    }
  }
];

// validate our user inputs for registration
exports.validateEditUser = [
  // validate our user inputs
  body("password").optional().trim().escape(),
  body("firstName")
    .isLength({
      min: 2
    })
    .withMessage("must be at least 2 characters")
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

  // after we validate the inputs we check for errors
  //if there are any. just throw them to the user
  // if no errors, call next, for the next middleware
  (req, res, next) => {
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
      next();
    }
  }
];
