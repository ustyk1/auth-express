const User = require('./modules/User');
const Role = require('./modules/Role');
const bcrypt = require('bcrypt');

class authController {

  async registration(req, res) {
    try {
      //method http POST
      const {userName, surname, email, password, confirmPassword, sex, phone} = req.body;
      const condidate = await User.findOne({ email });
      
      if (condidate) {
        return res.status(400).json({ message: 'Користувач з такою поштою уже існує' })
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Confirm password doesn`t match' })
      }

      const hashPassword = bcrypt.hashSync(password, 8);

      // const userRole = await Role.findOne({value: 'USER'}); // шукаємо в базі 
      const userRole = await Role.findOne({ value: 'ADMINISTRATOR' }); // шукаємо в базі 

      const user = new User({
        userName, 
        surname,
        email,
        password: hashPassword, 
        confirmPassword: hashPassword,
        roles: [userRole.value],
        sex,
        phone
      });

      await user.save();

      return res.status(200).json({ message: 'Користувач успішно зареєстрований' })

    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Registration error' })
    }
  }

  async login(req, res) {
    try {
      
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(req, res) {
    try {
      // const userRole = new Role();
      // const adminRole = new Role({value: 'ADMINISTRATOR'});
      // await userRole.save();
      // await adminRole.save();

      res.json('server work')
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new authController();
