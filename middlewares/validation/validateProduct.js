const { body, validationResult } = require("express-validator");

// validate our user inputs for registration
exports.validateAdd = [
  //validate product that it's not empthy
  // then sanitize it with trima and escape
  body("name")
    .isLength({ min: 2 })
    .withMessage("Must be at least 2 letters")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Must be at least 10 letters")
    .trim()
    .escape(),
  body("category")
    .isLength({ min: 1 })
    .withMessage("This field is required")
    .trim()
    .escape(),
  body("price")
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 number")
    .isNumeric()
    .withMessage("Must be Numeric")
    .isInt({ gt: 0 })
    .withMessage("must be more than 0")
    .trim()
    .escape(),
  body("numberInStock")
    .isLength({ min: 1 })
    .withMessage("Must be at least 1 number")
    .isNumeric()
    .withMessage("Must be Numeric")
    .isInt({ gt: 0 })
    .withMessage("must be more than 0")
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
exports.validateUpdate = [
  //validate product that it's not empthy
  // then sanitize it with trima and escape
  body("name")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 letters")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10 })
    .withMessage("must be at least 10 letters")
    .trim()
    .escape(),
  body("category", "This field is required").isLength({ min: 1 }).trim().escape(),
  body("price")
    .isLength({ min: 1 })
    .withMessage("must be at least 1 number")
    .isNumeric()
    .withMessage("must be Numeric")
    .trim()
    .escape(),
  body("numberInStock")
    .isLength({ min: 1 })
    .withMessage("must be at least 1 number")
    .isNumeric({ gt: -1 })
    .withMessage("must be Numeric")
    .isInt({ gt: -1 })
    .withMessage("must be more than -1")
    .trim()
    .escape(),

  // after we validate the inputs we check for errors
  //if there are any. just throw them to the user
  // if no errors, call next, for the next middleware
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
