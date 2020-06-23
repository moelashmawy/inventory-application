const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShipperSchema = new Schema({
  compoany: { type: String, required: true },
  Phone: { type: Number, required: true }
});

const Shipper = mongoose.model("Shipper", ShipperSchema);
module.exports = Shipper;
