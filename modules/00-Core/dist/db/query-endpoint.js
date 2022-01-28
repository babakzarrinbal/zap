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
 * This module provides queries for endpoint configuration.
 *
 * @module DB API: endpoint configuration queries against the database.
 */
var dbApi = require('./db-api.js');
var bin = require('../util/bin');
var dbMapping = require('./db-mapping.js');
/**
 * Returns a promise resolving into all endpoints.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise resolving into all endpoints.
 */
function selectAllEndpoints(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  ENDPOINT_ID,\n  SESSION_REF,\n  ENDPOINT_TYPE_REF,\n  PROFILE,\n  ENDPOINT_IDENTIFIER,\n  NETWORK_IDENTIFIER,\n  DEVICE_VERSION,\n  DEVICE_IDENTIFIER\nFROM ENDPOINT\nWHERE SESSION_REF = ?\nORDER BY ENDPOINT_IDENTIFIER\n    ", [sessionId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.endpoint)];
            }
        });
    });
}
/**
 * Retrieves clusters on an endpoint.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns promise that resolves into endpoint clusters.
 */
function selectEndpointClusters(db, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  C.CLUSTER_ID,\n  EC.ENDPOINT_TYPE_CLUSTER_ID,\n  EC.ENDPOINT_TYPE_REF,\n  C.CODE,\n  C.NAME,\n  C.MANUFACTURER_CODE,\n  EC.SIDE\nFROM\n  CLUSTER AS C\nLEFT JOIN\n  ENDPOINT_TYPE_CLUSTER AS EC\nON\n  C.CLUSTER_ID = EC.CLUSTER_REF\nWHERE\n  EC.ENABLED = 1\n  AND EC.ENDPOINT_TYPE_REF = ?\nORDER BY C.CODE\n", [endpointTypeId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) {
                            return {
                                clusterId: row['CLUSTER_ID'],
                                endpointTypeId: row['ENDPOINT_TYPE_REF'],
                                endpointTypeClusterId: row['ENDPOINT_TYPE_CLUSTER_ID'],
                                hexCode: '0x' + bin.int16ToHex(row['CODE']),
                                manufacturerCode: row['MANUFACTURER_CODE'],
                                code: row['CODE'],
                                name: row['NAME'],
                                side: row['SIDE'],
                            };
                        })];
            }
        });
    });
}
/**
 * Retrieves endpoint cluster attributes
 *
 * @param {*} db
 * @param {*} clusterId
 * @param {*} side
 * @param {*} endpointTypeId
 * @returns promise that resolves into endpoint cluster attributes
 */
function selectEndpointClusterAttributes(db, clusterId, side, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  A.ATTRIBUTE_ID,\n  A.CODE,\n  A.NAME,\n  A.SIDE,\n  A.TYPE,\n  A.ARRAY_TYPE,\n  A.MIN_LENGTH,\n  A.MAX_LENGTH,\n  A.MIN,\n  A.MAX,\n  A.MANUFACTURER_CODE,\n  A.IS_WRITABLE,\n  A.IS_NULLABLE,\n  A.MUST_USE_TIMED_WRITE,\n  A.DEFINE,\n  EA.STORAGE_OPTION,\n  EA.SINGLETON,\n  EA.BOUNDED,\n  EA.INCLUDED,\n  EA.DEFAULT_VALUE,\n  EA.INCLUDED_REPORTABLE,\n  EA.MIN_INTERVAL,\n  EA.MAX_INTERVAL,\n  EA.REPORTABLE_CHANGE\nFROM\n  ATTRIBUTE AS A\nLEFT JOIN\n  ENDPOINT_TYPE_ATTRIBUTE AS EA\nON\n  A.ATTRIBUTE_ID = EA.ATTRIBUTE_REF\nWHERE\n  (A.CLUSTER_REF = ? OR A.CLUSTER_REF IS NULL)\n  AND A.SIDE = ?\n  AND (EA.ENDPOINT_TYPE_REF = ? AND (EA.ENDPOINT_TYPE_CLUSTER_REF =\n    (SELECT ENDPOINT_TYPE_CLUSTER_ID\n     FROM ENDPOINT_TYPE_CLUSTER\n     WHERE CLUSTER_REF = ? AND SIDE = ? AND ENDPOINT_TYPE_REF = ?) ))\nORDER BY A.MANUFACTURER_CODE, A.CODE\n    ", [clusterId, side, endpointTypeId, clusterId, side, endpointTypeId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) {
                            return {
                                id: row.ATTRIBUTE_ID,
                                clusterId: clusterId,
                                code: row.CODE,
                                manufacturerCode: row.MANUFACTURER_CODE,
                                hexCode: '0x' + bin.int16ToHex(row['CODE']),
                                name: row.NAME,
                                side: row.SIDE,
                                type: row.TYPE,
                                entryType: row.ARRAY_TYPE,
                                minLength: row.MIN_LENGTH,
                                maxLength: row.MAX_LENGTH,
                                min: row.MIN,
                                max: row.MAX,
                                storage: row.STORAGE_OPTION,
                                isIncluded: row.INCLUDED,
                                isSingleton: row.SINGLETON,
                                isBound: row.BOUNDED,
                                isWritable: row.IS_WRITABLE,
                                isNullable: row.IS_NULLABLE,
                                mustUseTimedWrite: row.MUST_USE_TIMED_WRITE,
                                defaultValue: row.DEFAULT_VALUE,
                                includedReportable: row.INCLUDED_REPORTABLE,
                                minInterval: row.MIN_INTERVAL,
                                maxInterval: row.MAX_INTERVAL,
                                reportableChange: row.REPORTABLE_CHANGE,
                                define: row.DEFINE,
                            };
                        })];
            }
        });
    });
}
/**
 * Retrieves endpoint cluster commands.
 *
 * @param {*} db
 * @param {*} clusterId
 * @param {*} endpointTypeId
 * @returns promise that resolves into endpoint cluster commands
 */
