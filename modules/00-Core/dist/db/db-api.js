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
/**
 * This module provides generic DB functions for performing SQL queries.
 *
 * @module JS API: low level database access
 */
var sqlite = require('sqlite3'); // TODO add  sql.js for browser env
var fsp = require('fs').promises;
var env = require('../util/env'); // TODO logger functionality for all envs ...
var util = require('../util/util.js');
var dbEnum = require('../src-shared/db-enum.js');
var dbCache = require('./db-cache');
// This is a SQLITE specific thing. With SQLITE databases,
// we can't have multiple transactions. So this mechanism
// here is handling this.
// If this code ever runs against a database engine that
// supports multiple transactions, this can all go away.
//
var inTransaction = false;
function executeBeginTransaction(db, resolve, reject) {
    db.run('BEGIN TRANSACTION', [], function (err) {
        if (err) {
            env.logError('Failed to BEGIN TRANSACTION');
            reject(err);
        }
        else {
            env.logSql('Executed BEGIN TRANSACTION');
            resolve();
        }
    });
}
function delayBeginTransaction(db, resolve, reject) {
    var cnt = 0;
    var interval = setInterval(function () {
        if (inTransaction) {
            cnt++;
            if (cnt > 100) {
                reject('Waited for 10s for transaction to relinquish, but it did not.');
            }
        }
        else {
            clearInterval(interval);
            executeBeginTransaction(db, resolve, reject);
        }
    }, 100);
}
/**
 * Returns a promise to begin a transaction. The beginning of the
 * transaction will be delayed for up to 5 seconds, checking every
 * 1/10th of a second of previous transaction is already finished.
 *
 * After 5 seconds, the code gives up and rejects the promise.
 *
 * This is to allow simultaneous calls to this function, even though
 * SQLite does not allow for simultaneous transactions.
 *
 * So use transactions responsibly.
 *
 * @export
 * @param {*} db
 * @returns A promise that resolves without an argument and rejects with an error from BEGIN TRANSACTION query.
 */
function dbBeginTransaction(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (inTransaction) {
                        delayBeginTransaction(db, resolve, reject);
                    }
                    else {
                        inTransaction = true;
                        executeBeginTransaction(db, resolve, reject);
                    }
                })];
        });
    });
}
/**
 * Returns a promise to execute a commit.
 *
 * @export
 * @param {*} db
 * @returns A promise that resolves without an argument or rejects with an error from COMMIT query.
 */
