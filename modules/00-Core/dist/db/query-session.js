"use strict";
/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * This module provides session related queries.
 *
 * @module DB API: session related queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
var util = require('../util/util.js');
/**
 * Returns a promise that resolves into an array of objects containing 'sessionId', 'sessionKey' and 'creationTime'.
 *
 * @export
 * @param {*} db
 * @returns A promise of executing a query.
 */
function getAllSessions(db) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, 'SELECT SESSION_ID, SESSION_KEY, CREATION_TIME FROM SESSION', [])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.session)];
            }
        });
    });
}
/**
 * Sets the session dirty flag to false.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns A promise that resolves with the number of rows updated.
 */
function setSessionClean(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, 'UPDATE SESSION SET DIRTY = ? WHERE SESSION_ID = ?', [0, sessionId])];
        });
    });
}
/**
 * Resolves with true or false, depending whether this session is dirty.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns A promise that resolves into true or false, reflecting session dirty state.
 */
function getSessionDirtyFlag(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, 'SELECT DIRTY FROM SESSION WHERE SESSION_ID = ?', [sessionId])];
                case 1:
                    row = _a.sent();
                    if (row == null) {
                        return [2 /*return*/, undefined];
                    }
                    else {
                        return [2 /*return*/, dbApi.fromDbBool(row.DIRTY)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Resolves w/ the session tied to a session id.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns A promise that resolves into a session
 */
function getSessionFromSessionId(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT SESSION_ID, SESSION_KEY, CREATION_TIME FROM SESSION WHERE SESSION_ID = ?', [sessionId])
                    .then(dbMapping.map.session)];
        });
    });
}
/**
 * Resolves into a session id, obtained from window id.
 *
 * @export
 * @param {*} db
 * @param {*} sessionKey
 * @returns A promise that resolves into an object containing sessionId, sessionKey and creationTime.
 */
function getSessionInfoFromSessionKey(db, sessionKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT SESSION_ID, SESSION_KEY, CREATION_TIME FROM SESSION WHERE SESSION_KEY = ?', [sessionKey])
                    .then(dbMapping.map.session)];
        });
    });
}
/**
 * Returns a promise that will resolve into a sessionID created from a query.
 *
 * This method has essetially two different use cases:
 *   1.) When there is no sessionId yet (so sessionId argument is null), then this method is expected to either create a new session, or find a
 *       sessionId that is already associated with the given sessionKey.
 *
 *   2.) When a sessionId is passed, then the method simply updates the row with a given sessionId to contain sessionKey and windowId.
 *
 * In either case, the returned promise resolves with a sessionId.
 *
 * @export
 * @param {*} db
 * @param {*} userKey This is in essence the "session cookie id"
 * @param {*} sessionId If sessionId exists already, then it's passed in. If it doesn't then this is null.
 * @returns promise that resolves into a session id.
 */
