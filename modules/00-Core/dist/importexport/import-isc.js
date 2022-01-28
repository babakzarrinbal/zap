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
var path = require('path');
var queryConfig = require('../db/query-config.js');
var queryEndpoint = require('../db/query-endpoint.js');
var queryZcl = require('../db/query-zcl.js');
var queryAttribute = require('../db/query-attribute.js');
var queryCommand = require('../db/query-command.js');
var queryPackage = require('../db/query-package.js');
var querySession = require('../db/query-session.js');
var util = require('../util/util.js');
var dbEnum = require('../src-shared/db-enum.js');
var restApi = require('../src-shared/rest-api.js');
var env = require('../util/env');
/**
 * Locates or adds an attribute, and returns it.
 * at contains clusterId, attributeId, isClient, mfgCode and possibly value
 * @param {*} state
 */
function locateAttribute(state, at) {
    var match = null;
    state.attributeType.forEach(function (a) {
        if (at.clusterCode == a.clusterCode &&
            at.attributeCode == a.attributeCode &&
            at.isClient == a.isClient) {
            match = a;
        }
    });
    if (match == null) {
        state.attributeType.push(at);
        return at;
    }
    else {
        return match;
    }
}
/**
 * Parses attribute string in a form:
 *    cl:0xABCD, at:0xABCD, di: [client|server], mf:0xABCD
 *
 * @param {*} attributeString
 * @param {*} [value=null]
 */
function parseAttribute(attributeString, value) {
    if (value === void 0) { value = null; }
    var at = {};
    attributeString
        .split(',')
        .map(function (x) { return x.trim(); })
        .forEach(function (el) {
        if (el.startsWith('cl:')) {
            at.clusterCode = parseInt(el.substring(3));
        }
        else if (el.startsWith('at:')) {
            at.attributeCode = parseInt(el.substring(3));
        }
        else if (el.startsWith('di:')) {
            at.side =
                el.substring(3).trim() == 'client'
                    ? dbEnum.side.client
                    : dbEnum.side.server;
        }
        else if (el.startsWith('mf:')) {
            at.mfgCode = parseInt(el.substring(3));
        }
    });
    at.storageOption = dbEnum.storageOption.ram;
    if (value != null) {
        at.value = value;
    }
    return at;
}
/**
 * Logic that parses data out of an ISC file into a java object
 *
 * @param {*} state
 * @param {*} line
 */
