const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    email: { type: String }
});

const Users = mongoose.model("User", UserSchema);
module.exports = Users;
