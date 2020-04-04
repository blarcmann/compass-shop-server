const router = require('express').Router();
const jwt = require('jsonwebtoken');
const checkJWT = require('../middlewares/verify-token');
const User = require('../models/User');


router.post('/signup', (req, res) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      res.status(500).json({
        success: false
      })
    }
    if (existingUser) {
      res.json({
        success: false,
        message: 'An existing account already has this email'
      })
    } else {
      user.save();
      let token = jwt.sign({
        user: user
      }, process.env.SECRET_KEY, {
        expiresIn: '7d'
      });
      res.json({
        success: true,
        message: 'Your Account is successfully created',
        token: token
      });
    }
  });
});


router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(500).json({
        success: false
      })
    }
    if (!user) {
      res.json({
        success: false,
        message: 'User not found'
      });
    } else if (user) {
      let validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Password is incorrect'
        });
      } else {
        var token = jwt.sign({
          user: user
        }, process.env.SECRET_KEY, {
          expiresIn: '7d'
        });
        res.json({
          success: true,
          token: token
        })
      }
    }
  });
});