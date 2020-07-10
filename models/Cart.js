const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalPrice: { type: Number },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
      shipper: { type: Schema.Types.ObjectId, ref: "Shipper" },
      orderState: {
        pending: { type: Boolean },
        shipped: { type: Boolean },
        delivered: { type: Boolean },
        returned: { type: Boolean },
        refunded: { type: Boolean }
      }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);
