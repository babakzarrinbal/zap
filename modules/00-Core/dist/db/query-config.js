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
 * This module provides queries for user configuration.
 *
 * @module DB API: user configuration queries against the database.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
var queryPackage = require('./query-package.js');
var dbEnum = require('../src-shared/db-enum.js');
var queryZcl = require('./query-zcl.js');
var queryCommand = require('./query-command.js');
var restApi = require('../src-shared/rest-api.js');
var _ = require('lodash');
/**
 * Promises to update the cluster include/exclude state.
 * If the entry [as defined uniquely by endpointTypeId, clusterId, side] is not there, then insert
 * Else update the entry in place.
 *
 * @export
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef
 * @param {*} side
 * @param {*} enabled
 * @returns Promise to update the cluster exclude/include state.
 */
function insertOrReplaceClusterState(db, endpointTypeId, clusterRef, side, enabled) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, "\nINSERT\nINTO ENDPOINT_TYPE_CLUSTER\n  ( ENDPOINT_TYPE_REF, CLUSTER_REF, SIDE, ENABLED )\nVALUES\n  ( ?, ?, ?, ?)\nON CONFLICT\n  (ENDPOINT_TYPE_REF, CLUSTER_REF, SIDE)\nDO UPDATE SET ENABLED = ?", [endpointTypeId, clusterRef, side, enabled, enabled])];
        });
    });
}
/**
 * Promise to get a cluster's state.
 * This must return undefined/null for if the cluster state has not been used before for the endpointType
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef
 * @param {*} side
 */
function selectClusterState(db, endpointTypeId, clusterRef, side) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\n    SELECT\n      ENDPOINT_TYPE_CLUSTER_ID,\n      ENDPOINT_TYPE_REF,\n      CLUSTER_REF,\n      SIDE,\n      ENABLED\n    FROM ENDPOINT_TYPE_CLUSTER\n    WHERE\n      ENDPOINT_TYPE_REF = ? AND\n      CLUSTER_REF = ? AND\n      SIDE = ?\n    ", [endpointTypeId, clusterRef, side])
                    .then(dbMapping.map.endpointTypeCluster)];
        });
    });
}
/**
 * Promise to get clusters' states for all endpoints
 * This must return undefined/null for if the cluster state has not been used before for the endpointType
 * @param {*} db
 * @param {*} clusterRef
 * @param {*} side
 */
function selectClusterStatesForAllEndpoints(db, clusterRef, side) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n    SELECT\n      ENDPOINT_TYPE_CLUSTER_ID,\n      ENDPOINT_TYPE_REF,\n      CLUSTER_REF,\n      SIDE,\n      ENABLED\n    FROM ENDPOINT_TYPE_CLUSTER\n    WHERE\n      CLUSTER_REF = ? AND\n      SIDE = ?\n    ", [clusterRef, side])
                    .then(function (rows) { return rows.map(dbMapping.map.endpointTypeCluster); })];
        });
    });
}
/**
 * Promise that resolves after inserting the defaults associated with the clusterside to the database.
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef
 * @param {*} side
 */
