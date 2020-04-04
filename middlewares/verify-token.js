const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        res.json({
          success: false,
          message: 'Authentication failed'
        })
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'Token not provided'
    })
  }
}