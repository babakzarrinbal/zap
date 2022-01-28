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
 * This module provides queries for ZCL static queries.
 *
 * @module DB API: zcl database access
 */
var dbApi = require('./db-api');
var dbMapping = require('./db-mapping');
var queryAtomic = require('./query-atomic');
var queryEnum = require('./query-enum');
var queryStruct = require('./query-struct');
var queryBitmap = require('./query-bitmap');
/**
 * Retrieves all the bitmaps that are associated with a cluster.
 * @param {*} db
 * @param {*} packageId
 * @param {*} clusterId
 * @returns cluster-related bitmaps
 */
function selectClusterBitmaps(db, packageId, clusterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  B.BITMAP_ID,\n  B.NAME,\n  B.TYPE\nFROM\n  BITMAP AS B\nINNER JOIN\n  BITMAP_CLUSTER AS BC\nON\n  B.BITMAP_ID = BC.BITMAP_REF\nWHERE\n  B.PACKAGE_REF = ?\n  AND BC.CLUSTER_REF = ?\nORDER BY B.NAME", [packageId, clusterId])
                    .then(function (rows) { return rows.map(dbMapping.map.bitmap); })];
        });
    });
}
function selectAllBitmapFieldsById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT NAME, MASK, TYPE FROM BITMAP_FIELD WHERE BITMAP_REF = ? ORDER BY FIELD_IDENTIFIER', [id])
                    .then(function (rows) { return rows.map(dbMapping.map.bitmapField); })];
        });
    });
}
function selectAllBitmapFields(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT NAME, MASK, TYPE, BITMAP_REF FROM BITMAP_FIELD  WHERE PACKAGE_REF = ? ORDER BY BITMAP_REF, FIELD_IDENTIFIER', [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.bitmapField); })];
        });
    });
}
/**
 * Retrieves all the domains in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of domains.
 */
function selectAllDomains(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT DOMAIN_ID, NAME FROM DOMAIN WHERE PACKAGE_REF = ? ORDER BY NAME', [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.domain); })];
        });
    });
}
function selectDomainById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT DOMAIN_ID, NAME FROM DOMAIN WHERE DOMAIN_ID = ?', [id])
                    .then(dbMapping.map.domain)];
        });
    });
}
/**
 * Retrieves all the structs in the database, including the count
 * of items.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of structs.
 */
function selectAllStructsWithItemCount(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  STRUCT.STRUCT_ID,\n  STRUCT.NAME,\n  COUNT(ITEM.NAME) AS ITEM_COUNT\nFROM\n  STRUCT\nLEFT JOIN\n  STRUCT_ITEM AS ITEM\nON\n  STRUCT.STRUCT_ID = ITEM.STRUCT_REF\nWHERE\n  STRUCT.PACKAGE_REF = ?\nGROUP BY STRUCT.NAME\nORDER BY STRUCT.NAME", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.struct); })];
        });
    });
}
/**
 * Returns an array of clusters that struct belongs to.
 * @param {*} db
 * @param {*} structId
 * @returns clusters
 */
function selectStructClusters(db, structId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  C.CLUSTER_ID,\n  C.CODE,\n  C.MANUFACTURER_CODE,\n  C.NAME,\n  C.DESCRIPTION,\n  C.DEFINE,\n  C.DOMAIN_NAME,\n  C.IS_SINGLETON,\n  C.REVISION\nFROM\n  CLUSTER AS C\nINNER JOIN\n  STRUCT_CLUSTER AS SC\nON\n  C.CLUSTER_ID = SC.CLUSTER_REF\nWHERE\n  SC.STRUCT_REF = ?\nORDER BY C.CODE\n    ", [structId])
                    .then(function (rows) { return rows.map(dbMapping.map.cluster); })];
        });
    });
}
/**
 * Returns an array of clusters that enum belongs to.
 * @param {*} db
 * @param {*} enumId
 * @returns clusters
 */
function selectEnumClusters(db, enumId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  C.CLUSTER_ID,\n  C.CODE,\n  C.MANUFACTURER_CODE,\n  C.NAME,\n  C.DESCRIPTION,\n  C.DEFINE,\n  C.DOMAIN_NAME,\n  C.IS_SINGLETON,\n  C.REVISION\nFROM\n  CLUSTER AS C\nINNER JOIN\n  ENUM_CLUSTER AS EC\nON\n  C.CLUSTER_ID = EC.CLUSTER_REF\nWHERE\n  EC.ENUM_REF = ?\n    ", [enumId])
                    .then(function (rows) { return rows.map(dbMapping.map.cluster); })];
        });
    });
}
/**
 * Returns an array of clusters that enum belongs to.
 * @param {*} db
 * @param {*} enumId
 * @returns clusters
 */