function ensureZapSessionId(db, userKey, sessionId) {
    if (sessionId === void 0) { sessionId = null; }
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(sessionId == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, dbApi.dbGet(db, 'SELECT SESSION_ID FROM SESSION WHERE SESSION_KEY = ?', [userKey])];
                case 1:
                    row = _a.sent();
                    if (row == null) {
                        return [2 /*return*/, dbApi.dbInsert(db, 'INSERT INTO SESSION (SESSION_KEY, CREATION_TIME) VALUES (?,?)', [userKey, Date.now()])];
                    }
                    else {
                        return [2 /*return*/, row.SESSION_ID];
                    }
                    return [3 /*break*/, 4];
                case 2: 
                // This is a case where we want to attach to a given sessionId.
                return [4 /*yield*/, dbApi.dbUpdate(db, 'UPDATE SESSION SET SESSION_KEY = ? WHERE SESSION_ID = ?', [userKey, sessionId])];
                case 3:
                    // This is a case where we want to attach to a given sessionId.
                    _a.sent();
                    return [2 /*return*/, sessionId];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns a promise that will resolve into an existing userId and sessionId.
 * userId and sessionId that are passed as `options` are not
 * validated, they are trusted. If you pass both sessionId and
 * userId, this method will simply return them and do nothing.
 *
 * So don't use this method as "create if it doesn't exist" kind of
 * a method. The purpose is just to quickly ensure that an ID
 * is created when not passed.
 *
 * Returned promise resolves into an object with sessionId and userId.
 *
 * @export
 * @param {*} db
 * @param {*} userKey This is in essence the "session cookie id"
 * @param {*} sessionId If sessionId exists already, then it's passed in and linked to user.
 * @returns promise that resolves into an object with sessionId and userId and newSession.
 */
function ensureZapUserAndSession(db, userKey, sessionUuid, options) {
    if (options === void 0) { options = {
        sessionId: null,
        userId: null,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var user, sessionId, user, sessionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(options.sessionId != null && options.userId != null)) return [3 /*break*/, 1];
                    // if we're past both IDs, we simply return them back.
                    return [2 /*return*/, {
                            sessionId: options.sessionId,
                            userId: options.userId,
                            newSession: false,
                        }];
                case 1:
                    if (!(options.sessionId != null)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ensureUser(db, userKey)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, linkSessionToUser(db, options.sessionId, user.userId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {
                            sessionId: options.sessionId,
                            userId: user.userId,
                            newSession: false,
                        }];
                case 4:
                    if (!(options.userId != null)) return [3 /*break*/, 7];
                    return [4 /*yield*/, ensureBlankSession(db, sessionUuid)];
                case 5:
                    sessionId = _a.sent();
                    return [4 /*yield*/, linkSessionToUser(db, sessionId, options.userId)];
                case 6:
                    _a.sent();
                    return [2 /*return*/, {
                            sessionId: sessionId,
                            userId: options.userId,
                            newSession: true,
                        }];
                case 7: return [4 /*yield*/, ensureUser(db, userKey)];
                case 8:
                    user = _a.sent();
                    return [4 /*yield*/, ensureBlankSession(db, sessionUuid)];
                case 9:
                    sessionId = _a.sent();
                    return [4 /*yield*/, linkSessionToUser(db, sessionId, user.userId)];
                case 10:
                    _a.sent();
                    return [2 /*return*/, {
                            sessionId: sessionId,
                            userId: user.userId,
                            newSession: true,
                        }];
            }
        });
    });
}
function ensureBlankSession(db, uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbInsert(db, 'INSERT OR IGNORE INTO SESSION (SESSION_KEY, CREATION_TIME, DIRTY) VALUES (?,?,?)', [uuid, Date.now(), 0])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getSessionInfoFromSessionKey(db, uuid)];
                case 2:
                    session = _a.sent();
                    return [2 /*return*/, session.sessionId];
            }
        });
    });
}
/**
 * When loading in a file, we start with a blank session.
 *
 * @export
 * @param {*} db
 */
function createBlankSession(db, uuid) {
    if (uuid === void 0) { uuid = null; }
    return __awaiter(this, void 0, void 0, function () {
        var newUuid;
        return __generator(this, function (_a) {
            newUuid = uuid;
            if (newUuid == null)
                newUuid = util.createUuid();
            return [2 /*return*/, dbApi.dbInsert(db, 'INSERT INTO SESSION (SESSION_KEY, CREATION_TIME, DIRTY) VALUES (?,?,?)', [newUuid, Date.now(), 0])];
        });
    });
}
/**
 * Returns sessions for a given user.
 *
 * @param {*} db
 * @param {*} userId
 * @returns Promise that resolves into an array of sessions.
 */
function getUserSessions(db, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, 'SELECT SESSION_ID, CREATION_TIME, DIRTY FROM SESSION WHERE USER_REF = ?', [userId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.session)];
            }
        });
    });
}
/**
 * Returns user with a given key, or null if none exists.
 *
 * @param {*} db
 * @param {*} userKey
 * @returns A promise of returned user.
 */
function getUserByKey(db, userKey) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, 'SELECT USER_ID, USER_KEY, CREATION_TIME FROM USER WHERE USER_KEY = ?', [userKey])];
                case 1:
                    row = _a.sent();
                    return [2 /*return*/, dbMapping.map.user(row)];
            }
        });
    });
}
/**
 * Creates a new user entry for a given user key if it doesn't exist, or returns
 * the existing user.
 *
 * @param {*} db
 * @param {*} userKey
 * @returns user object, containing userId, userKey and creationTime
 */
function ensureUser(db, userKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbInsert(db, 'INSERT OR IGNORE INTO USER ( USER_KEY, CREATION_TIME ) VALUES (?,?)', [userKey, Date.now()])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, getUserByKey(db, userKey)];
            }
        });
    });
}
/**
 * Links an existing session with a user, given both IDs.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} userId
 * @returns promise that resolves into nothing
 */
function linkSessionToUser(db, sessionId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "UPDATE SESSION SET USER_REF = ? WHERE SESSION_ID = ?", [userId, sessionId])];
        });
    });
}
/**
 * Promises to delete a session from the database, including all the rows that have the session as a foreign key.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns A promise of a removal of session.
 */
