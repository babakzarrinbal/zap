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
 * This module provides queries for endpoint type.
 *
 * @module DB API: endpoint type queries against the database.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
/**
 * Promise to delete an endpoint type.
 * @param {*} db
 * @param {*} sessionId
 * @param {*} id
 */
function deleteEndpointType(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbRemove(db, 'DELETE FROM ENDPOINT_TYPE WHERE ENDPOINT_TYPE_ID = ?', [id])];
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
function selectAllEndpointTypes(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  ENDPOINT_TYPE_ID,\n  NAME,\n  DEVICE_TYPE_REF,\n  SESSION_REF\nFROM\n  ENDPOINT_TYPE\nWHERE SESSION_REF = ? ORDER BY NAME", [sessionId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.endpointType)];
            }
        });
    });
}
/**
 * Extracts endpoint type ids.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns promise that resolves into rows in the database table.
 */
function selectEndpointTypeIds(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    endpointTypeId: x.ENDPOINT_TYPE_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ENDPOINT_TYPE.ENDPOINT_TYPE_ID\nFROM\n  ENDPOINT_TYPE\nLEFT JOIN\n  DEVICE_TYPE\nON\n  ENDPOINT_TYPE.DEVICE_TYPE_REF = DEVICE_TYPE.DEVICE_TYPE_ID\nWHERE\n  ENDPOINT_TYPE.SESSION_REF = ?\nORDER BY ENDPOINT_TYPE.NAME", [sessionId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Extracts endpoint type ids which belong to user endpoints.
 * There have been occasions when the endpoint types are present
 * but they do not belong to any endpoints.
 *
 * @export
 * @param {*} db
 * @param {*} sessionId
 * @returns promise that resolves into rows in the database table.
 */
function selectUsedEndpointTypeIds(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var mapFunction;
        return __generator(this, function (_a) {
            mapFunction = function (x) {
                return {
                    endpointTypeId: x.ENDPOINT_TYPE_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ENDPOINT_TYPE.ENDPOINT_TYPE_ID\nFROM\n  ENDPOINT_TYPE\nINNER JOIN\n  ENDPOINT\nON\n  ENDPOINT_TYPE.ENDPOINT_TYPE_ID = ENDPOINT.ENDPOINT_TYPE_REF\nLEFT JOIN\n  DEVICE_TYPE\nON\n  ENDPOINT_TYPE.DEVICE_TYPE_REF = DEVICE_TYPE.DEVICE_TYPE_ID\nWHERE\n  ENDPOINT_TYPE.SESSION_REF = ?\nORDER BY ENDPOINT_TYPE.NAME", [sessionId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Returns promise of a details of an endpoint type.
 *
 * @param {*} db
 * @param {*} id
 * @returns endpoint type
 */
function selectEndpointType(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "SELECT ENDPOINT_TYPE_ID, SESSION_REF, NAME, DEVICE_TYPE_REF FROM ENDPOINT_TYPE WHERE ENDPOINT_TYPE_ID = ?", [id])
                    .then(dbMapping.map.endpointType)];
        });
    });
}
/**
 * Retrieve clusters from the endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
function selectAllClustersDetailsFromEndpointTypes(db, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    id: x.CLUSTER_ID,
                    name: x.NAME,
                    code: x.CODE,
                    define: x.DEFINE,
                    mfgCode: x.MANUFACTURER_CODE,
                    side: x.SIDE,
                    enabled: x.ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                    endpointCount: x['COUNT(*)'],
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.CODE,\n  CLUSTER.MANUFACTURER_CODE,\n  CLUSTER.NAME,\n  CLUSTER.DEFINE,\n  ENDPOINT_TYPE_CLUSTER.SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,\n  COUNT(*)\nFROM\n  CLUSTER\nINNER JOIN\n  ENDPOINT_TYPE_CLUSTER\nON\n  CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nWHERE\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\nAND\n  ENDPOINT_TYPE_CLUSTER.SIDE IS NOT \"\" AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nGROUP BY\n  NAME, SIDE"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Endpoint type details along with their cluster and attribute details
 *
 * @param db
 * @param endpointsAndClusters
 * @returns Endpoint type details
 */
