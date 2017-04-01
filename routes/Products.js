var express = require('express');
var router = express.Router(),
    MongoClient = require('mongodb').MongoClient;

const DB_USERNAME = 'admin';
const DB_PASSWORD = '123456';

var DATABASE_URL = 'mongodb://'+ DB_USERNAME + ':' + DB_PASSWORD + '@ds149030.mlab.com:49030/myshopify';


router.get('/products/products.json', function(req, res){
    findAllProducts(res)
});

exports.fetchShopifyProducts = function()
{
    const https = require('https');
    const API_KEY = "edd7fd7dac31cb81df28f91455649911";
    const PASSWORD = "330c304080eb8a70845b94ad0269bc50";
    const PATH = "@gointegrations-devtest.myshopify.com/admin/products.json";
    const URL = "https://" + API_KEY + ":" + PASSWORD + PATH ;

    https.get(URL, function (res) {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error("Request Failed.\n" +
                          "Status Code: " + statusCode);
        } 

        else if (!/^application\/json/.test(contentType)) {
            error = new Error("Invalid content-type.\n" +
                                "Expected application/json but received" + contentType);
        }
        
        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', function(data) { rawData = data});
        res.on('end', function() {
            try {
                    let parsedData = JSON.parse(rawData);
                    insertProduct(parsedData.products)
            } 
            catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function insertProduct(data)
{
    MongoClient.connect(DATABASE_URL, function(err, db) {
        
        if (err) {
            throw new Error("Failed to connect to the database")
        }

        console.log("Connected correctly to server");     
        var collection = db.collection('Products');
        
        // Insert products into the database
        collection.insertMany(data, function(err, result) {
            if (err) {
                throw new Error("Failed to insert products in to the database")
            }
            console.log("Inserted products in the Products collection");
            console.log(result);
        });
        db.close()
    });
}


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