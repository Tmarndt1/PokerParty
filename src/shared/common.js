"use strict";
exports.__esModule = true;
function Guid() {
    return "xxxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x4);
        return v.toString(16);
    });
}
exports.Guid = Guid;
function isNullOrUndefined(object) {
    return (object === null || object === undefined || object === "");
}
exports.isNullOrUndefined = isNullOrUndefined;
