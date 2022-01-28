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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * @module JS API: random utilities
 */
var os = require('os');
var fs = require('fs');
var fsp = fs.promises;
var env = require('./env');
var crc = require('crc');
var path = require('path');
var childProcess = require('child_process');
var queryPackage = require('../db/query-package.js');
var queryEndpoint = require('../db/query-endpoint.js');
var queryEndpointType = require('../db/query-endpoint-type.js');
var queryConfig = require('../db/query-config.js');
var queryZcl = require('../db/query-zcl.js');
var queryCommand = require('../db/query-command.js');
var querySession = require('../db/query-session.js');
var dbEnum = require('../src-shared/db-enum.js');
var uuidv4 = require('uuid').v4;
var xml2js = require('xml2js');
/**
 * Returns the CRC of the data that is passed.
 * @param {*} data
 * @returns Calculated CRC of a data.
 */
function checksum(data) {
    return crc.crc32(data);
}
/**
 * This function assigns a proper package ID to the session.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} metafiles: object containing 'zcl' and 'template'
 * @returns Promise that resolves with the packages array.
 */
function initializeSessionPackage(db, sessionId, metafiles) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, zclPropertiesPromise, genTemplateJsonPromise;
        return __generator(this, function (_a) {
            promises = [];
            zclPropertiesPromise = queryPackage
                .getPackagesByType(db, dbEnum.packageType.zclProperties)
                .then(function (rows) {
                var packageId;
                if (rows.length == 1) {
                    packageId = rows[0].id;
                    env.logDebug("Single zcl.properties found, using it for the session: ".concat(packageId));
                }
                else if (rows.length == 0) {
                    env.logError("No zcl.properties found for session.");
                    packageId = null;
                }
                else {
                    rows.forEach(function (p) {
                        if (path.resolve(metafiles.zcl) === p.path) {
                            packageId = p.id;
                        }
                    });
                    env.logWarning("".concat(sessionId, ", ").concat(metafiles.zcl, ": Multiple toplevel zcl.properties found. Using the first one from args: ").concat(packageId));
                }
                if (packageId != null) {
                    return queryPackage.insertSessionPackage(db, sessionId, packageId, true);
                }
            });
            promises.push(zclPropertiesPromise);
            genTemplateJsonPromise = queryPackage
                .getPackagesByType(db, dbEnum.packageType.genTemplatesJson)
                .then(function (rows) {
                var packageId;
                if (rows.length == 1) {
                    packageId = rows[0].id;
                    env.logDebug("Single generation template metafile found, using it for the session: ".concat(packageId));
                }
                else if (rows.length == 0) {
                    env.logInfo("No generation template metafile found for session.");
                    packageId = null;
                }
                else {
                    rows.forEach(function (p) {
                        if (metafiles.template != null &&
                            path.resolve(metafiles.template) === p.path) {
                            packageId = p.id;
                        }
                    });
                    if (packageId != null) {
                        env.logWarning("Multiple toplevel generation template metafiles found. Using the one from args: ".concat(packageId));
                    }
                    else {
                        packageId = rows[0].id;
                        env.logWarning("Multiple toplevel generation template metafiles found. Using the first one.");
                    }
                }
                if (packageId != null) {
                    return queryPackage.insertSessionPackage(db, sessionId, packageId, true);
                }
            });
            promises.push(genTemplateJsonPromise);
            return [2 /*return*/, Promise.all(promises)
                    .then(function () { return queryPackage.getSessionPackages(db, sessionId); })
                    .then(function (packages) {
                    var p = packages.map(function (pkg) {
                        return queryPackage
                            .selectAllDefaultOptions(db, pkg.packageRef)
                            .then(function (optionDefaultsArray) {
                            return Promise.all(optionDefaultsArray.map(function (optionDefault) {
                                return queryPackage
                                    .selectOptionValueByOptionDefaultId(db, optionDefault.optionRef)
                                    .then(function (option) {
                                    return querySession.insertSessionKeyValue(db, sessionId, option.optionCategory, option.optionCode);
                                });
                            }));
                        });
                    });
                    return Promise.all(p).then(function () { return packages; });
                })];
        });
    });
}
/**
 * Move database file out of the way into the backup location.
 *
 * @param {*} filePath
 */
