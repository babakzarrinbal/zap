"use strict";
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
var fs = require('fs');
var util = require('../util/util.js');
var dbEnum = require('../src-shared/db-enum.js');
var env = require('../util/env');
var queryConfig = require('../db/query-config.js');
var queryPackage = require('../db/query-package.js');
var queryImpexp = require('../db/query-impexp.js');
var querySession = require('../db/query-session.js');
/**
 * Resolves with a promise that imports session key values.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} keyValuePairs
 */
function importSessionKeyValues(db, sessionId, keyValuePairs) {
    return __awaiter(this, void 0, void 0, function () {
        var allQueries;
        return __generator(this, function (_a) {
            allQueries = [];
            if (keyValuePairs != null) {
                env.logDebug("Loading ".concat(keyValuePairs.length, " key value pairs."));
                // Write key value pairs
                keyValuePairs.forEach(function (element) {
                    allQueries.push(querySession.updateSessionKeyValue(db, sessionId, element.key, element.value));
                });
            }
            return [2 /*return*/, Promise.all(allQueries).then(function () { return sessionId; })];
        });
    });
}
function getPkgPath(pkg, zapFilePath) {
    if ('pathRelativity' in pkg) {
        return util.createAbsolutePath(pkg.path, pkg.pathRelativity, zapFilePath);
    }
    else {
        return pkg.path;
    }
}
// Resolves into a { packageId:, packageType:}
// object, pkg has`path`, `version`, `type`. It can ALSO have pathRelativity. If pathRelativity is missing
// path is considered absolute.
function importSinglePackage(db, sessionId, pkg, zapFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, pkgId, packages, msg, existingPackages, p, p, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    absPath = getPkgPath(pkg, zapFilePath);
                    return [4 /*yield*/, queryPackage.getPackageIdByPathAndTypeAndVersion(db, absPath, pkg.type, pkg.version)];
                case 1:
                    pkgId = _a.sent();
                    if (pkgId != null) {
                        // Perfect match found, return it and be done.
                        return [2 /*return*/, {
                                packageId: pkgId,
                                packageType: pkg.type,
                            }];
                    }
                    // Now we have to perform the guessing logic.
                    env.logDebug('Packages from the file did not match loaded packages making best bet.');
                    return [4 /*yield*/, queryPackage.getPackagesByType(db, pkg.type)
                        // If there isn't any, then abort, but if there is only one, use it.
                    ];
                case 2:
                    packages = _a.sent();
                    // If there isn't any, then abort, but if there is only one, use it.
                    if (packages.length == 0) {
                        if (pkg.type == dbEnum.packageType.genTemplatesJson) {
                            // We don't throw exception for genTemplatesJson, we can survive without.
                            env.logDebug("No packages of type ".concat(pkg.type, " found in the database."));
                            return [2 /*return*/, null];
                        }
                        else {
                            throw new Error("No packages of type ".concat(pkg.type, " found in the database."));
                        }
                    }
                    else if (packages.length == 1) {
                        env.logDebug("Only one package of given type ".concat(pkg.type, " present. Using it."));
                        return [2 /*return*/, {
                                packageId: packages[0].id,
                                packageType: pkg.type,
                            }];
                    }
                    // Filter to just the ones that match the version
                    packages = packages.filter(function (p) { return p.version == pkg.version; });
                    // If there isn't any abort, if there is only one, use it.
                    if (packages.length == 0) {
                        msg = "No packages of type ".concat(pkg.type, " that match version ").concat(pkg.version, " found in the database.");
                        if (pkg.type == dbEnum.packageType.genTemplatesJson) {
                            // We don't throw exception for genTemplatesJson, we can survive without.
                            env.logDebug(msg);
                            return [2 /*return*/, null];
                        }
                        else {
                            throw new Error(msg);
                        }
                    }
                    else if (packages.length == 1) {
                        env.logDebug("Only one package of given type ".concat(pkg.type, " and version ").concat(pkg.version, " present. Using it."));
                        return [2 /*return*/, {
                                packageId: packages[0].id,
                                packageType: pkg.type,
                            }];
                    }
                    existingPackages = packages.filter(function (p) { return fs.existsSync(p.path); });
                    if (existingPackages.length == 1) {
                        p = existingPackages[0];
                        env.logWarning("Using only package that exists:".concat(p.id, "."));
                        return [2 /*return*/, {
                                packageId: p.id,
                                packageType: pkg.type,
                            }];
                    }
                    else if (existingPackages.length > 1) {
                        p = existingPackages[0];
                        env.logWarning("Using first package that exists out of ".concat(existingPackages.length, ": ").concat(p.id, "."));
                        return [2 /*return*/, {
                                packageId: p.id,
                                packageType: pkg.type,
                            }];
                    }
                    else {
                        p = packages[0];
                        env.logWarning("None of packages exist, so using first one overall: ".concat(p.id, "."));
                        return [2 /*return*/, {
                                packageId: p.id,
                                packageType: pkg.type,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Resolves an array of { packageId:, packageType:} objects into { packageId: id, otherIds: [] }
function convertPackageResult(sessionId, data) {
    var ret = {
        sessionId: sessionId,
        packageId: null,
        otherIds: [],
        optionalIds: [],
    };
    data.forEach(function (obj) {
        if (obj == null)
            return null;
        if (obj.packageType == dbEnum.packageType.zclProperties) {
            ret.packageId = obj.packageId;
        }
        else if (obj.packageType == dbEnum.packageType.genTemplatesJson) {
            ret.otherIds.push(obj.packageId);
        }
        else {
            ret.optionalIds.push(obj.packageId);
        }
    });
    return ret;
}
// Returns a promise that resolves into an object containing: packageId and otherIds
function importPackages(db, sessionId, packages, zapFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var allQueries, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allQueries = [];
                    if (packages != null) {
                        env.logDebug("Loading ".concat(packages.length, " packages"));
                        packages.forEach(function (p) {
                            allQueries.push(importSinglePackage(db, sessionId, p, zapFilePath));
                        });
                    }
                    return [4 /*yield*/, Promise.all(allQueries)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, convertPackageResult(sessionId, data)];
            }
        });
    });
}
function importEndpointTypes(db, sessionId, packageId, endpointTypes, endpoints) {
    return __awaiter(this, void 0, void 0, function () {
        var allQueries, sortedEndpoints;
        return __generator(this, function (_a) {
            allQueries = [];
            sortedEndpoints = {};
            if (endpoints != null) {
                endpoints.forEach(function (ep) {
                    var eptIndex = ep.endpointTypeIndex;
                    if (sortedEndpoints[eptIndex] == null)
                        sortedEndpoints[eptIndex] = [];
                    sortedEndpoints[eptIndex].push(ep);
                });
            }
            if (endpointTypes != null) {
                env.logDebug("Loading ".concat(endpointTypes.length, " endpoint types"));
                endpointTypes.forEach(function (et, index) {
                    allQueries.push(queryImpexp
                        .importEndpointType(db, sessionId, packageId, et)
                        .then(function (endpointId) {
                        // Now we need to import commands, attributes and clusters.
                        var promises = [];
                        if (sortedEndpoints[index]) {
                            sortedEndpoints[index].forEach(function (endpoint) {
                                promises.push(queryImpexp.importEndpoint(db, sessionId, endpoint, endpointId));
                            });
                        }
                        // et.clusters
                        et.clusters.forEach(function (cluster) {
                            // code, mfgCode, side
                            promises.push(queryImpexp
                                .importClusterForEndpointType(db, packageId, endpointId, cluster)
                                .then(function (endpointClusterId) {
                                var ps = [];
                                if ('commands' in cluster)
                                    cluster.commands.forEach(function (command) {
                                        ps.push(queryImpexp.importCommandForEndpointType(db, packageId, endpointId, endpointClusterId, command));
                                    });
                                if ('attributes' in cluster)
                                    cluster.attributes.forEach(function (attribute) {
                                        ps.push(queryImpexp.importAttributeForEndpointType(db, packageId, endpointId, endpointClusterId, attribute));
                                    });
                                return Promise.all(ps);
                            }));
                        });
                        return Promise.all(promises);
                    }));
                });
            }
            return [2 /*return*/, Promise.all(allQueries)];
        });
    });
}
/**
 * Given a state object, this method returns a promise that resolves
 * with the succesfull writing into the database.
 *
 * @export
 * @param {*} db
 * @param {*} state
 * @param {*} sessionId If null, then new session will get
 *              created, otherwise it loads the data into an
 *              existing session. Previous session data is not deleted.
 * @returns a promise that resolves into a sessionId that was created.
 */
