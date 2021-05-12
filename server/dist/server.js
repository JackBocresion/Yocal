"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express = require('express');
exports.app = express();
var cors = require('cors');
var crypto = __importStar(require("crypto"));
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
exports.app.use(express.json());
//app.use(cors());
//add a cors policy
// app.use(cors());
var pg_1 = require("pg");
var connection = new pg_1.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'jackbocresion',
    password: '',
    port: 5432,
});
(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, connection.connect()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); })();
exports.app.use(cors());
var argon2 = __importStar(require("argon2"));
var redis = __importStar(require("redis"));
var tokenCache = redis.createClient();
tokenCache.on('error', function (error) {
    console.error(error);
});
tokenCache.set('key', 'value', redis.print);
tokenCache.get('key', function (err, reply) { return console.log(reply, 'f'); });
var port = process.env.PORT || 8000;
exports.app.listen(port, function () { return console.log('listening on port ' + port); });
var http_1 = require("http");
var httpServer = http_1.createServer(exports.app);
// const io = new Server(httpServer);
var io = require("socket.io")(httpServer);
httpServer.listen(4000);
io.on('connection', function (socket) {
    var uuid = socket.handshake.query.uuid;
    socket.join(uuid);
    console.log(uuid, 'uuid FLAG ON CLIENT');
    socket.on('requestFriend', function (requested) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('FRIEND REQUEST!!!');
                    return [4 /*yield*/, connection.query("SELECT * FROM users WHERE username='" + requested + "'")];
                case 1:
                    user = (_a.sent()).rows[0];
                    io.to(user.uuid).emit('requested');
                    console.log('emmited to user with uuid ', user.uuid);
                    return [2 /*return*/];
            }
        });
    }); });
    //FIX EMMITING AND WEBSOCKET CLIENT IMPLEMENTATION
    socket.on('555', function (f) {
        socket.emit('pong');
    });
});
function Authenticate(req, res, next) {
    var _this = this;
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    tokenCache.get(token, function (err, val) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, res.sendStatus(500)];
                    }
                    if (val === null) {
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    console.log('Authenticated user with UUID:' + val);
                    _a = req;
                    return [4 /*yield*/, connection.query("SELECT username, uuid FROM users WHERE uuid::text='" + val + "'")];
                case 1:
                    _a.user = (_b.sent()).rows[0];
                    next();
                    return [2 /*return*/];
            }
        });
    }); });
}
var maps_1 = require("./maps");
Array.prototype.mapify = maps_1.mapify;
Map.prototype.jsonify = maps_1.jsonify;
//check types.d.ts
exports.app.get('/getuser', Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events, incoming, outgoing;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, connection.query("SELECT * FROM events WHERE creator='{" + ((_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid) + "}'")];
            case 1:
                events = (_d.sent()).rows;
                return [4 /*yield*/, connection.query("SElECT username, uuid FROM requests JOIN users ON requester=uuid WHERE requested='{" + ((_b = req.user) === null || _b === void 0 ? void 0 : _b.uuid) + "}'")];
            case 2:
                incoming = (_d.sent()).rows;
                return [4 /*yield*/, connection.query("SElECT username, uuid FROM requests JOIN users ON requested=uuid WHERE requester='{" + ((_c = req.user) === null || _c === void 0 ? void 0 : _c.uuid) + "}'")];
            case 3:
                outgoing = (_d.sent()).rows;
                res.json(__assign(__assign({}, req.user), { events: events.mapify('eventid').jsonify(), incoming: incoming.mapify('requester').jsonify(), outgoing: outgoing.mapify('requested').jsonify() }));
                return [2 /*return*/];
        }
    });
}); });
exports.app.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, hash, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                username = username.trim();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, argon2.hash(password)];
            case 2:
                hash = _b.sent();
                return [4 /*yield*/, connection.query("INSERT INTO users(username, password) VALUES('" + username + "', '" + hash + "')")];
            case 3:
                _b.sent();
                return [2 /*return*/, res.sendStatus(201)];
            case 4:
                err_1 = _b.sent();
                console.error(err_1);
                console.log('error!');
                res.sendStatus(400);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.app.post('/createevent', Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, date, title, duration, users, insertion_1, e_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, date = _a.date, title = _a.title, duration = _a.duration, users = _a.users;
                console.log(users);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                return [4 /*yield*/, connection.query("INSERT INTO events(title, date, duration, creator) VALUES('" + title + "', '" + date + "', " + duration + ", '{" + ((_b = req.user) === null || _b === void 0 ? void 0 : _b.uuid) + "}') RETURNING *")];
            case 2:
                insertion_1 = (_d.sent()).rows[0];
                return [4 /*yield*/, connection.query("INSERT INTO event_relations(event, user_uuid) VALUES('" + insertion_1.eventid + "', '" + ((_c = req.user) === null || _c === void 0 ? void 0 : _c.uuid) + "')")];
            case 3:
                _d.sent();
                users.forEach(function (username) { return __awaiter(void 0, void 0, void 0, function () {
                    var user, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, connection.query("SELECT * FROM users WHERE username='" + username + "'")];
                            case 1:
                                user = (_a.sent()).rows[0];
                                console.log("found user", username, user);
                                return [4 /*yield*/, connection.query("INSERT INTO event_relations(event, user_uuid) VALUES('" + insertion_1.eventid + "', '" + user.uuid + "') RETURNING *")];
                            case 2:
                                i = _a.sent();
                                console.log(i);
                                io.to(user.uuid).emit("invite", {});
                                console.log("DONE@!");
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.json({ uid: insertion_1.eventid });
                return [3 /*break*/, 5];
            case 4:
                e_1 = _d.sent();
                console.log('error!', e_1);
                res.sendStatus(500);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
var EXP = 864000;
exports.app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, rows, user_1, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('post req made for login!');
                _a = req.body, username = _a.username, password = _a.password;
                console.log(req.body);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connection.query("SELECT * FROM users WHERE username='" + username + "';")];
            case 2:
                rows = (_b.sent()).rows;
                if (rows.length === 0) {
                    throw 404;
                }
                user_1 = rows[0];
                if (argon2.verify(user_1.password, password)) {
                    console.log('verified!');
                    crypto.randomBytes(48, function (err, buffer) {
                        var token = buffer.toString('hex');
                        tokenCache.setex(token, EXP, user_1.uuid, function (err, result) {
                            if (err) {
                                throw err;
                            }
                            // console.log(token)
                            res.json({ token: token });
                        });
                    });
                }
                else {
                    console.log('not verified!');
                }
                return [3 /*break*/, 4];
            case 3:
                e_2 = _b.sent();
                console.log(e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.app.post('/delete/:eid', Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var eid, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                eid = req.params.eid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connection.query("DELETE FROM events WHERE eventid='{" + eid + "}'")];
            case 2:
                _a.sent();
                res.sendStatus(200);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.log('PANIC ON DELETE');
                console.error(e_3);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.app.post('/editevent', Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, date, title, duration, eventid, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, date = _a.date, title = _a.title, duration = _a.duration, eventid = _a.eventid;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connection.query("UPDATE events SET title='" + title + "', date='" + date + "', duration='" + duration + "' WHERE eventid='" + eventid + "'")];
            case 2:
                _b.sent();
                res.sendStatus(200);
                return [3 /*break*/, 4];
            case 3:
                e_4 = _b.sent();
                console.log("error!", e_4);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.app.post('/adduser', Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requested, requestedUserRows, requestedUser, e_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                requested = req.body.requested;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, connection.query("SELECT username, uuid FROM users WHERE username='" + requested + "'")];
            case 2:
                requestedUserRows = (_c.sent()).rows;
                if (requestedUserRows.length === 0) {
                    throw 404;
                }
                requestedUser = requestedUserRows[0];
                console.log(requestedUser.uuid, 'requestedUser.uuid');
                return [4 /*yield*/, connection.query("SELECT * FROM requests WHERE requester='{" + ((_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid) + "}' AND requested='{" + requestedUser.uuid + "}'")];
            case 3:
                if ((_c.sent()).rows[0])
                    throw (403);
                return [4 /*yield*/, connection.query("INSERT INTO requests(requester, requested) VALUES('{" + ((_b = req.user) === null || _b === void 0 ? void 0 : _b.uuid) + "}','{" + requestedUser.uuid + "}')")];
            case 4:
                _c.sent();
                io.to(requestedUser.uuid).emit('requested', req.user);
                res.json({ requestedUser: requestedUser });
                return [3 /*break*/, 6];
            case 5:
                e_5 = _c.sent();
                console.error(e_5);
                if (e_5 === 403)
                    return [2 /*return*/, res.sendStatus(403)];
                if (e_5 === 404)
                    return [2 /*return*/, res.sendStatus(404)];
                res.sendStatus(500);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
setInterval(function () {
    io.emit("f", "g");
    // console.log("emmitted!!")
}, 2000);