function deleteSession(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbRemove(db, 'DELETE FROM SESSION WHERE SESSION_ID = ?', [
                    sessionId,
                ])];
        });
    });
}
/**
 * Write logs to the session log.
 *
 * @param {*} db database connection
 * @param {*} sessionId session id to write log to
 * @param {*} logArray array of objects containing 'timestamp' and 'log'
 * @returns promise of a database insert.
 */
function writeLog(db, sessionId, logArray) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO SESSION_LOG (SESSION_REF, TIMESTAMP, LOG) VALUES (?,?,?)', logArray.map(function (logEntry) {
                    return [sessionId, logEntry.timestamp, logEntry.log];
                }))];
        });
    });
}
/**
 * Read all logs for the session.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns promise that resolves into an array of objects containing 'timestamp' and 'log'
 */
function readLog(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT TIMESTAMP, LOG from SESSION_LOG WHERE SESSION_REF = ? ORDER BY TIMESTAMP', [sessionId])
                    .then(function (rows) { return rows.map(dbMapping.map.sessionLog); })];
        });
    });
}
/**
 * Promises to update or insert a key/value pair in SESSION_KEY_VALUE table.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @param {*} key
 * @param {*} value
 * @returns A promise of creating or updating a row, resolves with the rowid of a new row.
 */
function updateSessionKeyValue(db, sessionId, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, 'INSERT OR REPLACE INTO SESSION_KEY_VALUE (SESSION_REF, KEY, VALUE) VALUES (?,?,?)', [sessionId, key, value])];
        });
    });
}
/**
 * Promises to insert a key/value pair in SESSION_KEY_VALUE table. Ignore if value already exists.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @param {*} key
 * @param {*} value
 * @returns A promise of creating or updating a row, resolves with the rowid of a new row.
 */
function insertSessionKeyValue(db, sessionId, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, 'INSERT OR IGNORE INTO SESSION_KEY_VALUE (SESSION_REF, KEY, VALUE) VALUES (?,?,?)', [sessionId, key, value])];
        });
    });
}
/**
 * Promises to insert a whole batch of key/value pairs.
 * Any key/value inside object is loaded.
 *
 * @param {*} db
 * @param {*} session
 * @param {*} object
 * @returns Promise of multi-insert of all attributes inside object.
 */
function insertSessionKeyValues(db, sessionId, object) {
    return __awaiter(this, void 0, void 0, function () {
        var args, _a, _b, _c, key, value;
        var e_1, _d;
        return __generator(this, function (_e) {
            args = [];
            try {
                for (_a = __values(Object.entries(object)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    _c = __read(_b.value, 2), key = _c[0], value = _c[1];
                    args.push([sessionId, key, value]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT OR REPLACE INTO SESSION_KEY_VALUE (SESSION_REF, KEY, VALUE) VALUES (?,?,?)', args)];
        });
    });
}
/**
 * Retrieves a value of a single session key.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns A promise that resolves with a value or with 'undefined' if none is found.
 */
function getSessionKeyValue(db, sessionId, key) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, 'SELECT VALUE FROM SESSION_KEY_VALUE WHERE SESSION_REF = ? AND KEY = ?', [sessionId, key])];
                case 1:
                    row = _a.sent();
                    if (row == null) {
                        return [2 /*return*/, undefined];
                    }
                    else {
                        return [2 /*return*/, row.VALUE];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Resolves to an array of objects that contain 'key' and 'value'
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise to retrieve all session key values.
 */
function getAllSessionKeyValues(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, 'SELECT KEY, VALUE FROM SESSION_KEY_VALUE WHERE SESSION_REF = ? ORDER BY KEY', [sessionId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) {
                            return {
                                key: row.KEY,
                                value: row.VALUE,
                            };
                        })];
            }
        });
    });
}
// exports
exports.getAllSessions = getAllSessions;
exports.setSessionClean = setSessionClean;
exports.getSessionDirtyFlag = getSessionDirtyFlag;
exports.getSessionFromSessionId = getSessionFromSessionId;
exports.getSessionInfoFromSessionKey = getSessionInfoFromSessionKey;
exports.ensureZapSessionId = ensureZapSessionId;
exports.ensureZapUserAndSession = ensureZapUserAndSession;
exports.createBlankSession = createBlankSession;
exports.deleteSession = deleteSession;
exports.writeLog = writeLog;
exports.readLog = readLog;
exports.updateSessionKeyValue = updateSessionKeyValue;
exports.insertSessionKeyValue = insertSessionKeyValue;
exports.insertSessionKeyValues = insertSessionKeyValues;
exports.getSessionKeyValue = getSessionKeyValue;
exports.getAllSessionKeyValues = getAllSessionKeyValues;
exports.ensureUser = ensureUser;
exports.getUserSessions = getUserSessions;
//# sourceMappingURL=query-session.js.map