function dbCommit(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run('COMMIT', [], function (err) {
                        if (err) {
                            env.logError('Failed to COMMIT');
                            reject(err);
                        }
                        else {
                            env.logSql('Executed COMMIT');
                            inTransaction = false;
                            resolve();
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to execute a rollback of a transaction.
 *
 * @export
 * @param {*} db
 * @returns A promise that resolves without an argument or rejects with an error from ROLLBACK query.
 */
function dbRollback(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run('ROLLBACK', [], function (err) {
                        if (err) {
                            env.logError('Failed to ROLLBACK');
                            reject(err);
                        }
                        else {
                            env.logSql('Executed ROLLBACK');
                            inTransaction = false;
                            resolve();
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to execute a DELETE FROM query.
 *
 * @export
 * @param {*} db
 * @param {*} query
 * @param {*} args
 * @returns A promise that resolve with the number of delete rows, or rejects with an error from query.
 */
function dbRemove(db, query, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run(query, args, function (err) {
                        if (err) {
                            env.logError("Failed remove: ".concat(query, ": ").concat(args));
                            reject(err);
                        }
                        else {
                            env.logSql('Executed remove', query, args);
                            resolve(this.changes);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to execute an update query.
 *
 * @export
 * @param {*} db
 * @param {*} query
 * @param {*} args
 * @returns A promise that resolves with a number of changed rows, or rejects with an error from the query.
 */
function dbUpdate(db, query, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run(query, args, function (err) {
                        if (err) {
                            env.logError("Failed update: ".concat(query, ": ").concat(args));
                            reject(err);
                        }
                        else {
                            env.logSql('Executed update', query, args);
                            resolve(this.changes);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to execute an insert query.
 *
 * @export
 * @param {*} db
 * @param {*} query
 * @param {*} args
 * @returns A promise that resolves with the rowid from the inserted row, or rejects with an error from the query.
 */
function dbInsert(db, query, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run(query, args, function (err) {
                        if (err) {
                            env.logError("Failed insert: ".concat(query, ": ").concat(args, " : ").concat(err));
                            reject(err);
                        }
                        else {
                            env.logSql('Executed insert', query, args);
                            resolve(this.lastID);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to execute a query to perform a select that returns all rows that match a query.
 *
 * @export
 * @param {*} db
 * @param {*} query
 * @param {*} args
 * @returns A promise that resolves with the rows that got retrieved from the database, or rejects with an error from the query.
 */
function dbAll(db, query, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.all(query, args, function (err, rows) {
                        if (err) {
                            env.logError("Failed all: ".concat(query, ": ").concat(args, " : ").concat(err));
                            reject(err);
                        }
                        else {
                            env.logSql('Executed all', query, args);
                            resolve(rows);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to execute a query to perform a select that returns first row that matches a query.
 *
 * @export
 * @param {*} db
 * @param {*} query
 * @param {*} args
 * @returns A promise that resolves with a single row that got retrieved from the database, or rejects with an error from the query.
 */
function dbGet(db, query, args, reportError) {
    if (reportError === void 0) { reportError = true; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.get(query, args, function (err, row) {
                        if (err) {
                            if (reportError)
                                env.logError("Failed get: ".concat(query, ": ").concat(args, " : ").concat(err));
                            reject(err);
                        }
                        else {
                            env.logSql('Executed get', query, args);
                            resolve(row);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to perform a prepared statement, using data from array for SQL parameters.
 * It resolves with an array of rows, containing the data, or rejects with an error.
 *
 * @param {*} db
 * @param {*} sql
 * @param {*} arrayOfArrays
 */
function dbMultiSelect(db, sql, arrayOfArrays) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    env.logSql('Preparing select', sql, arrayOfArrays.length);
                    var rows = [];
                    var statement = db.prepare(sql, function (err) {
                        var e_1, _a;
                        if (err)
                            reject(err);
                        try {
                            for (var arrayOfArrays_1 = __values(arrayOfArrays), arrayOfArrays_1_1 = arrayOfArrays_1.next(); !arrayOfArrays_1_1.done; arrayOfArrays_1_1 = arrayOfArrays_1.next()) {
                                var singleArray = arrayOfArrays_1_1.value;
                                statement.get(singleArray, function (err2, row) {
                                    if (err2) {
                                        reject(err2);
                                    }
                                    else {
                                        rows.push(row);
                                    }
                                });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (arrayOfArrays_1_1 && !arrayOfArrays_1_1.done && (_a = arrayOfArrays_1.return)) _a.call(arrayOfArrays_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        statement.finalize(function (err3) {
                            if (err3) {
                                reject(err3);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                    });
                })];
        });
    });
}
/**
 * Returns a promise to perfom a prepared statement, using data from array for SQL parameters.
 * It resolves with an array of rowids, or rejects with an error.
 *
 * @export
 * @param {*} db
 * @param {*} sql
 * @param {*} arrayOfArrays
 * @returns A promise that resolves with the array of rowids for the rows that got inserted, or rejects with an error from the query.
 */
function dbMultiInsert(db, sql, arrayOfArrays) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    env.logSql('Preparing insert', sql, arrayOfArrays.length);
                    var lastIds = [];
                    var statement = db.prepare(sql, function (err) {
                        var e_2, _a;
                        var _this = this;
                        if (err)
                            reject(err);
                        try {
                            for (var arrayOfArrays_2 = __values(arrayOfArrays), arrayOfArrays_2_1 = arrayOfArrays_2.next(); !arrayOfArrays_2_1.done; arrayOfArrays_2_1 = arrayOfArrays_2.next()) {
                                var singleArray = arrayOfArrays_2_1.value;
                                statement.run(singleArray, function (err2) {
                                    if (err2)
                                        reject(err2);
                                    lastIds.push(_this.lastID);
                                });
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (arrayOfArrays_2_1 && !arrayOfArrays_2_1.done && (_a = arrayOfArrays_2.return)) _a.call(arrayOfArrays_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        statement.finalize(function (err3) {
                            if (err3)
                                reject(err3);
                            resolve(lastIds);
                        });
                    });
                })];
        });
    });
}
/**
 * Returns a promise that will resolve when the database in question is closed.
 * Rejects with an error if closing fails.
 *
 * @param {*} database
 * @returns A promise that resolves without an argument or rejects with error from the database closing.
 */
function closeDatabase(database) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dbCache.clear();
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    env.logSql('About to close database.');
                    database.close(function (err) {
                        if (err)
                            return reject(err);
                        env.logSql('Database is closed.');
                        resolve();
                    });
                })];
        });
    });
}
/**
 * Imediatelly closes the database.
 *
 * @param {*} database
 */
function closeDatabaseSync(database) {
    dbCache.clear();
    env.logSql('About to close database.');
    database.close(function (err) {
        if (err)
            console.log("Database close error: ".concat(err));
        env.logSql('Database is closed.');
    });
}
/**
 * Create in-memory database.
 *
 *  @returns Promise that resolve with the Db.
 */
function initRamDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dbCache.clear();
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var db = new sqlite.Database(':memory:', function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            env.logSql("Connected to the RAM database.");
                            resolve(db);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to initialize a database.
 *
 * @export
 * @param {*} sqlitePath
 * @returns A promise that resolves with the database object that got created, or rejects with an error if something went wrong.
 */
function initDatabase(sqlitePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dbCache.clear();
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var db = new sqlite.Database(sqlitePath, function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            env.logSql("Connected to the database at: ".concat(sqlitePath));
                            resolve(db);
                        }
                    });
                })];
        });
    });
}
/**
 * Returns a promise to insert or replace a setting into the database.
 *
 * @param {*} db
 * @param {*} version
 * @returns  A promise that resolves with a rowid of created setting row or rejects with error if something goes wrong.
 */
function insertOrReplaceSetting(db, category, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbInsert(db, 'INSERT OR REPLACE INTO SETTING ( CATEGORY, KEY, VALUE ) VALUES ( ?, ?, ? )', [category, key, value])];
        });
    });
}
function determineIfSchemaShouldLoad(db, context) {
    return __awaiter(this, void 0, void 0, function () {
        var row, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dbGet(db, 'SELECT CRC FROM PACKAGE WHERE PATH = ?', [context.filePath], false)];
                case 1:
                    row = _a.sent();
                    if (row == null) {
                        context.mustLoad = true;
                    }
                    else {
                        context.mustLoad = row.CRC != context.crc;
                    }
                    context.hasSchema = true;
                    return [2 /*return*/, context];
                case 2:
                    err_1 = _a.sent();
                    // Fall through, do nothing
                    context.mustLoad = true;
                    context.hasSchema = false;
                    return [2 /*return*/, context];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateCurrentSchemaCrc(db, context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbInsert(db, 'INSERT OR REPLACE INTO PACKAGE (PATH, CRC, TYPE) VALUES ( ?, ?, ? )', [context.filePath, context.crc, dbEnum.packageType.sqlSchema])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, context];
            }
        });
    });
}
function performSchemaLoad(db, schemaContent) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    env.logSql('Loading schema.');
                    db.serialize(function () {
                        db.exec(schemaContent, function (err) {
                            if (err) {
                                env.logError('Failed to populate schema');
                                env.logError(err);
                                reject(err);
                            }
                            resolve();
                        });
                    });
                })];
        });
    });
}
/**
 * Returns a promise to load schema into a blank database, and inserts a version to the settings table.j
 *
 * @export
 * @param {*} db
 * @param {*} schemaPath
 * @param {*} zapVersion
 * @returns A promise that resolves with the same db that got passed in, or rejects with an error.
 */