function selectEndpointDetailsFromAddedEndpoints(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointClusterIds, mapFunction;
        return __generator(this, function (_a) {
            endpointClusterIds = endpointsAndClusters
                .map(function (ep) { return ep.endpointClusterId; })
                .toString();
            mapFunction = function (x) {
                return {
                    id: x.ATTRIBUTE_ID,
                    name: x.NAME,
                    code: x.CODE,
                    side: x.SIDE,
                    type: x.TYPE,
                    define: x.DEFINE,
                    mfgCode: x.MANUFACTURER_CODE,
                    isWritable: x.IS_WRITABLE,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterName: x.CLUSTER_NAME,
                    clusterCode: x.CLUSTER_CODE,
                    isClusterEnabled: x.ENABLED,
                    isAttributeBounded: x.BOUNDED,
                    storageOption: x.STORAGE_OPTION,
                    isSingleton: x.SINGLETON,
                    attributeMinValue: x.MIN,
                    attributeMaxValue: x.MAX,
                    defaultValue: x.DEFAULT_VALUE,
                    attributeSize: x.ATOMIC_SIZE,
                    clusterIndex: x.CLUSTER_INDEX,
                    endpointIndex: x.ENDPOINT_INDEX,
                    rowNumber: x.ROW_INDEX,
                    clusterCount: x.CLUSTER_COUNT,
                    attributesSize: x.ATTRIBUTES_SIZE,
                    endpointTypeId: x.ENDPOINT_TYPE_ID,
                    endpointIdentifier: x.ENDPOINT_IDENTIFIER,
                    totalAttributeSizeAcrossEndpoints: x.ALL_ATTRIBUTES_SIZE_ACROSS_ENDPOINTS,
                    profileId: x.PROFILE_ID,
                    deviceId: x.DEVICE_ID,
                    deviceVersion: x.DEVICE_VERSION,
                    networkId: x.NETWORK_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT * FROM (\n  SELECT\n    ATTRIBUTE.ATTRIBUTE_ID AS ATTRIBUTE_ID,\n    ATTRIBUTE.NAME AS NAME,\n    ATTRIBUTE.CODE AS CODE,\n    ATTRIBUTE.SIDE AS SIDE,\n    ATTRIBUTE.TYPE AS TYPE,\n    ATTRIBUTE.DEFINE AS DEFINE,\n    ATTRIBUTE.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n    ATTRIBUTE.IS_WRITABLE AS IS_WRITABLE,\n    ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    CLUSTER.CODE AS CLUSTER_CODE,\n    ENDPOINT_TYPE_CLUSTER.ENABLED AS ENABLED,\n    ENDPOINT_TYPE_ATTRIBUTE.BOUNDED AS BOUNDED,\n    ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION AS STORAGE_OPTION,\n    ENDPOINT_TYPE_ATTRIBUTE.SINGLETON AS SINGLETON,\n    ATTRIBUTE.MIN AS MIN,\n    ATTRIBUTE.MAX AS MAX,\n    ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE AS DEFAULT_VALUE,\n    CASE\n      WHEN ATOMIC.IS_STRING=1 THEN \n        CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n             WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n             ELSE ATOMIC.ATOMIC_SIZE\n             END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n    END AS ATOMIC_SIZE,\n    ROW_NUMBER() OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE) CLUSTER_INDEX,\n    ROW_NUMBER() OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER) ENDPOINT_INDEX,\n    ROW_NUMBER() OVER () ROW_INDEX,\n    (DENSE_RANK() over (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER ORDER BY CLUSTER.MANUFACTURER_CODE, CLUSTER.NAME, ENDPOINT_TYPE_CLUSTER.SIDE) + DENSE_RANK() OVER (PARTITION BY ENDPOINT_TYPE.ENDPOINT_TYPE_ID ORDER BY CLUSTER.MANUFACTURER_CODE DESC, CLUSTER.NAME DESC, ENDPOINT_TYPE_CLUSTER.SIDE DESC) - 1) AS CLUSTER_COUNT,\n    SUM(CASE WHEN ATOMIC.IS_STRING=1 THEN \n      CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n          WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n          ELSE ATOMIC.ATOMIC_SIZE\n      END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n    END) OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER) ATTRIBUTES_SIZE,\n    ENDPOINT_TYPE.ENDPOINT_TYPE_ID AS ENDPOINT_TYPE_ID,\n    ENDPOINT.ENDPOINT_IDENTIFIER AS ENDPOINT_IDENTIFIER,\n    SUM(CASE WHEN ATOMIC.IS_STRING=1 THEN \n          CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n              WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n              ELSE ATOMIC.ATOMIC_SIZE\n          END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n        END) OVER () ALL_ATTRIBUTES_SIZE_ACROSS_ENDPOINTS,\n    ENDPOINT.PROFILE AS PROFILE_ID,\n    ENDPOINT.DEVICE_IDENTIFIER AS DEVICE_ID,\n    ENDPOINT.DEVICE_VERSION AS DEVICE_VERSION,\n    ENDPOINT.NETWORK_IDENTIFIER AS NETWORK_ID\n  FROM ATTRIBUTE\n  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE\n  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN CLUSTER\n  ON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ATOMIC\n  ON ATOMIC.NAME = ATTRIBUTE.TYPE\n  INNER JOIN ENDPOINT_TYPE\n  ON ENDPOINT_TYPE.ENDPOINT_TYPE_ID = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\n  INNER JOIN ENDPOINT\n  ON ENDPOINT_TYPE.ENDPOINT_TYPE_ID = ENDPOINT.ENDPOINT_TYPE_REF\n  WHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF IN (".concat(endpointClusterIds, ") AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\n  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ENDPOINT_TYPE_CLUSTER.SIDE=ATTRIBUTE.SIDE\n  GROUP BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.NAME, ENDPOINT_TYPE_CLUSTER.SIDE, ATTRIBUTE.NAME) WHERE ENDPOINT_INDEX=1 ORDER BY ENDPOINT_IDENTIFIER\n        "))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Exports clusters to an externalized form without duplicates caused by side.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
function selectAllClustersNamesFromEndpointTypes(db, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    id: x.CLUSTER_ID,
                    name: x.NAME,
                    code: x.CODE,
                    define: x.DEFINE,
                    mfgCode: x.MANUFACTURER_CODE,
                    enabled: x.ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.CODE,\n  CLUSTER.MANUFACTURER_CODE,\n  CLUSTER.NAME,\n  CLUSTER.DEFINE,\n  ENDPOINT_TYPE_CLUSTER.SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nFROM\n  CLUSTER\nINNER JOIN\n  ENDPOINT_TYPE_CLUSTER\nON\n  CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nWHERE\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\n  AND ENDPOINT_TYPE_CLUSTER.SIDE IS NOT \"\" AND ENDPOINT_TYPE_CLUSTER.ENABLED = 1\nGROUP BY\n  NAME"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Exports clusters to an externalized form irrespecive of side.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
function selectAllClustersDetailsIrrespectiveOfSideFromEndpointTypes(db, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    id: x.CLUSTER_ID,
                    name: x.NAME,
                    code: x.CODE,
                    define: x.DEFINE,
                    mfgCode: x.MANUFACTURER_CODE,
                    side: x.SIDE,
                    enabled: x.ENABLED,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER.CLUSTER_ID,\n  CLUSTER.CODE,\n  CLUSTER.MANUFACTURER_CODE,\n  CLUSTER.NAME,\n  CLUSTER.DEFINE,\n  ENDPOINT_TYPE_CLUSTER.SIDE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nFROM CLUSTER\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nWHERE ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\nAND ENDPOINT_TYPE_CLUSTER.SIDE IS NOT \"\" AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nGROUP BY NAME"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Returns a promise of data for commands inside all existing endpoint types.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the command data.
 */
function selectCommandDetailsFromAllEndpointTypeCluster(db, endpointTypes, endpointClusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    id: x.COMMAND_ID,
                    name: x.NAME,
                    code: x.CODE,
                    mfgCode: x.MANUFACTURER_CODE,
                    incoming: x.INCOMING,
                    outgoing: x.OUTGOING,
                    description: x.DESCRIPTION,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    COMMAND.COMMAND_ID,\n    COMMAND.NAME,\n    COMMAND.CODE,\n    COMMAND.MANUFACTURER_CODE,\n    ENDPOINT_TYPE_COMMAND.INCOMING,\n    ENDPOINT_TYPE_COMMAND.OUTGOING,\n    COMMAND.DESCRIPTION\n  FROM COMMAND\n  INNER JOIN ENDPOINT_TYPE_COMMAND\n  ON COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF\n  WHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ") AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ?\n        "), [endpointClusterId])
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * Exports clusters and endpoint ids
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that contains cluster
 * and endpoint id references
 */
function selectClustersAndEndpointDetailsFromEndpointTypes(db, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeIds, mapFunction;
        return __generator(this, function (_a) {
            endpointTypeIds = endpointTypes.map(function (ep) { return ep.endpointTypeId; }).toString();
            mapFunction = function (x) {
                return {
                    endpointId: x.ENDPOINT_TYPE_REF,
                    endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
                    endpointTypeClusterRef: x.CLUSTER_REF,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF,\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,\n  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nFROM \n  CLUSTER\nINNER JOIN \n  ENDPOINT_TYPE_CLUSTER\nON \n  CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nWHERE\n  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")"))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
exports.deleteEndpointType = deleteEndpointType;
exports.selectAllEndpointTypes = selectAllEndpointTypes;
exports.selectEndpointTypeIds = selectEndpointTypeIds;
exports.selectUsedEndpointTypeIds = selectUsedEndpointTypeIds;
exports.selectEndpointType = selectEndpointType;
exports.selectAllClustersDetailsFromEndpointTypes =
    selectAllClustersDetailsFromEndpointTypes;
exports.selectEndpointDetailsFromAddedEndpoints =
    selectEndpointDetailsFromAddedEndpoints;
exports.selectAllClustersNamesFromEndpointTypes =
    selectAllClustersNamesFromEndpointTypes;
exports.selectAllClustersDetailsIrrespectiveOfSideFromEndpointTypes =
    selectAllClustersDetailsIrrespectiveOfSideFromEndpointTypes;
exports.selectCommandDetailsFromAllEndpointTypeCluster =
    selectCommandDetailsFromAllEndpointTypeCluster;
exports.selectClustersAndEndpointDetailsFromEndpointTypes =
    selectClustersAndEndpointDetailsFromEndpointTypes;
//# sourceMappingURL=query-endpoint-type.js.map