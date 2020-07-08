const Address = require("./../models/Addresses");
const { body, validationResult } = require("express-validator");

//handle POST at api/users/addresses?action=add to add a new address
exports.addAddress = (req, res, next) => {
  if (req.query.action !== "add") {
    return next();
  }

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
};

//handle POST at api/users/addresses?action=add to add a new address
exports.editAddress = (req, res, next) => {
  // check the req query action equlas edit to proceseed with the operation
  if (req.query.action !== "edit") return next();

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
};

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
