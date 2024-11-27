const UserModel = require("../models/user");
const TeacherModel = require("../models/teacher");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const CourseModel = require("../models/course");
const jwt = require("jsonwebtoken");

//Setup
cloudinary.config({
  cloud_name: "dnglhx5tt",
  api_key: "723695369565341",
  api_secret: "JUf4hz8hf6TImRqldLOkEh-I7xc",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, email, image, id } = req.userData;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        e: email,
        i: image,
        btech: btech,
        bca: bca,
        mca: mca,
      }); // home.ejs file
    } catch (error) {
      console.log(error);
    }
  };

  static form = async (req, res) => {
    try {
      res.render("form");
    } catch (error) {
      console.log(error);
    }
  };

  static insertform = async (req, res) => {
    try {
      //console.log(req.body)
      const { name, email, password, confirmpassword } = req.body;
      await TeacherModel.create({
        name,
        email,
        password,
      });
      res.redirect("/");
    } catch (error) {
      console.log("error");
    }
  };
  static displayformdetails = async (req, res) => {
    try {
      const data = await TeacherModel.find();
      res.render("formdeatails", { data });
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("login", {
        msg1: req.flash("success"),
        msg: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  //insert data
  static insertStudent = async (req, res) => {
    try {
      //form ka data check karte hai
      // console.log(req.body)
      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        req.flash("error", "Please fill All Fields");
        return res.redirect("/register");
      }
      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "this email already register");
        return res.redirect("/register");
      }

      if (password != confirmpassword) {
        req.flash("error", "Password does not matched");
        return res.redirect("/register");
      }
      //console.log(req.files)
      //image upload
      const file = req.files.image;
      //console.log(file)
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload);

      const hashPassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashPassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });

      req.flash("success", "Register Success ! Please login");
      res.redirect("/"); //route ke web ke liye redirect use hota hai
    } catch (error) {
      console.log(error);
    }
  };

  static verifyLogin=async (req,res)=>{
    try {
      // 
      const {email,password }=req.body;
      if (email && password) {
        const user=await UserModel.findOne({email: email})
        if (user != null) {
           const isMatched=await bcrypt.compare(password,user.password)
          //  console.log(isMatched)   
           if (isMatched) {
            if(user.role == "admin"){
              //token create
          var jwt = require('jsonwebtoken');
          let token=jwt.sign({ID:user.id},'ayushshshgftrfgdbgzxzd')
          //console.log(token)middleware
          res.cookie('token',token)
          res.redirect('/admin/dashboard')
          }
          if(user.role == "student"){
              //token create
          var jwt = require('jsonwebtoken');
          let token=jwt.sign({ID:user.id},'ayushshshgftrfgdbgzxzd')
          //console.log(token)middleware
          res.cookie('token',token)
          res.redirect('/home')
          }
            
           } else {
            req.flash('error','Email or password is not valid')
            return res.redirect('/')
           }
          
        } else {
          req.flash('error','you are not a register user');
          return res.redirect('/');
          
        }
        
      } else {
        req.flash('error','All fields Required');
        return res.redirect('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  //profile
  static profile = async (req, res) => {
    try {
      const { name, email, image } = req.userData;
      res.render("profile", { n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userData;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { id } = req.Udata;
      console.log(req.body);
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
    if (user.role == "admin") {
      //token create
      var jwt = require("jsonwebtoken");
      let token = jwt.sign({ ID: user.id }, "klsahkohoikaniahoh");
      //console.log(token)middleware
      res.cookie("token", token);
      res.redirect("/admin/dashboard");
    }
    if (user.role == "student") {
      //token create
      var jwt = require("jsonwebtoken");
      let token = jwt.sign({ ID: user.id }, "klsahkohoikaniahoh");
      //console.log(token)middleware
      res.cookie("token", token);
      res.redirect("/home");
    }
  };
}
module.exports = FrontController;
