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
 * This module provides queries related to attributes.
 *
 * @module DB API: attribute queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
function attributeExportMapping(x) {
    return {
        id: x.ATTRIBUTE_ID,
        name: x.NAME,
        code: x.CODE,
        side: x.SIDE,
        type: x.TYPE,
        define: x.DEFINE,
        mfgCode: x.MANUFACTURER_CODE,
        clusterSide: x.SIDE,
        clusterName: x.CLUSTER_NAME,
        isClusterEnabled: x.ENABLED,
    };
}
/**
 * Returns a promise of data for attributes inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the attribute data.
 */
function selectAllAttributeDetailsFromEnabledClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypeClusterRef;
        return __generator(this, function (_a) {
            endpointTypeClusterRef = endpointsAndClusters
                .map(function (ep) { return ep.endpointTypeClusterRef; })
                .toString();
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    ATTRIBUTE.ATTRIBUTE_ID,\n    ATTRIBUTE.NAME,\n    ATTRIBUTE.CODE,\n    ATTRIBUTE.SIDE,\n    ATTRIBUTE.TYPE,\n    ATTRIBUTE.DEFINE,\n    ATTRIBUTE.MANUFACTURER_CODE,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    ENDPOINT_TYPE_CLUSTER.ENABLED\n  FROM ATTRIBUTE\n  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE\n  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN CLUSTER\n  ON ATTRIBUTE.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\n  WHERE ENDPOINT_TYPE_CLUSTER.CLUSTER_REF in (".concat(endpointTypeClusterRef, ")\n  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1\n  GROUP BY ATTRIBUTE.NAME\n        "))
                    .then(function (rows) { return rows.map(attributeExportMapping); })];
        });
    });
}
/**
 * Returns a promise of data for manufacturing/non-manufacturing specific attributes
 * inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing/non-manufacturing
 * specific attribute data.
 */
function selectAttributeDetailsFromAllEndpointTypesAndClustersUtil(db, endpointsAndClusters, isManufacturingSpecific) {
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
                    .dbAll(db, "\n  SELECT\n    ATTRIBUTE.ATTRIBUTE_ID,\n    ATTRIBUTE.NAME,\n    ATTRIBUTE.CODE,\n    ATTRIBUTE.SIDE,\n    ATTRIBUTE.TYPE,\n    ATTRIBUTE.DEFINE,\n    ATTRIBUTE.MANUFACTURER_CODE,\n    ENDPOINT_TYPE_CLUSTER.SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    ENDPOINT_TYPE_CLUSTER.ENABLED\n  FROM\n    ATTRIBUTE\n  INNER JOIN\n    ENDPOINT_TYPE_ATTRIBUTE\n  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN\n    ENDPOINT_TYPE_CLUSTER\n  ON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN\n    CLUSTER\n  ON ATTRIBUTE.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  WHERE\n    ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF IN (".concat(endpointTypeIds, ")\n    AND ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF in (").concat(endpointClusterIds, ")\n    AND ATTRIBUTE.MANUFACTURER_CODE IS ") +
                    (isManufacturingSpecific ? "NOT " : "") +
                    "NULL\n    AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1\n  GROUP BY ATTRIBUTE.NAME\n        ")
                    .then(function (rows) { return rows.map(attributeExportMapping); })];
        });
    });
}
/**
 * Returns a promise of data for manufacturing specific attributes inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing specific attribute data.
 */
function selectManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, selectAttributeDetailsFromAllEndpointTypesAndClustersUtil(db, endpointsAndClusters, true)];
        });
    });
}
/**
 * Returns a promise of data for attributes with no manufacturing specific information inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the non-manufacturing specific attribute data.
 */
function selectNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters(db, endpointsAndClusters) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, selectAttributeDetailsFromAllEndpointTypesAndClustersUtil(db, endpointsAndClusters, false)];
        });
    });
}
/**
 * Returns a promise of data for attributes inside an endpoint type
 * that either have a default or a bounded attribute.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the attribute data.
 */