function parseZclAfv2Line(state, line) {
    if (line.startsWith('configuredEndpoint:')) {
        if (!('endpoint' in state)) {
            state.endpoint = [];
        }
        // configuredEndpoint:*ep:1,pi: -1,di:-1,dv:1,ept:Centralized,nwk:Primary
        var tokens = line.substring('configuredEndpoint:'.length).split(',');
        var endpoint_1 = {};
        tokens.forEach(function (tok) {
            if (tok.startsWith('ep:')) {
                endpoint_1.endpoint = parseInt(tok.substring('ep:'.length));
            }
            else if (tok.startsWith('*ep:')) {
                endpoint_1.endpoint = parseInt(tok.substring('*ep:'.length));
            }
            else if (tok.startsWith('pi:')) {
                // This might be -1 and should be overriden from the actual device from the endpoint type
                endpoint_1.profileId = parseInt(tok.substring('pi:'.length));
            }
            else if (tok.startsWith('di:')) {
                // This might be -1 and should be overriden from the actual device from the endpoint type
                endpoint_1.deviceId = parseInt(tok.substring('di:'.length));
            }
            else if (tok.startsWith('dv:')) {
                endpoint_1.deviceVersion = parseInt(tok.substring('dv:'.length));
            }
            else if (tok.startsWith('ept:')) {
                endpoint_1.endpointType = tok.substring('ept:'.length);
            }
            else if (tok.startsWith('nwk:')) {
                var network = tok.substring('nwk:'.length);
                var networkId = state.networks.indexOf(network);
                if (networkId == -1) {
                    state.networks.push(network);
                    networkId = state.networks.indexOf(network);
                }
                endpoint_1.network = networkId;
            }
        });
        state.endpoint.push(endpoint_1);
    }
    else if (line.startsWith('beginEndpointType:')) {
        // Create a temporary state.endpointType
        state.endpointType = {
            typeName: line.substring('beginEndpointType:'.length),
            clusterOverride: [],
        };
    }
    else if (line.startsWith('endEndpointType')) {
        // Stick the endpoint into `state.endpointTypes[endpointType.typeName]'
        if (!('endpointTypes' in state)) {
            state.endpointTypes = {};
        }
        state.endpointTypes[state.endpointType.typeName] = state.endpointType;
        delete state.endpointType;
    }
    else if (line.startsWith('device:')) {
        state.endpointType.device = line.substring('device:'.length);
    }
    else if (line.startsWith('deviceId:')) {
        state.endpointType.deviceId = parseInt(line.substring('deviceId:'.length));
    }
    else if (line.startsWith('profileId:')) {
        state.endpointType.profileId = parseInt(line.substring('profileId:'.length));
    }
    else if (line.startsWith('overrideClientCluster:')) {
        var idOnOff = line.substring('overrideClientCluster:'.length).split(',');
        var override = {
            clusterId: parseInt(idOnOff[0]),
            isIncluded: idOnOff[1] == 'yes',
            side: dbEnum.side.client,
        };
        state.endpointType.clusterOverride.push(override);
    }
    else if (line.startsWith('overrideServerCluster:')) {
        var idOnOff = line.substring('overrideServerCluster:'.length).split(',');
        var override = {
            clusterId: parseInt(idOnOff[0]),
            isIncluded: idOnOff[1] == 'yes',
            side: dbEnum.side.server,
        };
        state.endpointType.clusterOverride.push(override);
    }
    else if (line.startsWith('intMap:DefaultResponsePolicy = ')) {
        var drp = parseInt(line.slice('intMap:DefaultResponsePolicy = '.length));
        switch (drp) {
            case 0:
                state.sessionKey.defaultResponsePolicy = 'always';
                break;
            case 1:
                state.sessionKey.defaultResponsePolicy = 'conditional';
                break;
            case 2:
                state.sessionKey.defaultResponsePolicy = 'never';
                break;
        }
    }
    else if (line == 'beginAttributeDefaults') {
        state.parseState = line;
    }
    else if (line == 'endAttributeDefaults') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttributeDefaultReportingConfig') {
        state.parseState = line;
    }
    else if (line == 'endAttributeDefaultReportingConfig') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttrList:EXTERNALLY_SAVED') {
        state.parseState = line.substring('beginAttrList:'.length);
    }
    else if (line == 'endAttrList:EXTERNALLY_SAVED') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttrList:OPTIONAL') {
        state.parseState = line.substring('beginAttrList:'.length);
    }
    else if (line == 'endAttrList:OPTIONAL') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttrList:SINGLETON') {
        state.parseState = line.substring('beginAttrList:'.length);
    }
    else if (line == 'endAttrList:SINGLETON') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttrList:BOUNDED') {
        state.parseState = line.substring('beginAttrList:'.length);
    }
    else if (line == 'endAttrList:BOUNDED') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttrList:SAVED_TO_FLASH') {
        state.parseState = line.substring('beginAttrList:'.length);
    }
    else if (line == 'endAttrList:SAVED_TO_FLASH') {
        state.parseState = 'zclAfv2';
    }
    else if (line == 'beginAttrList:REPORTABLE') {
        state.parseState = line.substring('beginAttrList:'.length);
    }
    else if (line == 'endAttrList:REPORTABLE') {
        state.parseState = 'zclAfv2';
    }
    else if (state.parseState == 'beginAttributeDefaults') {
        var arr = line.split('=>').map(function (x) { return x.trim(); });
        var at = parseAttribute(arr[0], arr[1]);
        locateAttribute(state, at).defaultValue = at.value;
    }
    else if (state.parseState == 'beginAttributeDefaultReportingConfig') {
        var arr = line.split('=>').map(function (x) { return x.trim(); });
        // Now parse arr[1], which is min,max:change
        var rpt = {};
        var splits = arr[1].split(':');
        var splits2 = splits[0].split(',');
        rpt.reportableChange = splits[1];
        rpt.minInterval = splits2[0];
        rpt.maxInterval = splits2[1];
        var at = parseAttribute(arr[0], rpt);
        at = locateAttribute(state, at);
        at.minInterval = parseInt(rpt.minInterval);
        at.maxInterval = parseInt(rpt.maxInterval);
        at.reportableChange = parseInt(rpt.reportableChange);
    }
    else if (state.parseState == 'EXTERNALLY_SAVED') {
        var at = parseAttribute(line.trim());
        locateAttribute(state, at).storageOption = dbEnum.storageOption.external;
    }
    else if (state.parseState == 'OPTIONAL') {
        var at = parseAttribute(line.trim());
        locateAttribute(state, at).isOptional = true;
    }
    else if (state.parseState == 'SINGLETON') {
        var at = parseAttribute(line.trim());
        locateAttribute(state, at).isSingleton = true;
    }
    else if (state.parseState == 'BOUNDED') {
        var at = parseAttribute(line.trim());
        locateAttribute(state, at).bounded = true;
    }
    else if (state.parseState == 'SAVED_TO_FLASH') {
        var at = parseAttribute(line.trim());
        locateAttribute(state, at).storageOption = dbEnum.storageOption.nvm;
    }
    else if (state.parseState == 'REPORTABLE') {
        var at = parseAttribute(line.trim());
        locateAttribute(state, at).reportable = true;
    }
}
/**
 * Function that deals with the zcl customizer data inside the ISC file
 *
 * @param {*} state
 * @param {*} line
 */