function insertClusterDefaults(db, endpointTypeId, packageId, cluster) {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            promises = [];
            promises.push(resolveDefaultAttributes(db, endpointTypeId, packageId, [cluster]));
            promises.push(resolveNonOptionalCommands(db, endpointTypeId, [cluster]));
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
/**
 * Promise to update the attribute state.
 * If the attribute entry [as defined uniquely by endpointTypeId and id], is not there, then create a default entry
 * Afterwards, update entry.
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef // We want this to be explicitly passed in, rather than derived from that static attribute due to this possibly being a global attribute.
 * @param {*} side // We want this to be explicitly passed in, rather than derived from that static attribute due to this possibly being a global attribute. Note we handle bidirectional attributes with two instances
 * @param {*} attributeId
 * @param {*} paramValuePairArray An array of objects whose keys are [key, value]. Key is name of the column to be editted. Value is what the column should be set to. This does not handle empty arrays.
 */
function insertOrUpdateAttributeState(db, endpointTypeId, clusterRef, side, attributeId, paramValuePairArray, reportMinInterval, reportMaxInterval, reportableChange) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, staticAttribute, etaId, query, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (reportMinInterval === undefined || reportMinInterval === null) {
                        reportMinInterval = 1;
                    }
                    if (reportMaxInterval === undefined || reportMaxInterval === null) {
                        reportMaxInterval = 0xffff - 1;
                    }
                    if (reportableChange === undefined || reportableChange === null) {
                        reportableChange = 0;
                    }
                    return [4 /*yield*/, insertOrSelectDefaultEndpointTypeCluster(db, endpointTypeId, clusterRef, side)];
                case 1:
                    cluster = _a.sent();
                    if (cluster == null) {
                        throw new Error("Could not locate cluster: ".concat(clusterRef));
                    }
                    return [4 /*yield*/, queryZcl.selectAttributeByAttributeIdAndClusterRef(db, attributeId, clusterRef)];
                case 2:
                    staticAttribute = _a.sent();
                    if (staticAttribute == null) {
                        throw new Error("COULD NOT LOCATE ATTRIBUTE: ".concat(attributeId, " "));
                    }
                    return [4 /*yield*/, dbApi.dbInsert(db, "\nINSERT OR IGNORE\nINTO ENDPOINT_TYPE_ATTRIBUTE (\n    ENDPOINT_TYPE_REF,\n    ENDPOINT_TYPE_CLUSTER_REF,\n    ATTRIBUTE_REF,\n    DEFAULT_VALUE,\n    STORAGE_OPTION,\n    SINGLETON,\n    MIN_INTERVAL,\n    MAX_INTERVAL,\n    REPORTABLE_CHANGE\n) VALUES (\n  ?,\n  ?,\n  ?,\n  ?,\n  ?,\n  ( SELECT IS_SINGLETON FROM CLUSTER WHERE CLUSTER_ID = ? ),\n  ?,\n  ?,\n  ?\n)", [
                            endpointTypeId,
                            cluster.endpointTypeClusterId,
                            attributeId,
                            staticAttribute.defaultValue ? staticAttribute.defaultValue : '',
                            dbEnum.storageOption.ram,
                            clusterRef,
                            reportMinInterval,
                            reportMaxInterval,
                            reportableChange,
                        ])];
                case 3:
                    etaId = _a.sent();
                    if (!(paramValuePairArray == null || paramValuePairArray.length == 0)) return [3 /*break*/, 4];
                    return [2 /*return*/, etaId];
                case 4:
                    query = 'UPDATE ENDPOINT_TYPE_ATTRIBUTE SET ' +
                        getAllParamValuePairArrayClauses(paramValuePairArray) +
                        'WHERE ENDPOINT_TYPE_REF = ? AND ENDPOINT_TYPE_CLUSTER_REF = ? AND ATTRIBUTE_REF = ?';
                    return [4 /*yield*/, dbApi.dbUpdate(db, query, [
                            endpointTypeId,
                            cluster.endpointTypeClusterId,
                            attributeId,
                        ])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dbApi.dbGet(db, "\nSELECT\n  ETA.ENDPOINT_TYPE_ATTRIBUTE_ID\nFROM\n  ENDPOINT_TYPE_ATTRIBUTE AS ETA\nWHERE\n  ETA.ENDPOINT_TYPE_REF = ? AND ENDPOINT_TYPE_CLUSTER_REF = ? AND ATTRIBUTE_REF = ?", [endpointTypeId, cluster.endpointTypeClusterId, attributeId])];
                case 6:
                    row = _a.sent();
                    return [2 /*return*/, row.ENDPOINT_TYPE_ATTRIBUTE_ID];
            }
        });
    });
}
function updateEndpointTypeAttribute(db, id, keyValuePairs) {
    return __awaiter(this, void 0, void 0, function () {
        var columns, args, query;
        return __generator(this, function (_a) {
            if (keyValuePairs == null || keyValuePairs.length == 0)
                return [2 /*return*/];
            columns = keyValuePairs
                .map(function (kv) { return "".concat(convertRestKeyToDbColumn(kv[0]), " = ?"); })
                .join(', ');
            args = [];
            keyValuePairs.forEach(function (kv) {
                args.push(kv[1]);
            });
            args.push(id);
            query = "UPDATE ENDPOINT_TYPE_ATTRIBUTE SET \n  ".concat(columns, "\nWHERE ENDPOINT_TYPE_ATTRIBUTE_ID = ?");
            return [2 /*return*/, dbApi.dbUpdate(db, query, args)];
        });
    });
}
function convertRestKeyToDbColumn(key) {
    switch (key) {
        case restApi.updateKey.endpointId:
            return 'ENDPOINT_IDENTIFIER';
        case restApi.updateKey.endpointType:
            return 'ENDPOINT_TYPE_REF';
        case restApi.updateKey.networkId:
            return 'NETWORK_IDENTIFIER';
        case restApi.updateKey.profileId:
            return 'PROFILE';
        case restApi.updateKey.deviceId:
            return 'DEVICE_IDENTIFIER';
        case restApi.updateKey.endpointVersion:
            return 'DEVICE_VERSION';
        case restApi.updateKey.deviceTypeRef:
            return 'DEVICE_TYPE_REF';
        case restApi.updateKey.name:
            return 'NAME';
        case restApi.updateKey.attributeSelected:
            return 'INCLUDED';
        case restApi.updateKey.attributeSingleton:
            return 'SINGLETON';
        case restApi.updateKey.attributeBounded:
            return 'BOUNDED';
        case restApi.updateKey.attributeDefault:
            return 'DEFAULT_VALUE';
        case restApi.updateKey.attributeReporting:
            return 'INCLUDED_REPORTABLE';
        case restApi.updateKey.attributeReportMin:
            return 'MIN_INTERVAL';
        case restApi.updateKey.attributeReportMax:
            return 'MAX_INTERVAL';
        case restApi.updateKey.attributeReportChange:
            return 'REPORTABLE_CHANGE';
        case restApi.updateKey.attributeStorage:
            return 'STORAGE_OPTION';
    }
    throw new Error("Invalid rest update key: ".concat(key));
}
function getAllParamValuePairArrayClauses(paramValuePairArray) {
    return paramValuePairArray.reduce(function (currentString, paramValuePair, index) {
        if (index > 0)
            currentString += ',';
        currentString += convertRestKeyToDbColumn(paramValuePair.key);
        currentString += ' = ';
        if (_.isBoolean(paramValuePair.value)) {
            currentString += paramValuePair.value ? '1' : '0';
        }
        else if (paramValuePair.value == '') {
            currentString += false;
        }
        else {
            if (paramValuePair.type == 'text') {
                currentString += "'" + paramValuePair.value + "'";
            }
            else {
                currentString += paramValuePair.value;
            }
        }
        currentString += ' ';
        return currentString;
    }, '');
}
/**
 * Promise to update the command state.
 * If the attribute entry [as defined uniquely by endpointTypeId and id], is not there, then create a default entry
 * Afterwards, update entry.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef // Note that this is the clusterRef from CLUSTER and not the ENDPOINT_TYPE_CLUSTER
 * @param {*} side // client or server
 * @param {*} id
 * @param {*} value
 * @param {*} booleanParam
 */
