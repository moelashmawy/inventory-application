const Shipper = require("./../models/Shipper");
const User = require("./../models/UsersModel");

const mongoose = require("mongoose");

// handle get request at api/permissions/allUsers;
exports.getAllUsers = (req, res) => {
  User.find({ username: { $nin: ["admin"] } })
    .sort({ creationDate: -1 })
    .select("-password")
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.json(err);
    });
};

// handle get request at api/permissions/allShippers;
exports.getAllShippers = (req, res) => {
  Shipper.find()
    .populate("user")
    .then(shippers => {
      res.status(200).json({ shippers });
    })
    .catch(err => {
      res.json(err);
    });
};

//handle GET at /api/permissions/addShipper to finish the order and move the cart to history
exports.addShipper = (req, res) => {
  let shipperId = req.body.shipperId;
  let isShipper = req.body.isShipper; //comes from frontend

  //create new Shipper
  let newShipper = new Shipper({
    user: shipperId,
    isActiveShipper: true
  });

  //if isShipper true means we wanna allow the user to be a shipper
  if (isShipper == "true") {
    updateOrCreateShipper();
  } else {
    //if false
    deactivateShipper();
  }

  function updateOrCreateShipper() {
    // 1- we check in our collection for existing shipper
    Shipper.findOne({ user: shipperId }, (err, foundShipper) => {
      // 2- check if the user is already a shipper and active
      if (foundShipper && foundShipper.isActiveShipper == true) {
        res.status(400).json({
          message: "The user is already a shipper"
        });

        // 3- if the shipper is deactevated and we wanna active him again
      } else if (foundShipper && foundShipper.isActiveShipper == false) {
        // Change user state (isShipper) to false
        User.findOneAndUpdate(
          { _id: shipperId },
          { $set: { isShipper: true } },
          { new: true, useFindAndModify: false }
        ).then(user => {
          foundShipper.isActiveShipper = true;

          foundShipper.save().then(shipper => {
            res.status(200).json({
              message: "The user is shipper again",
              user
            });
          });
        });

        // 4- if there shipper doesn't exist, create new one
      } else {
        // Change user state (isShipper) to false
        User.findOneAndUpdate(
          { _id: shipperId },
          { $set: { isShipper: true } },
          { new: true, useFindAndModify: false }
        ).then(user => {
          newShipper
            .save()
            .then(shipper => {
              res.status(200).json({
                message: "The user is shipper now",
                user
              });
            })
            .catch(err => res.status(400).json(err));
        });
      }
    });
  }

  // this function to deactivate the user in User and Shipper collections
  function deactivateShipper() {
    // Change user state (isShipper) to false
    User.findOneAndUpdate(
      { _id: shipperId },
      { $set: { isShipper: false } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      //if isShipper false, then we wanna deactivate that shipper
      Shipper.findOneAndUpdate(
        { user: shipperId },
        { $set: { isActiveShipper: false } },
        { new: true, useFindAndModify: false }
      ).then(shipper => {
        res.status(200).json({
          message: "User isn't shipper anymore",
          user
        });
      });
    });
  }
};

// to handle put at /api/permissions/addShipperInfo to add the shipper's info
exports.addShipperInfo = (req, res) => {
  let shipperId = req.body.shipperId;

  let shipperArea = req.body.area;
  let shipperPhone = req.body.phone;
  let shipperCompany = req.body.company;

  Shipper.findByIdAndUpdate(
    shipperId,
    {
      $set: { area: shipperArea, company: shipperCompany, phone: shipperPhone }
    },
    { new: true, useFindAndModify: false }
  )
    .populate("user")
    .exec((err, shipper) => {
      if (err) {
        res.status(400).json({ message: "Couldn't update shipper", err });
      } else {
        res.status(200).json({ message: "Updated Info", shipper });
      }
    });
};

//handle Put at /api/permissions/addAdmin to add admin permissions to any user
exports.addAdmin = (req, res) => {
  let adminId = req.body.adminId;
  let isAdmin = req.body.isAdmin; //comes from frontend

  //if isAdmin true means we wanna allow the user to be an admin
  if (isAdmin == "true") {
    // Change user state (isAdmin) to true
    User.findOneAndUpdate(
      { _id: adminId },
      { $set: { isAdmin: true } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "Added as admin",
        user
      });
    });
  } else {
    //if false, set isAdmin to false
    // Change user state (isAdmin) to true
    User.findOneAndUpdate(
      { _id: adminId },
      { $set: { isAdmin: false } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "Admin is removed",
        user
      });
    });
  }
};

//handle Put at /api/permissions/restrictUser to finish the order and move the cart to history
exports.restrictUser = (req, res) => {
  let userId = req.body.userId;
  let isRestricted = req.body.isRestricted; //comes from frontend

  //if isRestricted true means we wanna allow the user to be an admin
  if (isRestricted == "true") {
    // Change user state (isRestricted) to true
    User.findOneAndUpdate(
      { _id: userId },
      { $set: { isRestricted: true } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "User Restricted",
        user
      });
    });
  } else {
    //if false, set isRestricted to false
    // Change user state (isRestricted) to true
    User.findOneAndUpdate(
      { _id: userId },
      { $set: { isRestricted: false } },
      { new: true, useFindAndModify: false }
    ).then(user => {
      res.status(200).json({
        message: "User is un Restricted",
        user
      });
    });
  }
};
