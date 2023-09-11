const User = require('../models/User');
const Role = require('../models/Role');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtSecretRefresh, hash} = require('../config');
const {StatusCodes} = require("http-status-codes");
const tokenService = require("../services/tokenService");

class userController {
    async updateProfile(req, res) {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.json({ message: 'Validation error', errors: result.array() });
            }

            const {userId, firstName, lastName, email, sex, phone} = req.body;

            const user = await User.findOne({_id: userId});
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'User not found'});
            }

            firstName && (user.firstName = firstName);
            lastName && (user.lastName = lastName);
            email && (user.email = email);
            sex && (user.sex = sex);
            phone && (user.phone = phone);
            await user.save();

            const updatedUser = await User.findOne({_id: userId});

            const newUserDto = {
                id: updatedUser._id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                roles: updatedUser.roles,
                sex: updatedUser.sex,
                phone: updatedUser.phone
            }

            const tokens = tokenService.generateTokens({...newUserDto});

            const existingToken = await Token.findOne({user: user._id});
            if (!existingToken) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Profile user error'})
            }

            await tokenService.saveToken(userId, tokens.refreshToken);
            res.status(StatusCodes.OK).json({ tokens, message: 'Profile updated successful' });
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Update profile error' });
        }
    }

    async updateUser(req, res) {
        try {
            // const result = validationResult(req);
            // if (!result.isEmpty()) {
            //     return res.json({ message: 'Validation error', errors: result.array() });
            // }

            const {userId, firstName, lastName, email, sex, phone} = req.body;

            const user = await User.findOne({_id: userId});
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'User not found'});
            }

            firstName && (user.firstName = firstName);
            lastName && (user.lastName = lastName);
            email && (user.email = email);
            sex && (user.sex = sex);
            phone && (user.phone = phone);
            await user.save();

            //если юзер авторизован то вылогиним его
            const existingToken = await Token.findOne({user: user._id});
            if (existingToken) {
                await tokenService.removeToken(existingToken);
            }

            res.status(StatusCodes.OK).json({ message: 'User updated successful' });
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Update user error' });
        }
    }
}

module.exports = new userController();