function selectBitmapClusters(db, bitmapId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  C.CLUSTER_ID,\n  C.CODE,\n  C.MANUFACTURER_CODE,\n  C.NAME,\n  C.DESCRIPTION,\n  C.DEFINE,\n  C.DOMAIN_NAME,\n  C.IS_SINGLETON,\n  C.REVISION\nFROM\n  CLUSTER AS C\nINNER JOIN\n  BITMAP_CLUSTER AS BC\nON\n  C.CLUSTER_ID = BC.CLUSTER_REF\nWHERE\n  BC.BITMAP_REF = ?\n    ", [bitmapId])
                    .then(function (rows) { return rows.map(dbMapping.map.cluster); })];
        });
    });
}
/**
 * Retrieves all the cluster-related structs in the database with the items.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of structs, each one containing items field with rows of items.
 */
function selectClusterStructsWithItems(db, packageId, clusterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, selectStructsWithItemsImpl(db, packageId, clusterId)];
        });
    });
}
/**
 * Retrieves all the structs in the database with the items.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of structs, each one containing items field with rows of items.
 */
function selectAllStructsWithItems(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, selectStructsWithItemsImpl(db, packageId, null)];
        });
    });
}
function selectStructsWithItemsImpl(db, packageId, clusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, args, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (clusterId == null) {
                        query = "\n    SELECT\n      S.STRUCT_ID AS STRUCT_ID,\n      S.NAME AS STRUCT_NAME,\n      (SELECT COUNT(1) FROM STRUCT_CLUSTER WHERE STRUCT_CLUSTER.STRUCT_REF = S.STRUCT_ID) AS STRUCT_CLUSTER_COUNT,\n      SI.NAME AS ITEM_NAME,\n      SI.FIELD_IDENTIFIER AS ITEM_IDENTIFIER,\n      SI.TYPE AS ITEM_TYPE,\n      SI.IS_ARRAY AS ITEM_IS_ARRAY,\n      SI.IS_ENUM AS ITEM_IS_ENUM,\n      SI.MIN_LENGTH AS ITEM_MIN_LENGTH,\n      SI.MAX_LENGTH AS ITEM_MAX_LENGTH,\n      SI.IS_WRITABLE AS ITEM_IS_WRITABLE,\n      SI.IS_NULLABLE AS ITEM_IS_NULLABLE,\n      SI.IS_OPTIONAL AS ITEM_IS_OPTIONAL,\n      SI.IS_FABRIC_SENSITIVE AS ITEM_IS_FABRIC_SENSITIVE\n    FROM\n      STRUCT AS S\n    LEFT JOIN\n      STRUCT_ITEM AS SI\n    ON\n      S.STRUCT_ID = SI.STRUCT_REF\n    WHERE\n      S.PACKAGE_REF = ?\n    ORDER BY S.NAME, SI.FIELD_IDENTIFIER";
                        args = [packageId];
                    }
                    else {
                        query = "\n    SELECT\n      S.STRUCT_ID AS STRUCT_ID,\n      S.NAME AS STRUCT_NAME,\n      (SELECT COUNT(1) FROM STRUCT_CLUSTER WHERE STRUCT_CLUSTER.STRUCT_REF = S.STRUCT_ID) AS STRUCT_CLUSTER_COUNT,\n      SI.NAME AS ITEM_NAME,\n      SI.FIELD_IDENTIFIER AS ITEM_IDENTIFIER,\n      SI.TYPE AS ITEM_TYPE,\n      SI.IS_ARRAY AS ITEM_IS_ARRAY,\n      SI.IS_ENUM AS ITEM_IS_ENUM,\n      SI.MIN_LENGTH AS ITEM_MIN_LENGTH,\n      SI.MAX_LENGTH AS ITEM_MAX_LENGTH,\n      SI.IS_WRITABLE AS ITEM_IS_WRITABLE,\n      SI.IS_NULLABLE AS ITEM_IS_NULLABLE,\n      SI.IS_OPTIONAL AS ITEM_IS_OPTIONAL,\n      SI.IS_FABRIC_SENSITIVE AS ITEM_IS_FABRIC_SENSITIVE\n    FROM\n      STRUCT AS S\n    INNER JOIN\n      STRUCT_CLUSTER AS SC\n    ON\n      S.STRUCT_ID = SC.STRUCT_REF\n    LEFT JOIN\n      STRUCT_ITEM AS SI\n    ON\n      S.STRUCT_ID = SI.STRUCT_REF\n    WHERE\n      S.PACKAGE_REF = ?\n    AND\n      SC.CLUSTER_REF = ?\n    ORDER BY S.NAME, SI.FIELD_IDENTIFIER";
                        args = [packageId, clusterId];
                    }
                    return [4 /*yield*/, dbApi.dbAll(db, query, args)];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.reduce(function (acc, value) {
                            var objectToActOn;
                            if (acc.length == 0 || acc[acc.length - 1].name != value.STRUCT_NAME) {
                                // Create a new object
                                objectToActOn = {
                                    id: value.STRUCT_ID,
                                    name: value.STRUCT_NAME,
                                    label: value.STRUCT_NAME,
                                    struct_cluster_count: value.STRUCT_CLUSTER_COUNT,
                                    items: [],
                                    itemCnt: 0,
                                };
                                acc.push(objectToActOn);
                            }
                            else {
                                objectToActOn = acc[acc.length - 1];
                            }
                            objectToActOn.items.push({
                                name: value.ITEM_NAME,
                                label: value.ITEM_NAME,
                                fieldIdentifier: value.ITEM_IDENTIFIER,
                                type: value.ITEM_TYPE,
                                isArray: dbApi.fromDbBool(value.ITEM_IS_ARRAY),
                                isEnum: dbApi.fromDbBool(value.ITEM_IS_ENUM),
                                minLength: value.ITEM_MIN_LENGTH,
                                maxLength: value.ITEM_MAX_LENGTH,
                                isWritable: dbApi.fromDbBool(value.ITEM_IS_WRITABLE),
                                isNullable: dbApi.fromDbBool(value.ITEM_IS_NULLABLE),
                                isOptional: dbApi.fromDbBool(value.ITEM_IS_OPTIONAL),
                                isFabricSensitive: dbApi.fromDbBool(value.ITEM_IS_FABRIC_SENSITIVE),
                            });
                            objectToActOn.itemCnt++;
                            return acc;
                        }, [])];
            }
        });
    });
}
function selectAllStructItemsById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  FIELD_IDENTIFIER,\n  NAME,\n  TYPE,\n  STRUCT_REF,\n  IS_ARRAY,\n  IS_ENUM,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  IS_WRITABLE,\n  IS_NULLABLE,\n  IS_OPTIONAL,\n  IS_FABRIC_SENSITIVE\nFROM\n  STRUCT_ITEM\nWHERE STRUCT_REF = ?\nORDER BY\n  FIELD_IDENTIFIER", [id])
                    .then(function (rows) { return rows.map(dbMapping.map.structItem); })];
        });
    });
}
/**
 *
 *
 * @param  db
 * @param  name
 * @returns the details of the struct items given the name of the struct
 */
