const express = require('express');
const mongoose = require('mongoose');
let async = require('async')
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');

// hanle GET request at /api/category to get all the categories
exports.categoryIndex = (req, res) => {
    Category.find()
        .then(category => res.json(category))
}

//handle POST reqest at /api/category/create to create a new category
exports.createCategory = (req, res, next) => {
    const newCategory = new Category({
        name: req.body.name,
        description: req.body.description
    });

    newCategory.save()
        .then(() => res.redirect(newCategory.url))
        .catch(err => res.json(err))
}

// handle GET request at /api/category/:id to get one category
exports.categoryDetails = function (req, res) {
    async.parallel({
        category: function (callback) {
            Category.findById(req.params.id)
                .exec(callback)
        },
        product: function (callback) {
            Product.find({ 'category': req.params.id })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) {
            return res.json(err)
        } else {
            return res.json(results)
        }
    })
}

// handle DELETE request at /api/category/:id/delete
exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: `Category was deleted Succefully` }))
        .catch(err => res.json(err))
}

//handle PUT request at /api/category/:id/update to update a category with id
exports.updateCategory = (req, res) => {
    Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, useFindAndModify: false })
        .then(product => res.json(product))
        .catch(err => res.json(err))
}

