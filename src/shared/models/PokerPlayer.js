"use strict";
exports.__esModule = true;
var common_1 = require("../common");
var PokerPlayer = /** @class */ (function () {
    function PokerPlayer(json) {
        if (json === void 0) { json = null; }
        var _this = this;
        this.toJSON = function () {
            return {
                id: _this.id,
                username: _this.username,
                vote: _this.vote,
                admin: _this.admin,
                partyName: _this.partyName,
                voted: _this.voted,
                seatNumber: _this.seatNumber,
                v5Count: _this.v5Count,
                v10Count: _this.v10Count,
                v25Count: _this.v25Count,
                v50Count: _this.v50Count,
                lastVote: _this.lastVote
            };
        };
        this.clone = function () {
            return new PokerPlayer(_this.toJSON());
        };
        this.generateVote = function (vote, item) {
            _this.voted = true;
            _this.vote = vote.toString();
            _this.lastVote = [item.id, vote];
            _this.v5Count = Math.ceil(Math.random() * 9);
            _this.v10Count = Math.ceil(Math.random() * 9);
            _this.v25Count = Math.ceil(Math.random() * 7);
            _this.v50Count = Math.ceil(Math.random() * 3);
        };
        this.resetVote = function () {
            _this.voted = false;
            _this.vote = null;
        };
        this.mirror = function (player) {
            Object.keys(_this).forEach(function (key) {
                if (!common_1.isNullOrUndefined(player[key]) && typeof player[key] !== "function")
                    _this[key] = player[key];
            });
        };
        this.deepMirror = function (player) {
            Object.keys(_this).forEach(function (key) {
                if (typeof player[key] !== "function")
                    _this[key] = player[key];
            });
        };
        this.setSeatNumber = function (seatNumber) {
            _this.seatNumber = seatNumber;
        };
        this.id = (json.id === undefined || json.id == null) ? common_1.Guid() : json.id;
        this.username = json.username;
        this.vote = json.vote;
        this.admin = json.admin;
        this.partyName = json.partyName;
        this.voted = json.voted;
        this.connectionId = json.connectionId;
        this.seatNumber = json.seatNumber;
        this.v5Count = json.v5Count;
        this.v10Count = json.v10Count;
        this.v25Count = json.v25Count;
        this.v50Count = json.v50Count;
    }
    PokerPlayer.fromJSON = function (json) {
        return new PokerPlayer({
            id: json.id,
            username: json.username,
            vote: json.vote,
            admin: json.admin,
            partyName: json.partyName,
            voted: json.voted,
            seatNumber: json.seatNumber,
            v5Count: json.v5Count,
            v10Count: json.v10Count,
            v25Count: json.v25Count,
            v50Count: json.v50Count,
            lastVote: json.lastVote
        });
    };
    PokerPlayer.createEmpty = function () {
        return new PokerPlayer({
            id: null,
            username: null,
            vote: null,
            admin: null,
            partyName: null,
            voted: null,
            seatNumber: null,
            v5Count: null,
            v10Count: null,
            v25Count: null,
            v50Count: null,
            lastVote: [null, null]
        });
    };
    return PokerPlayer;
}());
exports["default"] = PokerPlayer;
