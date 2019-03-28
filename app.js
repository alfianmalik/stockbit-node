var express = require("express");
var bodyParser = require("body-parser");
var request = require('request');
const sqlite3 = require('sqlite3').verbose();

var app = express();
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});
db.run('CREATE TABLE IF NOT EXISTS movies(id INTEGER PRIMARY KEY, reqTime VARCHAR(25) NOT NULL, keyword VARCHAR(25) NOT NULL, result TEXT NOT NULL)');
db.close();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/movie-search", function(req, res) {
    var string = '';
    request('http://www.omdbapi.com/?apikey=faf7e5bb&s='+req.query.keyword+'&page=1', function (error, req, response, next) {

        if (!error && response.statusCode == 200) {

            db.run(`INSERT INTO movies(reqTime,keyword,result) VALUES(?,?,?)`, ['2009',req.query.keyword,response.Search], function(err) {
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });

            console.log(response) // Show the HTML for the Google homepage.
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(response);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(response);
        }
    })
    res.status(200).send("Welcome to our restful API");
});

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});