function parseZclCustomizer(state, line) {
    //console.log(`zclCustomizer:${line}`)
}
/**
 * Toplevel parser that ignore anything except the two setups that are
 * ZCL relevant.
 *
 * @param {*} filePath
 * @param {*} data
 * @returns promise of read ISC data
 */
function readIscData(filePath, data, zclMetafile) {
    return __awaiter(this, void 0, void 0, function () {
        var lines, errorLines, parser, state, S;
        return __generator(this, function (_a) {
            lines = data.toString().split(/\r?\n/);
            errorLines = [];
            parser = null;
            state = {
                log: [],
                filePath: filePath,
                featureLevel: 0,
                keyValuePairs: [],
                loader: iscDataLoader,
                parseState: 'init',
                // These are not the same as with zap files
                attributeType: [],
                zclMetafile: zclMetafile,
                sessionKey: {},
                networks: [],
            };
            state.log.push({
                timestamp: new Date().toISOString(),
                log: "Imported from ".concat(path.basename(filePath)),
            });
            lines.forEach(function (line) {
                if (line == '{setupId:zclAfv2') {
                    parser = parseZclAfv2Line;
                    state.parseState = 'zclAfv2';
                    return;
                }
                if (line == '{setupId:zclCustomizer') {
                    parser = parseZclCustomizer;
                    state.parseState = 'zclCustomizer';
                    return;
                }
                if (state.parseState != 'init' && line == '}') {
                    parser = null;
                    state.parseState = 'nonSetup';
                    return;
                }
                if (parser != null) {
                    try {
                        parser(state, line);
                    }
                    catch (msg) {
                        errorLines.push(msg);
                    }
                }
            });
            if (state.parseState == 'init') {
                S = 'Error importing the file: there is no usable ZCL content in this file.';
                state.log.push(S);
                throw new Error(S);
            }
            delete state.parseState;
            if (errorLines.length > 0) {
                throw new Error('Error while importing the file:\n  - ' + errorLines.join('\n  - '));
            }
            else {
                return [2 /*return*/, state];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Load individual endpoint types.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} zclPackages Array of package IDs for zcl queries.
 * @param {*} endpointType
 */
function loadEndpointType(db, sessionId, packageId, endpointType) {
    return __awaiter(this, void 0, void 0, function () {
        var deviceName, deviceCode, dev;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deviceName = endpointType.device;
                    deviceCode = endpointType.deviceId;
                    if (!isCustomDevice(deviceName, deviceCode)) return [3 /*break*/, 2];
                    return [4 /*yield*/, queryZcl.selectDeviceTypeByCodeAndName(db, packageId, dbEnum.customDevice.code, dbEnum.customDevice.name)];
                case 1:
                    dev = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, queryZcl.selectDeviceTypeByCodeAndName(db, packageId, deviceCode, deviceName)];
                case 3:
                    dev = _a.sent();
                    _a.label = 4;
                case 4:
                    if (dev == null)
                        throw new Error("Unknown device type: ".concat(deviceName, " / ").concat(deviceCode));
                    return [2 /*return*/, queryConfig.insertEndpointType(db, sessionId, endpointType.typeName, dev.id, false)];
            }
        });
    });
}
function isCustomDevice(deviceName, deviceCode) {
    return deviceName == 'zcustom';
}
function loadSingleAttribute(db, endpointTypeId, packageId, at) {
    return __awaiter(this, void 0, void 0, function () {
        var id, cluster, attribute, clusterRef, attributeRef, keyValuePairs, reportable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryConfig.selectEndpointTypeAttributeId(db, endpointTypeId, packageId, at.clusterCode, at.attributeCode, at.side, at.mfgCode)];
                case 1:
                    id = _a.sent();
                    if (!(id == null)) return [3 /*break*/, 6];
                    if (!at.isOptional) return [3 /*break*/, 5];
                    return [4 /*yield*/, queryZcl.selectClusterByCode(db, packageId, at.clusterCode, at.mfgCode)];
                case 2:
                    cluster = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeByCode(db, packageId, at.clusterCode, at.attributeCode, at.mfgCode)];
                case 3:
                    attribute = _a.sent();
                    if (cluster == null || attribute == null) {
                        env.logWarning("Could not resolve attribute ".concat(at.clusterCode, " / ").concat(at.attributeCode));
                        return [2 /*return*/];
                    }
                    clusterRef = cluster.id;
                    attributeRef = attribute.id;
                    return [4 /*yield*/, queryConfig.insertOrUpdateAttributeState(db, endpointTypeId, clusterRef, at.side, attributeRef, [{ key: restApi.updateKey.attributeSelected, value: 1 }], attribute.reportMinInterval, attribute.reportMaxInterval, attribute.reportableChange)];
                case 4:
                    id = _a.sent();
                    return [3 /*break*/, 6];
                case 5: 
                // This is ok: we are iterating over all endpoint type ids,
                // since ISC file doesn't really specifically override attribute
                // for every given endpoint type. So if we are looking at
                // the endpoint type which simply doesn't have this
                // attribute, so be it. Move on.
                return [2 /*return*/];
                case 6:
                    keyValuePairs = [];
                    if ('storageOption' in at) {
                        keyValuePairs.push([restApi.updateKey.attributeStorage, at.storageOption]);
                    }
                    if ('defaultValue' in at) {
                        keyValuePairs.push([restApi.updateKey.attributeDefault, at.defaultValue]);
                    }
                    reportable = false;
                    if ('minInterval' in at) {
                        keyValuePairs.push([restApi.updateKey.attributeReportMin, at.minInterval]);
                        reportable = true;
                    }
                    if ('maxInterval' in at) {
                        keyValuePairs.push([restApi.updateKey.attributeReportMax, at.maxInterval]);
                        reportable = true;
                    }
                    if ('reportableChange' in at) {
                        keyValuePairs.push([
                            restApi.updateKey.attributeReportChange,
                            at.reportableChange,
                        ]);
                        reportable = true;
                    }
                    if ('isSingleton' in at) {
                        keyValuePairs.push([restApi.updateKey.attributeSingleton, at.isSingleton]);
                    }
                    if ('bounded' in at) {
                        keyValuePairs.push([restApi.updateKey.attributeBounded, at.bounded]);
                    }
                    if (reportable) {
                        keyValuePairs.push([restApi.updateKey.attributeReporting, 1]);
                    }
                    return [2 /*return*/, queryConfig.updateEndpointTypeAttribute(db, id, keyValuePairs)];
            }
        });
    });
}
/**
 * Loads all implemented commands for a single endpoint.
 *
 * @param {*} db
 * @param {*} zclPackageId
 * @param {*} state
 * @param {*} commandExtensions
 * @param {*} endpointTypeId
 */
