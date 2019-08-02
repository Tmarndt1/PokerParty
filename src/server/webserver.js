"use strict";
exports.__esModule = true;
// src/server.ts
var express = require("express");
var WebServer = /** @class */ (function () {
    function WebServer(port) {
        var _this = this;
        this.getServer = function () {
            return _this.server;
        };
        this.stop = function () {
            console.log("closed connection on *:" + _this.port);
            _this.server.close();
        };
        this.port = port.toString();
        this.express = express();
        this.express.set("port", port);
        var http = require("http").Server(this.express);
        this.server = http.listen(port, function () {
            console.log("listening on *:" + port);
        });
    }
    return WebServer;
}());
exports["default"] = WebServer;
