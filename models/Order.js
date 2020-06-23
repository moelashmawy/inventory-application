const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "User" },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  shipper: { type: Schema.Types.ObjectId, ref: "Shipper" },
  payment: { type: Schema.Types.ObjectId, ref: "Payment" },
  price: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  shipDate: { type: Date, required: true }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
