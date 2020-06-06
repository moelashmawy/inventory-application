const express = require("express");
const mongoose = require("mongoose");
let async = require("async");
const { body, sanitizeBody, validationResult } = require("express-validator");
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

// hanle GET request at /api/category to get all the categories
exports.categoryIndex = (req, res) => {
    Category.find().then(category => res.json(category));
};

//handle POST reqest at /api/category/create to create a new category
exports.createCategory = [
    // Validate that the name field is not empty and minimum length 2
    //and Sanitize (trim) the field so it's clear to be inserted
    body("name", "category name required").isLength({ min: 2 }).trim().escape(),

    // Validate that the description field is not empty and minimum length 2
    //and Sanitize (trim) the field so it's clear to be inserted
    body("description", "category description required")
        .isLength({ min: 10 })
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

//handle PUT request at /api/category/:id/update to update a category with id
exports.updateCategory = [
    body("name").isLength({ min: 2 }).trim().escape(),

    body("description").isLength({ min: 10 }).trim().escape(),

    (req, res) => {
        const errors = validationResult(req);

        let updatedCategory = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

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
