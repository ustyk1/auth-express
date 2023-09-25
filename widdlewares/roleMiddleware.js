const jwt = require('jsonwebtoken');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
const {jwtSecret} = require('../config');

module.exports = (roles) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized4'});
      }

      const accessToken = authorizationHeader.split(' ')[1];

      if(!accessToken) {
          return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized'});
      }

      const {roles: userRoles} = jwt.verify(accessToken, jwtSecret);
      let hasAccess = false;

      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasAccess = true;
        }
      })

      if (!hasAccess) {
        return res.status(StatusCodes.FORBIDDEN).json({message: 'Access is denied'});
      }

      next();
    } catch (e) {
      console.log('at roleMiddleware error: ', e);
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized'});
    }
  }
}