const CourseModel = require("../models/course");
const nodemailer = require("nodemailer");

class CourseController {
  static Courseinsert = async (req, res) => {
    try {
      const { id } = req.userData;
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      const result = await CourseModel.create({
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course,
        user_id: id,
      });
      this.sendEmail(name, email, course);
      res.redirect("/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };

  static courseDisplay = async (req, res) => {
    try {
      const { name, image, id } = req.userData;
      const course = await CourseModel.find({ user_id: id });
      res.render("course/display", { n: name, i: image, c: course });
    } catch (error) {
      console.log(error);
    }
  };
  static courseView = async (req, res) => {
    try {
      //console.log(req.params.id)
      const { name, image, role } = req.userData;
      const data = await CourseModel.findById(req.params.id);
      //console.log(data)
      res.render("course/view", { n: name, i: image, d: data, r: role });
    } catch (error) {
      console.log(error);
    }
  };

  static courseEdit = async (req, res) => {
    try {
      //console.log(req.params.id)
      const { name, image, role } = req.userData;
      const data = await CourseModel.findById(req.params.id);
      //console.log(data)
      res.render("course/edit", { n: name, i: image, d: data, r: role });
    } catch (error) {
      console.log(error);
    }
  };

  static courseUpdate = async (req, res) => {
    try {
      //console.log(req.params.id)
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      const { image } = req.userData;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        education: education,
        course: course,
      });
      //console.log(data)
      req.flash("success", "Course Update Successfully.");
      res.redirect("/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };

  static courseDelete = async (req, res) => {
    try {
      //console.log(req.params.id)
      const { name, image } = req.userData;
      await CourseModel.findByIdAndDelete(req.params.id);
      //console.log(data)
      req.flash("success", "Course Delete Successfully.");
      res.redirect("/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, course) => {
    //console.log(name,email,course)
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
      subject: ` Course ${course} Application Status Update`, // Subject line
      text: "hello", // plain text body

      if(Status = "Approved") {
        html: `Dear [<b>${name}</b>],

               We hope this email finds you well.

               We are writing to inform you of the status of your application for the Course  <b>${course}</b> program at <b>Amity University Madhtya Pradesh</b>.

              [Your Application Status: <b>${Status}</b>
 
              We are pleased to inform you that your application has been <b>${Status}</b>. Please find the enclosed documents regarding the next steps in the admission process, including important dates and deadlines.`;
      },
      if(Status = "rejected") {
        html: `Dear [<b>${name}</b>],
              
              We regret to inform you that your application has not been selected for admission at this time.

               We thank you for your interest in Amity University, Madhya Pradesh and wish you all the best in your future endeavors.

               Sincerely,
               Swapnil Agrawal
               Amity University, Madhya Pradesh
               8839728739`;
      },
    });
  };
}
module.exports = CourseController;
