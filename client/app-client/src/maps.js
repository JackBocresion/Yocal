"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valify = exports.mapify = exports.jsonify = void 0;
function jsonify() {
    return Array.from(this);
}
exports.jsonify = jsonify;
function mapify(key) {
    var outMap = new Map();
    this.forEach(function (e) {
        outMap.set(e[key], e);
    });
    return outMap;
}
exports.mapify = mapify;
function valify() {
    return Array.from(this.values());
}
exports.valify = valify;