function jsonDataLoader(db, state, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, promisesStage0, promisesStage1, promisesStage2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importPackages(db, sessionId, state.package, state.filePath)
                    // data: { sessionId, packageId, otherIds, optionalIds}
                ];
                case 1:
                    data = _a.sent();
                    promisesStage0 = [];
                    promisesStage1 = [] // Stage 1 is endpoint types
                    ;
                    promisesStage2 = [] // Stage 2 is endpoints, which require endpoint types to be loaded prior.
                    ;
                    if (data.optionalIds.length > 0) {
                        data.optionalIds.forEach(function (optionalId) {
                            return promisesStage0.push(queryPackage.insertSessionPackage(db, sessionId, optionalId));
                        });
                    }
                    if ('keyValuePairs' in state) {
                        promisesStage1.push(importSessionKeyValues(db, data.sessionId, state.keyValuePairs));
                    }
                    if ('endpointTypes' in state) {
                        promisesStage1.push(importEndpointTypes(db, data.sessionId, data.packageId, state.endpointTypes, state.endpoints));
                    }
                    return [4 /*yield*/, Promise.all(promisesStage0)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(promisesStage1)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(promisesStage2)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, querySession.setSessionClean(db, data.sessionId)
                        // ensure the PACKAGE_REF is correct inside SESSION_PACKAGE table.
                        // Issue: upon startup, initializeSessionPackage() inits everything from the commandline args.
                        //        when loading an .zap configuration, it might refer to a different package than the startup package.
                    ];
                case 5:
                    _a.sent();
                    if (!('package' in state)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all(state.package.map(function (pkg) { return __awaiter(_this, void 0, void 0, function () {
                            var pkgFilePath, sessionPkgs, invalidSessionPkgs, validSessionPkgId;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        pkgFilePath = getPkgPath(pkg, state.filePath);
                                        return [4 /*yield*/, queryPackage.getSessionPackagesByType(db, data.sessionId, pkg.type)];
                                    case 1:
                                        sessionPkgs = _a.sent();
                                        invalidSessionPkgs = sessionPkgs.filter(function (x) { return x.path !== pkgFilePath; });
                                        return [4 /*yield*/, queryPackage.getPackageIdByPathAndTypeAndVersion(db, pkgFilePath, pkg.type, pkg.version)];
                                    case 2:
                                        validSessionPkgId = _a.sent();
                                        if (!(validSessionPkgId != null && invalidSessionPkgs.length)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, Promise.all(invalidSessionPkgs.map(function (y) {
                                                env.logDebug("Disabling/removing invalid session package. sessionId(".concat(sessionId, "), packageId(").concat(y.id, "), path(").concat(y.path, ")"));
                                                return queryPackage.deleteSessionPackage(db, sessionId, y.id);
                                            }))];
                                    case 3:
                                        _a.sent();
                                        env.logDebug("Enabling session package. sessionId(".concat(sessionId, "), packageId(").concat(validSessionPkgId, ")"));
                                        return [4 /*yield*/, queryPackage.insertSessionPackage(db, sessionId, validSessionPkgId)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, {
                        sessionId: data.sessionId,
                        errors: [],
                        warnings: [],
                    }];
            }
        });
    });
}
// This function cleans up some backwards-compatible problems in zap
// files.
function cleanJsonState(state) {
    if (!('featureLevel' in state)) {
        state.featureLevel = 0;
    }
    /*
    state.endpoints.forEach((ep) => {
      if (!('endpointVersion' in ep) || ep.endpointVersion == null) {
        ep.endpointVersion = 1
      }
    })
    */
}
/**
 * Parses JSON file and creates a state object out of it, which is passed further down the chain.
 *
 * @param {*} filePath
 * @param {*} data
 * @returns Promise of parsed JSON object
 */
function readJsonData(filePath, data) {
    return __awaiter(this, void 0, void 0, function () {
        var state, status;
        return __generator(this, function (_a) {
            state = JSON.parse(data);
            cleanJsonState(state);
            status = util.matchFeatureLevel(state.featureLevel, filePath);
            if (status.match) {
                if (!('keyValuePairs' in state)) {
                    state.keyValuePairs = [];
                }
                state.filePath = filePath;
                state.keyValuePairs.push({
                    key: dbEnum.sessionKey.filePath,
                    value: filePath,
                });
                state.loader = jsonDataLoader;
                return [2 /*return*/, state];
            }
            else {
                throw new Error(status.message);
            }
            return [2 /*return*/];
        });
    });
}
exports.readJsonData = readJsonData;
//# sourceMappingURL=import-json.js.map