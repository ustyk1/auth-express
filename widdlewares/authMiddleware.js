const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
const tokenService = require('../services/tokenService');
const {TokenExpiredError} = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }


  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized5'});
    }

    const accessToken = (authorizationHeader.split(' '))[1];
    if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized1'});
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      // return next( res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized2'}) );
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized2'});
    }
    req.user = userData;
    next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return next(res.status(StatusCodes.UNAUTHORIZED).json({message: 'Refresh token was expired. Please make a new signin request'}))
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized3'})
  }
}