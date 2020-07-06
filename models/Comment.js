//todo

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  details: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
