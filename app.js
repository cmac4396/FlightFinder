var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, () => console.log('App now running on port 3000!'));