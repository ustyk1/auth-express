const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({message: 'Unauthorized1'});
    }

    const userData = jwt.verify(accessToken, jwtSecret);
    if (!userData) {
      return next( res.status(401).json({message: 'Unauthorized2'}) );
    }

    req.user = userData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({message: 'Unauthorized3'})
  }
}