function insertOrUpdateCommandState(db, endpointTypeId, clusterRef, side, commandId, value, isIncoming) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertOrSelectDefaultEndpointTypeCluster(db, endpointTypeId, clusterRef, side)];
                case 1:
                    cluster = _a.sent();
                    return [4 /*yield*/, dbApi.dbInsert(db, "\nINSERT OR IGNORE\nINTO ENDPOINT_TYPE_COMMAND (\n  ENDPOINT_TYPE_REF,\n  ENDPOINT_TYPE_CLUSTER_REF,\n  COMMAND_REF\n) VALUES( ?, ?, ? )\n", [endpointTypeId, cluster.endpointTypeClusterId, commandId])];
                case 2:
                    _a.sent();
                    return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE ENDPOINT_TYPE_COMMAND\nSET ".concat(isIncoming ? 'INCOMING' : 'OUTGOING', " = ? \nWHERE ENDPOINT_TYPE_REF = ?\n  AND ENDPOINT_TYPE_CLUSTER_REF = ?\n  AND COMMAND_REF = ? "), [value, endpointTypeId, cluster.endpointTypeClusterId, commandId])];
            }
        });
    });
}
/**
 * Promise to update the event state.
 * If the attribute entry [as defined uniquely by endpointTypeId and id], is not there, then create a default entry
 * Afterwards, update entry.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef // Note that this is the clusterRef from CLUSTER and not the ENDPOINT_TYPE_CLUSTER
 * @param {*} side // client or server
 * @param {*} eventId
 * @param {*} value
 */
function insertOrUpdateEventState(db, endpointTypeId, clusterRef, side, eventId, value) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertOrSelectDefaultEndpointTypeCluster(db, endpointTypeId, clusterRef, side)];
                case 1:
                    cluster = _a.sent();
                    return [4 /*yield*/, dbApi.dbInsert(db, "\nINSERT OR IGNORE\nINTO ENDPOINT_TYPE_EVENT (\n  ENDPOINT_TYPE_REF,\n  ENDPOINT_TYPE_CLUSTER_REF,\n  EVENT_REF\n) VALUES( ?, ?, ? )\n", [endpointTypeId, cluster.endpointTypeClusterId, eventId])];
                case 2:
                    _a.sent();
                    return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE ENDPOINT_TYPE_EVENT\nSET INCLUDED = ? \nWHERE ENDPOINT_TYPE_REF = ?\n  AND ENDPOINT_TYPE_CLUSTER_REF = ?\n  AND EVENT_REF = ? ", [value, endpointTypeId, cluster.endpointTypeClusterId, eventId])];
            }
        });
    });
}
/**
 * Returns a promise to update the endpoint
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} endpointId
 * @param {*} changesArray
 * @returns Promise to update the endpoint
 */
