const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/', (res) => {
  console.log('called');
  res.send('users route works fine');
})

router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).json({
          success: false,
          message: 'email already exists'
        })
      } else {
        const newUser = new User({
          name: req.body.name,
          password: req.body.password,
          email: req.body.email,
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.status(201).json({
                  success: true,
                  user: user
                })
              })
              .catch(error => {
                res.status(400).json({
                  success: false,
                  message: `error occured during encryption, ${error}`
                })
              })
          })
        })
      }
    })
})


router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'user not found'
        })
      } else if (user) {
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              res.json({
                success: false,
                message: 'Password incorrect'
              });
            } else {
              var token = jwt.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: '7d' });
              res.status(200).json({
                success: true,
                token: token
              })
            }
          })
      }

    })
})

module.exports = router;