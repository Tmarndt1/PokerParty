"use strict";
exports.__esModule = true;
var PokerPlayer_1 = require("../shared/models/PokerPlayer");
var util_1 = require("util");
var DataStore = /** @class */ (function () {
    function DataStore() {
    }
    DataStore.pokerPlayer = [];
    DataStore.parties = [];
    DataStore.join = function (json, socketId) {
        var pokerPlayer = PokerPlayer_1["default"].createEmpty();
        pokerPlayer.mirror(json);
        if (pokerPlayer.admin === true) {
            for (var i = 0; i < DataStore.pokerPlayer.length; i++) {
                if (DataStore.pokerPlayer[i].admin === true && DataStore.pokerPlayer[i].partyName === pokerPlayer.partyName) {
                    return false;
                }
            }
        }
        DataStore.pokerPlayer.push(pokerPlayer);
        return pokerPlayer;
    };
    DataStore.removePokerPlayer = function (pokerPlayer) {
        if (pokerPlayer === null)
            return false;
        var party = DataStore.parties.filter(function (x) { return x.name === pokerPlayer.partyName; });
        if (party.length !== 1)
            return false;
        var removed = false;
        for (var i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === pokerPlayer.partyName) {
                var member = DataStore.parties[i].members.filter(function (x) { return x.id === pokerPlayer.id; })[0];
                var index = DataStore.parties[i].members.indexOf(member);
                if (index === -1)
                    break;
                DataStore.parties[i].members.splice(index, 1);
                removed = true;
            }
        }
        if (removed === false)
            return removed;
        for (var i = 0; i < DataStore.pokerPlayer.length; i++) {
            if (DataStore.pokerPlayer[i].id == pokerPlayer.id) {
                DataStore.pokerPlayer.splice(i, 1);
                break;
            }
        }
        return true;
    };
    DataStore.closeParty = function (partyName) {
        for (var i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName) {
                var pokerPlayer = DataStore.pokerPlayer.filter(function (x) { return x.partyName === partyName; });
                pokerPlayer.forEach(function (pokerPlayer) {
                    var index = DataStore.pokerPlayer.indexOf(pokerPlayer);
                    DataStore.pokerPlayer.splice(index, 1);
                });
                DataStore.parties.splice(i, 1);
                return;
            }
        }
        //notify user
    };
    DataStore.getBySocketId = function (socketId) {
        for (var i = 0; i < DataStore.pokerPlayer.length; i++) {
            if (DataStore.pokerPlayer[i].connectionId == socketId)
                return DataStore.pokerPlayer[i];
        }
        return null;
    };
    DataStore.startParty = function (party, password, pokerPlayer) {
        if (DataStore.parties.filter(function (x) { return x.name === party.name; }).length > 0)
            return false;
        DataStore.parties.push(party);
        DataStore.pokerPlayer.push(pokerPlayer);
        return true;
    };
    DataStore.isPartyStarted = function (partyName) {
        for (var i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName)
                return true;
        }
        return false;
    };
    DataStore.getPlayers = function (partyName) {
        var party = DataStore.parties.filter(function (x) { return x.name === partyName; })[0];
        if (util_1.isNullOrUndefined(party))
            return [];
        return party.members;
    };
    DataStore.getParty = function (partyName) {
        var party = DataStore.parties.filter(function (x) { return x.name === partyName; })[0];
        if (util_1.isNullOrUndefined(party))
            return null;
        return party.toJSON();
    };
    DataStore.getPlayersJSON = function (partyName) {
        var party = DataStore.parties.filter(function (x) { return x.name === partyName; })[0];
        if (util_1.isNullOrUndefined(party))
            return [];
        return party.members.map(function (member) {
            return member.toJSON();
        });
    };
    DataStore.getPartyDetails = function () {
        return DataStore.parties.map(function (party) {
            return party.toJSON();
        });
    };
    DataStore.validateParty = function (partyName, password) {
        for (var i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName) {
                return (DataStore.parties[i].password === password && DataStore.parties[i].members.length < 8);
            }
        }
        return false;
    };
    DataStore.joinParty = function (partyName, password, pokerPlayer) {
        for (var i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName && DataStore.parties[i].password === password) {
                if (DataStore.parties[i].members.filter(function (x) { return x.username === pokerPlayer.username; }).length > 0)
                    return false;
                DataStore.parties[i].join(pokerPlayer);
                DataStore.pokerPlayer.push(pokerPlayer);
                return true;
            }
        }
        return false;
    };
    DataStore.getLowestAvailableSeat = function (partyName) {
        var party = DataStore.parties.filter(function (x) { return x.name === partyName; })[0];
        if (util_1.isNullOrUndefined(party))
            return -1;
        var array = [1, 2, 3, 4, 5, 6, 7, 8];
        party.members.forEach(function (member) {
            if (array.includes(member.seatNumber)) {
                var index = array.indexOf(member.seatNumber);
                array.splice(index, 1);
            }
        });
        return Math.min.apply(Math, array);
    };
    DataStore.addItem = function (item) {
        DataStore.parties.forEach(function (party) {
            if (party.name === item.partyName) {
                return party.setItem(item);
            }
        });
        return false;
    };
    DataStore.setPlayersVote = function (clone) {
        if (util_1.isNullOrUndefined(clone) || util_1.isNullOrUndefined(clone.id))
            return false;
        for (var i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === clone.partyName) {
                var player = DataStore.parties[i].members.filter(function (x) { return x.id === clone.id; })[0];
                if (util_1.isNullOrUndefined(player))
                    return false;
                if (clone.voted === false)
                    player.resetVote();
                else if (clone.voted === true)
                    player.mirror(clone);
                return true;
            }
        }
        return false;
    };
    DataStore.resetVote = function (partyName) {
        var party = DataStore.parties.filter(function (x) { return x.name === partyName; })[0];
        if (util_1.isNullOrUndefined(party) === true)
            return false;
        party.members.forEach(function (player) {
            player.resetVote();
        });
        return true;
    };
    return DataStore;
}());
exports["default"] = DataStore;