function selectEndpointClusterCommands(db, clusterId, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  C.COMMAND_ID,\n  C.NAME,\n  C.CODE,\n  C.SOURCE,\n  C.MANUFACTURER_CODE,\n  C.IS_OPTIONAL,\n  C.MUST_USE_TIMED_INVOKE,\n  EC.INCOMING,\n  EC.OUTGOING\nFROM\n  COMMAND AS C\nLEFT JOIN\n  ENDPOINT_TYPE_COMMAND AS EC\nON\n  C.COMMAND_ID = EC.COMMAND_REF\nWHERE\n  C.CLUSTER_REF = ?\n  AND EC.ENDPOINT_TYPE_REF = ?\nORDER BY C.CODE\n  ", [clusterId, endpointTypeId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) {
                            return {
                                id: row['COMMAND_ID'],
                                name: row['NAME'],
                                code: row['CODE'],
                                manufacturerCode: row['MANUFACTURER_CODE'],
                                isOptional: row['IS_OPTIONAL'],
                                mustUseTimedInvoke: row['MUST_USE_TIMED_INVOKE'],
                                source: row['SOURCE'],
                                isIncoming: row['INCOMING'],
                                isOutgoing: row['OUTGOING'],
                                hexCode: '0x' + bin.int8ToHex(row['CODE']),
                            };
                        })];
            }
        });
    });
}
/**
 * Deletes an endpoint.
 *
 * @export
 * @param {*} db
 * @param {*} id
 * @returns Promise to delete an endpoint that resolves with the number of rows that were deleted.
 */
function deleteEndpoint(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbRemove(db, 'DELETE FROM ENDPOINT WHERE ENDPOINT_ID = ?', [id])];
        });
    });
}
/**
 * Promises to add an endpoint.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @param {*} endpointIdentifier
 * @param {*} endpointTypeRef
 * @param {*} networkIdentifier
 * @returns Promise to update endpoints.
 */
function insertEndpoint(db, sessionId, endpointIdentifier, endpointTypeRef, networkIdentifier, profileIdentifier, endpointVersion, deviceIdentifier) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, "\nINSERT OR REPLACE\nINTO ENDPOINT (\n  SESSION_REF,\n  ENDPOINT_IDENTIFIER,\n  ENDPOINT_TYPE_REF,\n  NETWORK_IDENTIFIER,\n  DEVICE_VERSION,\n  DEVICE_IDENTIFIER,\n  PROFILE\n) VALUES ( ?, ?, ?, ?, ?, ?, ?)", [
                    sessionId,
                    endpointIdentifier,
                    endpointTypeRef,
                    networkIdentifier,
                    endpointVersion,
                    deviceIdentifier,
                    profileIdentifier,
                ])];
        });
    });
}
/**
 * Returns a promise of a single endpoint.
 * Mayb resolve into null if invalid reference.
 *
 * @param {*} db
 * @param {*} endpointId
 * @returns Promise of an endpoint.
 */
function selectEndpoint(db, endpointId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  ENDPOINT_ID,\n  SESSION_REF,\n  ENDPOINT_IDENTIFIER,\n  ENDPOINT_TYPE_REF,\n  PROFILE,\n  NETWORK_IDENTIFIER,\n  DEVICE_VERSION,\n  DEVICE_IDENTIFIER\nFROM\n  ENDPOINT\nWHERE\n  ENDPOINT_ID = ?", [endpointId])
                    .then(dbMapping.map.endpoint)];
        });
    });
}
exports.selectEndpointClusters = selectEndpointClusters;
exports.selectEndpointClusterAttributes = selectEndpointClusterAttributes;
exports.selectEndpointClusterCommands = selectEndpointClusterCommands;
exports.insertEndpoint = insertEndpoint;
exports.deleteEndpoint = deleteEndpoint;
exports.selectEndpoint = selectEndpoint;
exports.selectAllEndpoints = selectAllEndpoints;
//# sourceMappingURL=query-endpoint.js.map