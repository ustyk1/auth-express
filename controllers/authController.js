const User = require('../models/User');
const Role = require('../models/Role');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { smtp_host, smtp_port, smtp_user, smtp_password, hash} = require('../config');
const {StatusCodes} = require('http-status-codes');
const tokenService = require('../services/tokenService');
const nodemailer = require('nodemailer');
const generator = require('generate-password')

class authController {

  async registration(req, res) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Помилка валідації', errors: result.array() });
      }

      const {firstName, lastName, email, password, confirmPassword, sex, phone} = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Користувач з такою поштою уже існує' })
      }

      if (password !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Confirm password doesn`t match' })
      }

      const hashPassword = bcrypt.hashSync(password, hash);

      const userRole = await Role.findOne({value: 'USER'}); // шукаємо в базі
      // const userRole = await Role.findOne({ value: 'ADMINISTRATOR' }); // шукаємо в базі

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        // password,
        roles: [userRole.value],
        sex,
        phone
      });

      await user.save();

      const {_id: userId} = await User.findOne({email});

      const transporter = nodemailer.createTransport({
        host: smtp_host,
        port: smtp_port,
        service: 'gmail',
        secure: false,
        auth: {
          user: smtp_user,
          pass: smtp_password,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const activationLink = `http://localhost:5000/auth/activation/${userId}`;
      const mailOptions = {
        to: email,
        from: smtp_user,
        subject: 'Please, activate your account',
        text: '',
        html: `
          <div>
            <h1>Для активації, перейдіть будь ласка за посиланням</h1>
            <a href="${activationLink}">${activationLink}</a>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log('at transporter error', error);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Email not send'});
        }
        return res.status(StatusCodes.OK).json({message: 'The activation letter has been sent'});
      });
      // return res.status(StatusCodes.OK).json({ message: 'Користувач успішно зареєстрований' })
    } catch (error) {
      console.log('at registration error: ',error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Registration error' })
    }
  }

  async login(req, res) {
    try {
      const {email, password} = req.body;

      const user = await User.findOne({email});
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Користувача за поштою ${email} не знайдено` })
      }

      if (!user.isActivated) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Користувач не підтвердив пошту` })
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('isValidPassword', isValidPassword);

      // if (!isValidPassword) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Невірний логін або пароль' });
      // }

      const userDto = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        sex: user.sex,
        phone: user.phone
      }

      const {accessToken, refreshToken} = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, refreshToken);

      return res.json({accessToken, refreshToken});
    } catch (error) {
      console.log('at login error: ', error);
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Login error'})
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
      console.log('at getUsers error: ', error);
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    console.log('id', id)

    try {
      const user = await User.findOneAndDelete({ _id: id });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Користувача не знайдено'})
      }

      res.status(StatusCodes.OK).json({message: 'User deleted successful'});
    } catch (error) {
      console.log('at delete error: ', error);
      res.status(StatusCodes.BAD_REQUEST).json({message: 'Delete error'});
    }
  };

  async refresh(req, res) {
    try {
      const {refreshToken} = req.body;
      let existingToken = await Token.findOne({refreshToken});

      if (!existingToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid refresh token'})
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      if (!userData) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid refresh token'})
      }

      console.log('userData refresh', userData)

      const tokens = tokenService.generateTokens({...userData});

      await tokenService.saveToken(userData.id, tokens.refreshToken);
      console.log('tokens', tokens)
      return res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      console.log('at refresh error: ', error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Refresh token error' });
    }
  };

  async logout(req, res) {
    try {
      const {refreshToken} = req.body;
      const token = await tokenService.removeToken(refreshToken);
      if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Token not found'});
      }

      return res.status(StatusCodes.OK).json({message: 'Logout successful'});
    } catch (error) {
      console.log('at logout error: ', error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Logout error' });
    }
  }

  async changePassword(req, res) {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Помилка валідації', errors: result.array() });
      }
      const {userId, currentPassword, newPassword, confirmPassword} = req.body;

      const user = await User.findOne({_id: userId});
      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'User not found'});
      }

      const isPasswordMatch = bcrypt.compare(currentPassword, user.password);
      // const isPasswordMatch = currentPassword === user.password;
      console.log('currentPassword', currentPassword)
      console.log('user.password', user.password)
      if (!isPasswordMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Wrong current password'});
      }

      const newPasswordHash = bcrypt.hashSync(newPassword, hash);
      user.password = newPasswordHash;
      // user.password = newPassword;
      await user.save();

      res.status(StatusCodes.OK).json({ message: 'Password changed successful' });

    } catch (error) {
      console.log('at changePassword error: ', error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Change password error' });
    }
  };

  async activate(req, res) {
    const { userId } = req.params;

    const user = await User.findOne({_id: userId});
    if (!user || user.isActivated) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Wrong id or user not activated'});
    }

    user.isActivated = true;
    await user.save();

    return res.json({message: 'Account was activated successfully. Please sign in'});
  }


  async forgotPassword(req, res) {
    try {
      const {email} = req.body;

      const user = await User.findOne({email});
      if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Користувача за такою поштою не знайдено.'});
      }

      const newPassword = generator.generate({
        length: 10,
        numbers: true,
        symbols: true
      });

      const hashPassword = bcrypt.hashSync(newPassword, hash);

      user.password = hashPassword;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: smtp_host,
        port: smtp_port,
        service: 'gmail',
        secure: false,
        auth: {
          user: smtp_user,
          pass: smtp_password,
        },
        tls: {
          rejectUnauthorized: false,
        }
      });

      const mailOptions = {
        to: email,
        from: smtp_user,
        subject: 'Відновлення пароля',
        text: '',
        html:
          `
            <h3 style='font-size: 28px;'>Ваш новий пароль:</h3>
            <h1 style='
            text-align: center;
            padding: 10px;
            background-color: silver;
            border-radius: 12px;
            border: 3px solid black;
            width: 170px;
            '>${newPassword}</h1>
            <h4 style='font-size: 22px; color: red;'>Рекомендуємо замінити пароль після входу в обліковий запис!</h4>
          `
      }

      transporter.sendMail(mailOptions, (error) => {
        if(error){
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Не вдалося відправити новий пароль на пошту.'})
        }
        return res.status(StatusCodes.OK).json({message: 'Новий пароль відправлено на вашу пошту.'})
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Помилка відновлення пароля' });
    }
  }
}

module.exports = new authController();
