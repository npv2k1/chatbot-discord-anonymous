const mongoose = require("mongoose");

// require("dotenv").config();

// mongoose options
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};

// mongodb environment variables
const { MONGO_HOSTNAME, MONGO_DB, MONGO_PORT } = process.env;

const dbConnectionURL = {
  LOCAL_DB_URL: `mongodb://localhost/tbot`,
  REMOTE_DB_URL: process.env.MONGODB_URI, //atlas url
};
mongoose.connect(dbConnectionURL.LOCAL_DB_URL, options,(err)=>{
    if(err) console.log("DataBase error");
    console.log("connected to database")
});
module.exports = mongoose
