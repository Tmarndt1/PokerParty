"use strict";
exports.__esModule = true;
var common_1 = require("../common");
var PokerItem = /** @class */ (function () {
    function PokerItem(json) {
        if (json === void 0) { json = null; }
        var _this = this;
        this.toJSON = function () {
            return {
                id: _this.id,
                title: _this.title,
                body: _this.body,
                partyName: _this.partyName
            };
        };
        if (common_1.isNullOrUndefined(json) === true)
            return;
        this.id = json.id;
        this.title = json.title;
        this.body = json.body;
        this.partyName = json.partyName;
    }
    PokerItem.fromJSON = function (json) {
        return new PokerItem({
            id: json.id,
            title: json.title,
            body: json.body,
            partyName: json.partyName
        });
    };
    return PokerItem;
}());
exports["default"] = PokerItem;
