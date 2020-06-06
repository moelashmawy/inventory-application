const express = require("express");
const mongoose = require("mongoose");
let async = require("async");
const { body, validationResult } = require("express-validator");
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

// hanle GET request at /api/category to get all the categories
exports.categoryIndex = (req, res) => {
    Category.find().then(category => res.json(category));
};

//handle POST reqest at /api/category/create to create a new category
// we will pass an array of funtions as a middleware
exports.createCategory = [
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

    // Continue process after validation
    (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a newCategory object with escaped and trimmed data if it's valid
        let newCategory = new Category({
            name: req.body.name,
            description: req.body.description
        });

        // if there are errors send them as json
        if (!errors.isEmpty()) {
            res.json(errors);
        } else {
            // Check if Category with same name already exists.
            Category.findOne({
                name: req.body.name
            }).exec(function (err, found_category) {
                if (err) {
                    return next(err);
                }

                if (found_category) {
                    // Category exists, redirect to its page
                    res.redirect(found_category.url);
                } else {
                    newCategory.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        // Category saved. Redirect to its page.
                        res.redirect(newCategory.url);
                    });
                }
            });
        }
    }
];

// handle GET request at /api/category/:id to get one category
exports.categoryDetails = function (req, res) {
    async.parallel(
        {
            category: function (callback) {
                Category.findById(req.params.id).exec(callback);
            },
            product: function (callback) {
                Product.find({
                    category: req.params.id
                }).exec(callback);
            }
        },
        function (err, results) {
            if (err) {
                return res.json(err);
            } else {
                return res.json(results);
            }
        }
    );
};

// handle DELETE request at /api/category/:id/delete
exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(() =>
            res.json({
                message: `Category was deleted Succefully`
            })
        )
        .catch(err => res.json(err));
};

//handle POST request at /api/category/:id/update to update a category with id
// will pass an array of functions as a middlware
exports.updateCategory = [
    // validate that the name is not empthy and have at least 2 letters
    // then sanitize and clear it with trim and escape
    body("name")
        .isLength({ min: 2 })
        .withMessage("Must be at least 2 letters")
        .trim()
        .escape(),

    // validate that the description is not empthy and have at least 10 letters
    // then sanitize and clear it with trim and escape
    body("description")
        .isLength({ min: 10 })
        .withMessage("Must be at least 10 letters")
        .trim()
        .escape(),

    //continue process after validation
    (req, res) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // create clear updatedCategory after sanitization
        let updatedCategory = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });
        // if there are errors send them as json
        if (!errors.isEmpty()) {
            res.json(errors);
        } else {
            Category.findByIdAndUpdate(req.params.id, updatedCategory, {
                new: true,
                useFindAndModify: false
            })
                .then(cat => res.json(cat))
                .catch(err => res.json(err));
        }
    }
];
