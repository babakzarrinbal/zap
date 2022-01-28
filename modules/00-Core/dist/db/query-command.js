"use strict";
/**
 *
 *    Copyright (c) 2021 Silicon Labs
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
 * This module provides queries related to commands.
 *
 * @module DB API: command queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
/**
 * Returns the count of the number of cluster commands with cli for a cluster
 * @param {*} db
 * @param {*} endpointTypes
 * @param {*} endpointClusterId
 */
function selectCliCommandCountFromEndpointTypeCluster(db, endpointTypes, endpointClusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
                    return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  COUNT(*) AS COUNT\nFROM\n  COMMAND\nINNER JOIN CLUSTER\n  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID\nINNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nINNER JOIN PACKAGE_OPTION\n  ON PACKAGE_OPTION.OPTION_CODE = COMMAND.NAME\nWHERE ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\n  AND ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID = ?\n        "), [endpointClusterId])];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res[0].COUNT];
            }
        });
    });
}
/**
 *
 * @param db
 * @param endpointClusterId
 * Returns: A promise with all commands with cli for a given cluster id
 */
function selectCliCommandsFromCluster(db, endpointClusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    name: x.NAME,
                    code: x.CODE,
                    mfgCode: x.MANUFACTURER_CODE,
                    source: x.SOURCE,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND.NAME,\n  COMMAND.CODE,\n  COMMAND.MANUFACTURER_CODE,\n  COMMAND.SOURCE\nFROM\n  COMMAND\nINNER JOIN\n  CLUSTER\nON\n  COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID\nINNER JOIN\n  PACKAGE_OPTION\nON\n  PACKAGE_OPTION.OPTION_CODE = COMMAND.NAME\nWHERE CLUSTER.CLUSTER_ID = ?", [endpointClusterId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * All available cluster command detals across all endpoints and clusters.
 * @param db
 * @param endpointTypes
 * @returns Available Cluster command details across given endpoints and clusters.
 * Note: The relationship between the endpoint_type_cluster being enabled and a
 * endpoint_type_command is indirect. The reason for this being the endpoint
 * type command is not precisely linked to the sides of the cluster as commands
 * do not belong to a side of a cluster like an attribute.
 */
function selectAllAvailableClusterCommandDetailsFromEndpointTypes(db, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    id: x.CLUSTER_ID,
                    clusterName: x.CLUSTER_NAME,
                    clusterCode: x.CLUSTER_CODE,
                    clusterDefine: x.CLUSTER_DEFINE,
                    commandMfgCode: x.COMMAND_MANUFACTURER_CODE,
                    clusterMfgCode: x.CLUSTER_MANUFACTURER_CODE,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterEnabled: x.CLUSTER_ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                    numberOfClusterSidesEnabled: x.NO_OF_CLUSTER_SIDES_ENABLED,
                    commandName: x.COMMAND_NAME,
                    commandSource: x.COMMAND_SOURCE,
                    commandCode: x.COMMAND_CODE,
                    incoming: x.INCOMING,
                    outgoing: x.OUTGOING,
                    mfgCommandCount: x.MANUFACTURING_SPECIFIC_COMMAND_COUNT,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT * FROM (\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.CODE AS CLUSTER_CODE,\n  CLUSTER.DEFINE AS CLUSTER_DEFINE,\n  COMMAND.MANUFACTURER_CODE AS COMMAND_MANUFACTURER_CODE,\n  CLUSTER.MANUFACTURER_CODE AS CLUSTER_MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS CLUSTER_ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,\n  COUNT(*) OVER (PARTITION BY CLUSTER.MANUFACTURER_CODE, CLUSTER.NAME, COMMAND.MANUFACTURER_CODE, COMMAND.NAME) AS NO_OF_CLUSTER_SIDES_ENABLED,\n  COMMAND.NAME AS COMMAND_NAME,\n  COMMAND.SOURCE AS COMMAND_SOURCE,\n  COMMAND.CODE AS COMMAND_CODE,\n  ENDPOINT_TYPE_COMMAND.INCOMING AS INCOMING,\n  ENDPOINT_TYPE_COMMAND.OUTGOING AS OUTGOING,\n  COUNT(COMMAND.MANUFACTURER_CODE) OVER () AS MANUFACTURING_SPECIFIC_COMMAND_COUNT\nFROM COMMAND\nINNER JOIN ENDPOINT_TYPE_COMMAND\nON ENDPOINT_TYPE_COMMAND.COMMAND_REF = COMMAND.COMMAND_ID\nINNER JOIN CLUSTER\nON CLUSTER.CLUSTER_ID = COMMAND.CLUSTER_REF\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nWHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\nAND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\nAND ENDPOINT_TYPE_CLUSTER.SIDE IN (\"client\", \"server\") AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nAND (\n      (ENDPOINT_TYPE_COMMAND.INCOMING=1 AND COMMAND.SOURCE!=ENDPOINT_TYPE_CLUSTER.SIDE) OR\n      (ENDPOINT_TYPE_COMMAND.OUTGOING=1 AND COMMAND.SOURCE=ENDPOINT_TYPE_CLUSTER.SIDE)\n    )\nGROUP BY CLUSTER.MANUFACTURER_CODE, CLUSTER.NAME, COMMAND.MANUFACTURER_CODE, COMMAND.NAME, ENDPOINT_TYPE_CLUSTER.SIDE ) GROUP BY CLUSTER_MANUFACTURER_CODE, CLUSTER_NAME, COMMAND_MANUFACTURER_CODE, COMMAND_NAME ORDER BY CLUSTER_MANUFACTURER_CODE, CLUSTER_CODE, COMMAND_MANUFACTURER_CODE, COMMAND_CODE"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * All Clusters with available incoming commands.
 * @param db
 * @param endpointTypes
 * @returns All Clusters with side that have available incoming commands.
 * uniqueClusterCodes can be used to get unique clusters based on a cluster code
 * and this can eliminate duplicate cluster code entries when manufacturing
 * specific clusters exist with the same cluster code.
 * Note: The relationship between the endpoint_type_cluster being enabled and a
 * endpoint_type_command is indirect. The reason for this being the endpoint
 * type command is not precisely linked to the sides of the cluster as commands
 * do not belong to a side of a cluster like an attribute.
 */
function selectAllClustersWithIncomingCommands(db, endpointTypes, uniqueClusterCodes) {
    if (uniqueClusterCodes === void 0) { uniqueClusterCodes = false; }
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, sqlGroupBy, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            sqlGroupBy = uniqueClusterCodes ? 'CLUSTER.CODE' : 'CLUSTER.NAME';
            mapFunction = function (x) {
                return {
                    id: x.CLUSTER_ID,
                    clusterName: x.CLUSTER_NAME,
                    code: x.CLUSTER_CODE,
                    clusterDefine: x.CLUSTER_DEFINE,
                    clusterMfgCode: x.MANUFACTURER_CODE,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterEnabled: x.CLUSTER_ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.CODE AS CLUSTER_CODE,\n  CLUSTER.DEFINE AS CLUSTER_DEFINE,\n  CLUSTER.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS CLUSTER_ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nFROM\n  COMMAND\nINNER JOIN\n  ENDPOINT_TYPE_COMMAND\nON\n  ENDPOINT_TYPE_COMMAND.COMMAND_REF = COMMAND.COMMAND_ID\nINNER JOIN\n  CLUSTER\nON\n  CLUSTER.CLUSTER_ID = COMMAND.CLUSTER_REF\nINNER JOIN\n  ENDPOINT_TYPE_CLUSTER\nON\n  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nWHERE\n  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\n  AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\n  AND ENDPOINT_TYPE_CLUSTER.SIDE IN (\"client\", \"server\")\n  AND ENDPOINT_TYPE_CLUSTER.ENABLED = 1\n  AND ENDPOINT_TYPE_COMMAND.INCOMING = 1\n  AND COMMAND.SOURCE != ENDPOINT_TYPE_CLUSTER.SIDE\nGROUP BY\n  ").concat(sqlGroupBy, ", ENDPOINT_TYPE_CLUSTER.SIDE ORDER BY CLUSTER.NAME, ENDPOINT_TYPE_CLUSTER.SIDE"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * All Manufacturing Clusters with available incoming commands for a given
 * cluster code.
 * @param db
 * @param endpointTypes
 * @returns  All Manufacturing Clusters with available incoming commands for a
 * given cluster code.
 * Note: The relationship between the endpoint_type_cluster being enabled and a
 * endpoint_type_command is indirect. The reason for this being the endpoint
 * type command is not precisely linked to the sides of the cluster as commands
 * do not belong to a side of a cluster like an attribute.
 */
function selectMfgClustersWithIncomingCommandsForClusterCode(db, endpointTypes, clusterCode) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    id: x.CLUSTER_ID,
                    clusterName: x.CLUSTER_NAME,
                    code: x.CLUSTER_CODE,
                    clusterDefine: x.CLUSTER_DEFINE,
                    clusterMfgCode: x.MANUFACTURER_CODE,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterEnabled: x.CLUSTER_ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.CODE AS CLUSTER_CODE,\n  CLUSTER.DEFINE AS CLUSTER_DEFINE,\n  CLUSTER.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS CLUSTER_ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nFROM\n  COMMAND\nINNER JOIN\n  ENDPOINT_TYPE_COMMAND\nON\n  ENDPOINT_TYPE_COMMAND.COMMAND_REF = COMMAND.COMMAND_ID\nINNER JOIN\n  CLUSTER\nON\n  CLUSTER.CLUSTER_ID = COMMAND.CLUSTER_REF\nINNER JOIN\n  ENDPOINT_TYPE_CLUSTER\nON\n  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nWHERE\n  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\n  AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\n  AND ENDPOINT_TYPE_CLUSTER.SIDE IN (\"client\", \"server\")\n  AND ENDPOINT_TYPE_CLUSTER.ENABLED = 1\n  AND ENDPOINT_TYPE_COMMAND.INCOMING = 1\n  AND COMMAND.SOURCE != ENDPOINT_TYPE_CLUSTER.SIDE\n  AND CLUSTER.CODE = ").concat(clusterCode, "\nGROUP BY\n  CLUSTER.NAME, ENDPOINT_TYPE_CLUSTER.SIDE ORDER BY CLUSTER.NAME, ENDPOINT_TYPE_CLUSTER.SIDE"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * All Clusters with available incoming commands. This function seeks to consolidate endpoint type clusters
 * that are differentiated by sides into one entry.
 * @param db
 * @param endpointTypes
 * @returns All Clusters that have available incoming commands.
 * Note: The relationship between the endpoint_type_cluster being enabled and a
 * endpoint_type_command is indirect. The reason for this being the endpoint
 * type command is not precisely linked to the sides of the cluster as commands
 * do not belong to a side of a cluster like an attribute.
 */
function selectAllClustersWithIncomingCommandsCombined(db, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var uncombinedClusters, reduceFunction;
        return __generator(this, function (_a) {
            uncombinedClusters = selectAllClustersWithIncomingCommands(db, endpointTypes);
            reduceFunction = function (combinedClusters, currentValue) {
                // Find out if current cluster is in combinedClusters, or just use currentValue otherwise.
                var newVal = combinedClusters.has(currentValue.id)
                    ? combinedClusters.get(currentValue.id)
                    : currentValue;
                //Add side enabled keys
                if (currentValue.clusterSide == 'client') {
                    newVal['clientSideEnabled'] = true;
                }
                else if (currentValue.clusterSide == 'server') {
                    newVal['serverSideEnabled'] = true;
                }
                // Delete extraneous keys
                delete newVal['clusterSide'];
                delete newVal['enabled'];
                combinedClusters.set(currentValue.id, newVal);
                return combinedClusters;
            };
            return [2 /*return*/, uncombinedClusters.then(function (rows) {
                    return Array.from(rows.reduce(reduceFunction, new Map()), function (value, key) { return value[1]; });
                })];
        });
    });
}
/**
 * This function returns all incoming commands that are on enabled sides for a cluster.
 * @param db
 * @param endpointTypes
 * @param clName
 * @param clientSideEnabled
 * @param serverSideEnabled
 * @param isMfgSpecific
 * @return All commands that are enabled on their incoming side. This is unique based on the command name across a cluster.
 *
 */
function selectAllIncomingCommandsForClusterCombined(db, endpointTypes, clName, clientSideEnabled, serverSideEnabled, isMfgSpecific) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _a, server, _b, combinedClusters, reduceFunction;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!clientSideEnabled) return [3 /*break*/, 2];
                    return [4 /*yield*/, selectAllIncomingCommandsForCluster(db, endpointTypes, clName, 'client', isMfgSpecific)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = [];
                    _c.label = 3;
                case 3:
                    client = _a;
                    if (!serverSideEnabled) return [3 /*break*/, 5];
                    return [4 /*yield*/, selectAllIncomingCommandsForCluster(db, endpointTypes, clName, 'server', isMfgSpecific)];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = [];
                    _c.label = 6;
                case 6:
                    server = _b;
                    combinedClusters = client.concat(server);
                    reduceFunction = function (combinedMap, currentValue) {
                        if (!combinedMap.has(currentValue.commandName)) {
                            combinedMap.set(currentValue.commandName, currentValue);
                        }
                        return combinedMap;
                    };
                    return [2 /*return*/, Array.from(combinedClusters.reduce(reduceFunction, new Map()), function (value, key) { return value[1]; })];
            }
        });
    });
}
function selectAllIncomingCommandsForCluster(db, endpointTypes, clName, clSide, isMfgSpecific) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mfgSpecificString, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mfgSpecificString = isMfgSpecific === undefined
                ? ""
                : isMfgSpecific
                    ? " AND COMMAND.MANUFACTURER_CODE IS NOT NULL "
                    : " AND COMMAND.MANUFACTURER_CODE IS NULL ";
            mapFunction = function (x) {
                return {
                    clusterId: x.CLUSTER_ID,
                    clusterName: x.CLUSTER_NAME,
                    clusterCode: x.CLUSTER_CODE,
                    clusterDefine: x.CLUSTER_DEFINE,
                    commandMfgCode: x.COMMAND_MANUFACTURER_CODE,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterEnabled: x.CLUSTER_ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                    numberOfClusterSidesEnabled: x.NO_OF_CLUSTER_SIDES_ENABLED,
                    id: x.COMMAND_ID,
                    commandName: x.COMMAND_NAME,
                    commandSource: x.COMMAND_SOURCE,
                    code: x.COMMAND_CODE,
                    mustUseTimedInvoke: dbApi.fromDbBool(x.MUST_USE_TIMED_INVOKE),
                    incoming: x.INCOMING,
                    outgoing: x.OUTGOING,
                    mfgCommandCount: x.MANUFACTURING_SPECIFIC_COMMAND_COUNT,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.CODE AS CLUSTER_CODE,\n  CLUSTER.DEFINE AS CLUSTER_DEFINE,\n  COMMAND.MANUFACTURER_CODE AS COMMAND_MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS CLUSTER_ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,\n  COUNT(*) OVER (PARTITION BY CLUSTER.NAME, COMMAND.NAME) AS NO_OF_CLUSTER_SIDES_ENABLED,\n  COMMAND.COMMAND_ID AS COMMAND_ID,\n  COMMAND.NAME AS COMMAND_NAME,\n  COMMAND.SOURCE AS COMMAND_SOURCE,\n  COMMAND.CODE AS COMMAND_CODE,\n  COMMAND.MUST_USE_TIMED_INVOKE AS MUST_USE_TIMED_INVOKE,\n  ENDPOINT_TYPE_COMMAND.INCOMING AS INCOMING,\n  ENDPOINT_TYPE_COMMAND.OUTGOING AS OUTGOING,\n  COUNT(COMMAND.MANUFACTURER_CODE) OVER () AS MANUFACTURING_SPECIFIC_COMMAND_COUNT\nFROM COMMAND\nINNER JOIN ENDPOINT_TYPE_COMMAND\nON ENDPOINT_TYPE_COMMAND.COMMAND_REF = COMMAND.COMMAND_ID\nINNER JOIN CLUSTER\nON CLUSTER.CLUSTER_ID = COMMAND.CLUSTER_REF\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nWHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\nAND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\nAND ENDPOINT_TYPE_CLUSTER.SIDE IN (\"client\", \"server\") AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nAND ENDPOINT_TYPE_COMMAND.INCOMING=1 AND COMMAND.SOURCE!=ENDPOINT_TYPE_CLUSTER.SIDE\nAND CLUSTER.NAME = \"").concat(clName, "\" AND ENDPOINT_TYPE_CLUSTER.SIDE = \"").concat(clSide, "\" \n").concat(mfgSpecificString, " GROUP BY COMMAND.NAME"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
function selectAllIncomingCommands(db, endpointTypes, isMfgSpecific) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mfgSpecificString, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mfgSpecificString = isMfgSpecific === undefined
                ? ""
                : isMfgSpecific
                    ? " AND COMMAND.MANUFACTURER_CODE IS NOT NULL "
                    : " AND COMMAND.MANUFACTURER_CODE IS NULL ";
            mapFunction = function (x) {
                return {
                    clusterId: x.CLUSTER_ID,
                    clusterName: x.CLUSTER_NAME,
                    clusterCode: x.CLUSTER_CODE,
                    clusterDefine: x.CLUSTER_DEFINE,
                    commandMfgCode: x.COMMAND_MANUFACTURER_CODE,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterEnabled: x.CLUSTER_ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                    numberOfClusterSidesEnabled: x.NO_OF_CLUSTER_SIDES_ENABLED,
                    id: x.COMMAND_ID,
                    commandName: x.COMMAND_NAME,
                    commandSource: x.COMMAND_SOURCE,
                    code: x.COMMAND_CODE,
                    mustUseTimedInvoke: dbApi.fromDbBool(x.MUST_USE_TIMED_INVOKE),
                    incoming: x.INCOMING,
                    outgoing: x.OUTGOING,
                    mfgCommandCount: x.MANUFACTURING_SPECIFIC_COMMAND_COUNT,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.CODE AS CLUSTER_CODE,\n  CLUSTER.DEFINE AS CLUSTER_DEFINE,\n  COMMAND.MANUFACTURER_CODE AS COMMAND_MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS CLUSTER_ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,\n  COUNT(*) OVER (PARTITION BY CLUSTER.NAME, COMMAND.NAME) AS NO_OF_CLUSTER_SIDES_ENABLED,\n  COMMAND.COMMAND_ID AS COMMAND_ID,\n  COMMAND.NAME AS COMMAND_NAME,\n  COMMAND.SOURCE AS COMMAND_SOURCE,\n  COMMAND.CODE AS COMMAND_CODE,\n  COMMAND.MUST_USE_TIMED_INVOKE AS MUST_USE_TIMED_INVOKE,\n  ENDPOINT_TYPE_COMMAND.INCOMING AS INCOMING,\n  ENDPOINT_TYPE_COMMAND.OUTGOING AS OUTGOING,\n  COUNT(COMMAND.MANUFACTURER_CODE) OVER () AS MANUFACTURING_SPECIFIC_COMMAND_COUNT\nFROM COMMAND\nINNER JOIN ENDPOINT_TYPE_COMMAND\nON ENDPOINT_TYPE_COMMAND.COMMAND_REF = COMMAND.COMMAND_ID\nINNER JOIN CLUSTER\nON CLUSTER.CLUSTER_ID = COMMAND.CLUSTER_REF\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nWHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\nAND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\nAND ENDPOINT_TYPE_CLUSTER.SIDE IN (\"client\", \"server\") AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nAND ENDPOINT_TYPE_COMMAND.INCOMING=1 AND COMMAND.SOURCE!=ENDPOINT_TYPE_CLUSTER.SIDE \n").concat(mfgSpecificString, " GROUP BY CLUSTER.NAME, COMMAND.NAME\nORDER BY CLUSTER.NAME, COMMAND.NAME"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
function selectCommandByCode(db, packageId, clusterCode, commandCode, mfgCode) {
    if (mfgCode === void 0) { mfgCode = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (clusterCode == null) {
                return [2 /*return*/, selectGlobalCommandByCode(db, packageId, commandCode, mfgCode)];
            }
            else {
                return [2 /*return*/, selectNonGlobalCommandByCode(db, packageId, clusterCode, commandCode, mfgCode)];
            }
            return [2 /*return*/];
        });
    });
}
function selectNonGlobalCommandByCode(db, packageId, clusterCode, commandCode, mfgCode) {
    if (mfgCode === void 0) { mfgCode = null; }
    return __awaiter(this, void 0, void 0, function () {
        var query, args;
        return __generator(this, function (_a) {
            query = "\n  SELECT\n    C.COMMAND_ID,\n    C.CLUSTER_REF,\n    C.PACKAGE_REF,\n    C.CODE,\n    C.MANUFACTURER_CODE,\n    C.NAME,\n    C.DESCRIPTION,\n    C.SOURCE,\n    C.IS_OPTIONAL,\n    C.MUST_USE_TIMED_INVOKE,\n    C.RESPONSE_REF\n  FROM COMMAND AS C\n  INNER JOIN CLUSTER AS CL\n  ON CL.CLUSTER_ID = C.CLUSTER_REF\n  WHERE\n    C.PACKAGE_REF = ?\n    AND C.CODE = ?\n    AND CL.CODE = ?";
            if (mfgCode == null || mfgCode == 0) {
                query = query + " AND C.MANUFACTURER_CODE IS NULL";
                args = [packageId, commandCode, clusterCode];
            }
            else {
                query = query + " AND C.MANUFACTURER_CODE = ?";
                args = [packageId, commandCode, clusterCode, mfgCode];
            }
            return [2 /*return*/, dbApi.dbGet(db, query, args).then(dbMapping.map.command)];
        });
    });
}
function selectGlobalCommandByCode(db, packageId, commandCode, mfgCode) {
    if (mfgCode === void 0) { mfgCode = null; }
    return __awaiter(this, void 0, void 0, function () {
        var query, args;
        return __generator(this, function (_a) {
            query = "\n  SELECT\n    C.COMMAND_ID,\n    C.CLUSTER_REF,\n    C.PACKAGE_REF,\n    C.CODE,\n    C.MANUFACTURER_CODE,\n    C.NAME,\n    C.DESCRIPTION,\n    C.SOURCE,\n    C.IS_OPTIONAL,\n    C.MUST_USE_TIMED_INVOKE,\n    C.RESPONSE_REF\n  FROM\n    COMMAND AS C\n  WHERE\n    C.PACKAGE_REF = ?\n    AND C.CODE = ?";
            if (mfgCode == null || mfgCode == 0) {
                query = query + " AND C.MANUFACTURER_CODE IS NULL";
                args = [packageId, commandCode];
            }
            else {
                query = query + " AND C.MANUFACTURER_CODE = ?";
                args = [packageId, commandCode, mfgCode];
            }
            return [2 /*return*/, dbApi.dbGet(db, query, args).then(dbMapping.map.command)];
        });
    });
}
function selectCommandById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  PACKAGE_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_REF\nFROM COMMAND\n  WHERE COMMAND_ID = ?", [id])
                    .then(dbMapping.map.command)];
        });
    });
}
/**
 * Retrieves commands for a given cluster Id.
 * This method DOES NOT retrieve global commands, since those have a cluster_ref = null
 *
 * @param {*} db
 * @param {*} clusterId
 * @returns promise of an array of command rows, which represent per-cluster commands, excluding global commands.
 */