function selectAllStructItemsByStructName(db, name, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  SI.FIELD_IDENTIFIER,\n  SI.NAME,\n  SI.TYPE,\n  SI.STRUCT_REF,\n  SI.IS_ARRAY,\n  SI.IS_ENUM,\n  SI.MIN_LENGTH,\n  SI.MAX_LENGTH,\n  SI.IS_WRITABLE,\n  SI.IS_NULLABLE,\n  SI.IS_OPTIONAL,\n  SI.IS_FABRIC_SENSITIVE\nFROM\n  STRUCT_ITEM AS SI\nINNER JOIN\n  STRUCT\nON\n  STRUCT.STRUCT_ID = SI.STRUCT_REF\nWHERE STRUCT.NAME = ?\n  AND STRUCT.PACKAGE_REF = ?\nORDER BY FIELD_IDENTIFIER", [name, packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.structItem); })];
        });
    });
}
/**
 * Retrieves all the clusters in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of clusters.
 */
function selectAllClusters(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  CLUSTER_ID,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  DEFINE,\n  DOMAIN_NAME,\n  IS_SINGLETON,\n  REVISION\nFROM CLUSTER\nWHERE\n  PACKAGE_REF = ?\nORDER BY CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.cluster); })];
        });
    });
}
/**
 * Finds cluster by code.
 *
 * @param {*} db
 * @param {*} packageId Single packageId or an array of them.
 * @param {*} clusterCode
 * @param {*} mfgCode
 * @returns cluster by code in a single package id.
 */
function selectClusterByCode(db, packageId, clusterCode, mfgCode) {
    if (mfgCode === void 0) { mfgCode = null; }
    return __awaiter(this, void 0, void 0, function () {
        var query, args;
        return __generator(this, function (_a) {
            query = "\nSELECT\n  CLUSTER_ID,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  DEFINE,\n  DOMAIN_NAME,\n  IS_SINGLETON,\n  REVISION\nFROM\n  CLUSTER\nWHERE\n  PACKAGE_REF = ?\n  AND CODE = ?";
            if (mfgCode == null || mfgCode == 0) {
                query = query + " AND MANUFACTURER_CODE IS NULL";
                args = [packageId, clusterCode];
            }
            else {
                query = query + " AND MANUFACTURER_CODE = ?";
                args = [packageId, clusterCode, mfgCode];
            }
            return [2 /*return*/, dbApi.dbGet(db, query, args).then(dbMapping.map.cluster)];
        });
    });
}
/**
 * Returns a promise that resolves into a cluster.
 *
 * @param {*} db
 * @param {*} clusterId
 * @param {*} packageId
 * @returns promise that resolves into a cluster object
 */
function selectClusterById(db, clusterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  CLUSTER_ID,\n  PACKAGE_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  DEFINE,\n  DOMAIN_NAME,\n  IS_SINGLETON,\n  REVISION\nFROM\n  CLUSTER\nWHERE\n  CLUSTER_ID = ?", [clusterId])
                    .then(dbMapping.map.cluster)];
        });
    });
}
/**
 * Retrieves all the device types in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of device types.
 */
