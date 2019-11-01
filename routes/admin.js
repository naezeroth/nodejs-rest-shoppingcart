var express = require('express');
var async = require("async");
const Joi = require('@hapi/joi');
var router = express.Router();

const Product = require('../models/Product');
const Order = require('../models/Order');

var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjI1NzI0NjQsImV4cCI6MTU5NDEwODQ2OSwiYXVkIjoid3d3LnN0dWRlbnRzLjJoYXRzLmNvbS5hdSIsInN1YiI6InVzZXJAMmhhdHMuY29tLmF1IiwiR2l2ZW5OYW1lIjoiSm9obiIsIlN1cm5hbWUiOiJTbm93IiwiRW1haWwiOiJqb2huc25vd0AyaGF0cy5jb20uYXUiLCJSb2xlIjoiSmFuaXRvciJ9.BEEqb2ihfP0ec8TBu91T9lk0kcBKpz1NkJv4PpyjxdE";

var auth = function (req, res, next) {
    if(req.headers.authentication == `Bearer ${token}`){
        console.log("Authenticated");
        next();
    }
    else{
        res.json({
            success: false,
            message: "Unauthorized"
        })
    }
}

/* GET home page. */
router.get('/', auth, function(req, res, next) {
    console.log("Base Route");
});

router.post('/items', auth, (req, res) => {
    var arr = req.body.items;
    var toReturn = [];

    async.forEachOf(arr, (arrayItem, key, callback) => {
        var data = [
            arrayItem.type,
            arrayItem.color,
            arrayItem.size,
            arrayItem.stock
        ]
        bodySchema = Joi.object().keys({ 
            type: Joi.string().required(),
            color: Joi.string().required(),  
            size: Joi.string().regex(/[SML]/).required(),  
            stock: Joi.number().required()
        }); 
        const result = bodySchema.validate(arrayItem); 
        const {value, error} = result;
        console.log(value);
        console.log(error);
        if(error){
            res.json({
                success:false, 
                message:"One (or more) items are invalid"
            })
        }
        else{
            Product.findOne({type: data[0]}, (err, product) => {
                if(err){
                    console.log("in error");
                }
                else if(product){
                    product.stock = data[3];
                    product.save();
                }
                else{
                    var p = new Product({
                        type: data[0],
                        color: data[1],
                        size: data[2],
                        stock: data[3]
                    });
                    toReturn.push(p._id);
                    p.save();
                }
                callback();
            });
        }
    }, err => {
        if (err) console.error(err.message);
        console.log(toReturn);
        res.json({
            success: true, 
            itemIds: toReturn
        });
    });
});

router.patch('/item/:id', auth, (req, res) => {
    Product.findById(req.params.id, function (err, product) {
        if(err){
            res.status(400).json({
              success: false,
              message:"Item could not be found"
            });
            console.log("failed");
          }
          else if (product){
            product.stock = req.body.stock;
            product.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
            });
            console.log("Patch passed");
          }
          else{
            res.json({
                success:false, 
                messsage:"Invalid request"
            });
          }
    })
});

router.delete('/item/:id', auth, (req, res) => {
    Product.findByIdAndRemove(req.params.id, function (err, product) {
        if(err){
            res.status(400).json({
              success: false,
              message:"Item could not be found"
            });
            console.log("failed");
        }
        else if(product){
            res.status(200).json({success:true});
            console.log("deleted");
        }
        else{
            res.json({
                success:false, 
                messsage:"Invalid request"
            });
        }
      })
});

module.exports = router;
