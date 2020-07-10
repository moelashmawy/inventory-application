const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShipperSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  company: { type: String },
  area: { type: String },
  phone: { type: String },
  isActiveShipper: { type: Boolean }
});

const Shipper = mongoose.model("Shipper", ShipperSchema);
module.exports = Shipper;