function loadSchema(db, schemaPath, zapVersion, sqliteFile) {
    if (sqliteFile === void 0) { sqliteFile = null; }
    return __awaiter(this, void 0, void 0, function () {
        var schemaFileContent, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsp.readFile(schemaPath, 'utf8')];
                case 1:
                    schemaFileContent = _a.sent();
                    context = {
                        filePath: schemaPath,
                        data: schemaFileContent,
                        crc: util.checksum(schemaFileContent),
                    };
                    return [4 /*yield*/, determineIfSchemaShouldLoad(db, context)];
                case 2:
                    _a.sent();
                    if (!(context.mustLoad && context.hasSchema)) return [3 /*break*/, 4];
                    return [4 /*yield*/, closeDatabase(db)];
                case 3:
                    _a.sent();
                    if (sqliteFile != null)
                        util.createBackupFile(sqliteFile);
                    _a.label = 4;
                case 4:
                    if (!(context.mustLoad && context.hasSchema)) return [3 /*break*/, 8];
                    if (!(sqliteFile == null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, initRamDatabase()];
                case 5:
                    db = _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, initDatabase(sqliteFile)];
                case 7:
                    db = _a.sent();
                    _a.label = 8;
                case 8:
                    if (!context.mustLoad) return [3 /*break*/, 11];
                    return [4 /*yield*/, performSchemaLoad(db, context.data)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, updateCurrentSchemaCrc(db, context)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11: return [4 /*yield*/, insertOrReplaceSetting(db, 'APP', 'VERSION', zapVersion.version)];
                case 12:
                    _a.sent();
                    if (!('hash' in zapVersion)) return [3 /*break*/, 14];
                    return [4 /*yield*/, insertOrReplaceSetting(db, 'APP', 'HASH', zapVersion.hash)];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14:
                    if (!('date' in zapVersion)) return [3 /*break*/, 16];
                    return [4 /*yield*/, insertOrReplaceSetting(db, 'APP', 'DATE', zapVersion.date)];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16: return [2 /*return*/, db];
            }
        });
    });
}
/**
 * Init database and load the schema.
 *
 * @param {*} sqliteFile
 * @param {*} schemaFile
 * @param {*} zapVersion
 * @returns Promise that resolves into the database object.
 */