function selectCommandsByClusterId(db, clusterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_REF\nFROM COMMAND WHERE CLUSTER_REF = ?\nORDER BY CODE", [clusterId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
function selectAllCommandsWithArguments(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction, rows, reduction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mapFunction = function (x) {
                        return {
                            id: x.COMMAND_ID,
                            commandId: x.COMMAND_ID,
                            commandCode: x.CODE,
                            commandMfgCode: x.MANUFACTURER_CODE,
                            name: x.NAME,
                            commandName: x.NAME,
                            commandDescription: x.DESCRIPTION,
                            commandSource: x.SOURCE,
                            commandIsOptional: dbApi.fromDbBool(x.IS_OPTIONAL),
                            commandMustUseTimedInvoke: dbApi.fromDbBool(x.MUST_USE_TIMED_INVOKE),
                            clusterName: x.CLUSTER_NAME,
                            clusterCode: x.CLUSTER_CODE,
                            clusterMfgCode: x.CLUSTER_MANUFACTURER_CODE,
                            argName: x.ARG_NAME,
                            argType: x.ARG_TYPE,
                            argFieldId: x.FIELD_IDENTIFIER,
                            argIsArray: dbApi.fromDbBool(x.ARG_IS_ARRAY),
                            argPresentIf: x.ARG_PRESENT_IF,
                            argIsNullable: dbApi.fromDbBool(x.ARG_IS_NULLABLE),
                            argCountArg: x.ARG_COUNT_ARG,
                            argIntroducedIn: x.INTRODUCED_IN_REF,
                            argRemovedIn: x.REMOVED_IN_REF,
                        };
                    };
                    return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  CO.COMMAND_ID,\n  CO.CLUSTER_REF,\n  CO.CODE,\n  CO.MANUFACTURER_CODE,\n  CO.NAME,\n  CO.DESCRIPTION,\n  CO.SOURCE,\n  CO.IS_OPTIONAL,\n  CO.MUST_USE_TIMED_INVOKE,\n  CO.RESPONSE_REF,\n  CL.NAME AS CLUSTER_NAME,\n  CL.CODE AS CLUSTER_CODE,\n  CL.MANUFACTURER_CODE AS CLUSTER_MANUFACTURER_CODE,\n  CA.NAME AS ARG_NAME,\n  CA.TYPE AS ARG_TYPE,\n  CA.FIELD_IDENTIFIER,\n  CA.IS_ARRAY AS ARG_IS_ARRAY,\n  CA.PRESENT_IF AS ARG_PRESENT_IF,\n  CA.IS_NULLABLE AS ARG_IS_NULLABLE,\n  CA.COUNT_ARG AS ARG_COUNT_ARG,\n  CA.INTRODUCED_IN_REF,\n  CA.REMOVED_IN_REF\nFROM\n  COMMAND AS CO\nINNER JOIN\n  CLUSTER AS CL\nON\n  CL.CLUSTER_ID = CO.CLUSTER_REF\nLEFT JOIN\n  COMMAND_ARG AS CA\nON\n  CA.COMMAND_REF = CO.COMMAND_ID\nWHERE\n  CO.PACKAGE_REF = ?\nORDER BY\n  CL.CODE, CO.SOURCE, CO.CODE,  CA.FIELD_IDENTIFIER", [packageId])];
                case 1:
                    rows = _a.sent();
                    rows = rows.map(mapFunction);
                    reduction = rows.reduce(function (total, current) {
                        var lastItem = null;
                        if (total.length > 0)
                            lastItem = total[total.length - 1];
                        var extractArg = function (x) {
                            var ret = {
                                name: x.argName,
                                label: x.argName,
                                type: x.argType,
                                fieldId: x.argFieldId,
                                isArray: x.argIsArray,
                                presentIf: x.argPresentIf,
                                isNullable: x.argIsNullable,
                                countArg: x.argCountArg,
                                introducedIn: x.argIntroducedIn,
                                removedIn: x.argRemovedIn,
                                introducedInRef: x.argIntroducedIn,
                                removedInRef: x.argRemovedIn,
                            };
                            delete x.argName;
                            delete x.argType;
                            delete x.argFieldId;
                            delete x.argIsArray;
                            delete x.argPresentIf;
                            delete x.argIsNullable;
                            delete x.argCountArg;
                            delete x.argIntroducedIn;
                            delete x.argRemovedIn;
                            return ret;
                        };
                        if (lastItem == null ||
                            !(lastItem.commandCode == current.commandCode &&
                                lastItem.commandMfgCode == current.commandMfgCode &&
                                lastItem.commandSource == current.commandSource &&
                                lastItem.clusterCode == current.clusterCode &&
                                lastItem.clusterMfgCode == current.clusterMfgCode)) {
                            // We have a new command
                            current.commandArgs = [];
                            current.argCount = 0;
                            if (current.argName != null) {
                                current.commandArgs.push(extractArg(current));
                                current.argCount++;
                            }
                            total.push(current);
                        }
                        else {
                            // We just aggregate args.
                            if (current.argName != null) {
                                lastItem.commandArgs.push(extractArg(current));
                                lastItem.argCount++;
                            }
                        }
                        return total;
                    }, []);
                    return [2 /*return*/, reduction];
            }
        });
    });
}
/**
 *
 * @param db
 * @param packageId
 * @returns all commands along with their cluster information
 */
