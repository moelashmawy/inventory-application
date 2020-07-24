const { body, validationResult } = require("express-validator");

// validate our user inputs for registration
exports.validateOrderQuantity = [
  body("orderQuantity")
    .isNumeric()
    .isInt({ gt: 0 })
    .withMessage("must be more than 0")
    .isLength({
      min: 1
    })
    .withMessage("must be at least 1 charachers")
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
