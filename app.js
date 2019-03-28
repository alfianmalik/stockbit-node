var express = require("express");
var bodyParser = require("body-parser");
var request = require('request');
var now = new Date();
const sqlite3 = require('sqlite3').verbose();

var app = express();
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});
db.run('CREATE TABLE IF NOT EXISTS movies(id INTEGER PRIMARY KEY, reqTime VARCHAR(25) NOT NULL, keyword VARCHAR(25), result TEXT)');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/movie-search", function(req, res) {
    request('http://www.omdbapi.com/?apikey=faf7e5bb&s='+req.query.keyword+'&page=1', function (error, request, response, next){
        if (!error) {
            db.run(`INSERT INTO movies(reqTime,keyword,result) VALUES(?,?,?)`, [now, req.query.keyword, JSON.parse(response).Search], function(err, row) {
                if (err) {
                    return console.log(err.message);
                }
            });
        }
    })

    db.run(`SELECT reqTime FROM movies where id = ?`, [1], function(err, row) {
        if (err) {
            return console.log(err.message);
        }
        res.status(200).send(row);
    });

    res.status(200).send("Welcome to our restful API");
});

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});