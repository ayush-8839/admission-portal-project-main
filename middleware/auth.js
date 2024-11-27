const jwt = require("jsonwebtoken");
const UserModel = require('../models/user')

const checkAuth =async (req, res, next) => {
  // console.log("hello auth")
  const { token } = req.cookies;
  // console.log(token)
  if (!token) {
    req.flash("error", "Unauthorised user please login");
    res.redirect("/");
  } else {
    const verifyLogin = jwt.verify(token, "ayushshshgftrfgdbgzxzd");
    //console.log(verifyLogin)
    const data = await UserModel.findOne({_id:verifyLogin.ID})
    //console.log(data)
    req.userData =data
    next(); // next method rout par pahucvha dega
  }
};

module.exports = checkAuth;
