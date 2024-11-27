const express = require('express')
const FrontController = require('../controllers/FrontController')
const AdminController = require('../controllers/Admin/AdminController')
const route = express.Router()
const checkAuth=require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const ContactController = require('../controllers/admin/ContactController')

// routing

route.get('/home',checkAuth, FrontController.home)
route.get('/about',checkAuth, FrontController.about)
route.get('/',FrontController.login)
route.get('/register',FrontController.register)
route.get('/contact',checkAuth, FrontController.contact)

route.get('/form',FrontController.form)
route.get('/details',FrontController.displayformdetails)

//insert data
route.post('/insertStudent', FrontController.insertStudent)
route.post('/form', FrontController.insertform)
//verifyLogin
route.post('/verifyLogin',FrontController.verifyLogin)
route.get('/logout',FrontController.logout)
//profile and update password
route.get('/profile',checkAuth,FrontController.profile)
route.post('/changePassword',checkAuth,FrontController.changePassword)
route.post('/updateProfile',checkAuth,FrontController.updateProfile)


//AdminController

route.get('/admin/dashboard',checkAuth, AdminController.dashboard)
route.get('/admin/studentdisplay',checkAuth,AdminController.displayStudent)
route.get('/admin/deleteStudent/:id',checkAuth, AdminController.deleteStudent)
route.get('/admin/viewStudent/:id',checkAuth,AdminController.viewStudent)
route.get('/admin/editStudent/:id',checkAuth,AdminController.editStudent)

route.post('/admin/StudentUpdate/:id',checkAuth, AdminController.studentUpdate)
route.post('/admin/insertStudent',checkAuth, AdminController.studentInsert)
route.get('/admin/Coursedisplay',checkAuth, AdminController.Coursedisplay)
route.post('/admin/update_status/:id',checkAuth, AdminController.update_status)

//contactController
route.post("/insertcontact", ContactController.insertContact);

//CourseController
route.post('/course_insert',checkAuth,CourseController.Courseinsert)
route.get('/courseDisplay',checkAuth,CourseController.courseDisplay)
route.get("/courseView/:id",checkAuth,CourseController.courseView)
route.get("/courseEdit/:id",checkAuth,CourseController.courseEdit)
route.post("/courseUpdate/:id",checkAuth,CourseController.courseUpdate)
route.get("/courseDelete/:id",checkAuth,CourseController.courseDelete)

module.exports = route