function loadImplementedCommandsForEndpoint(db, zclPackageId, state, commandExtensions, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var codes, _a, _b, ext, insertionPromises, _c, _d, c, clusterCode, commandIds, cluster, _e, _f, commandCode, command, p, e_1_1, e_2_1;
        var e_3, _g, e_2, _h, e_1, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    codes = {};
                    try {
                        for (_a = __values(commandExtensions.defaults), _b = _a.next(); !_b.done; _b = _a.next()) {
                            ext = _b.value;
                            if (ext.value == 1) {
                                if (!(ext.parentCode in codes)) {
                                    codes[ext.parentCode] = [];
                                }
                                codes[ext.parentCode].push(ext.entityCode);
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    insertionPromises = [];
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 13, 14, 15]);
                    _c = __values(Object.keys(codes)), _d = _c.next();
                    _k.label = 2;
                case 2:
                    if (!!_d.done) return [3 /*break*/, 12];
                    c = _d.value;
                    clusterCode = parseInt(c);
                    commandIds = codes[c];
                    return [4 /*yield*/, queryZcl.selectClusterByCode(db, zclPackageId, clusterCode)];
                case 3:
                    cluster = _k.sent();
                    _k.label = 4;
                case 4:
                    _k.trys.push([4, 9, 10, 11]);
                    _e = (e_1 = void 0, __values(Object.keys(commandIds))), _f = _e.next();
                    _k.label = 5;
                case 5:
                    if (!!_f.done) return [3 /*break*/, 8];
                    commandCode = _f.value;
                    return [4 /*yield*/, queryCommand.selectCommandByCode(db, zclPackageId, clusterCode, commandCode)];
                case 6:
                    command = _k.sent();
                    if (cluster != null && command != null) {
                        p = queryConfig.insertOrUpdateCommandState(db, endpointTypeId, cluster.id, command.source, command.id, 1, true);
                        insertionPromises.push(p);
                    }
                    _k.label = 7;
                case 7:
                    _f = _e.next();
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 11:
                    _d = _c.next();
                    return [3 /*break*/, 2];
                case 12: return [3 /*break*/, 15];
                case 13:
                    e_2_1 = _k.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 15];
                case 14:
                    try {
                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/, Promise.all(insertionPromises)];
            }
        });
    });
}
/**
 * This method goes over the endpoint type and the state, and enables
 * commands that belong to enabled clusters and are listed in the
 * commandExtensions as "implemented".
 * @param {*} db
 * @param {*} zclPackageId
 * @param {*} state
 * @param {*} commandExtensions
 * @param {*} endpointTypeIdArray
 */
