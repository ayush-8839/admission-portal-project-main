const ContactModel = require('../../models/contact');

class ContactController {
  static insertContact = async (req, res) => {
    try {
        const {name,email,phone,message} = req.body
        await ContactModel.create({
          name,
          email,
          phone,
          message
        })
        res.redirect('/contact')
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = ContactController;