function updateEndpoint(db, sessionId, endpointId, changesArray) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "UPDATE ENDPOINT SET " +
                    getAllParamValuePairArrayClauses(changesArray) +
                    "WHERE ENDPOINT_ID = ? AND SESSION_REF = ?", [endpointId, sessionId])];
        });
    });
}
/**
 * Returns the number of endpoints with a given endpoint_identifier and sessionid.
 * Used for validation
 *
 * @param {*} endpointIdentifier
 * @param {*} sessionId
 * @returns Promise that resolves into a count.
 */
function selectCountOfEndpointsWithGivenEndpointIdentifier(db, endpointIdentifier, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT COUNT(ENDPOINT_IDENTIFIER) FROM ENDPOINT WHERE ENDPOINT_IDENTIFIER = ? AND SESSION_REF = ?', [endpointIdentifier, sessionId])
                    .then(function (x) { return x['COUNT(ENDPOINT_IDENTIFIER)']; })];
        });
    });
}
/**
 * Promises to add an endpoint type.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @param {*} name
 * @param {*} deviceTypeRef
 * @returns Promise to update endpoints.
 */
function insertEndpointType(db, sessionId, name, deviceTypeRef, doTransaction) {
    if (doTransaction === void 0) { doTransaction = true; }
    return __awaiter(this, void 0, void 0, function () {
        var newEndpointTypeId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbInsert(db, 'INSERT OR REPLACE INTO ENDPOINT_TYPE ( SESSION_REF, NAME, DEVICE_TYPE_REF ) VALUES ( ?, ?, ?)', [sessionId, name, deviceTypeRef])];
                case 1:
                    newEndpointTypeId = _a.sent();
                    return [4 /*yield*/, setEndpointDefaults(db, sessionId, newEndpointTypeId, deviceTypeRef, doTransaction)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, newEndpointTypeId];
            }
        });
    });
}
/**
 * Promise to update a an endpoint type.
 * @param {*} db
 * @param {*} sessionId
 * @param {*} endpointTypeId
 * @param {*} param
 * @param {*} updatedValue
 */
function updateEndpointType(db, sessionId, endpointTypeId, updateKey, updatedValue) {
    return __awaiter(this, void 0, void 0, function () {
        var param, wasPresent, newEndpointId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    param = convertRestKeyToDbColumn(updateKey);
                    return [4 /*yield*/, dbApi.dbGet(db, 'SELECT DEVICE_TYPE_REF FROM ENDPOINT_TYPE WHERE ENDPOINT_TYPE_ID = ? AND SESSION_REF = ?', [endpointTypeId, sessionId])];
                case 1:
                    wasPresent = _a.sent();
                    return [4 /*yield*/, dbApi.dbUpdate(db, "UPDATE ENDPOINT_TYPE SET ".concat(param, " = ? WHERE ENDPOINT_TYPE_ID = ? AND SESSION_REF = ?"), [updatedValue, endpointTypeId, sessionId])];
                case 2:
                    newEndpointId = _a.sent();
                    if (!(param === 'DEVICE_TYPE_REF' && wasPresent[param] != updatedValue)) return [3 /*break*/, 4];
                    return [4 /*yield*/, setEndpointDefaults(db, sessionId, endpointTypeId, updatedValue)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, newEndpointId];
            }
        });
    });
}
/**
 * Promise to set the default attributes and clusters for a endpoint type.
 * @param {*} db
 * @param {*} endpointTypeId
 */
