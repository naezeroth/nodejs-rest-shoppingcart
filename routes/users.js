const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const Product = require('../models/Product');
const Order = require('../models/Order');

router.get('/items', function (req, res, next) {
  Product.find((err, products) => {
    res.json({
      success: true,
      items: products
    })
  });
      // .exec( (err, products) => { Utilised for dynamic queries
      //   res.json({
      //     success: true,
      //     items: products
      //   })
      // })
});

router.get('/item/:id', function (req, res, next) {
  Product.findById(req.params.id, function (err, product) {
    console.log(product);
    if(err){
      res.status(400).json({
        success: false,
        message:"Item could not be found"
      });
      console.log("failed");
    }
    else if (product){
      res.status(200).json({
        success: true,
        item: product
      });
    }
    else{ //None found
      res.status(400).json({
        success: false,
        message:"Item could not be found"
      });
    }
  })
});

router.get('/orders', function(req, res, next) {
 // res.send('respond with a resource');
  Order.find((err, order) => {
    res.json({
      success: true,
      items: order
    })
  });
});

router.post('/orders', function(req, res, next) { //ARRAY + RETURN ID'S OF ITEMS
   var data = [
    req.body.itemId,
    req.body.quantity,
  ];

  bodySchema = Joi.object().keys({ 
    itemId: Joi.string().required(),
    quantity: Joi.number().required(),  
  }); 
  const result = bodySchema.validate(req.body); 
  const {value, error} = result;
  console.log(value);
  console.log(error);
  if(error){
      res.json({
          success:false, 
          message:"Invalid request"
      })
  }
  else{
    Product.findById(data[0], function (err, product) {
      if(err){
          res.status(400).json({
            success: false,
            message:"Item could not be found"
          });
          console.log("failed");
      }
      else if (product){
        if(product.stock >= data[1]){ //if enough stock
          let o = new Order({
            itemId: data[0],
            quantity: data[1]  
          });
          o.save();
          product.stock = product.stock - data[1];
          product.save(function (err) {
              if(err) {
                  console.error('ERROR!');
              }
          });
          res.status(200).json({
            success: true,
            order: o
          });
        }
        else if(product.stock < data[1]){
          res.status(400).json({
            success: false,
            message:"Item does not have enough stock"
          });
        }
        else{
          res.status(400).json({
            success: false,
            messsage:"Invalid request"
          });
        }     
      }
    });
  }
 });

router.get('/order/:id', function(req, res, next) {
  Order.findById(req.params.id, function (err, order) {
    console.log(order);
    if(err){
      res.status(400).json({
        success: false,
        message:"Order could not be found"
      });
      console.log("failed");
    }
    else if (order){
      res.status(200).json({
        success: true,
        item: order
      });
    }
    else{ //None found
      res.status(400).json({
        success: false,
        message:"Order could not be found"
      });
    }
  });
});

module.exports = router;