function createBackupFile(filePath) {
    var pathBak = filePath + '~';
    if (fs.existsSync(filePath)) {
        if (fs.existsSync(pathBak)) {
            env.logDebug("Deleting old backup file: ".concat(pathBak));
            fs.unlinkSync(pathBak);
        }
        env.logDebug("Creating backup file: ".concat(filePath, " to ").concat(pathBak));
        fs.renameSync(filePath, pathBak);
    }
}
/**
 * Returns an object that contains:
 *    match: true or false if featureLevel is matched or not.
 *    message: in case of missmatch, the message shown to user.
 * @param {*} featureLevel
 */
function matchFeatureLevel(featureLevel, requirementSource) {
    if (requirementSource === void 0) { requirementSource = null; }
    if (featureLevel > env.zapVersion().featureLevel) {
        return {
            match: false,
            message: "".concat(requirementSource == null ? 'File' : requirementSource, " requires feature level ").concat(featureLevel, ", we only have ").concat(env.zapVersion().featureLevel, ". Please upgrade your zap!"),
        };
    }
    else {
        return { match: true };
    }
}
/**
 * Produces a text dump of a session data for human consumption.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns promise that resolves into a text report for the session.
 */
function sessionReport(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, queryEndpointType
                    .selectAllEndpointTypes(db, sessionId)
                    .then(function (epts) {
                    var ps = [];
                    epts.forEach(function (ept) {
                        ps.push(queryEndpoint.selectEndpointClusters(db, ept.id).then(function (clusters) {
                            var e_1, _a;
                            var s = "Endpoint: ".concat(ept.name, " \n");
                            var ps2 = [];
                            var _loop_1 = function (c) {
                                var rpt = "  - ".concat(c.hexCode, ": cluster: ").concat(c.name, " (").concat(c.side, ")\n");
                                ps2.push(queryEndpoint
                                    .selectEndpointClusterAttributes(db, c.clusterId, c.side, ept.id)
                                    .then(function (attrs) {
                                    var e_2, _a;
                                    try {
                                        for (var attrs_1 = (e_2 = void 0, __values(attrs)), attrs_1_1 = attrs_1.next(); !attrs_1_1.done; attrs_1_1 = attrs_1.next()) {
                                            var at = attrs_1_1.value;
                                            rpt = rpt.concat("    - ".concat(at.hexCode, ": attribute: ").concat(at.name, " [").concat(at.type, "] [bound: ").concat(at.isBound, "]\n"));
                                        }
                                    }
                                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                    finally {
                                        try {
                                            if (attrs_1_1 && !attrs_1_1.done && (_a = attrs_1.return)) _a.call(attrs_1);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                    }
                                })
                                    .then(function () {
                                    return queryEndpoint.selectEndpointClusterCommands(db, c.clusterId, ept.id);
                                })
                                    .then(function (cmds) {
                                    var e_3, _a;
                                    try {
                                        for (var cmds_1 = (e_3 = void 0, __values(cmds)), cmds_1_1 = cmds_1.next(); !cmds_1_1.done; cmds_1_1 = cmds_1.next()) {
                                            var cmd = cmds_1_1.value;
                                            rpt = rpt.concat("    - ".concat(cmd.hexCode, ": command: ").concat(cmd.name, "\n"));
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1.return)) _a.call(cmds_1);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                    return rpt;
                                }));
                            };
                            try {
                                for (var clusters_1 = __values(clusters), clusters_1_1 = clusters_1.next(); !clusters_1_1.done; clusters_1_1 = clusters_1.next()) {
                                    var c = clusters_1_1.value;
                                    _loop_1(c);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (clusters_1_1 && !clusters_1_1.done && (_a = clusters_1.return)) _a.call(clusters_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            return Promise.all(ps2)
                                .then(function (rpts) { return rpts.join(''); })
                                .then(function (r) { return s.concat(r); });
                        }));
                    });
                    return Promise.all(ps).then(function (results) { return results.join('\n'); });
                })];
        });
    });
}
/**
 * Produces a text dump of a session data for human consumption.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns promise that resolves into a text report for the session.
 */