function loadImplementedCommandsExtensions(db, zclPackageId, state, commandExtensions, endpointTypeIdArray) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, endpointTypeIdArray_1, endpointTypeIdArray_1_1, endpointTypeId;
        var e_4, _a;
        return __generator(this, function (_b) {
            promises = [];
            try {
                for (endpointTypeIdArray_1 = __values(endpointTypeIdArray), endpointTypeIdArray_1_1 = endpointTypeIdArray_1.next(); !endpointTypeIdArray_1_1.done; endpointTypeIdArray_1_1 = endpointTypeIdArray_1.next()) {
                    endpointTypeId = endpointTypeIdArray_1_1.value;
                    promises.push(loadImplementedCommandsForEndpoint(db, zclPackageId, state, commandExtensions, endpointTypeId));
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (endpointTypeIdArray_1_1 && !endpointTypeIdArray_1_1.done && (_a = endpointTypeIdArray_1.return)) _a.call(endpointTypeIdArray_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
/**
 * This method resolves promises that contain all the
 * queries that are needed to load the attribute state
 *
 * @param {*} db
 * @param {*} state
 * @param {*} sessionId
 */
function loadCommands(db, state, zclPackageId, genPackageId, endpointTypeIdArray) {
    return __awaiter(this, void 0, void 0, function () {
        var commandExtensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(genPackageId != null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, queryPackage.selectPackageExtensionByPropertyAndEntity(db, genPackageId, 'implementedCommands', dbEnum.packageExtensionEntity.command)];
                case 1:
                    commandExtensions = _a.sent();
                    if (!(commandExtensions != null &&
                        commandExtensions.defaults != null &&
                        commandExtensions.defaults.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, loadImplementedCommandsExtensions(db, zclPackageId, state, commandExtensions, endpointTypeIdArray)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * This method resolves promises that contain all the
 * queries that are needed to load the attribute state
 *
 * @param {*} db
 * @param {*} state
 * @param {*} sessionId
 */
function loadAttributes(db, state, packageId, endpointTypeIdArray) {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            promises = [];
            if (state.attributeType.length > 0 && endpointTypeIdArray.length > 0) {
                endpointTypeIdArray.forEach(function (endpointTypeId) {
                    state.attributeType.forEach(function (at) {
                        promises.push(loadSingleAttribute(db, endpointTypeId, packageId, at));
                    });
                });
            }
            if (promises.length > 0) {
                return [2 /*return*/, Promise.all(promises)];
            }
            else {
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Loads the session key values from the keyValues object
 * @param {*} db
 * @param {*} sessionId
 * @param {*} keyValues
 */
function loadSessionKeyValues(db, sessionId, keyValues) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, querySession.insertSessionKeyValues(db, sessionId, keyValues)];
        });
    });
}
/**
 * Function that actually loads the data out of a state object.
 * Session at this point is blank, and has no packages.
 *
 * @param {*} db
 * @param {*} state
 * @param {*} sessionId
 */
function iscDataLoader(db, state, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, promises, zclPackages, genPackages, genPackageId, zclPackageId, usedEndpointTypes, _a, _b, endpointTypeKey, _loop_1, _c, _d, key, results, endpointInsertionPromises, endpointTypeIds;
        var e_5, _e, e_6, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    endpointTypes = state.endpointTypes;
                    promises = [];
                    return [4 /*yield*/, util.initializeSessionPackage(db, sessionId, {
                            zcl: state.zclMetafile,
                            template: null,
                        })];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, queryPackage.getSessionPackagesByType(db, sessionId, dbEnum.packageType.zclProperties)];
                case 2:
                    zclPackages = _g.sent();
                    return [4 /*yield*/, queryPackage.getSessionPackagesByType(db, sessionId, dbEnum.packageType.genTemplatesJson)];
                case 3:
                    genPackages = _g.sent();
                    if (zclPackages.length == 0) {
                        throw new Error('No zcl packages found for ISC import.');
                    }
                    genPackageId = null;
                    if (genPackages.length == 0) {
                        env.logWarning('No gen packages, missing the extensions matching.');
                    }
                    else {
                        genPackageId = genPackages[0].id;
                    }
                    zclPackageId = zclPackages[0].id;
                    usedEndpointTypes = state.endpoint.map(function (ep) { return ep.endpointType; });
                    try {
                        for (_a = __values(Object.keys(endpointTypes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            endpointTypeKey = _b.value;
                            if (!usedEndpointTypes.includes(endpointTypeKey)) {
                                delete endpointTypes[endpointTypeKey];
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    _loop_1 = function (key) {
                        promises.push(loadEndpointType(db, sessionId, zclPackageId, endpointTypes[key])
                            .then(function (newEndpointTypeId) {
                            return {
                                endpointTypeId: newEndpointTypeId,
                                endpointType: endpointTypes[key],
                            };
                        })
                            .then(function (endpointTypeIds) {
                            // Now load the cluster configs
                            var clusterOverridePromises = [];
                            endpointTypes[key].clusterOverride.forEach(function (cl) {
                                var clusterCode = cl.clusterId;
                                var isIncluded = cl.isIncluded;
                                var side = cl.side;
                                clusterOverridePromises.push(queryConfig.setClusterIncluded(db, zclPackageId, endpointTypeIds.endpointTypeId, clusterCode, isIncluded, side));
                            });
                            return Promise.all(clusterOverridePromises).then(function () { return endpointTypeIds; });
                        }));
                    };
                    try {
                        for (_c = __values(Object.keys(endpointTypes)), _d = _c.next(); !_d.done; _d = _c.next()) {
                            key = _d.value;
                            _loop_1(key);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    return [4 /*yield*/, Promise.all(promises)
                        // results is an array of "endpointTypeId"/"endpointType" objects.
                    ];
                case 4:
                    results = _g.sent();
                    endpointInsertionPromises = [];
                    if (state.endpoint != null)
                        state.endpoint.forEach(function (ep) {
                            // insert individual endpoint
                            var endpointTypeId = undefined;
                            results.forEach(function (res) {
                                if (res.endpointType.typeName == ep.endpointType) {
                                    endpointTypeId = res.endpointTypeId;
                                    // Now let's deal with the endpoint id and device id
                                    if (ep.profileId == -1) {
                                        ep.profileId = res.endpointType.profileId;
                                    }
                                    if (ep.deviceId == -1) {
                                        ep.deviceId = res.endpointType.deviceId;
                                    }
                                }
                            });
                            if (endpointTypeId != undefined) {
                                endpointInsertionPromises.push(queryEndpoint
                                    .insertEndpoint(db, sessionId, ep.endpoint, endpointTypeId, ep.network, ep.profileId, ep.deviceVersion, ep.deviceId)
                                    .then(function () { return endpointTypeId; }));
                            }
                        });
                    if (state.log != null) {
                        querySession.writeLog(db, sessionId, state.log);
                    }
                    return [4 /*yield*/, Promise.all(endpointInsertionPromises)];
                case 5:
                    endpointTypeIds = _g.sent();
                    return [4 /*yield*/, loadAttributes(db, state, zclPackageId, endpointTypeIds)];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, loadCommands(db, state, zclPackageId, genPackageId, endpointTypeIds)];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, loadSessionKeyValues(db, sessionId, state.sessionKey)];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, querySession.setSessionClean(db, sessionId)];
                case 9:
                    _g.sent();
                    return [2 /*return*/, {
                            sessionId: sessionId,
                            errors: [],
                            warnings: [],
                        }];
            }
        });
    });
}
exports.readIscData = readIscData;
//# sourceMappingURL=import-isc.js.map