function selectAttributeDetailsWithABoundFromEnabledClusters(db, endpointsAndClusters) {
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
                    clusterSide: x.CLUSTER_SIDE,
                    clusterName: x.CLUSTER_NAME,
                    isClusterEnabled: x.ENABLED,
                    isAttributeBounded: x.BOUNDED,
                    attributeMinValue: x.MIN,
                    attributeMaxValue: x.MAX,
                    minLength: x.REPORT_MIN_INTERVAL,
                    maxLength: x.REPORT_MAX_INTERVAL,
                    reportableChange: x.REPORTABLE_CHANGE,
                    reportableChangeLength: x.REPORTABLE_CHANGE_LENGTH,
                    defaultValue: x.DEFAULT_VALUE,
                    attributeSize: x.ATOMIC_SIZE,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ATTRIBUTE.ATTRIBUTE_ID,\n  ATTRIBUTE.NAME,\n  ATTRIBUTE.CODE,\n  ATTRIBUTE.SIDE,\n  ATTRIBUTE.TYPE,\n  ATTRIBUTE.DEFINE,\n  ATTRIBUTE.MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  ENDPOINT_TYPE_CLUSTER.ENABLED,\n  ENDPOINT_TYPE_ATTRIBUTE.BOUNDED,\n  ATTRIBUTE.MIN,\n  ATTRIBUTE.MAX,\n  ATTRIBUTE.REPORT_MIN_INTERVAL,\n  ATTRIBUTE.REPORT_MAX_INTERVAL,\n  ATTRIBUTE.REPORTABLE_CHANGE,\n  ATTRIBUTE.REPORTABLE_CHANGE_LENGTH,\n  ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE,\n    CASE\n      WHEN ATOMIC.IS_STRING=1 THEN \n        CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n             WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n             ELSE ATOMIC.ATOMIC_SIZE\n             END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n    END AS ATOMIC_SIZE\nFROM\n  ATTRIBUTE\nINNER JOIN\n  ENDPOINT_TYPE_ATTRIBUTE\nON\n  ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\nINNER JOIN\n  ENDPOINT_TYPE_CLUSTER\nON\n  ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nINNER JOIN\n  CLUSTER\nON\n  CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF\nINNER JOIN\n  ATOMIC\nON\n  ATOMIC.NAME = ATTRIBUTE.TYPE\nWHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF in (".concat(endpointClusterIds, ")\n  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ENDPOINT_TYPE_ATTRIBUTE.BOUNDED !=0\n  AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nGROUP BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.MANUFACTURER_CODE, ATTRIBUTE.NAME, ATTRIBUTE.SIDE\n        "))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * The enabled attributes details across all endpoints and clusters.
 * @param db
 * @param endpointsAndClusters
 * @returns The enabled attributes details across all endpoints and clusters.
 */
function selectAttributeDetailsFromEnabledClusters(db, endpointsAndClusters) {
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
                    clusterRef: x.CLUSTER_REF,
                    clusterId: x.CLUSTER_ID,
                    clusterSide: x.CLUSTER_SIDE,
                    clusterName: x.CLUSTER_NAME,
                    clusterDefine: x.CLUSTER_DEFINE,
                    clusterCode: x.CLUSTER_CODE,
                    isClusterEnabled: x.ENABLED,
                    isAttributeBounded: x.BOUNDED,
                    storageOption: x.STORAGE_OPTION,
                    isSingleton: x.SINGLETON,
                    isAttributeReportable: x.INCLUDED_REPORTABLE,
                    attributeReportableMinValue: x.MIN_INTERVAL,
                    attributeReportableMaxValue: x.MAX_INTERVAL,
                    attributeReportableChange: x.REPORTABLE_CHANGE,
                    attributeMinValue: x.MIN,
                    attributeMaxValue: x.MAX,
                    attributeMaxLength: x.MAX_LENGTH,
                    defaultValue: x.DEFAULT_VALUE,
                    attributeSize: x.ATOMIC_SIZE,
                    clusterIndex: x.CLUSTER_INDEX,
                    mfgAttributeCount: x.MANUFACTURING_SPECIFIC_ATTRIBUTE_COUNT,
                    singletonAttributeSize: x.SINGLETON_ATTRIBUTE_SIZE,
                    maxAttributeSize: x.MAX_ATTRIBUTE_SIZE,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n\n  ATTRIBUTE.ATTRIBUTE_ID,\n    ATTRIBUTE.NAME,\n    ATTRIBUTE.CLUSTER_REF,\n    ATTRIBUTE.CODE,\n    ATTRIBUTE.SIDE,\n    ATTRIBUTE.TYPE,\n    ATTRIBUTE.DEFINE,\n    ATTRIBUTE.MANUFACTURER_CODE,\n    ATTRIBUTE.IS_WRITABLE,\n    ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n    CLUSTER.CLUSTER_ID AS CLUSTER_ID,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    CLUSTER.DEFINE AS CLUSTER_DEFINE,\n    CLUSTER.CODE AS CLUSTER_CODE,\n    ENDPOINT_TYPE_CLUSTER.ENABLED,\n    ENDPOINT_TYPE_ATTRIBUTE.BOUNDED,\n    ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION,\n    ENDPOINT_TYPE_ATTRIBUTE.SINGLETON,\n    ENDPOINT_TYPE_ATTRIBUTE.INCLUDED_REPORTABLE,\n    ENDPOINT_TYPE_ATTRIBUTE.MIN_INTERVAL,\n    ENDPOINT_TYPE_ATTRIBUTE.MAX_INTERVAL,\n    ENDPOINT_TYPE_ATTRIBUTE.REPORTABLE_CHANGE,\n    ATTRIBUTE.MIN,\n    ATTRIBUTE.MAX,\n    ATTRIBUTE.MAX_LENGTH,\n    ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE,\n    CASE\n      WHEN ATOMIC.IS_STRING=1 THEN \n        CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n             WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n             ELSE ATOMIC.ATOMIC_SIZE\n             END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n    END AS ATOMIC_SIZE,\n    ROW_NUMBER() OVER (PARTITION BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE ORDER BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE) CLUSTER_INDEX,\n    COUNT (ATTRIBUTE.MANUFACTURER_CODE) OVER () AS MANUFACTURING_SPECIFIC_ATTRIBUTE_COUNT,\n    SUM (CASE WHEN ENDPOINT_TYPE_ATTRIBUTE.SINGLETON=1 THEN \n          CASE WHEN ATOMIC.IS_STRING=1 THEN \n            CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n                 WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n                 ELSE ATOMIC.ATOMIC_SIZE\n            END\n          WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n          ELSE ATOMIC.ATOMIC_SIZE\n          END\n        ELSE 0 END) OVER () AS SINGLETON_ATTRIBUTE_SIZE,\n    MAX(CASE WHEN ATOMIC.IS_STRING=1 THEN \n          CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n              WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n              ELSE ATOMIC.ATOMIC_SIZE\n          END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n        END) OVER () AS MAX_ATTRIBUTE_SIZE\n  FROM ATTRIBUTE\n  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE\n  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN CLUSTER\n  ON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ATOMIC\n  ON ATOMIC.NAME = ATTRIBUTE.TYPE\n  WHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF IN (".concat(endpointClusterIds, ")\n  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ENDPOINT_TYPE_CLUSTER.ENABLED=1 AND ENDPOINT_TYPE_CLUSTER.SIDE=ATTRIBUTE.SIDE\n  GROUP BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE, ATTRIBUTE.SIDE\n  ORDER BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE\n        "))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 *
 * @param db
 * @param endpointsAndClusters
 * @returns
 * Default values for the attributes longer than a pointer,
 * in a form of a binary blob. All attribute values with size greater than 2 bytes.
 * Excluding 0 values and externally saved values
 * Union is used to get separate entries of attributes w.r.t to default, minimum
 * and maximum values
 */
function selectAttributeBoundDetails(db, endpointsAndClusters) {
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
                    clusterSide: x.CLUSTER_SIDE,
                    clusterName: x.CLUSTER_NAME,
                    clusterMfgCode: x.CLUSTER_MANUFACTURER_CODE,
                    isClusterEnabled: x.ENABLED,
                    defaultValue: x.ATT_VALUE,
                    attributeSize: x.ATOMIC_SIZE,
                    attributeValueType: x.ATTRIBUTE_VALUE_TYPE,
                    arrayIndex: x.ARRAY_INDEX,
                    isString: x.IS_STRING,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "SELECT\n      *, SUM(ATOMIC_SIZE) OVER (ORDER BY CLUSTER_MANUFACTURER_CODE, CLUSTER_NAME ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS ARRAY_INDEX FROM (\n  SELECT\n    ATTRIBUTE.ATTRIBUTE_ID AS ATTRIBUTE_ID,\n    ATTRIBUTE.NAME AS NAME,\n    ATTRIBUTE.CODE AS CODE,\n    ATTRIBUTE.SIDE AS SIDE,\n    ATTRIBUTE.TYPE AS TYPE,\n    ATTRIBUTE.DEFINE AS DEFINE,\n    ATTRIBUTE.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n    ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    CLUSTER.MANUFACTURER_CODE AS CLUSTER_MANUFACTURER_CODE,\n    ENDPOINT_TYPE_CLUSTER.ENABLED AS ENABLED,\n    ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE AS ATT_VALUE,\n    CASE\n    WHEN ATOMIC.IS_STRING=1 THEN \n      CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n           WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n           ELSE ATOMIC.ATOMIC_SIZE\n           END\n      WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n      ELSE ATOMIC.ATOMIC_SIZE\n    END AS ATOMIC_SIZE,\n    'DEFAULT' as ATTRIBUTE_VALUE_TYPE,\n    ATOMIC.IS_STRING AS IS_STRING\n  FROM ATTRIBUTE\n  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE\n  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN CLUSTER\n  ON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ATOMIC\n  ON ATOMIC.NAME = ATTRIBUTE.TYPE\n  WHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF in (".concat(endpointClusterIds, ")\n  AND ENDPOINT_TYPE_CLUSTER.SIDE = ATTRIBUTE.SIDE AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\n  AND (CASE\n    WHEN ATOMIC.IS_STRING=1 THEN \n      CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n           WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n           ELSE ATOMIC.ATOMIC_SIZE\n           END\n      WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n      ELSE ATOMIC.ATOMIC_SIZE\n    END) > 2 AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ATT_VALUE IS NOT NULL AND ATT_VALUE != \"\" AND REPLACE(ATT_VALUE, '0', '')!='x' AND REPLACE(ATT_VALUE, '0', '')!=''\n  GROUP BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE, ATTRIBUTE.SIDE\n  UNION\n  SELECT\n  ATTRIBUTE.ATTRIBUTE_ID AS ATTRIBUTE_ID,\n  ATTRIBUTE.NAME AS NAME,\n  ATTRIBUTE.CODE AS CODE,\n  ATTRIBUTE.SIDE AS SIDE,\n  ATTRIBUTE.TYPE AS TYPE,\n  ATTRIBUTE.DEFINE AS DEFINE,\n  ATTRIBUTE.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.MANUFACTURER_CODE AS CLUSTER_MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS ENABLED,\n  ATTRIBUTE.MIN AS ATT_VALUE,\n  CASE\n  WHEN ATOMIC.IS_STRING=1 THEN \n    CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n         WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n         ELSE ATOMIC.ATOMIC_SIZE\n         END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n  END AS ATOMIC_SIZE,\n  'MINIMUM' as ATTRIBUTE_VALUE_TYPE,\n  ATOMIC.IS_STRING AS IS_STRING\nFROM ATTRIBUTE\nINNER JOIN ENDPOINT_TYPE_ATTRIBUTE\nON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nINNER JOIN CLUSTER\nON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nINNER JOIN ATOMIC\nON ATOMIC.NAME = ATTRIBUTE.TYPE\nWHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF in (").concat(endpointClusterIds, ")\nAND ENDPOINT_TYPE_CLUSTER.SIDE = ATTRIBUTE.SIDE AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nAND (CASE\n  WHEN ATOMIC.IS_STRING=1 THEN \n    CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n         WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n         ELSE ATOMIC.ATOMIC_SIZE\n         END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n  END) > 2 AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ATT_VALUE IS NOT NULL AND ATT_VALUE != \"\" AND ENDPOINT_TYPE_ATTRIBUTE.BOUNDED !=0 AND REPLACE(ATT_VALUE, '0', '')!='x' AND REPLACE(ATT_VALUE, '0', '')!=''\nGROUP BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE, ATTRIBUTE.SIDE\nUNION\n  SELECT\n  ATTRIBUTE.ATTRIBUTE_ID AS ATTRIBUTE_ID,\n  ATTRIBUTE.NAME AS NAME,\n  ATTRIBUTE.CODE AS CODE,\n  ATTRIBUTE.SIDE AS SIDE,\n  ATTRIBUTE.TYPE AS TYPE,\n  ATTRIBUTE.DEFINE AS DEFINE,\n  ATTRIBUTE.MANUFACTURER_CODE AS MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n  CLUSTER.NAME AS CLUSTER_NAME,\n  CLUSTER.MANUFACTURER_CODE AS CLUSTER_MANUFACTURER_CODE,\n  ENDPOINT_TYPE_CLUSTER.ENABLED AS ENABLED,\n  ATTRIBUTE.MAX AS ATT_VALUE,\n  CASE\n  WHEN ATOMIC.IS_STRING=1 THEN \n    CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n         WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n         ELSE ATOMIC.ATOMIC_SIZE\n         END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n  END AS ATOMIC_SIZE,\n  'MAXIMUM' as ATTRIBUTE_VALUE_TYPE,\n  ATOMIC.IS_STRING AS IS_STRING\nFROM ATTRIBUTE\nINNER JOIN ENDPOINT_TYPE_ATTRIBUTE\nON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\nINNER JOIN ENDPOINT_TYPE_CLUSTER\nON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nINNER JOIN CLUSTER\nON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\nINNER JOIN ATOMIC\nON ATOMIC.NAME = ATTRIBUTE.TYPE\nWHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF in (").concat(endpointClusterIds, ")\nAND ENDPOINT_TYPE_CLUSTER.SIDE = ATTRIBUTE.SIDE AND ENDPOINT_TYPE_CLUSTER.ENABLED=1\nAND (CASE\n  WHEN ATOMIC.IS_STRING=1 THEN \n    CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n         WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n         ELSE ATOMIC.ATOMIC_SIZE\n         END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n  END) > 2 AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ATT_VALUE IS NOT NULL AND ATT_VALUE != \"\" AND ENDPOINT_TYPE_ATTRIBUTE.BOUNDED !=0 AND REPLACE(ATT_VALUE, '0', '')!='x' AND REPLACE(ATT_VALUE, '0', '')!=''\nGROUP BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE, ATTRIBUTE.SIDE )\n        "))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
/**
 * The reportable attribute details per endpoint per clusters.
 * @param {*} db
 * @param {*} endpointsAndClusters
 * @returns * The reportable attribute details per endpoint per clusters.
 */
function selectReportableAttributeDetailsFromEnabledClustersAndEndpoints(db, endpointsAndClusters) {
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
                    clusterDefine: x.CLUSTER_DEFINE,
                    clusterCode: x.CLUSTER_CODE,
                    isClusterEnabled: x.ENABLED,
                    isAttributeBounded: x.BOUNDED,
                    storageOption: x.STORAGE_OPTION,
                    isSingleton: x.SINGLETON,
                    isAttributeReportable: x.INCLUDED_REPORTABLE,
                    attributeReportableMinValue: x.MIN_INTERVAL,
                    attributeReportableMaxValue: x.MAX_INTERVAL,
                    attributeReportableChange: x.REPORTABLE_CHANGE,
                    attributeMinValue: x.MIN,
                    attributeMaxValue: x.MAX,
                    attributeMaxLength: x.MAX_LENGTH,
                    defaultValue: x.DEFAULT_VALUE,
                    attributeSize: x.ATOMIC_SIZE,
                    clusterIndex: x.CLUSTER_INDEX,
                    mfgAttributeCount: x.MANUFACTURING_SPECIFIC_ATTRIBUTE_COUNT,
                    singletonAttributeSize: x.SINGLETON_ATTRIBUTE_SIZE,
                    maxAttributeSize: x.MAX_ATTRIBUTE_SIZE,
                    endpointIdentifier: x.ENDPOINT_IDENTIFIER,
                };
            };
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n  SELECT\n    ATTRIBUTE.ATTRIBUTE_ID,\n    ATTRIBUTE.NAME,\n    ATTRIBUTE.CODE,\n    ATTRIBUTE.SIDE,\n    ATTRIBUTE.TYPE,\n    ATTRIBUTE.DEFINE,\n    ATTRIBUTE.MANUFACTURER_CODE,\n    ATTRIBUTE.IS_WRITABLE,\n    ENDPOINT_TYPE_CLUSTER.SIDE AS CLUSTER_SIDE,\n    CLUSTER.NAME AS CLUSTER_NAME,\n    CLUSTER.DEFINE AS CLUSTER_DEFINE,\n    CLUSTER.CODE AS CLUSTER_CODE,\n    ENDPOINT_TYPE_CLUSTER.ENABLED,\n    ENDPOINT_TYPE_ATTRIBUTE.BOUNDED,\n    ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION,\n    ENDPOINT_TYPE_ATTRIBUTE.SINGLETON,\n    ENDPOINT_TYPE_ATTRIBUTE.INCLUDED_REPORTABLE,\n    ENDPOINT_TYPE_ATTRIBUTE.MIN_INTERVAL,\n    ENDPOINT_TYPE_ATTRIBUTE.MAX_INTERVAL,\n    ENDPOINT_TYPE_ATTRIBUTE.REPORTABLE_CHANGE,\n    ATTRIBUTE.MIN,\n    ATTRIBUTE.MAX,\n    ATTRIBUTE.MAX_LENGTH,\n    ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE,\n    CASE\n      WHEN ATOMIC.IS_STRING=1 THEN \n        CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n             WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n             ELSE ATOMIC.ATOMIC_SIZE\n             END\n        WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n        ELSE ATOMIC.ATOMIC_SIZE\n    END AS ATOMIC_SIZE,\n    ROW_NUMBER() OVER (PARTITION BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ENDPOINT_TYPE_CLUSTER.SIDE ORDER BY CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE) CLUSTER_INDEX,\n    COUNT (ATTRIBUTE.MANUFACTURER_CODE) OVER () AS MANUFACTURING_SPECIFIC_ATTRIBUTE_COUNT,\n    SUM (CASE WHEN ENDPOINT_TYPE_ATTRIBUTE.SINGLETON=1 THEN \n      CASE WHEN ATOMIC.IS_STRING=1 THEN \n        CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n             WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n             ELSE ATOMIC.ATOMIC_SIZE\n        END\n      WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n      ELSE ATOMIC.ATOMIC_SIZE\n      END\n    ELSE 0 END) OVER () AS SINGLETON_ATTRIBUTE_SIZE,\n    MAX(CASE WHEN ATOMIC.IS_STRING=1 THEN \n      CASE WHEN ATOMIC.IS_LONG=0 THEN ATTRIBUTE.MAX_LENGTH+1\n          WHEN ATOMIC.IS_LONG=1 THEN ATTRIBUTE.MAX_LENGTH+2\n          ELSE ATOMIC.ATOMIC_SIZE\n      END\n    WHEN ATOMIC.ATOMIC_SIZE IS NULL THEN ATTRIBUTE.MAX_LENGTH\n    ELSE ATOMIC.ATOMIC_SIZE\n    END) OVER () AS MAX_ATTRIBUTE_SIZE,\n    ENDPOINT.ENDPOINT_IDENTIFIER\n  FROM ATTRIBUTE\n  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE\n  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  INNER JOIN ENDPOINT_TYPE_CLUSTER\n  ON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\n  INNER JOIN CLUSTER\n  ON ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = CLUSTER.CLUSTER_ID\n  INNER JOIN ENDPOINT\n  ON ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF = ENDPOINT.ENDPOINT_TYPE_REF\n  INNER JOIN ATOMIC\n  ON ATOMIC.NAME = ATTRIBUTE.TYPE\n  WHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF IN (".concat(endpointClusterIds, ")\n  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1 AND ENDPOINT_TYPE_CLUSTER.ENABLED=1 AND ENDPOINT_TYPE_CLUSTER.SIDE=ATTRIBUTE.SIDE\n  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED_REPORTABLE = 1\n  GROUP BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE, ATTRIBUTE.SIDE\n  ORDER BY ENDPOINT.ENDPOINT_IDENTIFIER, CLUSTER.MANUFACTURER_CODE, CLUSTER.CODE, ATTRIBUTE.CODE, ATTRIBUTE.MANUFACTURER_CODE\n        "))
                    .then(function (rows) { return rows.map(mapFunction); })];
        });
    });
}
function selectAttributeByCode(db, packageId, clusterCode, attributeCode, manufacturerCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (clusterCode == null) {
                return [2 /*return*/, selectGlobalAttributeByCode(db, packageId, attributeCode, manufacturerCode)];
            }
            else {
                return [2 /*return*/, selectNonGlobalAttributeByCode(db, packageId, clusterCode, attributeCode, manufacturerCode)];
            }
            return [2 /*return*/];
        });
    });
}
function selectNonGlobalAttributeByCode(db, packageId, clusterCode, attributeCode, manufacturerCode) {
    return __awaiter(this, void 0, void 0, function () {
        var manufacturerCondition, arg;
        return __generator(this, function (_a) {
            arg = [packageId, attributeCode, clusterCode];
            if (manufacturerCode == null || manufacturerCode == 0) {
                manufacturerCondition = 'C.MANUFACTURER_CODE IS NULL';
            }
            else {
                manufacturerCondition =
                    '( C.MANUFACTURER_CODE IS NULL OR C.MANUFACTURER_CODE = ? )';
                arg.push(manufacturerCode);
            }
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  A.ATTRIBUTE_ID,\n  A.CLUSTER_REF,\n  A.CODE,\n  A.MANUFACTURER_CODE,\n  A.NAME,\n  A.TYPE,\n  A.SIDE,\n  A.DEFINE,\n  A.MIN,\n  A.MAX,\n  A.REPORT_MIN_INTERVAL,\n  A.REPORT_MAX_INTERVAL,\n  A.REPORTABLE_CHANGE,\n  A.REPORTABLE_CHANGE_LENGTH,\n  A.IS_WRITABLE,\n  A.DEFAULT_VALUE,\n  A.IS_OPTIONAL,\n  A.IS_REPORTABLE,\n  A.IS_NULLABLE,\n  A.IS_SCENE_REQUIRED,\n  A.ARRAY_TYPE,\n  A.MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE AS A\nINNER JOIN CLUSTER AS C\nON C.CLUSTER_ID = A.CLUSTER_REF\nWHERE A.PACKAGE_REF = ?\n  AND A.CODE = ?\n  AND C.CODE = ?\n  AND ".concat(manufacturerCondition), arg)
                    .then(dbMapping.map.attribute)];
        });
    });
}
function selectGlobalAttributeByCode(db, packageId, attributeCode, manufacturerCode) {
    return __awaiter(this, void 0, void 0, function () {
        var manufacturerCondition, arg;
        return __generator(this, function (_a) {
            arg = [packageId, attributeCode];
            if (manufacturerCode == null || manufacturerCode == 0) {
                manufacturerCondition = 'A.MANUFACTURER_CODE IS NULL';
            }
            else {
                manufacturerCondition =
                    '( A.MANUFACTURER_CODE IS NULL OR A.MANUFACTURER_CODE = ? )';
                arg.push(manufacturerCode);
            }
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  A.ATTRIBUTE_ID,\n  A.CLUSTER_REF,\n  A.CODE,\n  A.MANUFACTURER_CODE,\n  A.NAME,\n  A.TYPE,\n  A.SIDE,\n  A.DEFINE,\n  A.MIN,\n  A.MAX,\n  A.REPORT_MIN_INTERVAL,\n  A.REPORT_MAX_INTERVAL,\n  A.REPORTABLE_CHANGE,\n  A.REPORTABLE_CHANGE_LENGTH,\n  A.IS_WRITABLE,\n  A.DEFAULT_VALUE,\n  A.IS_OPTIONAL,\n  A.IS_REPORTABLE,\n  A.IS_NULLABLE,\n  A.IS_SCENE_REQUIRED,\n  A.ARRAY_TYPE,\n  A.MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE AS A\nWHERE A.PACKAGE_REF = ?\n  AND A.CODE = ?\n  AND ".concat(manufacturerCondition), arg)
                    .then(dbMapping.map.attribute)];
        });
    });
}
/**
 * Retrieves the global attribute data for a given attribute code.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} attributeCode
 */
