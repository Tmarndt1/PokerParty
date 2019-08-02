"use strict";
exports.__esModule = true;
var socket = require("socket.io");
var PokerPlayer_1 = require("../shared/models/PokerPlayer");
var DataStore_1 = require("./DataStore");
var Party_1 = require("../shared/models/Party");
var PokerItem_1 = require("../shared/models/PokerItem");
var SocketEvent_1 = require("../shared/enums/SocketEvent");
var util_1 = require("util");
var SocketService = /** @class */ (function () {
    function SocketService(server) {
        var _this = this;
        this.setup = function (socket) {
            socket.on(SocketEvent_1["default"].Disconnect, function () {
                var pokerPlayer = DataStore_1["default"].getBySocketId(socket.id);
                if (pokerPlayer == null)
                    return;
                if (pokerPlayer.admin === true) {
                    DataStore_1["default"].closeParty(pokerPlayer.partyName);
                    _this.broadcastToParty(pokerPlayer.partyName, SocketEvent_1["default"].LocalClosed, {});
                    _this.broadcast(SocketEvent_1["default"].OtherClosed, {});
                }
                else {
                    DataStore_1["default"].removePokerPlayer(pokerPlayer);
                    _this.broadcastToParty(pokerPlayer.partyName, SocketEvent_1["default"].PlayerRemoved, pokerPlayer.toJSON());
                }
                socket.leave(pokerPlayer.partyName);
            });
            socket.on(SocketEvent_1["default"].RemovePlayer, function (args, callback) {
                if (util_1.isNullOrUndefined(args))
                    return _this.sendBadResult("Could not remove player", callback);
                var players = DataStore_1["default"].getPlayers(args.partyName);
                var pokerPlayer = players.filter(function (x) { return x.id === args.id; })[0];
                if (util_1.isNullOrUndefined(pokerPlayer) || DataStore_1["default"].removePokerPlayer(pokerPlayer) === false)
                    return _this.sendBadResult("Could not remove player", callback);
                if (pokerPlayer.admin === true) {
                    DataStore_1["default"].closeParty(pokerPlayer.partyName);
                    _this.broadcastToParty(pokerPlayer.partyName, SocketEvent_1["default"].LocalClosed, {});
                    _this.broadcast(SocketEvent_1["default"].OtherClosed, {});
                    _this.sendGoodResult(null, null, callback);
                }
                else {
                    _this.io.to(pokerPlayer.connectionId).emit(SocketEvent_1["default"].LocalClosed);
                    _this.broadcastToParty(args.partyName, SocketEvent_1["default"].PlayerRemoved, pokerPlayer.toJSON());
                    _this.sendGoodResult(null, null, callback);
                }
            });
            socket.on(SocketEvent_1["default"].SubmitItem, function (args, callback) {
                var pokerItem = new PokerItem_1["default"](args);
                if (util_1.isNullOrUndefined(pokerItem))
                    return _this.sendBadResult("Could not create item.", callback);
                DataStore_1["default"].addItem(pokerItem);
                _this.broadcastToParty(args.partyName, SocketEvent_1["default"].ItemSubmmitted, args);
                _this.sendGoodResult(null, null, callback);
            });
            socket.on(SocketEvent_1["default"].RevoteItem, function (partyName, callback) {
                if (DataStore_1["default"].isPartyStarted(partyName) === false)
                    return _this.sendBadResult("Bad revote request", callback);
                if (DataStore_1["default"].resetVote(partyName) === false)
                    return _this.sendBadResult("Bad revote request", callback);
                _this.broadcastToParty(partyName, SocketEvent_1["default"].RevoteItem, null);
                _this.sendGoodResult(null, null, callback);
            });
            socket.on(SocketEvent_1["default"].Vote, function (args, callback) {
                if (DataStore_1["default"].isPartyStarted(args.partyName) === false)
                    return _this.sendBadResult("Bad vote request", callback);
                if (DataStore_1["default"].setPlayersVote(args.pokerPlayer) === false)
                    return _this.sendBadResult("Vote unsuccessful", callback);
                var player = DataStore_1["default"].getPlayers(args.partyName).filter(function (x) { return x.id === args.pokerPlayer.id; })[0];
                _this.broadcastToParty(args.partyName, SocketEvent_1["default"].PlayerVoted, player.toJSON());
                _this.sendGoodResult(null, null, callback);
            });
            socket.on(SocketEvent_1["default"].Reset, function (args, callback) {
                _this.broadcastToParty(args.partyName, SocketEvent_1["default"].Reset, {});
                _this.sendGoodResult(null, null, callback);
            });
            socket.on(SocketEvent_1["default"].GetParties, function (callback) {
                callback(DataStore_1["default"].getPartyDetails());
            });
            socket.on(SocketEvent_1["default"].StartParty, function (req, callback) {
                var partyName = req.partyName;
                var jPokerPlayer = req.pokerPlayer;
                var password = req.password;
                if (jPokerPlayer.admin === true && !DataStore_1["default"].isPartyStarted(partyName)) {
                    jPokerPlayer.connectionId = socket.id;
                    var admin = new PokerPlayer_1["default"](jPokerPlayer);
                    var party = new Party_1["default"](admin, password);
                    if (DataStore_1["default"].startParty(party, password, admin) === false)
                        return _this.sendBadResult("Could not start party.", callback);
                    var seatNumber = DataStore_1["default"].getLowestAvailableSeat(req.partyName);
                    if (seatNumber === -1)
                        return _this.sendBadResult("Could not join party", callback);
                    admin.setSeatNumber(seatNumber);
                    socket.join(partyName);
                    _this.broadcast(SocketEvent_1["default"].PartyAdded, party.toJSON());
                    _this.sendGoodResult(null, jPokerPlayer.seatNumber, callback);
                }
                else
                    _this.sendBadResult("Could not join party.", callback);
            });
            socket.on(SocketEvent_1["default"].JoinParty, function (req, callback) {
                var partyName = req.partyName;
                var jPokerPlayer = req.pokerPlayer;
                var password = req.password;
                if (jPokerPlayer.admin === false && DataStore_1["default"].validateParty(partyName, password)) {
                    jPokerPlayer.seatNumber = DataStore_1["default"].getLowestAvailableSeat(req.partyName);
                    jPokerPlayer.connectionId = socket.id;
                    var pokerPlayer = new PokerPlayer_1["default"](jPokerPlayer);
                    if (DataStore_1["default"].joinParty(partyName, password, pokerPlayer) === false)
                        return _this.sendBadResult("Could not join party.", callback);
                    socket.join(partyName);
                    _this.broadcastToParty(partyName, SocketEvent_1["default"].PlayerAdded, pokerPlayer.toJSON());
                    _this.sendGoodResult(null, jPokerPlayer.seatNumber, callback);
                }
                else
                    _this.sendBadResult("Could not join party.", callback);
            });
            socket.on(SocketEvent_1["default"].GetPokerPlayers, function (partyName, callback) {
                callback(DataStore_1["default"].getPlayersJSON(partyName));
            });
            socket.on(SocketEvent_1["default"].GetParty, function (partyName, callback) {
                callback(DataStore_1["default"].getParty(partyName));
            });
        };
        this.broadcastToParty = function (party, method, args) {
            _this.io.to(party).emit(method, args);
        };
        this.broadcast = function (method, args) {
            _this.io.emit(method, args);
        };
        this.sendBadResult = function (message, callback) {
            callback({
                message: message,
                success: false
            });
        };
        this.sendGoodResult = function (message, data, callback) {
            callback({
                message: message,
                success: true,
                data: data
            });
        };
        this.watchers = [];
        this.io = socket(server);
        this.io.origins("*:8080");
        this.io.sockets.on(SocketEvent_1["default"].Connect, function (socket) {
            _this.socket = socket;
            _this.setup(socket);
        });
    }
    return SocketService;
}());
exports.SocketService = SocketService;
