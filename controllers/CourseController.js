const CourseModel = require('../models/course')
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
}
module.exports = CourseController