function selectAllDeviceTypes(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT DEVICE_TYPE_ID, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION FROM DEVICE_TYPE WHERE PACKAGE_REF = ? ORDER BY DOMAIN, CODE', [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.deviceType); })];
        });
    });
}
function selectDeviceTypeById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT DEVICE_TYPE_ID, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION FROM DEVICE_TYPE WHERE DEVICE_TYPE_ID = ?', [id])
                    .then(dbMapping.map.deviceType)];
        });
    });
}
function selectDeviceTypeByCodeAndName(db, packageId, code, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT DEVICE_TYPE_ID, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION FROM DEVICE_TYPE WHERE CODE = ? AND NAME = ? AND PACKAGE_REF = ? ', [code, name, packageId])
                    .then(dbMapping.map.deviceType)];
        });
    });
}
/**
 * Returns attributes for a given cluster.
 * IMPORTANT:
 *    packageId is needed to properly deal with the global attributes.
 *
 * This method will NOT only return the attributes that link to
 * a given cluster, but will ALSO return the attributes that have
 * empty clusterRef (which are global attributes), and the check
 * in that case will be made via packageId.
 *
 * @param {*} db
 * @param {*} clusterId
 * @param {*} packageId
 * @returns promise of a list of attributes, including global attributes
 */
function selectAttributesByClusterIdIncludingGlobal(db, clusterId, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ATTRIBUTE_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  TYPE,\n  SIDE,\n  DEFINE,\n  MIN,\n  MAX,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  REPORT_MIN_INTERVAL,\n  REPORT_MAX_INTERVAL,\n  REPORTABLE_CHANGE,\n  REPORTABLE_CHANGE_LENGTH,\n  IS_WRITABLE,\n  DEFAULT_VALUE,\n  IS_OPTIONAL,\n  IS_REPORTABLE,\n  IS_NULLABLE,\n  IS_SCENE_REQUIRED,\n  ARRAY_TYPE,\n  MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE\nWHERE (CLUSTER_REF = ? OR CLUSTER_REF IS NULL)\n  AND PACKAGE_REF = ? \nORDER BY CODE", [clusterId, packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.attribute); })];
        });
    });
}
function selectAttributesByClusterIdAndSideIncludingGlobal(db, clusterId, packageId, side) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ATTRIBUTE_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  TYPE,\n  SIDE,\n  DEFINE,\n  MIN,\n  MAX,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  REPORT_MIN_INTERVAL,\n  REPORT_MAX_INTERVAL,\n  REPORTABLE_CHANGE,\n  REPORTABLE_CHANGE_LENGTH,\n  IS_WRITABLE,\n  DEFAULT_VALUE,\n  IS_OPTIONAL,\n  IS_REPORTABLE,\n  IS_NULLABLE,\n  IS_SCENE_REQUIRED,\n  ARRAY_TYPE,\n  MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE\nWHERE\n  SIDE = ?\n  AND (CLUSTER_REF = ? OR CLUSTER_REF IS NULL)\n  AND PACKAGE_REF = ? \nORDER BY CODE", [side, clusterId, packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.attribute); })];
        });
    });
}
/**
 * Queries for attributes inside a cluster.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} clusterCode
 * @param {*} manufacturerCode
 * @returns promise that resolves into attributes.
 */
function selectAttributesByClusterCodeAndManufacturerCode(db, packageId, clusterCode, manufacturerCode) {
    return __awaiter(this, void 0, void 0, function () {
        var manufacturerString;
        return __generator(this, function (_a) {
            if (manufacturerCode == null) {
                manufacturerString = ' AND CLUSTER.MANUFACTURER_CODE IS NULL';
            }
            else {
                manufacturerString =
                    ' AND CLUSTER.MANUFACTURER_CODE IS NULL OR MANUFACTURER_CODE = ' +
                        manufacturerCode;
            }
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  ATTRIBUTE.ATTRIBUTE_ID,\n  ATTRIBUTE.CLUSTER_REF,\n  ATTRIBUTE.CODE,\n  ATTRIBUTE.MANUFACTURER_CODE,\n  ATTRIBUTE.NAME,\n  ATTRIBUTE.TYPE,\n  ATTRIBUTE.SIDE,\n  ATTRIBUTE.DEFINE,\n  ATTRIBUTE.MIN,\n  ATTRIBUTE.MAX,\n  ATTRIBUTE.MIN_LENGTH,\n  ATTRIBUTE.MAX_LENGTH,\n  ATTRIBUTE.REPORT_MIN_INTERVAL,\n  ATTRIBUTE.REPORT_MAX_INTERVAL,\n  ATTRIBUTE.REPORTABLE_CHANGE,\n  ATTRIBUTE.REPORTABLE_CHANGE_LENGTH,\n  ATTRIBUTE.IS_WRITABLE,\n  ATTRIBUTE.DEFAULT_VALUE,\n  ATTRIBUTE.IS_OPTIONAL,\n  ATTRIBUTE.IS_REPORTABLE,\n  ATTRIBUTE.IS_NULLABLE,\n  ATTRIBUTE.IS_SCENE_REQUIRED,\n  ATTRIBUTE.ARRAY_TYPE,\n  ATTRIBUTE.MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE, CLUSTER\nWHERE CLUSTER.CODE = ?\n  AND CLUSTER.CLUSTER_ID = ATTRIBUTE.CLUSTER_REF\n  AND ATTRIBUTE.PACKAGE_REF = ?\n  ".concat(manufacturerString), [clusterCode, packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.attribute); })];
        });
    });
}
function selectAttributeById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  ATTRIBUTE_ID,\n  CLUSTER_REF,\n  PACKAGE_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  TYPE,\n  SIDE,\n  DEFINE,\n  MIN,\n  MAX,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  REPORT_MIN_INTERVAL,\n  REPORT_MAX_INTERVAL,\n  REPORTABLE_CHANGE,\n  REPORTABLE_CHANGE_LENGTH,\n  IS_WRITABLE,\n  DEFAULT_VALUE,\n  IS_OPTIONAL,\n  IS_REPORTABLE,\n  IS_NULLABLE,\n  IS_SCENE_REQUIRED,\n  ARRAY_TYPE,\n  MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE\nWHERE ATTRIBUTE_ID = ?", [id])
                    .then(dbMapping.map.attribute)];
        });
    });
}
/**
 * This async function should be used when you want to get attributes, while also resolving against any global data that may be overridden by a particular cluster.
 * @param {*} db
 * @param {*} attributeId
 * @param {*} clusterRef
 */
