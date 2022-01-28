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
 * This file provides the functionality that reads the ZAP data from a database
 * and exports it into a file.
 */
var os = require('os');
var fs = require('fs');
var fsp = fs.promises;
var path = require('path');
var env = require('../util/env');
var querySession = require('../db/query-session.js');
var queryImpExp = require('../db/query-impexp.js');
var dbEnum = require('../src-shared/db-enum.js');
function exportEndpointType(db, endpointType) {
    return __awaiter(this, void 0, void 0, function () {
        var data, ps;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryImpExp.exportClustersFromEndpointType(db, endpointType.endpointTypeId)];
                case 1:
                    data = _a.sent();
                    endpointType.clusters = data;
                    ps = data.map(function (endpointCluster) { return __awaiter(_this, void 0, void 0, function () {
                        var endpointClusterId, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    endpointClusterId = endpointCluster.endpointClusterId;
                                    delete endpointCluster.endpointClusterId;
                                    _a = endpointCluster;
                                    return [4 /*yield*/, queryImpExp.exportCommandsFromEndpointTypeCluster(db, endpointType.endpointTypeId, endpointClusterId)];
                                case 1:
                                    _a.commands =
                                        _c.sent();
                                    _b = endpointCluster;
                                    return [4 /*yield*/, queryImpExp.exportAttributesFromEndpointTypeCluster(db, endpointType.endpointTypeId, endpointClusterId)];
                                case 2:
                                    _b.attributes =
                                        _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, Promise.all(ps)];
            }
        });
    });
}
/**
 * Resolves to an array of endpoint types.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise to retrieve all endpoint types.
 */
function exportEndpointTypes(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, promises, endpoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryImpExp.exportEndpointTypes(db, sessionId)];
                case 1:
                    endpointTypes = _a.sent();
                    promises = endpointTypes.map(function (endpointType) {
                        return exportEndpointType(db, endpointType);
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, queryImpExp.exportEndpoints(db, sessionId, endpointTypes)];
                case 3:
                    endpoints = _a.sent();
                    endpointTypes.forEach(function (ept) {
                        delete ept.endpointTypeId;
                    });
                    endpoints.forEach(function (ep) {
                        delete ep.endpointTypeRef;
                    });
                    return [2 /*return*/, { endpointTypes: endpointTypes, endpoints: endpoints }];
            }
        });
    });
}
/**
 * Resolves with data for packages.
 *
 * @param {*} db
 * @param {*} sessionId
 */
function exportSessionPackages(db, sessionId, zapProjectFileLocation) {
    return __awaiter(this, void 0, void 0, function () {
        var packages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryImpExp.exportPackagesFromSession(db, sessionId)];
                case 1:
                    packages = _a.sent();
                    return [2 /*return*/, packages.map(function (p) {
                            var pathRelativity = dbEnum.pathRelativity.relativeToUserHome;
                            var relativePath = path.relative(os.homedir(), p.path);
                            if (zapProjectFileLocation != null) {
                                var rel = path.relative(path.dirname(zapProjectFileLocation), p.path);
                                if (rel.length > 0) {
                                    relativePath = rel;
                                    pathRelativity = dbEnum.pathRelativity.relativeToZap;
                                }
                            }
                            return {
                                pathRelativity: pathRelativity,
                                path: relativePath,
                                version: p.version,
                                type: p.type,
                            };
                        })];
            }
        });
    });
}
/**
 * Toplevel file that takes a given session ID and exports the data into the file
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @param {*} filePath
 * @returns A promise that resolves with the path of the file written.
 */
function exportDataIntoFile(db, sessionId, filePath, options) {
    if (options === void 0) { options = {
        removeLog: false,
        createBackup: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    env.logDebug("Writing state from session ".concat(sessionId, " into file ").concat(filePath));
                    return [4 /*yield*/, createStateFromDatabase(db, sessionId)];
                case 1:
                    state = _a.sent();
                    if (options.removeLog)
                        delete state.log;
                    if (fs.existsSync(filePath)) {
                        fs.copyFileSync(filePath, filePath + '~');
                    }
                    return [4 /*yield*/, fsp.writeFile(filePath, JSON.stringify(state, null, 2))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, querySession.setSessionClean(db, sessionId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, filePath];
            }
        });
    });
}
function getSessionKeyValues(db, sessionId, excludedKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var keyValues, zapFilePath, storedKeyValuePairs, x, exportedKeyValues, d;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, querySession.getAllSessionKeyValues(db, sessionId)];
                case 1:
                    keyValues = _a.sent();
                    env.logDebug("Retrieved session keys: ".concat(keyValues.length));
                    zapFilePath = null;
                    storedKeyValuePairs = keyValues.filter(function (datum) { return !excludedKeys.includes(datum.key); });
                    x = keyValues.filter(function (datum) { return datum.key == dbEnum.sessionKey.filePath; });
                    if (x.length > 0)
                        zapFilePath = x[0].value;
                    exportedKeyValues = {
                        key: 'keyValuePairs',
                        data: storedKeyValuePairs,
                        zapFilePath: zapFilePath,
                    };
                    return [4 /*yield*/, exportSessionPackages(db, sessionId, exportedKeyValues.zapFilePath)];
                case 2:
                    d = _a.sent();
                    return [2 /*return*/, [exportedKeyValues, { key: 'package', data: d }]];
            }
        });
    });
}
/**
 * Given a database and a session id, this method returns a promise that
 * resolves with a state object that needs to be saved into a file.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns state object that needs to be saved into a file.
 */
function createStateFromDatabase(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var state, promises, excludedKeys, allEndpointTypes, parseEndpointTypes, parseEndpoints, appendLogPromise, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = {
                        featureLevel: env.zapVersion().featureLevel,
                        creator: 'zap',
                    };
                    promises = [];
                    excludedKeys = [dbEnum.sessionKey.filePath];
                    env.logInfo("Exporting data for session: ".concat(sessionId));
                    promises.push(getSessionKeyValues(db, sessionId, excludedKeys));
                    return [4 /*yield*/, exportEndpointTypes(db, sessionId)];
                case 1:
                    allEndpointTypes = _a.sent();
                    parseEndpointTypes = Promise.resolve({
                        key: 'endpointTypes',
                        data: allEndpointTypes.endpointTypes,
                    });
                    parseEndpoints = Promise.resolve({
                        key: 'endpoints',
                        data: allEndpointTypes.endpoints,
                    });
                    appendLogPromise = querySession.readLog(db, sessionId).then(function (log) {
                        return { key: 'log', data: log };
                    });
                    promises.push(parseEndpointTypes);
                    promises.push(parseEndpoints);
                    promises.push(appendLogPromise);
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    data = _a.sent();
                    data.flat().forEach(function (keyDataPair) {
                        state[keyDataPair.key] = keyDataPair.data;
                    });
                    return [2 /*return*/, state];
            }
        });
    });
}
// exports
exports.exportDataIntoFile = exportDataIntoFile;
exports.createStateFromDatabase = createStateFromDatabase;
//# sourceMappingURL=export.js.map