function setEndpointDefaults(db, sessionId, endpointTypeId, deviceTypeRef, doTransaction) {
    if (doTransaction === void 0) { doTransaction = true; }
    return __awaiter(this, void 0, void 0, function () {
        var pkgs, packageId, clusters, defaultClusters, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!doTransaction) return [3 /*break*/, 2];
                    return [4 /*yield*/, dbApi.dbBeginTransaction(db)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, queryPackage.getSessionPackagesByType(db, sessionId, dbEnum.packageType.zclProperties)];
                case 3:
                    pkgs = _a.sent();
                    if (pkgs == null || pkgs.length < 1)
                        throw new Error('Could not locate package id for a given session.');
                    packageId = pkgs[0].id;
                    return [4 /*yield*/, queryZcl.selectDeviceTypeClustersByDeviceTypeRef(db, deviceTypeRef)];
                case 4:
                    clusters = _a.sent();
                    return [4 /*yield*/, resolveDefaultClusters(db, endpointTypeId, clusters)];
                case 5:
                    defaultClusters = _a.sent();
                    promises = [];
                    promises.push(resolveDefaultDeviceTypeAttributes(db, endpointTypeId, deviceTypeRef), resolveDefaultDeviceTypeCommands(db, endpointTypeId, deviceTypeRef), resolveDefaultAttributes(db, endpointTypeId, packageId, defaultClusters), resolveNonOptionalCommands(db, endpointTypeId, defaultClusters));
                    return [2 /*return*/, Promise.all(promises).finally(function () {
                            if (doTransaction)
                                return dbApi.dbCommit(db);
                            else
                                return Promise.resolve({ defaultClusters: defaultClusters });
                        })];
            }
        });
    });
}
/**
 * Returns a promise of resolving default clusters.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusters
 * @returns Promise of resolved default clusters.
 */
function resolveDefaultClusters(db, endpointTypeId, clusters) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, allClustersResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = clusters.map(function (cluster) {
                        var clientServerPromise = [];
                        if (cluster.includeClient) {
                            clientServerPromise.push(insertOrReplaceClusterState(db, endpointTypeId, cluster.clusterRef, dbEnum.side.client, true).then(function () {
                                return {
                                    clusterRef: cluster.clusterRef,
                                    side: dbEnum.side.client,
                                };
                            }));
                        }
                        if (cluster.includeServer) {
                            clientServerPromise.push(insertOrReplaceClusterState(db, endpointTypeId, cluster.clusterRef, dbEnum.side.server, true).then(function () {
                                return {
                                    clusterRef: cluster.clusterRef,
                                    side: dbEnum.side.server,
                                };
                            }));
                        }
                        return Promise.all(clientServerPromise);
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    allClustersResult = _a.sent();
                    return [2 /*return*/, allClustersResult.flat()];
            }
        });
    });
}
/**
 * Returns promise of default device type attributes.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} deviceTypeRef
 * @returns promise of default device type attributes.
 */
function resolveDefaultDeviceTypeAttributes(db, endpointTypeId, deviceTypeRef) {
    return __awaiter(this, void 0, void 0, function () {
        var deviceTypeAttributes, promises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectDeviceTypeAttributesByDeviceTypeRef(db, deviceTypeRef)];
                case 1:
                    deviceTypeAttributes = _a.sent();
                    promises = deviceTypeAttributes.map(function (deviceAttribute) { return __awaiter(_this, void 0, void 0, function () {
                        var attribute, clusterRef;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(deviceAttribute.attributeRef != null)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, queryZcl.selectAttributeById(db, deviceAttribute.attributeRef)];
                                case 1:
                                    attribute = _a.sent();
                                    clusterRef = attribute === null || attribute === void 0 ? void 0 : attribute.clusterRef;
                                    return [2 /*return*/, insertOrUpdateAttributeState(db, endpointTypeId, clusterRef, attribute.side, deviceAttribute.attributeRef, [
                                            {
                                                key: restApi.updateKey.attributeSelected,
                                                value: true,
                                            },
                                            {
                                                key: restApi.updateKey.attributeReporting,
                                                value: deviceAttribute.isReportable == true,
                                            },
                                        ], attribute.reportMinInterval, attribute.reportMaxInterval, attribute.reportableChange)];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, Promise.all(promises)];
            }
        });
    });
}
function resolveCommandState(db, endpointTypeId, deviceCommand) {
    return __awaiter(this, void 0, void 0, function () {
        var deviceTypeCluster, command, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectDeviceTypeClusterByDeviceTypeClusterId(db, deviceCommand.deviceTypeClusterRef)];
                case 1:
                    deviceTypeCluster = _a.sent();
                    if (deviceCommand.commandRef == null)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, queryCommand.selectCommandById(db, deviceCommand.commandRef)];
                case 2:
                    command = _a.sent();
                    if (command == null)
                        return [2 /*return*/, null];
                    promises = [];
                    if (deviceTypeCluster.includeClient) {
                        promises.push(insertOrUpdateCommandState(db, endpointTypeId, command.clusterRef, command.source, deviceCommand.commandRef, true, command.source != dbEnum.source.client));
                    }
                    if (deviceTypeCluster.includeServer) {
                        promises.push(insertOrUpdateCommandState(db, endpointTypeId, command.clusterRef, command.source, deviceCommand.commandRef, true, command.source != dbEnum.source.server));
                    }
                    return [2 /*return*/, Promise.all(promises)];
            }
        });
    });
}
/**
 * Returns promise of default device type commands.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} deviceTypeRef
 * @returns promise of default device type commands.
 */