function sessionDump(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var dump, endpoints, epts, ps, _a, _b, at, attributeId, attribute, e_4_1, _c, _d, cm, commandId, cmd, e_5_1, _e, _f, cl, clusterId, cluster, e_6_1;
        var e_4, _g, e_5, _h, e_6, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    dump = {
                        endpointTypes: [],
                        attributes: [],
                        commands: [],
                        clusters: [],
                        usedPackages: [],
                        packageReport: '',
                    };
                    return [4 /*yield*/, queryEndpoint.selectAllEndpoints(db, sessionId)];
                case 1:
                    endpoints = _k.sent();
                    dump.endpoints = endpoints;
                    return [4 /*yield*/, queryEndpointType.selectAllEndpointTypes(db, sessionId)];
                case 2:
                    epts = _k.sent();
                    ps = [];
                    epts.forEach(function (ept) {
                        ept.clusters = [];
                        ept.attributes = [];
                        ept.commands = [];
                        dump.endpointTypes.push(ept);
                        ps.push(queryEndpoint.selectEndpointClusters(db, ept.id).then(function (clusters) {
                            var e_7, _a;
                            var ps2 = [];
                            var _loop_2 = function (c) {
                                ept.clusters.push(c);
                                dump.clusters.push(c);
                                ps2.push(queryEndpoint
                                    .selectEndpointClusterAttributes(db, c.clusterId, c.side, ept.id)
                                    .then(function (attrs) {
                                    var _a, _b;
                                    c.attributes = attrs;
                                    (_a = ept.attributes).push.apply(_a, __spreadArray([], __read(attrs), false));
                                    (_b = dump.attributes).push.apply(_b, __spreadArray([], __read(attrs), false));
                                })
                                    .then(function () {
                                    return queryEndpoint.selectEndpointClusterCommands(db, c.clusterId, ept.id);
                                })
                                    .then(function (cmds) {
                                    var _a, _b;
                                    c.commands = cmds;
                                    (_a = ept.commands).push.apply(_a, __spreadArray([], __read(cmds), false));
                                    (_b = dump.commands).push.apply(_b, __spreadArray([], __read(cmds), false));
                                }));
                            };
                            try {
                                for (var clusters_2 = __values(clusters), clusters_2_1 = clusters_2.next(); !clusters_2_1.done; clusters_2_1 = clusters_2.next()) {
                                    var c = clusters_2_1.value;
                                    _loop_2(c);
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (clusters_2_1 && !clusters_2_1.done && (_a = clusters_2.return)) _a.call(clusters_2);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                            return Promise.all(ps2);
                        }));
                    });
                    return [4 /*yield*/, Promise.all(ps)
                        // Here we are testing that we have entities only from ONE
                        // package present. There was a bug, where global attributes from
                        // other packages got referenced under the session, because
                        // some query wasn't taking packageId into consideration.
                    ];
                case 3:
                    _k.sent();
                    _k.label = 4;
                case 4:
                    _k.trys.push([4, 9, 10, 11]);
                    _a = __values(dump.attributes), _b = _a.next();
                    _k.label = 5;
                case 5:
                    if (!!_b.done) return [3 /*break*/, 8];
                    at = _b.value;
                    attributeId = at.id;
                    return [4 /*yield*/, queryZcl.selectAttributeById(db, attributeId)];
                case 6:
                    attribute = _k.sent();
                    if (dump.usedPackages.indexOf(attribute.packageRef) == -1) {
                        dump.usedPackages.push(attribute.packageRef);
                    }
                    _k.label = 7;
                case 7:
                    _b = _a.next();
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_4_1 = _k.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 11:
                    _k.trys.push([11, 16, 17, 18]);
                    _c = __values(dump.commands), _d = _c.next();
                    _k.label = 12;
                case 12:
                    if (!!_d.done) return [3 /*break*/, 15];
                    cm = _d.value;
                    commandId = cm.id;
                    return [4 /*yield*/, queryCommand.selectCommandById(db, commandId)];
                case 13:
                    cmd = _k.sent();
                    if (dump.usedPackages.indexOf(cmd.packageRef) == -1) {
                        dump.usedPackages.push(cmd.packageRef);
                    }
                    _k.label = 14;
                case 14:
                    _d = _c.next();
                    return [3 /*break*/, 12];
                case 15: return [3 /*break*/, 18];
                case 16:
                    e_5_1 = _k.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 18];
                case 17:
                    try {
                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                    }
                    finally { if (e_5) throw e_5.error; }
                    return [7 /*endfinally*/];
                case 18:
                    _k.trys.push([18, 23, 24, 25]);
                    _e = __values(dump.clusters), _f = _e.next();
                    _k.label = 19;
                case 19:
                    if (!!_f.done) return [3 /*break*/, 22];
                    cl = _f.value;
                    clusterId = cl.clusterId;
                    return [4 /*yield*/, queryZcl.selectClusterById(db, clusterId)];
                case 20:
                    cluster = _k.sent();
                    if (dump.usedPackages.indexOf(cluster.packageRef) == -1) {
                        dump.usedPackages.push(cluster.packageRef);
                    }
                    _k.label = 21;
                case 21:
                    _f = _e.next();
                    return [3 /*break*/, 19];
                case 22: return [3 /*break*/, 25];
                case 23:
                    e_6_1 = _k.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 25];
                case 24:
                    try {
                        if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 25: return [2 /*return*/, dump];
            }
        });
    });
}
/**
 * If you have an array of arguments, and a function that creates
 * a promise out of each of those arguments, this function
 * executes them sequentially, one by one.
 *
 * @param {*} arrayOfData
 * @param {*} promiseCreator
 */
