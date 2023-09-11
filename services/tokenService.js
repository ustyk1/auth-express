const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const {jwtSecret, jwtSecretRefresh} = require("../config");

class TokenService {
  generateTokens({id, email, firstName, roles, sex, phone}) {
    const payload = {id, email, firstName, roles, sex, phone};
    const accessToken = jwt.sign(payload, jwtSecret, {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, jwtSecretRefresh, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({user: userId});

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await Token.create({user: userId, refreshToken});
    return token;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, jwtSecret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, jwtSecretRefresh)
      return userData;
    } catch (e) {
      return null;
    }
  }

  async removeToken(refreshToken) {
      const tokenData = await Token.findOneAndDelete({ refreshToken });
      return tokenData;
  }
}

module.exports = new TokenService();
