const express = require("express");
const FrontController = require("../controllers/FrontController");
const AdminController = require("../controllers/Admin/AdminController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const isLogin = require("../middleware/isLogin");
const adminRole = require("../middleware/adminRole");
const CourseController = require("../controllers/CourseController");
const ContactController = require("../controllers/admin/ContactController");
// const passport = require("passport");

// route.use(passport.initialize());
// route.use(passport.session());
// routing

route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/", isLogin, FrontController.login);
route.get("/register", FrontController.register);
route.get("/contact", checkAuth, FrontController.contact);

route.get("/form", FrontController.form);
route.get("/details", FrontController.displayformdetails);

//insert data
route.post("/insertStudent", FrontController.insertStudent);
route.post("/form", FrontController.insertform);
//verifyLogin
route.post("/verifyLogin", FrontController.verifyLogin);
route.get("/logout", FrontController.logout);
//profile and update password
route.get("/profile", checkAuth, FrontController.profile);
route.post("/changePassword", checkAuth, FrontController.changePassword);
route.post("/updateProfile", checkAuth, FrontController.updateProfile);

//AdminController

route.get(
  "/admin/dashboard",
  checkAuth,
  adminRole("admin"),
  AdminController.dashboard
);
route.get(
  "/admin/studentdisplay",
  checkAuth,
  adminRole("admin"),
  AdminController.displayStudent
);
route.get(
  "/admin/deleteStudent/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.deleteStudent
);
route.get(
  "/admin/viewStudent/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.viewStudent
);
route.get(
  "/admin/editStudent/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.editStudent
);

route.post(
  "/admin/StudentUpdate/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.studentUpdate
);
route.post(
  "/admin/insertStudent",
  checkAuth,
  adminRole("admin"),
  AdminController.studentInsert
);
route.get(
  "/admin/Coursedisplay",
  checkAuth,
  adminRole("admin"),
  AdminController.Coursedisplay
);
route.get(
  "/admin/Contactdisplay",
  checkAuth,
  adminRole("admin"),
  AdminController.Contactdisplay
);

route.post(
  "/admin/update_status/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.update_status
);
route.get(
  "/admin/profile",
  checkAuth,
  adminRole("admin"),
  AdminController.profile
);
route.post(
  "/admin/changePassword",
  checkAuth,
  adminRole("admin"),
  AdminController.changePassword
);
route.post(
  "/admin/updateProfile",
  checkAuth,
  adminRole("admin"),
  AdminController.updateProfile
);

//contactController
route.post("/insertcontact", ContactController.insertContact);

//CourseController
route.post("/course_insert", checkAuth, CourseController.Courseinsert);
route.get("/courseDisplay", checkAuth, CourseController.courseDisplay);
route.get("/courseView/:id", checkAuth, CourseController.courseView);
route.get("/courseEdit/:id", checkAuth, CourseController.courseEdit);
route.post("/courseUpdate/:id", checkAuth, CourseController.courseUpdate);
route.get("/courseDelete/:id", checkAuth, CourseController.courseDelete);

//Forgot Password
route.post("/forgot_Password", FrontController.forgetPasswordVerify);
route.get("/reset-password", FrontController.reset_Password);
route.post("/reset_Password1", FrontController.reset_Password1);

//verify mail
route.get("/verify", FrontController.verifyMail);

module.exports = route;