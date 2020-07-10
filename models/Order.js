const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderDate: { type: Date, default: Date.now },
  shippedDate: { type: Date },
  deliveredDate: { type: Date },
  products: { type: Array, default: [] },
  totalPrice: { type: Number },
  address: { type: Schema.Types.ObjectId, ref: "Address" }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