function selectAllCommandsWithClusterInfo(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND.COMMAND_ID,\n  COMMAND.CLUSTER_REF,\n  COMMAND.CODE,\n  COMMAND.MANUFACTURER_CODE,\n  COMMAND.NAME,\n  COMMAND.DESCRIPTION,\n  COMMAND.SOURCE,\n  COMMAND.IS_OPTIONAL,\n  COMMAND.MUST_USE_TIMED_INVOKE,\n  COMMAND.RESPONSE_REF,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.CODE AS CLUSTER_CODE\nFROM COMMAND\nINNER JOIN CLUSTER ON CLUSTER.CLUSTER_ID = COMMAND.CLUSTER_REF\n  WHERE COMMAND.PACKAGE_REF = ?\nORDER BY CLUSTER.CODE, COMMAND.CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
function selectAllCommands(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_REF\nFROM COMMAND\n  WHERE PACKAGE_REF = ?\nORDER BY CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
function selectAllCommandsBySource(db, source, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_REF\nFROM COMMAND\nWHERE\n  SOURCE = ?\n  AND PACKAGE_REF = ?\nORDER BY CODE", [source, packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
/**
 * Retrieves filtered commands for a given cluster Id based on the source.
 * This method DOES NOT retrieve global commands, since those have a cluster_ref = null
 *
 * @param {*} db
 * @param {*} clusterId
 * @returns promise of an array of command rows, which represent per-cluster commands, excluding global commands.
 */
function selectCommandsByClusterIdAndSource(db, clusterId, source, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE\nFROM COMMAND\nWHERE\n  CLUSTER_REF = ?\n  AND SOURCE = ?\n  AND PACKAGE_REF = ?\nORDER BY CODE", [clusterId, source, packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
function selectAllGlobalCommands(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_REF\nFROM COMMAND\nWHERE CLUSTER_REF IS NULL AND PACKAGE_REF = ?\nORDER BY CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
function selectAllClusterCommands(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_REF\nFROM COMMAND\nWHERE CLUSTER_REF IS NOT NULL AND PACKAGE_REF = ?\nORDER BY CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
function selectAllCommandArguments(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_ARG.COMMAND_REF,\n  COMMAND_ARG.FIELD_IDENTIFIER,\n  COMMAND_ARG.NAME,\n  COMMAND_ARG.TYPE,\n  COMMAND_ARG.IS_ARRAY,\n  COMMAND_ARG.PRESENT_IF,\n  COMMAND_ARG.IS_NULLABLE,\n  COMMAND_ARG.IS_OPTIONAL,\n  COMMAND_ARG.INTRODUCED_IN_REF,\n  COMMAND_ARG.REMOVED_IN_REF,\n  COMMAND_ARG.COUNT_ARG\nFROM COMMAND_ARG, COMMAND\nWHERE\n  COMMAND_ARG.COMMAND_REF = COMMAND.COMMAND_ID\n  AND COMMAND.PACKAGE_REF = ?\nORDER BY COMMAND_REF, FIELD_IDENTIFIER", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.commandArgument); })];
        });
    });
}
/**
 * Get the number of command arguments for a command
 *
 * @param {*} db
 * @param {*} commandId
 * @param {*} [packageId=null]
 * @returns A promise with number of command arguments for a command
 */
function selectCommandArgumentsCountByCommandId(db, commandId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT COUNT(*) AS count\nFROM COMMAND_ARG WHERE COMMAND_REF = ? ", [commandId])
                    .then(function (res) { return res[0].count; })];
        });
    });
}
/**
 * Extract the command arguments for a command
 *
 * @param {*} db
 * @param {*} commandId
 * @param {*} [packageId=null]
 * @returns A promise with command arguments for a command
 */