function resolveDefaultDeviceTypeCommands(db, endpointTypeId, deviceTypeRef) {
    return __awaiter(this, void 0, void 0, function () {
        var commands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectDeviceTypeCommandsByDeviceTypeRef(db, deviceTypeRef)];
                case 1:
                    commands = _a.sent();
                    return [2 /*return*/, Promise.all(commands.map(function (cmd) { return resolveCommandState(db, endpointTypeId, cmd); }))];
            }
        });
    });
}
function resolveNonOptionalCommands(db, endpointTypeId, clusters) {
    return __awaiter(this, void 0, void 0, function () {
        var clustersPromises;
        return __generator(this, function (_a) {
            clustersPromises = clusters.map(function (cluster) {
                return queryCommand
                    .selectCommandsByClusterId(db, cluster.clusterRef)
                    .then(function (commands) {
                    return Promise.all(commands.map(function (command) {
                        if (!command.isOptional) {
                            var isOutgoing = (cluster.side == dbEnum.side.client &&
                                command.source == dbEnum.source.client) ||
                                (cluster.side == dbEnum.side.server &&
                                    command.source == dbEnum.source.server);
                            return insertOrUpdateCommandState(db, endpointTypeId, command.clusterRef, command.source, command.id, true, !isOutgoing);
                        }
                        else {
                            return Promise.resolve();
                        }
                    }));
                });
            });
            return [2 /*return*/, Promise.all(clustersPromises)];
        });
    });
}
function resolveDefaultAttributes(db, endpointTypeId, packageId, endpointClusters) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointClustersPromises;
        return __generator(this, function (_a) {
            endpointClustersPromises = endpointClusters.map(function (cluster) {
                return queryZcl
                    .selectAttributesByClusterIdIncludingGlobal(db, cluster.clusterRef, packageId)
                    .then(function (attributes) {
                    var promiseArray = [];
                    promiseArray.push(resolveNonOptionalAndReportableAttributes(db, endpointTypeId, attributes, cluster));
                    return Promise.all(promiseArray);
                });
            });
            return [2 /*return*/, Promise.all(endpointClustersPromises)];
        });
    });
}
function resolveNonOptionalAndReportableAttributes(db, endpointTypeId, attributes, cluster) {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            promises = attributes.map(function (attribute) {
                var settings = [];
                if (attribute.isReportable)
                    settings.push({
                        key: restApi.updateKey.attributeReporting,
                        value: true,
                    });
                if (!attribute.isOptional) {
                    settings.push({
                        key: restApi.updateKey.attributeSelected,
                        value: true,
                    });
                }
                if (cluster.isSingleton) {
                    settings.push({
                        key: restApi.updateKey.attributeSingleton,
                        value: true,
                    });
                }
                var clusterRef = cluster.clusterRef;
                if (settings.length > 0 && clusterRef != null) {
                    return insertOrUpdateAttributeState(db, endpointTypeId, clusterRef, attribute.side, attribute.id, settings, attribute.reportMinInterval, attribute.reportMaxInterval, attribute.reportableChange);
                }
                else {
                    return Promise.resolve();
                }
            });
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
/**
 * Resolves into the number of endpoint types for session.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise that resolves into a count.
 */
function selectEndpointTypeCount(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, 'SELECT COUNT(ENDPOINT_TYPE_ID) AS CNT FROM ENDPOINT_TYPE WHERE SESSION_REF = ?', [sessionId])];
                case 1:
                    x = _a.sent();
                    return [2 /*return*/, x['CNT']];
            }
        });
    });
}
/**
 * Resolves into the number of endpoint types for session.
 * by cluster ID
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise that resolves into a count.
 */
