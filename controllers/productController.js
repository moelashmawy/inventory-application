const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/ProductModel');

// handle GET request at /api/product to get list of all products
exports.productIndex = (req, res, next) => {
    Product.find()
        .then(product => res.json(product))
}

// Multer handling image upload Middleware at /api/product/create
exports.handleImages = function () {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });
    const upload = multer({ storage });

    return upload.single('productImage')
}

// handle POST request at /api/product/create to create a new product
exports.createProduct = (req, res, next) => {
    const newProduct = new Product(
        {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            productImage: req.file.path
        });

    newProduct.save()
        .then(product => res.redirect(product.url))
        .catch(err => res.json(err))
}

// handle GET request at /api/product/:id to get details for a specific product
exports.productDetails = (req, res) => {
    Product.findById(req.params.id)
        .populate('category')
        .exec(function (err, result) {
            if (err) {
                res.json(err.message)
            } else {
                res.json(result)
            }
        })
}

// handle DELETE request at /api/product/:id/delete to delete an item by its id
exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json({ message: `item ${req.params.id} was deleted` })
        }
    })
}

// handle POST request at /api/product/:id/update to update an item
exports.updateProduct = (req, res, next) => {
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.file.path
    }

    Product.findByIdAndUpdate(req.params.id, { $set: updatedProduct }, { new: true, useFindAndModify: false })
        .then(product => res.redirect(product.url))
        .catch(err => res.json(err))
}