function selectAttributeByAttributeIdAndClusterRef(db, attributeId, clusterRef) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  A.ATTRIBUTE_ID,\n  A.CLUSTER_REF,\n  A.CODE,\n  A.MANUFACTURER_CODE,\n  A.NAME,\n  A.TYPE,\n  A.SIDE,\n  A.DEFINE,\n  A.MIN,\n  A.MAX,\n  A.MIN_LENGTH,\n  A.MAX_LENGTH,\n  A.REPORT_MIN_INTERVAL,\n  A.REPORT_MAX_INTERVAL,\n  A.REPORTABLE_CHANGE,\n  A.REPORTABLE_CHANGE_LENGTH,\n  A.IS_WRITABLE,\n  CASE\n    WHEN A.CLUSTER_REF NOT NULL\n    THEN A.DEFAULT_VALUE\n  ELSE\n    CASE\n      WHEN\n        EXISTS ( SELECT DEFAULT_VALUE\n                 FROM GLOBAL_ATTRIBUTE_DEFAULT\n                 WHERE CLUSTER_REF = ?\n                   AND ATTRIBUTE_REF = ATTRIBUTE_ID )\n      THEN ( SELECT DEFAULT_VALUE\n             FROM GLOBAL_ATTRIBUTE_DEFAULT\n             WHERE CLUSTER_REF = ?\n               AND ATTRIBUTE_REF = ATTRIBUTE_ID)\n    ELSE A.DEFAULT_VALUE\n    END\n  END AS DEFAULT_VALUE,\n  A.IS_OPTIONAL,\n  A.IS_REPORTABLE,\n  A.IS_NULLABLE,\n  A.IS_SCENE_REQUIRED,\n  A.ARRAY_TYPE,\n  A.MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE AS A\nWHERE ATTRIBUTE_ID = ?", [clusterRef, clusterRef, attributeId])
                    .then(dbMapping.map.attribute)];
        });
    });
}
function selectAllAttributes(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  A.ATTRIBUTE_ID,\n  A.CLUSTER_REF,\n  A.CODE,\n  A.MANUFACTURER_CODE,\n  A.NAME,\n  A.TYPE,\n  A.SIDE,\n  A.DEFINE,\n  A.MIN,\n  A.MAX,\n  A.MIN_LENGTH,\n  A.MAX_LENGTH,\n  A.REPORT_MIN_INTERVAL,\n  A.REPORT_MAX_INTERVAL,\n  A.REPORTABLE_CHANGE,\n  A.REPORTABLE_CHANGE_LENGTH,\n  A.IS_WRITABLE,\n  A.DEFAULT_VALUE,\n  A.IS_OPTIONAL,\n  A.IS_REPORTABLE,\n  A.IS_NULLABLE,\n  A.IS_SCENE_REQUIRED,\n  A.ARRAY_TYPE,\n  A.MUST_USE_TIMED_WRITE,\n  C.CODE AS CLUSTER_CODE\nFROM\n  ATTRIBUTE AS A\nLEFT JOIN\n  CLUSTER AS C\nON\n  A.CLUSTER_REF = C.CLUSTER_ID\nWHERE\n  A.PACKAGE_REF = ?\nORDER BY\n  C.CODE, A.CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.attribute); })];
        });
    });
}
/**
 * Query for attributes by side.
 *
 * @param {*} db
 * @param {*} side
 * @param {*} packageId
 * @returns promise that resolves into attributes.
 */