function selectEndpointTypeCountByCluster(db, sessionId, endpointClusterId, side) {
    return __awaiter(this, void 0, void 0, function () {
        var x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, "\nSELECT\n  COUNT(ENDPOINT_TYPE_ID)\nFROM\n  ENDPOINT_TYPE\nWHERE SESSION_REF = ?\n  AND ENDPOINT_TYPE_ID IN\n      (SELECT ENDPOINT_TYPE_REF\n       FROM ENDPOINT_TYPE_CLUSTER\n       WHERE CLUSTER_REF = ? AND SIDE = ? AND ENABLED = 1) ", [sessionId, endpointClusterId, side])];
                case 1:
                    x = _a.sent();
                    return [2 /*return*/, x['COUNT(ENDPOINT_TYPE_ID)']];
            }
        });
    });
}
/**
 * Get or inserts default endpoint type cluster given endpoint type, cluster ref, and side.
 * @param {*} db
 * @param {*} endpointTypeId
 * @param {*} clusterRef
 * @param {*} side
 */
function insertOrSelectDefaultEndpointTypeCluster(db, endpointTypeId, clusterRef, side) {
    return __awaiter(this, void 0, void 0, function () {
        var eptClusterData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbInsert(db, "\nINSERT OR IGNORE\nINTO ENDPOINT_TYPE_CLUSTER (\n  ENDPOINT_TYPE_REF, CLUSTER_REF, SIDE, ENABLED\n) VALUES ( ?, ?, ?, ? )\n", [endpointTypeId, clusterRef, side, false])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dbApi.dbGet(db, "\nSELECT\n  ENDPOINT_TYPE_CLUSTER_ID,\n  ENDPOINT_TYPE_REF,\n  CLUSTER_REF,\n  SIDE,\n  ENABLED\nFROM ENDPOINT_TYPE_CLUSTER\nWHERE ENDPOINT_TYPE_REF = ?\n  AND CLUSTER_REF = ?\n  AND SIDE = ?", [endpointTypeId, clusterRef, side])];
                case 2:
                    eptClusterData = _a.sent();
                    return [2 /*return*/, dbMapping.map.endpointTypeCluster(eptClusterData)];
            }
        });
    });
}
/**
 * Returns a promise that resolve into an endpoint type attribute id.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} clusterCode
 * @param {*} attributeCode
 * @param {*} attributeSide
 * @param {*} mfgCode
 * @returns endpointType attribute id or null
 */
function selectEndpointTypeAttributeId(db, endpointTypeId, packageId, clusterCode, attributeCode, attributeSide, mfgCode) {
    return __awaiter(this, void 0, void 0, function () {
        var args, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = [
                        endpointTypeId,
                        packageId,
                        clusterCode,
                        attributeCode,
                        attributeSide,
                    ];
                    if (!(mfgCode == 0 || mfgCode == null))
                        args.push(mfgCode);
                    return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT \n  ENDPOINT_TYPE_ATTRIBUTE_ID\nFROM \n  ENDPOINT_TYPE_ATTRIBUTE AS ETA\nINNER JOIN\n  ATTRIBUTE AS A\nON\n  ETA.ATTRIBUTE_REF = A.ATTRIBUTE_ID \nINNER JOIN\n  CLUSTER AS C\nON \n  C.CLUSTER_ID = A.CLUSTER_REF\nWHERE\n  ETA.ENDPOINT_TYPE_REF = ?\n  AND C.PACKAGE_REF = ?\n  AND C.CODE = ?\n  AND A.CODE = ?\n  AND A.SIDE = ?\n  AND ".concat(mfgCode == 0 || mfgCode == null
                            ? 'A.MANUFACTURER_CODE IS NULL'
                            : 'A.MANUFACTURER_CODE = ?', "\n"), args)];
                case 1:
                    rows = _a.sent();
                    if (rows.length == 0) {
                        return [2 /*return*/, null];
                    }
                    else if (rows.length == 1) {
                        return [2 /*return*/, rows[0].ENDPOINT_TYPE_ATTRIBUTE_ID];
                    }
                    else {
                        throw new Error("Ambiguity: multiple attributes with same data loaded: ".concat(endpointTypeId, " / ").concat(clusterCode, " / ").concat(attributeCode, " / ").concat(attributeSide, "."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieves all the attribute data for the session.
 *
 * @param {*} db
 * @param {*} sessionId
 */
function selectAllSessionAttributes(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  A.NAME,\n  A.CODE AS ATTRIBUTE_CODE,\n  C.CODE AS CLUSTER_CODE,\n  ETA.DEFAULT_VALUE,\n  ETA.STORAGE_OPTION,\n  ETA.SINGLETON,\n  ETA.BOUNDED,\n  A.TYPE,\n  A.SIDE,\n  A.MIN,\n  A.MAX,\n  A.IS_WRITABLE,\n  A.ARRAY_TYPE,\n  ETA.INCLUDED_REPORTABLE,\n  ETA.MIN_INTERVAL,\n  ETA.MAX_INTERVAL,\n  ETA.REPORTABLE_CHANGE\nFROM\n  ENDPOINT_TYPE_ATTRIBUTE AS ETA\nJOIN\n  ENDPOINT_TYPE_CLUSTER AS ETC ON ETA.ENDPOINT_TYPE_CLUSTER_REF = ETC.ENDPOINT_TYPE_CLUSTER_ID\nJOIN\n  CLUSTER AS C ON ETC.CLUSTER_REF = C.CLUSTER_ID\nJOIN\n  ATTRIBUTE AS A ON ETA.ATTRIBUTE_REF = A.ATTRIBUTE_ID\nJOIN\n  ENDPOINT_TYPE AS ET ON ETA.ENDPOINT_TYPE_REF = ET.ENDPOINT_TYPE_ID\nWHERE\n  ET.SESSION_REF = ? AND ETA.INCLUDED = 1\nORDER BY\n  CLUSTER_CODE, ATTRIBUTE_CODE\n  ", [sessionId])
                    .then(function (rows) {
                    return rows.map(function (row) {
                        return {
                            name: row.NAME,
                            attributeCode: row.ATTRIBUTE_CODE,
                            clusterCode: row.CLUSTER_CODE,
                            defaultValue: row.DEFAULT_VALUE,
                            storageOption: row.STORAGE_OPTION,
                            isSingleton: row.SINGLETON,
                            isBounded: row.BOUNDED,
                            type: row.TYPE,
                            side: row.SIDE,
                            min: row.MIN,
                            max: row.MAX,
                            writable: row.IS_WRITABLE,
                            entryType: row.ARRAY_TYPE,
                            reportable: {
                                included: row.INCLUDED_REPORTABLE,
                                minInterval: row.MIN_INTERVAL,
                                maxInterval: row.MAX_INTERVAL,
                                change: row.REPORTABLE_CHANGE,
                            },
                        };
                    });
                })];
        });
    });
}
/**
 * Sets a given cluster to be included on a given endpoint.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} clusterCode
 * @param {*} isIncluded
 * @param {*} side
 */
