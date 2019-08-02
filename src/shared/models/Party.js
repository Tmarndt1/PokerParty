"use strict";
exports.__esModule = true;
var common_1 = require("../../shared/common");
var Party = /** @class */ (function () {
    function Party(admin, password) {
        var _this = this;
        this.join = function (PokerPlayer) {
            for (var i = 0; i < _this.members.length; i++) {
                if (_this.members[i].id === PokerPlayer.id)
                    return false;
            }
            _this.members.push(PokerPlayer);
            return true;
        };
        this.toJSON = function () {
            return {
                id: _this.id,
                name: _this.name,
                members: _this.members.map(function (member) { return member.toJSON(); }),
                memberCount: _this.members.length,
                pokerItem: common_1.isNullOrUndefined(_this.pokerItem) ? null : _this.pokerItem.toJSON()
            };
        };
        this.setItem = function (item) {
            if (common_1.isNullOrUndefined(item))
                return false;
            _this.itemHistory.push(item);
            _this.pokerItem = item;
            return true;
        };
        this.id = common_1.Guid();
        this.name = admin.partyName;
        this.password = password;
        this.members = [];
        this.members.push(admin);
        this.admin = admin;
        this.pokerItem = null;
        this.itemHistory = [];
    }
    return Party;
}());
exports["default"] = Party;