function selectCommandArgumentsByCommandId(db, commandId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  COMMAND_REF,\n  FIELD_IDENTIFIER,\n  NAME,\n  TYPE,\n  IS_ARRAY,\n  PRESENT_IF,\n  IS_NULLABLE,\n  IS_OPTIONAL,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF,\n  COUNT_ARG\nFROM COMMAND_ARG\nWHERE COMMAND_REF = ?\nORDER BY FIELD_IDENTIFIER", [commandId])
                    .then(function (rows) { return rows.map(dbMapping.map.commandArgument); })];
        });
    });
}
/**
 * This method returns all commands, joined with their
 * respective arguments and clusters, so it's a long query.
 * If you are just looking for a quick query across all commands
 * use the selectAllCommands query.
 *
 * @param {*} db
 * @param {*} packageId
 * @returns promise that resolves into a list of all commands and arguments.
 */
function selectCommandTree(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CMD.COMMAND_ID,\n  CMD.CLUSTER_REF,\n  CMD.CODE,\n  CMD.MANUFACTURER_CODE,\n  CMD.NAME,\n  CMD.DESCRIPTION,\n  CMD.SOURCE,\n  CMD.IS_OPTIONAL,\n  CMD.MUST_USE_TIMED_INVOKE,\n  CMD.RESPONSE_REF,\n  CL.CODE AS CLUSTER_CODE,\n  CL.NAME AS CLUSTER_NAME,\n  CL.NAME AS CLUSTER_NAME,\n  CL.DEFINE AS CLUSTER_DEFINE_NAME,\n  CA.NAME AS ARG_NAME,\n  CA.TYPE AS ARG_TYPE,\n  CA.IS_ARRAY AS ARG_IS_ARRAY,\n  CA.PRESENT_IF AS ARG_PRESENT_IF,\n  CA.IS_NULLABLE AS ARG_IS_NULLABLE,\n  CA.COUNT_ARG AS ARG_COUNT_ARG\nFROM \n  COMMAND AS CMD\nLEFT JOIN\n  CLUSTER AS CL\nON\n  CMD.CLUSTER_REF = CL.CLUSTER_ID\nLEFT JOIN\n  COMMAND_ARG AS CA\nON\n  CMD.COMMAND_ID = CA.COMMAND_REF\nWHERE CMD.PACKAGE_REF = ?\nORDER BY CL.CODE, CMD.CODE, CA.FIELD_IDENTIFIER", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.command); })];
        });
    });
}
/**
 * After the data is loaded from XML, we need to link the command request/responses
 * RESPONSE_REF fields together.
 * This is done in a 2 ways:
 *    - for commands that already have RESPONSE_NAME, it is used.
 *    - for commands that have Request/Response names, those names are matched.
 * In both cases, RESPONSE_REF is properly linked.
 *
 * @param {*} db
 */
function updateCommandRequestResponseReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // First we link up all the cases where the response_for_name is present
                return [4 /*yield*/, dbApi.dbUpdate(db, "\nUPDATE\n  COMMAND\nSET\n  RESPONSE_REF =\n  ( SELECT\n      CMD_REF.COMMAND_ID\n    FROM\n      COMMAND AS CMD_REF\n    WHERE\n      ( CMD_REF.NAME = COMMAND.RESPONSE_NAME ) AND (\n        ( CMD_REF.CLUSTER_REF = COMMAND.CLUSTER_REF )\n        OR\n        ( CMD_REF.CLUSTER_REF IS NULL AND COMMAND.CLUSTER_REF IS NULL )\n      ) AND (\n        ( CMD_REF.PACKAGE_REF = COMMAND.PACKAGE_REF)\n      )\n  )\nWHERE\n  COMMAND.RESPONSE_NAME IS NOT NULL\n  AND COMMAND.PACKAGE_REF = ?\n  ", [packageId])
                    // Then we link up the ones where the "response/request" names match.
                ];
                case 1:
                    // First we link up all the cases where the response_for_name is present
                    _a.sent();
                    // Then we link up the ones where the "response/request" names match.
                    return [4 /*yield*/, dbApi.dbUpdate(db, "\nUPDATE\n  COMMAND\nSET\n  RESPONSE_REF =\n  (\n    SELECT\n      CMD_REF.COMMAND_ID\n    FROM\n      COMMAND AS CMD_REF\n    WHERE\n      ( CMD_REF.NAME = COMMAND.NAME||'Response'\n        OR\n        CMD_REF.NAME = REPLACE(COMMAND.NAME, 'Request', '')||'Response'\n      ) AND (\n        ( CMD_REF.CLUSTER_REF = COMMAND.CLUSTER_REF )\n        OR\n        ( CMD_REF.CLUSTER_REF IS NULL AND COMMAND.CLUSTER_REF IS NULL )\n        ) AND (\n          ( CMD_REF.PACKAGE_REF = COMMAND.PACKAGE_REF)\n        )\n  )\nWHERE\n  COMMAND.NAME NOT LIKE '%Response' AND COMMAND.RESPONSE_NAME IS NULL\n    ")];
                case 2:
                    // Then we link up the ones where the "response/request" names match.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function commandMapFunction(x) {
    return {
        id: x.COMMAND_ID,
        name: x.NAME,
        code: x.CODE,
        commandSource: x.SOURCE,
        source: x.SOURCE,
        mustUseTimedInvoke: dbApi.fromDbBool(x.MUST_USE_TIMED_INVOKE),
        mfgCode: x.MANUFACTURER_CODE,
        incoming: x.INCOMING,
        outgoing: x.OUTGOING,
        description: x.DESCRIPTION,
        clusterSide: x.SIDE,
        clusterName: x.CLUSTER_NAME,
        clusterDefine: x.CLUSTER_DEFINE,
        isClusterEnabled: x.ENABLED,
        responseRef: x.RESPONSE_REF,
    };
}
/**
 * Returns a promise of data for commands inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the command data.
 */
function selectAllCommandDetailsFromEnabledClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeClusterRef;
        return __generator(this, function (_a) {
            endpointTypeClusterRef = endpointsAndClusters
                .map(function (ep) { return ep.endpointTypeClusterRef; })
                .toString();
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    COMMAND.COMMAND_ID,\n    COMMAND.NAME,\n    COMMAND.CODE,\n    COMMAND.SOURCE,\n    COMMAND.MANUFACTURER_CODE,\n    COMMAND.DESCRIPTION,\n    COMMAND.RESPONSE_REF,\n    COMMAND.MUST_USE_TIMED_INVOKE,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    ENDPOINT_TYPE_CLUSTER.ENABLED\n  FROM COMMAND\n  INNER JOIN CLUSTER\n  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\n  WHERE ENDPOINT_TYPE_CLUSTER.CLUSTER_REF in (".concat(endpointTypeClusterRef, ")\n  GROUP BY COMMAND.NAME\n        "))
                    .then(function (rows) { return rows.map(commandMapFunction); })];
        });
    });
}
/**
 *
 * @param db
 * @param endpointsAndClusters
 * @returns  Returns a promise of data for commands with cli inside an endpoint type.
 */
function selectAllCliCommandDetailsFromEnabledClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeClusterRef;
        return __generator(this, function (_a) {
            endpointTypeClusterRef = endpointsAndClusters
                .map(function (ep) { return ep.endpointTypeClusterRef; })
                .toString();
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    COMMAND.COMMAND_ID,\n    COMMAND.NAME,\n    COMMAND.CODE,\n    COMMAND.SOURCE,\n    COMMAND.MANUFACTURER_CODE,\n    COMMAND.DESCRIPTION,\n    COMMAND.RESPONSE_REF,\n    COMMAND.MUST_USE_TIMED_INVOKE,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    CLUSTER.DEFINE AS CLUSTER_DEFINE,\n    ENDPOINT_TYPE_CLUSTER.ENABLED\n  FROM COMMAND\n  INNER JOIN CLUSTER\n  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\n  INNER JOIN PACKAGE_OPTION\n  ON PACKAGE_OPTION.OPTION_CODE = COMMAND.NAME\n  WHERE ENDPOINT_TYPE_CLUSTER.CLUSTER_REF in (".concat(endpointTypeClusterRef, ") AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\n  GROUP BY COMMAND.NAME, CLUSTER.NAME\n        "))
                    .then(function (rows) { return rows.map(commandMapFunction); })];
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
function selectCommandDetailsFromAllEndpointTypesAndClusters(db, endpointsAndClusters, doGroupBy) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, endpointClusterIds, query;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointsAndClusters
                .map(function (ep) { return ep.endpointId; })
                .toString();
            endpointClusterIds = endpointsAndClusters
                .map(function (ep) { return ep.endpointClusterId; })
                .toString();
            query = "\n  SELECT\n    COMMAND.COMMAND_ID,\n    COMMAND.NAME,\n    COMMAND.CODE,\n    COMMAND.SOURCE,\n    COMMAND.MANUFACTURER_CODE,\n    ENDPOINT_TYPE_COMMAND.INCOMING,\n    ENDPOINT_TYPE_COMMAND.OUTGOING,\n    COMMAND.DESCRIPTION,\n    COMMAND.RESPONSE_REF,\n    COMMAND.MUST_USE_TIMED_INVOKE,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    ENDPOINT_TYPE_CLUSTER.ENABLED\n  FROM\n    COMMAND\n  INNER JOIN\n    ENDPOINT_TYPE_COMMAND\n  ON\n    COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF\n  INNER JOIN\n    ENDPOINT_TYPE_CLUSTER\n  ON\n    ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN\n    CLUSTER\n  ON\n    COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  WHERE\n    ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ") \n    AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF in (").concat(endpointClusterIds, ") ");
            if (doGroupBy) {
                // See: https://github.com/project-chip/zap/issues/192
                query = query + " GROUP BY COMMAND.NAME, COMMAND.COMMAND_ID";
            }
            return [2 /*return*/, dbApi.dbAll(db, query).then(function (rows) { return rows.map(commandMapFunction); })];
        });
    });
}
/**
 * Returns a promise of data for manufacturing/non-manufacturing specific commands
 * inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing/non-manufacturing
 * specific command data.
 */