function setClusterIncluded(db, packageId, endpointTypeId, clusterCode, isIncluded, side) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, clusterState, insertDefaults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectClusterByCode(db, packageId, clusterCode)];
                case 1:
                    cluster = _a.sent();
                    return [4 /*yield*/, selectClusterState(db, endpointTypeId, cluster.id, side)];
                case 2:
                    clusterState = _a.sent();
                    insertDefaults = clusterState == null;
                    return [4 /*yield*/, insertOrReplaceClusterState(db, endpointTypeId, cluster.id, side, isIncluded)];
                case 3:
                    _a.sent();
                    if (!insertDefaults) return [3 /*break*/, 5];
                    return [4 /*yield*/, insertClusterDefaults(db, endpointTypeId, packageId, {
                            clusterRef: cluster.id,
                            side: side,
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// exports
exports.insertOrReplaceClusterState = insertOrReplaceClusterState;
exports.selectClusterState = selectClusterState;
exports.selectClusterStatesForAllEndpoints = selectClusterStatesForAllEndpoints;
exports.insertOrUpdateAttributeState = insertOrUpdateAttributeState;
exports.insertOrUpdateCommandState = insertOrUpdateCommandState;
exports.insertOrUpdateEventState = insertOrUpdateEventState;
exports.convertRestKeyToDbColumn = convertRestKeyToDbColumn;
exports.updateEndpoint = updateEndpoint;
exports.insertEndpointType = insertEndpointType;
exports.updateEndpointType = updateEndpointType;
exports.selectCountOfEndpointsWithGivenEndpointIdentifier =
    selectCountOfEndpointsWithGivenEndpointIdentifier;
exports.selectEndpointTypeCount = selectEndpointTypeCount;
exports.selectEndpointTypeCountByCluster = selectEndpointTypeCountByCluster;
exports.selectAllSessionAttributes = selectAllSessionAttributes;
exports.insertClusterDefaults = insertClusterDefaults;
exports.setClusterIncluded = setClusterIncluded;
exports.selectEndpointTypeAttributeId = selectEndpointTypeAttributeId;
exports.updateEndpointTypeAttribute = updateEndpointTypeAttribute;
//# sourceMappingURL=query-config.js.map