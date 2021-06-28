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
  LOCAL_DB_URL: `mongodb://localhost/testsss`,
  REMOTE_DB_URL: process.env.MONGO_URI, //atlas url
};
console.log("dbConnectionURL :>> ", dbConnectionURL);
if (dbConnectionURL.REMOTE_DB_URL) {
  mongoose.connect(dbConnectionURL.REMOTE_DB_URL, options, (err) => {
    if (err) console.log("DataBase error");
    console.log("connected to remote database");
  });
} else {
  mongoose.connect(dbConnectionURL.LOCAL_DB_URL, options, (err) => {
    if (err) console.log("DataBase error");
    console.log("connected to local database");
  });
}

module.exports = mongoose;
