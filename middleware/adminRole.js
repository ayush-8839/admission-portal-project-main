const jwt = require("jsonwebtoken");

const authRoles = (roles) =>{
    return (req,res) =>{
        if(!roles.includes(req.userData.role)){
            req.flash('errorr','Unauthorized user please login')
            res.redirect('/')
        }
        next()
    }
}

module.exports = authRoles