function selectAllAttributesBySide(db, side, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  ATTRIBUTE_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  TYPE,\n  SIDE,\n  DEFINE,\n  MIN,\n  MAX,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  REPORT_MIN_INTERVAL,\n  REPORT_MAX_INTERVAL,\n  REPORTABLE_CHANGE,\n  REPORTABLE_CHANGE_LENGTH,\n  IS_WRITABLE,\n  DEFAULT_VALUE,\n  IS_OPTIONAL,\n  IS_REPORTABLE,\n  IS_NULLABLE,\n  IS_SCENE_REQUIRED,\n  ARRAY_TYPE,\n  MUST_USE_TIMED_WRITE\nFROM ATTRIBUTE\n   WHERE SIDE = ?\n   AND PACKAGE_REF = ?\nORDER BY CODE", [side, packageId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.attribute)];
            }
        });
    });
}
function selectEndpointTypeClustersByEndpointTypeId(db, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  ENDPOINT_TYPE_REF,\n  CLUSTER_REF,\n  SIDE,\n  ENABLED\nFROM\n  ENDPOINT_TYPE_CLUSTER\nWHERE\n  ENDPOINT_TYPE_REF = ?\nORDER BY\n  CLUSTER_REF", [endpointTypeId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.endpointTypeCluster)];
            }
        });
    });
}
function selectEndpointTypeAttributesByEndpointId(db, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  ETA.ENDPOINT_TYPE_REF,\n  ETC.CLUSTER_REF,\n  ETA.ATTRIBUTE_REF,\n  ETA.INCLUDED,\n  ETA.STORAGE_OPTION,\n  ETA.SINGLETON,\n  ETA.BOUNDED,\n  ETA.DEFAULT_VALUE,\n  ETA.INCLUDED_REPORTABLE,\n  ETA.MIN_INTERVAL,\n  ETA.MAX_INTERVAL,\n  ETA.REPORTABLE_CHANGE\nFROM\n  ENDPOINT_TYPE_ATTRIBUTE AS ETA,\n  ENDPOINT_TYPE_CLUSTER AS ETC\nWHERE\n  ETA.ENDPOINT_TYPE_REF = ?\n  AND ETA.ENDPOINT_TYPE_CLUSTER_REF = ETC.ENDPOINT_TYPE_CLUSTER_ID\nORDER BY ATTRIBUTE_REF", [endpointTypeId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.endpointTypeAttribute)];
            }
        });
    });
}
function selectEndpointTypeAttribute(db, endpointTypeId, attributeRef, clusterRef) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, "\nSELECT\n  ETA.ENDPOINT_TYPE_REF,\n  ETC.CLUSTER_REF,\n  ETA.ATTRIBUTE_REF,\n  ETA.INCLUDED,\n  ETA.STORAGE_OPTION,\n  ETA.SINGLETON,\n  ETA.BOUNDED,\n  ETA.DEFAULT_VALUE,\n  ETA.INCLUDED_REPORTABLE,\n  ETA.MIN_INTERVAL,\n  ETA.MAX_INTERVAL,\n  ETA.REPORTABLE_CHANGE\nFROM\n  ENDPOINT_TYPE_ATTRIBUTE AS ETA, ENDPOINT_TYPE_CLUSTER AS ETC\nWHERE\n  ETA.ENDPOINT_TYPE_REF = ?\n  AND ETA.ATTRIBUTE_REF = ?\n  AND ETA.ENDPOINT_TYPE_CLUSTER_REF = ETC.ENDPOINT_TYPE_CLUSTER_ID\n  AND ETC.CLUSTER_REF = ?", [endpointTypeId, attributeRef, clusterRef])];
                case 1:
                    row = _a.sent();
                    return [2 /*return*/, dbMapping.map.endpointTypeAttribute(row)];
            }
        });
    });
}
function selectEndpointTypeCommandsByEndpointId(db, endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF,\n  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF,\n  ENDPOINT_TYPE_COMMAND.COMMAND_REF,\n  ENDPOINT_TYPE_COMMAND.INCOMING,\n  ENDPOINT_TYPE_COMMAND.OUTGOING\nFROM\n  ENDPOINT_TYPE_COMMAND, ENDPOINT_TYPE_CLUSTER\nWHERE\n  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ?\n  AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID\nORDER BY COMMAND_REF", [endpointTypeId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.endpointTypeCommand)];
            }
        });
    });
}
function selectDeviceTypeClustersByDeviceTypeRef(db, deviceTypeRef) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  DEVICE_TYPE_CLUSTER_ID,\n  DEVICE_TYPE_REF,\n  CLUSTER_REF,\n  CLUSTER_NAME,\n  INCLUDE_CLIENT,\n  INCLUDE_SERVER,\n  LOCK_CLIENT,\n  LOCK_SERVER\nFROM\n  DEVICE_TYPE_CLUSTER\nWHERE\n  DEVICE_TYPE_REF = ?\nORDER BY CLUSTER_REF", [deviceTypeRef])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.deviceTypeCluster)];
            }
        });
    });
}
function selectDeviceTypeClusterByDeviceTypeClusterId(db, deviceTypeClusterId) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, "\nSELECT\n  DEVICE_TYPE_CLUSTER_ID,\n  DEVICE_TYPE_REF,\n  CLUSTER_REF,\n  CLUSTER_NAME,\n  INCLUDE_CLIENT,\n  INCLUDE_SERVER,\n  LOCK_CLIENT,\n  LOCK_SERVER\nFROM\n  DEVICE_TYPE_CLUSTER\nWHERE\n  DEVICE_TYPE_CLUSTER_ID = ?", [deviceTypeClusterId])];
                case 1:
                    row = _a.sent();
                    return [2 /*return*/, dbMapping.map.deviceTypeCluster(row)];
            }
        });
    });
}
function selectDeviceTypeAttributesByDeviceTypeRef(db, deviceTypeRef) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  DEVICE_TYPE_CLUSTER.CLUSTER_REF,\n  DEVICE_TYPE_ATTRIBUTE.DEVICE_TYPE_CLUSTER_REF,\n  DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_REF,\n  DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_NAME\nFROM\n  DEVICE_TYPE_ATTRIBUTE,\n  DEVICE_TYPE_CLUSTER\nWHERE\n  DEVICE_TYPE_CLUSTER.DEVICE_TYPE_REF = ?\n  AND DEVICE_TYPE_CLUSTER.DEVICE_TYPE_CLUSTER_ID = DEVICE_TYPE_ATTRIBUTE.DEVICE_TYPE_CLUSTER_REF", [deviceTypeRef])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.deviceTypeAttribute)];
            }
        });
    });
}
function selectDeviceTypeCommandsByDeviceTypeRef(db, deviceTypeRef) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  DEVICE_TYPE_CLUSTER.CLUSTER_REF,\n  DEVICE_TYPE_COMMAND.DEVICE_TYPE_CLUSTER_REF,\n  DEVICE_TYPE_COMMAND.COMMAND_REF,\n  DEVICE_TYPE_COMMAND.COMMAND_NAME\nFROM\n  DEVICE_TYPE_COMMAND,\n  DEVICE_TYPE_CLUSTER\nWHERE\n  DEVICE_TYPE_CLUSTER.DEVICE_TYPE_REF = ?\n  AND DEVICE_TYPE_CLUSTER.DEVICE_TYPE_CLUSTER_ID = DEVICE_TYPE_COMMAND.DEVICE_TYPE_CLUSTER_REF", [deviceTypeRef])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.deviceTypeCommand)];
            }
        });
    });
}
/**
 * After loading up device type cluster table with the names,
 * this method links the refererence to actual cluster reference.
 *
 * @param {*} db
 * @returns promise of completion
 */
