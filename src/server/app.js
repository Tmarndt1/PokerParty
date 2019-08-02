"use strict";
exports.__esModule = true;
var SocketServer_1 = require("./SocketServer");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var port = 8080;
var app = express();
app.set("port", process.env.PORT || port);
app.use(express.static("../../dist"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var http = require("http").Server(app);
// update file location on prod build
app.get("/", function (req, res) {
    res.sendFile(path.join("../../dist/index.html"));
});
var server = http.listen(port, function () {
    console.log("listening on *:" + port);
});
var socketServer = new SocketServer_1.SocketService(server);
