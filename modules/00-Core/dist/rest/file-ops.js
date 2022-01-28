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
/**
 * This module provides the interface to an extenal IDE: Simplicity Studio.
 *
 * @module External IDE interface.
 */
var restApi = require('../src-shared/rest-api.js');
var env = require('../util/env');
var importJs = require('../importexport/import.js');
var exportJs = require('../importexport/export.js');
var path = require('path');
var StatusCodes = require('http-status-codes').StatusCodes;
var querySession = require('../db/query-session.js');
var dbEnum = require('../src-shared/db-enum.js');
var studio = require('../ide-integration/studio-rest-api');
/**
 * HTTP POST: IDE open
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostFileOpen(db) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, zapFilePath, ideProjectPath, name, importResult, response, err_1, msg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, zapFilePath = _a.zapFilePath, ideProjectPath = _a.ideProjectPath;
                    name = '';
                    if (zapFilePath) {
                        name = path.posix.basename(zapFilePath);
                        env.logDebug("Loading project(".concat(name, ")"));
                    }
                    if (!zapFilePath) return [3 /*break*/, 7];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, importJs.importDataFromFile(db, zapFilePath, {
                            sessionId: req.zapSessionId,
                        })];
                case 2:
                    importResult = _b.sent();
                    response = {
                        sessionId: importResult.sessionId,
                        sessionKey: req.session.id,
                    };
                    env.logDebug("Loaded project(".concat(name, ") into database. RESP: ").concat(JSON.stringify(response)));
                    if (!ideProjectPath) return [3 /*break*/, 4];
                    env.logDebug("IDE: setting project path(".concat(name, ") to ").concat(ideProjectPath));
                    // store studio project path
                    return [4 /*yield*/, querySession.updateSessionKeyValue(db, req.zapSessionId, dbEnum.sessionKey.ideProjectPath, ideProjectPath)];
                case 3:
                    // store studio project path
                    _b.sent();
                    _b.label = 4;
                case 4:
                    res.status(StatusCodes.OK).json(response);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    err_1.project = zapFilePath;
                    studio.sendSessionCreationErrorStatus(db, err_1);
                    env.logError(JSON.stringify(err_1));
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    msg = "Opening/Loading project: Missing zap file path.";
                    env.logWarning(msg);
                    res.status(StatusCodes.BAD_REQUEST).send({ error: msg });
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: IDE save
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostFileSave(db) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var zapPath, actualPath, filePath, err_2, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zapPath = req.body.path;
                    env.logDebug("Saving session: id = ".concat(req.zapSessionId, ". path = ").concat(zapPath));
                    if (!(zapPath == null || zapPath.length == 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, querySession.getSessionKeyValue(db, req.zapSessionId, dbEnum.sessionKey.filePath)];
                case 1:
                    actualPath = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, querySession
                        .updateSessionKeyValue(db, req.zapSessionId, dbEnum.sessionKey.filePath, zapPath)
                        .then(function () { return zapPath; })];
                case 3:
                    actualPath = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(actualPath != null && actualPath.length > 0)) return [3 /*break*/, 9];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, exportJs.exportDataIntoFile(db, req.zapSessionId, actualPath)];
                case 6:
                    filePath = _a.sent();
                    res.status(StatusCodes.OK).send({ filePath: filePath });
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    msg = "Unable to save project.";
                    env.logError(msg, err_2);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err_2);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    res.status(StatusCodes.BAD_REQUEST).send({ error: 'No file specified.' });
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); };
}
exports.post = [
    {
        uri: restApi.ide.open,
        callback: httpPostFileOpen,
    },
    {
        uri: restApi.ide.save,
        callback: httpPostFileSave,
    },
];
//# sourceMappingURL=file-ops.js.map