const mongoose = require("mongoose");

const connectDB = () => {
  return mongoose.connect("mongodb://127.0.0.1:27017/admissionPortal")

    .then(() => {
      console.log("connect db"); 
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = connectDB;
