const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');

module.exports = (roles) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(' ')[1];

      if(!accessToken) {
          return res.status(401).json({message: 'Unauthorized'});
      }

      const {roles: userRoles} = jwt.verify(accessToken, jwtSecret);
      let hasAccess = false;

      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasAccess = true;
        }
      })

      if (!hasAccess) {
        return res.status(403).json({message: 'Access is denied'});
      }

      next();
    } catch (e) {
      console.log(e);
      return res.status(401).json({message: 'Unauthorized'});
    }
  }
}