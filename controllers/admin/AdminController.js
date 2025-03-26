const CourseModel = require("../../models/course");
const UserModel = require("../../models/user");
const nodemailer = require('nodemailer');

class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("admin/dashboard", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static displayStudent = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const data = await UserModel.find();
      //console.log(data)

      res.render("admin/displaystudent", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static deleteStudent = async (req, res) => {
    try {
      //console.log(req.params.id)
      await UserModel.findByIdAndDelete(req.params.id);
      res.redirect("/admin/studentdisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static viewStudent = async (req, res) => {
    try {
      const data = await UserModel.findById(req.params.id);
      //console.log(data)

      res.render("admin/view", { view: data });
    } catch (error) {
      console.log(error);
    }
  };
  static editStudent = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await UserModel.findById(id);
      //console.log(data)

      res.render("admin/edit", { edit: data });
    } catch (error) {
      console.log(error);
    }
  };
  static studentUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, password } = req.body;
      await UserModel.findByIdAndUpdate(id, {
        name,
        email,
        password,
      });

      res.redirect("/admin/studentdisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static studentInsert = async (req, res) => {
    try {
      //console.log(req.body)

      const { name, email, password } = req.body;
      await UserModel.create({
        name,
        email,
        password,
      });

      res.redirect("/admin/studentdisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static Coursedisplay = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const course = await CourseModel.find();
      //console.log(course)

      res.render("admin/Coursedisplay", { c: course, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static Contactdisplay = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const course = await CourseModel.find();
      //console.log(course)

      res.render("admin/Coursedisplay", { c: course, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static update_status = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, course, status, comment } = req.body;
      await CourseModel.findByIdAndUpdate(id, {
        status,
        comment,
      });
      this.sendEmail(name, email, course, comment, status);
      res.redirect("/admin/Coursedisplay");
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
      res.redirect("/admin/profile");
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
          res.redirect("/admin/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/admin/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/admin/profile");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/admin/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, email, image } = req.userData;
      res.render("admin/profile", { n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, course, comment, status) => {
   // console.log(name, email, course, comment, status);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "ayushsharma8739@gmail.com",
        pass: "prze tskb jwco fcno",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: ` Course ${course}`, // Subject line
      text: "heelo", // plain text body
      html: `<b>${name}</b> Course  <b>${course}</b> <b> ${status}</b><br> successful! </br><b> ${comment} </br>
         `, // html body
    });
  };
}
module.exports = AdminController;
