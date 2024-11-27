const CourseModel = require('../../models/course');
const UserModel= require('../../models/user')

class AdminController{
  
  static dashboard=async(req,res)=>{
    try{
      const { name, image } = req.userData;
       res.render('admin/dashboard',{n:name,i:image})
    }catch(error){
        console.log(error)
    }
  }
  static displayStudent=async(req,res)=>{
    try{
      const{name,image} = req.userData
      const data= await UserModel.find()
      //console.log(data)

       res.render('admin/displaystudent',{d:data,n:name,i:image})
    }catch(error){
        console.log(error)
    }
  }

  static deleteStudent=async (req,res)=>{
    try{
      //console.log(req.params.id)
      await UserModel.findByIdAndDelete(req.params.id)
      res.redirect('/admin/studentdisplay')
    }catch(error){
      console.log(error)
    }
  }
  static viewStudent=async(req,res)=>{
    try{
      const data= await UserModel.findById(req.params.id)
      //console.log(data)

       res.render('admin/view',{view:data})
    }catch(error){
        console.log(error)
    }
  }
  static editStudent=async(req,res)=>{
    try{
      const id=req.params.id;
      const data= await UserModel.findById(id)
      //console.log(data)

       res.render('admin/edit',{edit:data})
    }catch(error){
        console.log(error)
    }
  }
  static studentUpdate=async(req,res)=>{
    try{
      const id=req.params.id;
      const {name,email,password}=req.body
      await UserModel.findByIdAndUpdate(id,{
        name,
        email,
        password
      })

      res.redirect('/admin/studentdisplay')
    }catch(error){
        console.log(error)
    }
  }
  static studentInsert=async(req,res)=>{
    try{
      //console.log(req.body)
      
      const {name,email,password}=req.body
      await UserModel.create({
        name,
        email,
        password
      })

       res.redirect('/admin/studentdisplay',)
    }catch(error){
        console.log(error)
    }
  }
  static Coursedisplay =async(req,res)=>{
    try{
      const {name, image} = req.userData;
      const course = await CourseModel.find()
      //console.log(course)

       res.render('admin/Coursedisplay',{c:course, n:name, i:image});
    }catch(error){
        console.log(error)
    }
  }
  static update_status=async(req,res)=>{
    try{
      const id=req.params.id;
      const {name,email,status,comment}=req.body
      await CourseModel.findByIdAndUpdate(id,{
        status,
        comment
      })

      res.redirect('/admin/Coursedisplay')
    }catch(error){
        console.log(error)
    }
  }
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
      console.log(req.body)
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
  };
}
module.exports=AdminController