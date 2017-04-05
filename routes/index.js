var express = require('express');
var router = express.Router(),
    MongoClient = require('mongodb').MongoClient;

var username = 'admin';
var password = '123456';

var DATABASE_URL = 'mongodb://'+ username + ':' + password + '@ds149030.mlab.com:49030/myshopify';

router.get('/', function(req, res){
    res.sendFile('index.html');
});

function findAllProducts(res) {
     MongoClient.connect(DATABASE_URL, function(err, db) {
        
        if (err) {
            throw new Error("Failed to connect to the database")
        }

        console.log("Connected correctly to server");     
        var collection = db.collection('Products');
        
        // Insert products into the database
        collection.find({}).toArray(function(err, result) {
            if (err) {
                throw new Error("Failed to insert products in to the database")
            }
            
            console.log("Searching products in the Products collection");
            console.log(result);
            var discount_products = result.map(function(product, index){
                var details = product.variants[0];
                var rate = 0.75;
                details.price =  details.price * rate;
                return product;
            })
            //console.log(discount_products)

            res.send({products : discount_products})
        });
        db.close()
    });
}

module.exports = router;