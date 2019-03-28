var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.status(200).send("Welcome to our restful API");
});

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});