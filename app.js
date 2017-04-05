var express = require('express'),
    app = express(),
    MongoClient = require('mongodb').MongoClientvar,
    bodyParser = require('body-parser');
var username = 'admin';
var password = '123456';

var DATABASE_URL = 'mongodb://'+ username + ':' + password + '@ds149030.mlab.com:49030/myshopify';
var index = require('./routes/index');
var products = require("./routes/Products");

/*
 * Here we are configuring express to use body-parser as middle-ware.
 * to handle request body input
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/'));

app.use("/", index);
app.use("/products", products);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

app.listen(process.env.PORT || 3000,  function() {
    console.log('Server listening http://localhost:3000/');
});


/* Initialize Database with products */
