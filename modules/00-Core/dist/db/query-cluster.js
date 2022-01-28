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
 * This module provides queries related to cluster.
 *
 * @module DB API: cluster queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
/**
 * All cluster details along with their attribute details per endpoint.
 * @param db
 * @param endpointsAndClusters
 * @returns cluster details along with their attribute details per endpoint.
 */
function selectClusterDetailsFromEnabledClusters(db, endpointsAndClusters) {
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
                    attributeCount: x.ATTRIBUTE_COUNT,
                    clusterCount: x.CLUSTER_COUNT,
                    attributesSize: x.ATTRIBUTES_SIZE,
                    endpointTypeId: x.ENDPOINT_TYPE_ID,
                    endpointIdentifier: x.ENDPOINT_IDENTIFIER,
                    mfgClusterCount: x.MANUFACTURING_SPECIFIC_CLUSTER_COUNT,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    *,\n    COUNT(MANUFACTURER_CODE) OVER () AS MANUFACTURING_SPECIFIC_CLUSTER_COUNT FROM (\n  SELECT\n    ATTRIBUTE.ATTRIBUTE_ID AS ATTRIBUTE_ID,\n    ATTRIBUTE.NAME AS NAME,\n    ATTRIBUTE.CODE AS CODE,\n    ATTRIBUTE.SIDE AS SIDE,\n    ATTRIBUTE.TYPE AS TYPE,\n    ATTRIBUTE.DEFINE AS DEFINE,\n    CLUSTER.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n    ATTRIBUTE.IS_WRITABLE AS IS_WRITABLE,\n    ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    CLUSTER.CODE AS CLUSTER_CODE,\n    ENDPOINT_TYPE_CLUSTER.ENABLED AS ENABLED,\n    ENDPOINT_TYPE_ATTRIBUTE.BOUNDED AS BOUNDED,\n    ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION AS STORAGE_OPTION,\n    ENDPOINT_TYPE_ATTRIBUTE.SINGLETON AS SINGLETON,\n    ATTRIBUTE.MIN AS MIN,\n    ATTRIBUTE.MAX AS MAX,\n    ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE AS DEFAULT_VALUE,\n    CASE\n      WHEN ATOMIC.IS_STRING=1 THEN \n        CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n             WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n             ELSE ATOMIC.ATOMIC_SIZE\n             END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n    END AS ATOMIC_SIZE,\n    ROW_NUMBER() OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE) CLUSTER_INDEX,\n    ROW_NUMBER() OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER ORDER BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE) ENDPOINT_INDEX,\n    ROW_NUMBER() OVER () ROW_INDEX,\n    COUNT(ATTRIBUTE.CODE) OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE) ATTRIBUTE_COUNT,\n    COUNT(CLUSTER.CODE) OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE) CLUSTER_COUNT,\n    SUM(CASE WHEN ATOMIC.IS_STRING=1 THEN \n      CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n          WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n          ELSE ATOMIC.ATOMIC_SIZE\n      END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n    END) OVER (PARTITION BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE) ATTRIBUTES_SIZE,\n    ENDPOINT_TYPE.ENDPOINT_TYPE_ID AS ENDPOINT_TYPE_ID,\n    ENDPOINT.ENDPOINT_IDENTIFIER AS ENDPOINT_IDENTIFIER\n  FROM\n    ATTRIBUTE\n  INNER JOIN\n    ENDPOINT_TYPE_ATTRIBUTE\n  ON\n    ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN\n    ENDPOINT_TYPE_CLUSTER\n  ON\n    ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN\n    CLUSTER\n  ON\n    ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN\n    ATOMIC\n  ON\n    ATOMIC.NAME = ATTRIBUTE.TYPE\n  INNER JOIN\n    ENDPOINT_TYPE\n  ON\n    ENDPOINT_TYPE.ENDPOINT_TYPE_ID = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF\n  INNER JOIN\n    ENDPOINT\n  ON\n    ENDPOINT.ENDPOINT_TYPE_REF = ENDPOINT_TYPE.ENDPOINT_TYPE_ID\n  WHERE\n    ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF IN (".concat(endpointClusterIds, ")\n    AND ENDPOINT_TYPE_CLUSTER.ENABLED = 1\n    AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1\n    AND ENDPOINT_TYPE_CLUSTER.SIDE = ATTRIBUTE.SIDE\n  GROUP BY\n    ENDPOINT.ENDPOINT_IDENTIFIER,\n    CLUSTER.NAME,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    ATTRIBUTE.NAME )\nWHERE\n  CLUSTER_INDEX = 1\nORDER BY\n  ENDPOINT_IDENTIFIER, CLUSTER_CODE, CLUSTER_SIDE\n        "))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
exports.selectClusterDetailsFromEnabledClusters =
    selectClusterDetailsFromEnabledClusters;
//# sourceMappingURL=query-cluster.js.map