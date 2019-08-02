"use strict";
exports.__esModule = true;
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["Connect"] = "connect";
    SocketEvent["Connection"] = "connection";
    SocketEvent["Disconnect"] = "disconnect";
    SocketEvent["JoinParty"] = "joinParty";
    SocketEvent["StartParty"] = "startParty";
    SocketEvent["GetPokerPlayers"] = "getPokerPlayers";
    SocketEvent["GetParties"] = "getParties";
    SocketEvent["GetParty"] = "getParty";
    SocketEvent["Vote"] = "vote";
    SocketEvent["Reset"] = "reset";
    SocketEvent["ItemSubmmitted"] = "itemSubmmitted";
    SocketEvent["LocalClosed"] = "localClosed";
    SocketEvent["OtherClosed"] = "otherClosed";
    SocketEvent["SubmitItem"] = "submitItem";
    SocketEvent["RevoteItem"] = "revoteItem";
    SocketEvent["PartyAdded"] = "partyAdded";
    SocketEvent["PlayerAdded"] = "playerAdded";
    SocketEvent["PlayerVoted"] = "playerVoted";
    SocketEvent["PlayerRemoved"] = "playerRemoved";
    SocketEvent["RemovePlayer"] = "removePlayer";
})(SocketEvent || (SocketEvent = {}));
exports["default"] = SocketEvent;
