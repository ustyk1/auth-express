const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');

const generateeAccessToken = ({id, email, firstName, roles, sex, phone}) => {
  const payload = {
    id,
    email,
    firstName,
    roles,
    sex,
    phone
  }
  return jwt.sign(payload, jwtSecret, {expiresIn: '1h'})
}

class authController {

  async registration(req, res) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.json({ message: 'Помилка валідації', errors: result.array() });
      }
      
      const {firstName, lastName, email, password, confirmPassword, sex, phone} = req.body;
      const candidate = await User.findOne({ email });
      
      if (candidate) {
        return res.status(400).json({ message: 'Користувач з такою поштою уже існує' })
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Confirm password doesn`t match' })
      }

      const hashPassword = bcrypt.hashSync(password, 8);

      // const userRole = await Role.findOne({value: 'USER'}); // шукаємо в базі
      const userRole = await Role.findOne({ value: 'ADMINISTRATOR' }); // шукаємо в базі

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
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
      const {email, password} = req.body;
      
      const user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({ message: `Користувача за поштою ${email} не знайдено` })
      }

      const isValidPassword = bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Невірний логін або пароль' });
      }

      const userDto = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        roles: user.roles,
        sex: user.sex,
        phone: user.phone
      }
      const token = generateeAccessToken(userDto);
      return res.json({token});

    } catch (error) {
      console.log(error);
      return res.status(400).json({message: 'Помилка входу'})
    }
  }

  async getUsers(req, res) {
    try {
      // const userRole = new Role();
      // const adminRole = new Role({value: 'ADMINISTRATOR'});
      // await userRole.save();
      // await adminRole.save();

      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      const result = await User.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        res.status(400).json({message: 'Користувача не знайдено'})
      }

      res.status(200).json(result);
    } catch (error) {
      console.log(error)
    }
  };
}

module.exports = new authController();