function selectGlobalAttributeDefaults(db, clusterRef, attributeRef) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  GAD.DEFAULT_VALUE,\n  GAB.BIT,\n  GAB.VALUE,\n  (SELECT NAME FROM TAG WHERE TAG_ID = GAB.TAG_REF) AS TAG\nFROM\n  GLOBAL_ATTRIBUTE_DEFAULT AS GAD\nLEFT JOIN\n  GLOBAL_ATTRIBUTE_BIT AS GAB\nON\n  GAD.GLOBAL_ATTRIBUTE_DEFAULT_ID = GAB.GLOBAL_ATTRIBUTE_DEFAULT_REF\nWHERE\n  GAD.CLUSTER_REF = ?\n  AND GAD.ATTRIBUTE_REF = ?\nORDER BY\n  GAD.CLUSTER_REF, GAD.ATTRIBUTE_REF, GAB.BIT\n", [clusterRef, attributeRef])
                    .then(function (rows) {
                    return rows.reduce(function (ac, row) {
                        if (!('default_value' in ac)) {
                            ac.defaultValue = row.DEFAULT_VALUE;
                        }
                        if (row.BIT != null) {
                            if (!('featureBits' in ac)) {
                                ac.featureBits = [];
                            }
                            ac.featureBits.push({ bit: row.BIT, value: row.VALUE, tag: row.TAG });
                        }
                        return ac;
                    }, {});
                })];
        });
    });
}
exports.selectAllAttributeDetailsFromEnabledClusters =
    selectAllAttributeDetailsFromEnabledClusters;
exports.selectManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters =
    selectManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters;
exports.selectNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters =
    selectNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters;
exports.selectAttributeDetailsWithABoundFromEnabledClusters =
    selectAttributeDetailsWithABoundFromEnabledClusters;
exports.selectAttributeDetailsFromEnabledClusters =
    selectAttributeDetailsFromEnabledClusters;
exports.selectAttributeBoundDetails = selectAttributeBoundDetails;
exports.selectReportableAttributeDetailsFromEnabledClustersAndEndpoints =
    selectReportableAttributeDetailsFromEnabledClustersAndEndpoints;
exports.selectGlobalAttributeDefaults = selectGlobalAttributeDefaults;
exports.selectAttributeByCode = selectAttributeByCode;
//# sourceMappingURL=query-attribute.js.map