function selectCommandDetailsFromAllEndpointTypesAndClustersUtil(db, endpointsAndClusters, isManufacturingSpecific) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, endpointClusterIds;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointsAndClusters
                .map(function (ep) { return ep.endpointId; })
                .toString();
            endpointClusterIds = endpointsAndClusters
                .map(function (ep) { return ep.endpointClusterId; })
                .toString();
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    COMMAND.COMMAND_ID,\n    COMMAND.NAME,\n    COMMAND.CODE,\n    COMMAND.SOURCE,\n    COMMAND.MANUFACTURER_CODE,\n    ENDPOINT_TYPE_COMMAND.INCOMING,\n    ENDPOINT_TYPE_COMMAND.OUTGOING,\n    COMMAND.DESCRIPTION,\n    COMMAND.RESPONSE_REF,\n    COMMAND.MUST_USE_TIMED_INVOKE,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    ENDPOINT_TYPE_CLUSTER.ENABLED\n  FROM\n    COMMAND\n  INNER JOIN\n    ENDPOINT_TYPE_COMMAND\n  ON\n    COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF\n  INNER JOIN\n    ENDPOINT_TYPE_CLUSTER\n  ON\n    ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN\n    CLUSTER\n  ON\n    COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  WHERE\n    ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\n    AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF in (").concat(endpointClusterIds, ")\n    AND COMMAND.MANUFACTURER_CODE IS ").concat(isManufacturingSpecific ? "NOT" : "", " NULL\n  GROUP BY COMMAND.NAME\n        "))
                    .then(function (rows) { return rows.map(commandMapFunction); })];
        });
    });
}
/**
 * Returns a promise of data for manufacturing specific commands inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing specific command data.
 */
function selectManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, selectCommandDetailsFromAllEndpointTypesAndClustersUtil(db, endpointsAndClusters, true)];
        });
    });
}
/**
 * Returns a promise of data for commands with no manufacturing specific information inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the non-manufacturing specific command data.
 */
function selectNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, selectCommandDetailsFromAllEndpointTypesAndClustersUtil(db, endpointsAndClusters, false)];
        });
    });
}
exports.selectCliCommandCountFromEndpointTypeCluster =
    selectCliCommandCountFromEndpointTypeCluster;
exports.selectCliCommandsFromCluster = selectCliCommandsFromCluster;
exports.selectAllAvailableClusterCommandDetailsFromEndpointTypes =
    selectAllAvailableClusterCommandDetailsFromEndpointTypes;
exports.selectAllClustersWithIncomingCommands =
    selectAllClustersWithIncomingCommands;
exports.selectAllClustersWithIncomingCommandsCombined =
    selectAllClustersWithIncomingCommandsCombined;
exports.selectAllIncomingCommandsForCluster =
    selectAllIncomingCommandsForCluster;
exports.selectAllIncomingCommandsForClusterCombined =
    selectAllIncomingCommandsForClusterCombined;
exports.selectAllCommands = selectAllCommands;
exports.selectCommandsByClusterId = selectCommandsByClusterId;
exports.selectCommandById = selectCommandById;
exports.selectCommandByCode = selectCommandByCode;
exports.selectAllCommandsBySource = selectAllCommandsBySource;
exports.selectCommandsByClusterIdAndSource = selectCommandsByClusterIdAndSource;
exports.selectAllGlobalCommands = selectAllGlobalCommands;
exports.selectAllClusterCommands = selectAllClusterCommands;
exports.selectAllCommandArguments = selectAllCommandArguments;
exports.selectCommandArgumentsCountByCommandId =
    selectCommandArgumentsCountByCommandId;
exports.selectCommandArgumentsByCommandId = selectCommandArgumentsByCommandId;
exports.selectCommandTree = selectCommandTree;
exports.updateCommandRequestResponseReferences =
    updateCommandRequestResponseReferences;
exports.selectAllCommandDetailsFromEnabledClusters =
    selectAllCommandDetailsFromEnabledClusters;
exports.selectAllCliCommandDetailsFromEnabledClusters =
    selectAllCliCommandDetailsFromEnabledClusters;
exports.selectCommandDetailsFromAllEndpointTypesAndClusters =
    selectCommandDetailsFromAllEndpointTypesAndClusters;
exports.selectManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters =
    selectManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters;
exports.selectNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters =
    selectNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters;
exports.selectAllIncomingCommands = selectAllIncomingCommands;
exports.selectMfgClustersWithIncomingCommandsForClusterCode =
    selectMfgClustersWithIncomingCommandsForClusterCode;
exports.selectAllCommandsWithClusterInfo = selectAllCommandsWithClusterInfo;
exports.selectAllCommandsWithArguments = selectAllCommandsWithArguments;
//# sourceMappingURL=query-command.js.map