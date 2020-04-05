const router = require('express').Router();
const Product = require('../models/Product');
const verifyToken = require('../middlewares/verify-token');

router.get('/products', (req, res) => {
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
})