function executePromisesSequentially(arrayOfData, promiseCreator) {
    return arrayOfData.reduce(function (prev, nextData, currentIndex) {
        return prev.then(function () { return promiseCreator(nextData, currentIndex); });
    }, Promise.resolve());
}
/**
 * This function creates absolute path out of relative path and its relativity
 * @param {*} relativePath
 * @param {*} relativity
 * @param {*} zapFilePath
 */
function createAbsolutePath(relativePath, relativity, zapFilePath) {
    switch (relativity) {
        case dbEnum.pathRelativity.absolute:
            return relativePath;
        case dbEnum.pathRelativity.relativeToUserHome:
            return path.join(os.homedir(), relativePath);
        case dbEnum.pathRelativity.relativeToZap:
            return path.join(path.dirname(zapFilePath), relativePath);
    }
    return relativePath;
}
/**
 * This method takes an array of root locations and a relative path.
 * It will attempt to locate an absolute file at the path, combining
 * the root location and a relative path, until a file is found and returned.
 *
 * If none of the combined root locations and relative paths results
 * in an actual file, null is returned.
 *
 * @param {*} rootFileLocations Array of root file locations, typically directories
 * @param {*} relativeFilePath Relative path
 * @returns A fully resolved path that exists, or null if none is available.
 */
function locateRelativeFilePath(rootFileLocations, relativeFilePath) {
    if (relativeFilePath) {
        for (var i = 0; i < rootFileLocations.length; i++) {
            var resolvedFile = path.resolve(rootFileLocations[i], relativeFilePath.trim());
            if (fs.existsSync(resolvedFile)) {
                return resolvedFile;
            }
        }
    }
    return null;
}
/**
 * Returns a promise of an execution of an external program.
 *
 * @param {*} cmd
 */
