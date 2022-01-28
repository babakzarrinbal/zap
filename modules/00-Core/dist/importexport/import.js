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
/*
 * This file provides the functionality that reads the ZAP data from a JSON file
 * and imports it into a database.
 */
var fsp = require('fs').promises;
var path = require('path');
var importIsc = require('./import-isc.js');
var importJson = require('./import-json.js');
var dbApi = require('../db/db-api.js');
var querySession = require('../db/query-session.js');
var env = require('../util/env');
var script = require('../util/script');
/**
 * Reads the data from the file and resolves with the state object if all is good.
 *
 * @export
 * @param {*} filePath
 * @returns Promise of file reading.
 */
function readDataFromFile(filePath, defaultZclMetafile) {
    return __awaiter(this, void 0, void 0, function () {
        var data, stringData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsp.readFile(filePath)];
                case 1:
                    data = _a.sent();
                    stringData = data.toString().trim();
                    if (stringData.startsWith('{')) {
                        return [2 /*return*/, importJson.readJsonData(filePath, data)];
                    }
                    else if (stringData.startsWith('#ISD')) {
                        return [2 /*return*/, importIsc.readIscData(filePath, data, defaultZclMetafile == null
                                ? env.builtinSilabsZclMetafile()
                                : defaultZclMetafile)];
                    }
                    else {
                        throw new Error('Invalid file format. Only .zap JSON files and ISC file format are supported.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function executePostImportScript(db, sessionId, scriptFile) {
    return __awaiter(this, void 0, void 0, function () {
        var context;
        return __generator(this, function (_a) {
            context = {
                db: db,
                sessionId: sessionId,
            };
            return [2 /*return*/, script.executeScriptFunction(script.functions.postLoad, context, scriptFile)];
        });
    });
}
/**
 * Writes the data from the file into a new session.
 * NOTE: This function does NOT initialize session packages.
 *
 * @export
 * @param {*} db
 * @param {*} filePath
 * @returns a promise that resolves with the import result object that contains: sessionId, errors, warnings.
 */
function importDataFromFile(db, filePath, options) {
    if (options === void 0) { options = {
        sessionId: null,
        defaultZclMetafile: env.builtinSilabsZclMetafile(),
        postImportScript: null,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var state, sid, loaderResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 9, 10]);
                    return [4 /*yield*/, readDataFromFile(filePath, options.defaultZclMetafile)];
                case 1:
                    state = _a.sent();
                    return [4 /*yield*/, dbApi.dbBeginTransaction(db)];
                case 2:
                    _a.sent();
                    sid = void 0;
                    if (!(options.sessionId == null)) return [3 /*break*/, 4];
                    return [4 /*yield*/, querySession.createBlankSession(db)];
                case 3:
                    sid = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    sid = options.sessionId;
                    _a.label = 5;
                case 5: return [4 /*yield*/, state.loader(db, state, sid)];
                case 6:
                    loaderResult = _a.sent();
                    if (!(options.postImportScript != null)) return [3 /*break*/, 8];
                    return [4 /*yield*/, executePostImportScript(db, loaderResult.sessionId, options.postImportScript)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, loaderResult];
                case 9:
                    dbApi.dbCommit(db);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// exports
exports.readDataFromFile = readDataFromFile;
exports.importDataFromFile = importDataFromFile;
exports.executePostImportScript = executePostImportScript;
//# sourceMappingURL=import.js.map