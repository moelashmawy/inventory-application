const { body, validationResult } = require("express-validator");

// validate our user inputs for registration
exports.validateAdd = [
  // Validate that the name field is not empty and minimum length 2
  //and Sanitize (trim) the field so it's clear to be inserted
  body("name")
    .isLength({ min: 2 })
    .withMessage("Must be at least 2 letters")
    .trim()
    .escape(),

  // Validate that the description field is not empty and minimum length 2
  //and Sanitize (trim) the field so it's clear to be inserted
  body("description")
    .isLength({ min: 10 })
    .withMessage("Must be at least 10 letters")
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
  // validate that the field aren't empty with a min letters
  // then sanitize and clear it with trim and escape
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
