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
 * This module provides queries related to imports and exports of files.
 *
 * @module DB API: package-based queries.
 */
var dbApi = require('./db-api.js');
/**
 * Imports a single endpoint
 * @param {} db
 * @param {*} sessionId
 * @param {*} endpoint
 * @param {*} endpointTypeRef
 */
function importEndpoint(db, sessionId, endpoint, endpointTypeRef) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, "\nINSERT INTO ENDPOINT (\n  SESSION_REF,\n  ENDPOINT_TYPE_REF,\n  PROFILE,\n  ENDPOINT_IDENTIFIER,\n  NETWORK_IDENTIFIER,\n  DEVICE_VERSION,\n  DEVICE_IDENTIFIER\n) VALUES (\n  ?,\n  ?,\n  ?,\n  ?,\n  ?,\n  ?,\n  ?\n)\n  ", [
                    sessionId,
                    endpointTypeRef,
                    endpoint.profileId,
                    endpoint.endpointId,
                    endpoint.networkId,
                    endpoint.endpointVersion,
                    endpoint.deviceIdentifier,
                ])];
        });
    });
}
/**
 * Extracts endpoints.
 *
 * @param {*} db
 * @param {*} sessionId
 */
function exportEndpoints(db, sessionId, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIndexFunction, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIndexFunction = function (epts, endpointTypeRef) {
                return epts.findIndex(function (value) { return value.endpointTypeId == endpointTypeRef; });
            };
            mapFunction = function (x) {
                return {
                    endpointTypeName: x.NAME,
                    endpointTypeIndex: endpointTypeIndexFunction(endpointTypes, x.ENDPOINT_TYPE_REF),
                    endpointTypeRef: x.ENDPOINT_TYPE_REF,
                    profileId: x.PROFILE,
                    endpointId: x.ENDPOINT_IDENTIFIER,
                    networkId: x.NETWORK_IDENTIFIER,
                    endpointVersion: x.DEVICE_VERSION,
                    deviceIdentifier: x.DEVICE_IDENTIFIER,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ET.NAME,\n  E.ENDPOINT_TYPE_REF,\n  E.PROFILE,\n  E.ENDPOINT_IDENTIFIER,\n  E.NETWORK_IDENTIFIER,\n  E.DEVICE_VERSION,\n  E.DEVICE_IDENTIFIER\nFROM\n  ENDPOINT AS E\nLEFT JOIN\n  ENDPOINT_TYPE AS ET\nON\n  E.ENDPOINT_TYPE_REF = ET.ENDPOINT_TYPE_ID\nWHERE\n  E.SESSION_REF = ?\nORDER BY E.ENDPOINT_IDENTIFIER\n    ", [sessionId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Extracts raw endpoint types rows.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns promise that resolves into rows in the database table.
 */
function exportEndpointTypes(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    endpointTypeId: x.ENDPOINT_TYPE_ID,
                    name: x.NAME,
                    deviceTypeName: x.DEVICE_TYPE_NAME,
                    deviceTypeCode: x.DEVICE_TYPE_CODE,
                    deviceTypeProfileId: x.DEVICE_TYPE_PROFILE_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT DISTINCT\n  ENDPOINT_TYPE.ENDPOINT_TYPE_ID,\n  ENDPOINT_TYPE.NAME,\n  ENDPOINT_TYPE.DEVICE_TYPE_REF,\n  DEVICE_TYPE.CODE AS DEVICE_TYPE_CODE,\n  DEVICE_TYPE.PROFILE_ID as DEVICE_TYPE_PROFILE_ID,\n  DEVICE_TYPE.NAME AS DEVICE_TYPE_NAME\nFROM\n  ENDPOINT_TYPE\nLEFT JOIN\n  ENDPOINT\nON\n  ENDPOINT.ENDPOINT_TYPE_REF = ENDPOINT_TYPE.ENDPOINT_TYPE_ID\nLEFT JOIN\n  DEVICE_TYPE\nON\n  ENDPOINT_TYPE.DEVICE_TYPE_REF = DEVICE_TYPE.DEVICE_TYPE_ID\nWHERE\n  ENDPOINT_TYPE.SESSION_REF = ?\nORDER BY\n  ENDPOINT.ENDPOINT_IDENTIFIER,\n  ENDPOINT_TYPE.NAME,\n  DEVICE_TYPE_CODE,\n  DEVICE_TYPE_PROFILE_ID", [sessionId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Imports an endpoint type, resolving other data along the way.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} packageId
 * @param {*} endpointType
 * @returns Promise of endpoint insertion.
 */
function importEndpointType(db, sessionId, packageId, endpointType) {
    return __awaiter(this, void 0, void 0, function () {
        var multipleDeviceIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "SELECT DEVICE_TYPE_ID FROM DEVICE_TYPE WHERE CODE = \"".concat(parseInt(endpointType.deviceTypeCode), "\" AND PROFILE_ID = \"").concat(parseInt(endpointType.deviceTypeProfileId), "\" AND PACKAGE_REF = \"").concat(packageId, "\""))];
                case 1:
                    multipleDeviceIds = _a.sent();
                    if (multipleDeviceIds != null && multipleDeviceIds.length > 1) {
                        // Each endpoint has: 'name', 'deviceTypeName', 'deviceTypeCode', `deviceTypeProfileId`, 'clusters', 'commands', 'attributes'
                        return [2 /*return*/, dbApi.dbInsert(db, "\n  INSERT INTO ENDPOINT_TYPE (\n    SESSION_REF,\n    NAME,\n    DEVICE_TYPE_REF\n  ) VALUES(\n    ?,\n    ?,\n    (SELECT DEVICE_TYPE_ID FROM DEVICE_TYPE WHERE CODE = ? AND PROFILE_ID = ? AND NAME = ? AND PACKAGE_REF = ?)\n  )", [
                                sessionId,
                                endpointType.name,
                                parseInt(endpointType.deviceTypeCode),
                                parseInt(endpointType.deviceTypeProfileId),
                                endpointType.deviceTypeName,
                                packageId,
                            ])];
                    }
                    else {
                        // Each endpoint has: 'name', 'deviceTypeName', 'deviceTypeCode', `deviceTypeProfileId`, 'clusters', 'commands', 'attributes'
                        return [2 /*return*/, dbApi.dbInsert(db, "\n  INSERT INTO ENDPOINT_TYPE (\n    SESSION_REF,\n    NAME,\n    DEVICE_TYPE_REF\n  ) VALUES(\n    ?,\n    ?,\n    (SELECT DEVICE_TYPE_ID FROM DEVICE_TYPE WHERE CODE = ? AND PROFILE_ID = ? AND PACKAGE_REF = ?)\n  )", [
                                sessionId,
                                endpointType.name,
                                parseInt(endpointType.deviceTypeCode),
                                parseInt(endpointType.deviceTypeProfileId),
                                packageId,
                            ])];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Exports packages for externalized form.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise of a data that is listing all the packages in the session.
 */
function exportPackagesFromSession(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    path: x.PATH,
                    version: x.VERSION,
                    type: x.TYPE,
                    required: x.REQUIRED,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  PACKAGE.PATH,\n  PACKAGE.VERSION,\n  PACKAGE.TYPE,\n  SESSION_PACKAGE.REQUIRED\nFROM PACKAGE\nINNER JOIN SESSION_PACKAGE\nON PACKAGE.PACKAGE_ID = SESSION_PACKAGE.PACKAGE_REF\nWHERE SESSION_PACKAGE.SESSION_REF = ? AND SESSION_PACKAGE.ENABLED = 1", [sessionId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Exports clusters to an externalized form.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
function exportClustersFromEndpointType(db, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    name: x.NAME,
                    code: x.CODE,
                    mfgCode: x.MANUFACTURER_CODE,
                    define: x.DEFINE,
                    side: x.SIDE,
                    enabled: x.ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CODE,\n  CLUSTER.MANUFACTURER_CODE,\n  CLUSTER.NAME,\n  CLUSTER.DEFINE,\n  ENDPOINT_TYPE_CLUSTER.SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nFROM CLUSTER\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nWHERE ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF = ?\nORDER BY CLUSTER.CODE, CLUSTER.NAME", [endpointTypeId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Imports a single cluster to endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} cluster Object populated same way as export method leaves it.
 * @returns Promise of an imported cluster.
 */
function importClusterForEndpointType(db, packageId, endpointTypeId, cluster) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, "\nINSERT INTO ENDPOINT_TYPE_CLUSTER\n  (ENDPOINT_TYPE_REF, CLUSTER_REF, SIDE, ENABLED)\nVALUES\n  (?,\n   (SELECT CLUSTER_ID FROM CLUSTER WHERE PACKAGE_REF = ? AND CODE = ? AND ".concat(cluster.mfgCode == null
                    ? 'MANUFACTURER_CODE IS NULL'
                    : 'MANUFACTURER_CODE = ?', "),\n   ?,\n   ?)"), cluster.mfgCode == null
                    ? [endpointTypeId, packageId, cluster.code, cluster.side, cluster.enabled]
                    : [
                        endpointTypeId,
                        packageId,
                        cluster.code,
                        cluster.mfgCode,
                        cluster.side,
                        cluster.enabled,
                    ])];
        });
    });
}
/**
 * Returns a promise of data for attributes inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the attribute data.
 */
function exportAttributesFromEndpointTypeCluster(db, endpointTypeId, endpointClusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    name: x.NAME,
                    code: x.CODE,
                    mfgCode: x.MANUFACTURER_CODE,
                    side: x.SIDE,
                    included: x.INCLUDED,
                    storageOption: x.STORAGE_OPTION,
                    singleton: x.SINGLETON,
                    bounded: x.BOUNDED,
                    defaultValue: x.DEFAULT_VALUE,
                    reportable: x.INCLUDED_REPORTABLE,
                    minInterval: x.MIN_INTERVAL,
                    maxInterval: x.MAX_INTERVAL,
                    reportableChange: x.REPORTABLE_CHANGE,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ATTRIBUTE.NAME,\n  ATTRIBUTE.CODE,\n  ATTRIBUTE.MANUFACTURER_CODE,\n  ATTRIBUTE.SIDE,\n  ENDPOINT_TYPE_ATTRIBUTE.INCLUDED,\n  ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION,\n  ENDPOINT_TYPE_ATTRIBUTE.SINGLETON,\n  ENDPOINT_TYPE_ATTRIBUTE.BOUNDED,\n  ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE,\n  ENDPOINT_TYPE_ATTRIBUTE.INCLUDED_REPORTABLE,\n  ENDPOINT_TYPE_ATTRIBUTE.MIN_INTERVAL,\n  ENDPOINT_TYPE_ATTRIBUTE.MAX_INTERVAL,\n  ENDPOINT_TYPE_ATTRIBUTE.REPORTABLE_CHANGE\nFROM\n  ATTRIBUTE\nINNER JOIN\n  ENDPOINT_TYPE_ATTRIBUTE\nON\n  ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\nWHERE\n  ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF = ?\n  AND ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ?\nORDER BY\n  ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE\n    ", [endpointTypeId, endpointClusterId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Imports an attribute information of an endpoint type.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} endpointTypeId
 * @param {*} endpointClusterId may be null if global attribute
 * @param {*} attribute
 * @returns Promise of an attribute insertion.
 */
function importAttributeForEndpointType(db, packageId, endpointTypeId, endpointClusterId, attribute) {
    return __awaiter(this, void 0, void 0, function () {
        var arg;
        return __generator(this, function (_a) {
            arg = [
                endpointTypeId,
                endpointClusterId,
                attribute.code,
                packageId,
                endpointClusterId,
            ];
            if (attribute.mfgCode != null)
                arg.push(attribute.mfgCode);
            arg.push(attribute.included, attribute.storageOption, attribute.singleton, attribute.bounded, attribute.defaultValue, attribute.reportable, attribute.minInterval, attribute.maxInterval, attribute.reportableChange);
            return [2 /*return*/, dbApi.dbInsert(db, "\nINSERT INTO ENDPOINT_TYPE_ATTRIBUTE\n( ENDPOINT_TYPE_REF,\n  ENDPOINT_TYPE_CLUSTER_REF,\n  ATTRIBUTE_REF,\n  INCLUDED,\n  STORAGE_OPTION,\n  SINGLETON,\n  BOUNDED,\n  DEFAULT_VALUE,\n  INCLUDED_REPORTABLE,\n  MIN_INTERVAL,\n  MAX_INTERVAL,\n  REPORTABLE_CHANGE )\nVALUES\n( ?, ?,\n  ( SELECT ATTRIBUTE_ID FROM ATTRIBUTE, ENDPOINT_TYPE_CLUSTER\n    WHERE ATTRIBUTE.CODE = ?\n    AND ATTRIBUTE.PACKAGE_REF = ?\n    AND ATTRIBUTE.SIDE = ENDPOINT_TYPE_CLUSTER.SIDE\n    AND ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID = ?\n    AND (ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = ATTRIBUTE.CLUSTER_REF\n      OR ATTRIBUTE.CLUSTER_REF IS NULL\n      )\n    AND ".concat(attribute.mfgCode == null
                    ? 'MANUFACTURER_CODE IS NULL'
                    : 'MANUFACTURER_CODE = ?', "),\n    ?, ?, ?, ?, ?, ?, ?, ?, ?)\n  "), arg)];
        });
    });
}
/**
 * Returns a promise of data for commands inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the command data.
 */
function exportCommandsFromEndpointTypeCluster(db, endpointTypeId, endpointClusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    name: x.NAME,
                    code: x.CODE,
                    mfgCode: x.MANUFACTURER_CODE,
                    source: x.SOURCE,
                    incoming: x.INCOMING,
                    outgoing: x.OUTGOING,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND.NAME,\n  COMMAND.CODE,\n  COMMAND.MANUFACTURER_CODE,\n  COMMAND.SOURCE,\n  ENDPOINT_TYPE_COMMAND.INCOMING,\n  ENDPOINT_TYPE_COMMAND.OUTGOING\nFROM\n  COMMAND\nINNER JOIN\n  ENDPOINT_TYPE_COMMAND\nON\n  COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF\nWHERE\n  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ?\n  AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ?\nORDER BY\n  COMMAND.MANUFACTURER_CODE, COMMAND.CODE\n        ", [endpointTypeId, endpointClusterId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Imports a command information of an endpoint type.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} endpointTypeId
 * @param {*} endpointClusterId may be null if global command
 * @param {*} command
 * @returns Promise of a command insertion.
 */
function importCommandForEndpointType(db, packageId, endpointTypeId, endpointClusterId, command) {
    return __awaiter(this, void 0, void 0, function () {
        var arg;
        return __generator(this, function (_a) {
            arg = [
                endpointTypeId,
                endpointClusterId,
                command.code,
                command.source,
                packageId,
                endpointClusterId,
            ];
            if (command.mfgCode != null)
                arg.push(command.mfgCode);
            arg.push(command.incoming, command.outgoing);
            return [2 /*return*/, dbApi.dbInsert(db, "\nINSERT INTO ENDPOINT_TYPE_COMMAND\n( ENDPOINT_TYPE_REF,\n  ENDPOINT_TYPE_CLUSTER_REF,\n  COMMAND_REF,\n  INCOMING,\n  OUTGOING )\nVALUES\n  ( ?, ?,\n    ( SELECT COMMAND_ID\n      FROM COMMAND, ENDPOINT_TYPE_CLUSTER WHERE\n        COMMAND.CODE = ?\n        AND COMMAND.SOURCE = ?\n        AND COMMAND.PACKAGE_REF = ?\n        AND ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID = ?\n        AND COMMAND.CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\n        AND ".concat(command.mfgCode == null
                    ? 'MANUFACTURER_CODE IS NULL'
                    : 'MANUFACTURER_CODE = ?', "),\n    ?,\n    ?\n    )\n  "), arg)];
        });
    });
}
exports.exportEndpointTypes = exportEndpointTypes;
exports.importEndpointType = importEndpointType;
exports.exportClustersFromEndpointType = exportClustersFromEndpointType;
exports.importClusterForEndpointType = importClusterForEndpointType;
exports.exportPackagesFromSession = exportPackagesFromSession;
exports.exportAttributesFromEndpointTypeCluster =
    exportAttributesFromEndpointTypeCluster;
exports.importAttributeForEndpointType = importAttributeForEndpointType;
exports.exportCommandsFromEndpointTypeCluster =
    exportCommandsFromEndpointTypeCluster;
exports.importCommandForEndpointType = importCommandForEndpointType;
exports.exportEndpoints = exportEndpoints;
exports.importEndpoint = importEndpoint;
//# sourceMappingURL=query-impexp.js.map