function initDatabaseAndLoadSchema(sqliteFile, schemaFile, zapVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDatabase(sqliteFile)];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, loadSchema(db, schemaFile, zapVersion, sqliteFile)];
            }
        });
    });
}
/**
 * Returns the data that should be stored into the DB column, from the passed JS boolean.
 *
 * @param {*} value
 * @returns Value to be stored into the database.
 */
function toDbBool(value) {
    return value ? 1 : 0;
}
/**
 * Returns a true or false JS boolean from the value that was read in the database.
 *
 * @param {*} value
 * @return value to be used in JS after reading value from database.
 */
function fromDbBool(value) {
    return value == 1;
}
exports.dbBeginTransaction = dbBeginTransaction;
exports.dbCommit = dbCommit;
exports.dbRollback = dbRollback;
exports.dbRemove = dbRemove;
exports.dbUpdate = dbUpdate;
exports.dbInsert = dbInsert;
exports.dbAll = dbAll;
exports.dbGet = dbGet;
exports.dbMultiSelect = dbMultiSelect;
exports.dbMultiInsert = dbMultiInsert;
exports.closeDatabase = closeDatabase;
exports.closeDatabaseSync = closeDatabaseSync;
exports.initRamDatabase = initRamDatabase;
exports.initDatabase = initDatabase;
exports.loadSchema = loadSchema;
exports.initDatabaseAndLoadSchema = initDatabaseAndLoadSchema;
exports.toDbBool = toDbBool;
exports.fromDbBool = fromDbBool;
//# sourceMappingURL=db-api.js.map