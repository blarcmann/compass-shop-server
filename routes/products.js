const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const User = require('../models/User');
const verifyToken = require('../middlewares/verify-token');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

router.get('/test', (res) => {
  console.log('called');
})

router.get('/all', (req, res) => {
  let skip = 0;
  let limit = 10;
  let query = {};
  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }
  if (typeof req.query.skip !== 'undefined') {
    skip = req.query.skip;
  }
  if (typeof req.query.skip !== 'undefined') {
    skip = req.query.skip;
  }
  Product.find(query)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: 'desc' })
    .exec((err, products) => {
      if (err) {
        console.log('error occured', err);
        return res.status(500).json({
          success: false,
          message: 'internal server error'
        })
      }
      res.status(200).json({
        success: true,
        products
      })
    })
});

router.get('/:id', (req, res) => {
  Product.findById({ _id: req.params.id })
    .populate('owner')
    .exec((err, product) => {
      if (err) {
        res.json({
          success: false,
          message: 'Product not found'
        });
      } else {
        res.json({
          success: true,
          product: product,
        });
      }
    });
});

router.post('/add_product', verifyToken, (req, res) => {
  User.findById({ _id: req.decoded.user._id })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'user not found, dummy!'
        })
      }
      if (req.files.product_image) {
        const file = req.files.product_image;
        cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
          if (error) {
            console.log('error occured while uploading', error);
            return res.status(501).json({
              success: false,
              message: 'error occured while uploading to cloudinary'
            })
          }
          let img_url = result.url;
          let product = new Product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            product_image: img_url
          });
          product.save();
          return res.status(201).json({
            success: true
          });
        })
      } else {
        let product = new Producr({
          name: req.body.name,
          category: req.body.category,
          description: req.body.description,
          price: req.body.price,
          product_image: ''
        })
        product.save();
        res.status(201).json({
          success: true,
        });
      }
    })
});

module.exports = router;