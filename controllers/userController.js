const User = require("./../models/UsersModel");

const { body, validationResult } = require("express-validator");
const { json } = require("express");

exports.createUser = [
    // validate our user inputs
    body("username")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 charachers")
        .trim()
        .escape(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("must be at least 8 charachers")
        .trim()
        .escape(),
    body("name")
        .isLength({ min: 2 })
        .withMessage("must be at least 2 charachers")
        .trim()
        .escape(),
    body("email").isEmail().withMessage("isn't vaild").trim().escape(),

    // continue the proccess after validation
    (req, res) => {
        const errors = validationResult(req);

        // create a new user after validating and sanitzing
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email
        });

        // check if the validation passes, if not
        // return a json respond with an error message
        if (!errors.isEmpty()) {
            console.log(errors);

            let field = errors.errors[0].param;
            let message = errors.errors[0].msg;
            let errorMessage = field + " " + message;

            res.status(400).json({ message: errorMessage, errors: errors });
        } else {
            // check if the email address was is already taken
            // throw a message to the user if so
            User.findOne({ email: req.body.email }, (err, foundUser) => {
                if (err) {
                    console.log(err);

                    res.status(400).json({
                        message: "Error getting email try gain"
                    });
                } else if (foundUser) {
                    res.status(400).json({ message: "This email is taken" });
                } else {
                    // if the email isn't taken before create a new user
                    newUser
                        .save()
                        .then(user => {
                            res.status(200).json({
                                message: "Registered Succefully",
                                user
                            });
                        })
                        .catch(err => {
                            res.status(400).json({
                                message: "Error registering",
                                err
                            });
                        });
                }
            });
        }
    }
];
