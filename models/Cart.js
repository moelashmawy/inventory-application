const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
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
