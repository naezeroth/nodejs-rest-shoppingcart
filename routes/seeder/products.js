const express = require('express');
const router = express.Router();
const faker = require('faker');
const Product = require('../../models/Product');

router.get('/', function (req, res, next) {
    const s = ["S", "M", "L"];
    for (let i = 0; i < 10; i++) {
        let product = new Product({
            type: faker.commerce.productName(),
            color: faker.commerce.color(),
            size: s[Math.floor(Math.random()*10)%3],
            stock: Math.floor(Math.random()*100)
        });
        product.save();
    }
    res.redirect('/')
});


module.exports = router;