function updateClusterReferencesForDeviceTypeClusters(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE\n  DEVICE_TYPE_CLUSTER\nSET\n  CLUSTER_REF =\n  ( SELECT\n      CLUSTER.CLUSTER_ID\n    FROM\n      CLUSTER\n    WHERE\n      lower(CLUSTER.NAME) = lower(DEVICE_TYPE_CLUSTER.CLUSTER_NAME)\n    AND\n      CLUSTER.PACKAGE_REF = ?\n  )\nWHERE\n  ( SELECT PACKAGE_REF\n    FROM DEVICE_TYPE\n    WHERE DEVICE_TYPE_ID = DEVICE_TYPE_CLUSTER.DEVICE_TYPE_REF\n  ) = ?", [packageId, packageId])];
        });
    });
}
/**
 * After loading up device type attribute table with the names,
 * this method links the refererence to actual attribute reference.
 *
 * @param {*} db
 * @returns promise of completion
 */
function updateAttributeReferencesForDeviceTypeReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE\n  DEVICE_TYPE_ATTRIBUTE\nSET\n  ATTRIBUTE_REF =\n  ( SELECT\n      ATTRIBUTE.ATTRIBUTE_ID\n    FROM\n      ATTRIBUTE\n    WHERE\n      upper(ATTRIBUTE.DEFINE) = upper(DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_NAME)\n    AND\n      ATTRIBUTE.CLUSTER_REF = (\n        SELECT\n          DEVICE_TYPE_CLUSTER.CLUSTER_REF\n        FROM\n          DEVICE_TYPE_CLUSTER\n        WHERE\n          DEVICE_TYPE_CLUSTER_ID = DEVICE_TYPE_ATTRIBUTE.DEVICE_TYPE_CLUSTER_REF\n      )\n    AND\n      ATTRIBUTE.PACKAGE_REF = ?\n  )\nWHERE\n  (\n    SELECT PACKAGE_REF\n    FROM ATTRIBUTE\n    WHERE ATTRIBUTE.ATTRIBUTE_ID = DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_REF\n  ) = ?\n  ", [packageId, packageId])];
        });
    });
}
/**
 * After loading up device type command table with the names,
 * this method links the refererence to actual command reference.
 *
 * @param {*} db
 * @returns promise of completion
 */
function updateCommandReferencesForDeviceTypeReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE\n  DEVICE_TYPE_COMMAND\nSET\n  COMMAND_REF =\n  ( SELECT\n      COMMAND.COMMAND_ID\n    FROM\n      COMMAND\n    WHERE\n      upper(COMMAND.NAME) = upper(DEVICE_TYPE_COMMAND.COMMAND_NAME)\n    AND\n      COMMAND.CLUSTER_REF =\n      ( SELECT\n          DEVICE_TYPE_CLUSTER.CLUSTER_REF\n        FROM\n          DEVICE_TYPE_CLUSTER\n        WHERE\n          DEVICE_TYPE_CLUSTER_ID = DEVICE_TYPE_COMMAND.DEVICE_TYPE_CLUSTER_REF\n      )\n    AND\n      COMMAND.PACKAGE_REF = ?\n  )\nWHERE\n  (\n    SELECT PACKAGE_REF\n    FROM COMMAND\n    WHERE COMMAND.COMMAND_ID = DEVICE_TYPE_COMMAND.COMMAND_REF\n  ) = ?", [packageId, packageId])];
        });
    });
}
/**
 * This method returns the promise of linking the device type clusters
 * commands and attributes to the correct IDs in the cluster, attribute
 * and command tables.
 *
 * Initial load only populates the names, so once everything is loaded,
 * we have to link the foreign keys.
 *
 * @param {*} db
 * @returns promise of completed linking
 */
function updateDeviceTypeEntityReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateClusterReferencesForDeviceTypeClusters(db, packageId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateAttributeReferencesForDeviceTypeReferences(db, packageId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, updateCommandReferencesForDeviceTypeReferences(db, packageId)];
            }
        });
    });
}
// exports
exports.selectClusterBitmaps = selectClusterBitmaps;
exports.selectAllBitmapFields = selectAllBitmapFields;
exports.selectAllBitmapFieldsById = selectAllBitmapFieldsById;
exports.selectAllDomains = selectAllDomains;
exports.selectDomainById = selectDomainById;
exports.selectAllStructsWithItemCount = selectAllStructsWithItemCount;
exports.selectAllStructsWithItems = selectAllStructsWithItems;
exports.selectClusterStructsWithItems = selectClusterStructsWithItems;
exports.selectAllStructItemsById = selectAllStructItemsById;
exports.selectAllStructItemsByStructName = selectAllStructItemsByStructName;
exports.selectAllClusters = selectAllClusters;
exports.selectClusterById = selectClusterById;
exports.selectClusterByCode = selectClusterByCode;
exports.selectAllDeviceTypes = selectAllDeviceTypes;
exports.selectDeviceTypeById = selectDeviceTypeById;
exports.selectDeviceTypeByCodeAndName = selectDeviceTypeByCodeAndName;
exports.selectAttributesByClusterIdAndSideIncludingGlobal =
    selectAttributesByClusterIdAndSideIncludingGlobal;
exports.selectAttributesByClusterIdIncludingGlobal =
    selectAttributesByClusterIdIncludingGlobal;
exports.selectAttributesByClusterCodeAndManufacturerCode =
    selectAttributesByClusterCodeAndManufacturerCode;
exports.selectAttributeById = selectAttributeById;
exports.selectAttributeByAttributeIdAndClusterRef =
    selectAttributeByAttributeIdAndClusterRef;
exports.selectAllAttributes = selectAllAttributes;
exports.selectAllAttributesBySide = selectAllAttributesBySide;
exports.selectEndpointTypeClustersByEndpointTypeId =
    selectEndpointTypeClustersByEndpointTypeId;
exports.selectEndpointTypeAttributesByEndpointId =
    selectEndpointTypeAttributesByEndpointId;
exports.selectEndpointTypeAttribute = selectEndpointTypeAttribute;
exports.selectEndpointTypeCommandsByEndpointId =
    selectEndpointTypeCommandsByEndpointId;
exports.selectDeviceTypeClustersByDeviceTypeRef =
    selectDeviceTypeClustersByDeviceTypeRef;
exports.selectDeviceTypeClusterByDeviceTypeClusterId =
    selectDeviceTypeClusterByDeviceTypeClusterId;
exports.selectDeviceTypeAttributesByDeviceTypeRef =
    selectDeviceTypeAttributesByDeviceTypeRef;
exports.selectDeviceTypeCommandsByDeviceTypeRef =
    selectDeviceTypeCommandsByDeviceTypeRef;
exports.updateDeviceTypeEntityReferences = updateDeviceTypeEntityReferences;
exports.selectEnumClusters = selectEnumClusters;
exports.selectStructClusters = selectStructClusters;
exports.selectBitmapClusters = selectBitmapClusters;
// Forwarded exports so we don't break API.
exports.selectAllAtomics = queryAtomic.selectAllAtomics;
exports.selectAtomicSizeFromType = queryAtomic.selectAtomicSizeFromType;
exports.selectAtomicType = queryAtomic.selectAtomicType;
exports.selectAtomicById = queryAtomic.selectAtomicById;
exports.selectAllEnums = queryEnum.selectAllEnums;
exports.selectClusterEnums = queryEnum.selectClusterEnums;
exports.selectAllEnumItemsById = queryEnum.selectAllEnumItemsById;
exports.selectAllEnumItems = queryEnum.selectAllEnumItems;
exports.selectEnumById = queryEnum.selectEnumById;
exports.selectEnumByName = queryEnum.selectEnumByName;
exports.selectStructById = queryStruct.selectStructById;
exports.selectStructByName = queryStruct.selectStructByName;
exports.selectBitmapById = queryBitmap.selectBitmapById;
exports.selectAllBitmaps = queryBitmap.selectAllBitmaps;
exports.selectBitmapByName = queryBitmap.selectBitmapByName;
//# sourceMappingURL=query-zcl.js.map