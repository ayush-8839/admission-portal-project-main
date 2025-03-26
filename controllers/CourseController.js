const CourseModel = require('../models/course')
const nodemailer = require("nodemailer")

class CourseController {

  static Courseinsert = async (req, res) => {
    try {
      const { id } = req.userData
      const { name, email, phone, dob, address, gender, education, course } = req.body
      const result = await CourseModel .create({
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course,
        user_id: id
      })
      this.sendEmail(name,email,course)
      res.redirect('/courseDisplay')
    } catch (error) {
      console.log(error)
    }
  }

  static courseDisplay = async (req, res) => {
    try {
      const { name, image, id } = req.userData
      const course = await CourseModel.find({ user_id: id })
      res.render('course/display', { n: name, i: image, c: course })
    } catch (error) {
      console.log(error)
    }
  }
  static courseView =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image ,role} = req.userData
        const data =await CourseModel.findById(req.params.id)
        //console.log(data)
        res.render('course/view',{n:name,i:image,d:data,r:role})
    }catch(error){
        console.log(error)
    }
}

static courseEdit =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image,role } = req.userData
        const data =await CourseModel.findById(req.params.id)
        //console.log(data)
        res.render('course/edit',{n:name,i:image,d:data,r:role})
    }catch(error){
        console.log(error)
    }
}

static courseUpdate =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const {name,email,phone,dob,address,gender,education,course} =req.body
        const { image } = req.userData
        await CourseModel.findByIdAndUpdate(req.params.id,{
            name:name,
            email:email,
            phone:phone,
            dob:dob,
            gender:gender,
            address:address,
            education:education,
            course:course
        })
        //console.log(data)
        req.flash('success', 'Course Update Successfully.')
        res.redirect('/courseDisplay')
    }catch(error){
        console.log(error)
    }
}

static courseDelete =async(req,res)=>{
    try{
        //console.log(req.params.id)
        const { name, image } = req.userData
        await CourseModel.findByIdAndDelete(req.params.id)
        //console.log(data)
        req.flash('success', 'Course Delete Successfully.')
        res.redirect('/courseDisplay')
    }catch(error){
        console.log(error)
    }
}

static sendEmail = async (name, email,course) => {
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
      subject: ` Course ${course}`, // Subject line
      text: "heelo", // plain text body
      html: `<b>${name}</b> Course  <b>${course}</b> insert successful! <br>
       `, // html body
  });
};
}
module.exports = CourseController