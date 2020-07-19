const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

// Creating our Product Schema with it's elements
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number, required: true },
  productImage: { type: Array, required: true, default: [] },
  creationDate: { type: Date, default: Date.now }
});

ProductSchema.virtual("url").get(function () {
  return "/product/" + this._id;
});

// will use mongoose-paginate plugin to retrieve data when make pagination
ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
