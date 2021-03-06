var express = require('express'),
    app = express();
    
var router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    shopifyAPI = require('shopify-node-api');

var Shopify = new shopifyAPI({
      shop: "gointegrations-devtest", // MYSHOP.myshopify.com 
      shopify_api_key: 'edd7fd7dac31cb81df28f91455649911', // Your API key 
      access_token: "330c304080eb8a70845b94ad0269bc50",
    });


const DB_USERNAME = 'admin';
const DB_PASSWORD = '123456';

var DATABASE_URL = 'mongodb://'+ DB_USERNAME + ':' + DB_PASSWORD + '@ds149030.mlab.com:49030/myshopify';


router.get('/products.json', function(req, res){
    findAllProducts(res)
});

router.post('/draft_order', function(req, res){

    var draft_order = JSON.parse(req.body.data)
    createShopifyDraftOrder ( draft_order, res)
});


exports.fetchShopifyProducts = function()
{
    console.log("inside fetch")
    Shopify.get('/admin/products.json', function(err, data) {
      insertProduct(data.products); // Data contains product json information 
    });

}

function createShopifyDraftOrder (draft_order, res) {

    console.log("Inside draftOrder")
    console.log(draft_order)
    Shopify.post('/admin/draft_orders.json', draft_order, function(err, data){
      res.send(data) // Data contains product json information 
    });
}

//exports.fetchShopifyProducts()
//exports.createShopifyDraftOrder()
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