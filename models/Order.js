const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number },
  shipper: { type: Schema.Types.ObjectId, ref: "Shipper" },
  sellerId: { type: Schema.Types.ObjectId, ref: "User" },
  orderState: {
    pending: { type: Boolean, default: true },
    shipped: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
    returned: { type: Boolean, default: false },
    refunded: { type: Boolean, default: false }
  }
}, { _id: false });

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderDate: { type: Date, default: Date.now },
  shippedDate: { type: Date },
  deliveredDate: { type: Date },
  products: { type: [OrderItemSchema], default: [] },
  totalPrice: { type: Number },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  addressState: { type: String }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
