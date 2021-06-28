const mongoose = require("./connect.js");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  discordid: {
    type: String,
    require: true,
  },
  match: {
    type: Boolean,
    default: false,
  },
  matchid: {
    type: String,
    default: '',
  },
  role: {
    type: Number,
    default: 2,
  },
});
// tạo model
const Users = mongoose.model("users", usersSchema);

module.exports = Users;