function executeExternalProgram(cmd, workingDirectory, options) {
    if (options === void 0) { options = {
        rejectOnFail: true,
        routeErrToOut: false,
    }; }
    return new Promise(function (resolve, reject) {
        childProcess.exec(cmd, {
            cwd: workingDirectory,
            windowsHide: true,
            timeout: 10000,
        }, function (error, stdout, stderr) {
            console.log("    \u270D  ".concat(cmd));
            if (error) {
                if (options.rejectOnFail) {
                    reject(error);
                }
                else {
                    console.log(error);
                    resolve();
                }
            }
            else {
                console.log(stdout);
                if (options.routeErrToOut) {
                    console.log(stderr);
                }
                else {
                    console.error(stderr);
                }
                resolve();
            }
        });
    });
}
/**
 * Retrieve specific entry from extensions defaults(array) via 'clusterCode' key fields
 *
 * @param {*} extensions
 * @param {*} extensionId field name under specific extension
 * @param {*} clusterCode search key
 * @parem {*} clusterRole: one of server/client enums, or null for either.
 * @returns Value of the cluster extension property.
 */
function getClusterExtensionDefault(extensions, extensionId, clusterCode, clusterRole) {
    if (clusterRole === void 0) { clusterRole = null; }
    var f = getClusterExtension(extensions, extensionId);
    if (f.length == 0) {
        return '';
    }
    else {
        var val_1 = null;
        f[0].defaults.forEach(function (d) {
            if (d.entityCode == clusterCode) {
                if (clusterRole == null) {
                    val_1 = d.value;
                }
                else if (clusterRole == d.entityQualifier) {
                    val_1 = d.value;
                }
            }
        });
        if (val_1 == null)
            val_1 = f[0].globalDefault;
        if (val_1 == null)
            val_1 = '';
        return val_1;
    }
}
/**
 * Retrieve specific entry from extensions defaults(array) via 'clusterCode' key fields
 *
 * @param {*} extensions
 * @param {*} property field name under specific extension
 * @param {*} clusterCode search key
 * @returns Object containing all attribuetes specific to the extension
 */
function getClusterExtension(extensions, extensionId) {
    return extensions.filter(function (x) { return x.property == extensionId; });
}
/**
 * Global way how to get an UUID.
 */
function createUuid() {
    return uuidv4();
}
/**
 * Returns a promise that resolves after time milliseconds
 * @param {} time
 */
function waitFor(time) {
    return new Promise(function (r) { return setTimeout(r, time); });
}
/**
 * Returns a promise that resolve into a parsed XML object.
 * @param {*} fileContent
 * @returns promise that resolves into parsed object.
 */
function parseXml(fileContent) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, xml2js.parseStringPromise(fileContent)];
        });
    });
}
/**
 * Reads the properties file and returns object containing
 * 'data', 'filePath' and 'crc'
 *
 * @param {*} metadata file
 * @returns Promise to populate data, filePath and crc into the context.
 */
function readFileContentAndCrc(metadataFile) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsp.readFile(metadataFile, { encoding: 'utf-8' })];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, {
                            data: content,
                            filePath: metadataFile,
                            crc: checksum(content),
                        }];
            }
        });
    });
}
/**
 * This method takes a nanosecond duration and prints out
 * decently human readable time out of it.
 *
 * @param {*} nsDifference
 * @returns String with human readable time duration.
 */
function duration(nsDifference) {
    var diff = Number(nsDifference);
    var out = '';
    if (diff > 1000000000) {
        out += "".concat(Math.floor(diff / 1000000000), "s ");
    }
    out += "".concat(Math.round((diff % 1000000000) / 1000000), "ms");
    return out;
}
exports.createBackupFile = createBackupFile;
exports.checksum = checksum;
exports.initializeSessionPackage = initializeSessionPackage;
exports.matchFeatureLevel = matchFeatureLevel;
exports.sessionReport = sessionReport;
exports.sessionDump = sessionDump;
exports.executePromisesSequentially = executePromisesSequentially;
exports.createAbsolutePath = createAbsolutePath;
exports.executeExternalProgram = executeExternalProgram;
exports.locateRelativeFilePath = locateRelativeFilePath;
exports.createUuid = createUuid;
exports.waitFor = waitFor;
exports.getClusterExtension = getClusterExtension;
exports.getClusterExtensionDefault = getClusterExtensionDefault;
exports.parseXml = parseXml;
exports.readFileContentAndCrc = readFileContentAndCrc;
exports.duration = duration;
//# sourceMappingURL=util.js.map