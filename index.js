require('dotenv').config({path: '.env'})
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

var corsOptions = {
    methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS"
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true, keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
app.use(bodyParser.json());

const router = require('./route/todo_route');
app.use(router);

app.listen(3001, function () {
    console.log("sever started on port 3001");
});

