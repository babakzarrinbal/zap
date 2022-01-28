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
 * This module provides queries related to packages.
 *
 * @module DB API: package-based queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
var dbEnum = require('../src-shared/db-enum.js');
/**
 * Checks if the package with a given path exists and executes appropriate action.
 * Returns the promise that resolves the the package or null if nothing was found.
 *
 * @export
 * @param {*} db
 * @param {*} path Path of a file to check.
 */
function getPackageByPathAndParent(db, path, parentId, isCustom) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT PACKAGE_ID, PATH, TYPE, CRC, VERSION FROM PACKAGE WHERE PATH = ? AND ' +
                    (isCustom ? 'PARENT_PACKAGE_REF IS NULL' : '(PARENT_PACKAGE_REF = ?)'), isCustom ? [path] : [path, parentId])
                    .then(dbMapping.map.package)];
        });
    });
}
/**
 * Get packages that have a given parent.
 *
 * @param {*} db
 * @param {*} parentId
 * @returns promise that resolves into an array of packages.
 */
function getPackageByParent(db, parentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT PACKAGE_ID, PATH, TYPE, CRC, VERSION FROM PACKAGE WHERE PARENT_PACKAGE_REF = ?', [parentId])
                    .then(function (rows) { return rows.map(dbMapping.map.package); })];
        });
    });
}
/**
 * Returns the package by path and type.
 *
 * @param {*} db
 * @param {*} path
 * @param {*} type
 * @returns Promise of a query.
 */
function getPackageByPathAndType(db, path, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT PACKAGE_ID, PATH, TYPE, CRC, VERSION FROM PACKAGE WHERE PATH = ? AND TYPE = ?', [path, type])
                    .then(dbMapping.map.package)];
        });
    });
}
/**
 * Returns the package ID by path and type and version.
 *
 * @param {*} db
 * @param {*} path
 * @param {*} type
 * @param {*} version
 * @returns Promise of a query.
 */
function getPackageIdByPathAndTypeAndVersion(db, path, type, version) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT PACKAGE_ID FROM PACKAGE WHERE PATH = ? AND TYPE = ? AND VERSION = ?', [path, type, version])
                    .then(function (row) {
                    if (row == null)
                        return null;
                    else
                        return row.PACKAGE_ID;
                })];
        });
    });
}
/**
 * Returns packages of a given type.
 *
 * @param {*} db
 * @param {*} type
 * @returns A promise that resolves into the rows array of packages.
 */
function getPackagesByType(db, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT PACKAGE_ID, PATH, TYPE, CRC, VERSION FROM PACKAGE WHERE TYPE = ?', [type])
                    .then(function (rows) { return rows.map(dbMapping.map.package); })];
        });
    });
}
/**
 * Returns packages of a given type and parent.
 *
 * @param {*} db
 * @param {*} type
 * @returns A promise that resolves into the rows array of packages.
 */
function getPackagesByParentAndType(db, parentId, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT PACKAGE_ID, PATH, TYPE, CRC, VERSION FROM PACKAGE WHERE TYPE = ? AND PARENT_PACKAGE_REF = ?', [type, parentId])
                    .then(function (rows) { return rows.map(dbMapping.map.package); })];
        });
    });
}
/**
 * Checks if the package with a given path exists and executes appropriate action.
 * Returns the promise that resolves the the package or null if nothing was found.
 *
 * @export
 * @param {*} db
 * @param {*} path Path of a file to check.
 */
function getPackageByPackageId(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, 'SELECT PACKAGE_ID, PARENT_PACKAGE_REF, PATH, TYPE, CRC, VERSION FROM PACKAGE WHERE PACKAGE_ID = ?', [packageId])
                    .then(dbMapping.map.package)];
        });
    });
}
/**
 * Resolves with a CRC or null for a given path.
 *
 * @export
 * @param {*} db
 * @param {*} path
 * @returns Promise resolving with a CRC or null.
 */
function getPathCrc(db, path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbGet(db, 'SELECT CRC FROM PACKAGE WHERE PATH = ?', [path]).then(function (row) {
                    return new Promise(function (resolve, reject) {
                        if (row == null) {
                            resolve(null);
                        }
                        else {
                            resolve(row.CRC);
                        }
                    });
                })];
        });
    });
}
/**
 * Updates the version inside the package.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} version
 * @returns A promise of an updated version.
 */
function updateVersion(db, packageId, version) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, 'UPDATE PACKAGE SET VERSION = ? WHERE PACKAGE_ID = ?', [version, packageId])];
        });
    });
}
/**
 * Inserts a given path CRC type combination into the package table.
 *
 * @param {*} db
 * @param {*} path Path of the file.
 * @param {*} crc CRC of the file.
 * @returns Promise of an insertion.
 */
function insertPathCrc(db, path, crc, type, parentId, version) {
    if (parentId === void 0) { parentId = null; }
    if (version === void 0) { version = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, 'INSERT INTO PACKAGE ( PATH, CRC, TYPE, PARENT_PACKAGE_REF, VERSION ) VALUES (?, ?, ?, ?, ?)', [path, crc, type, parentId, version])];
        });
    });
}
/**
 * Inserts or updates a package. Resolves with a packageId.
 *
 * @param {*} db
 * @param {*} path
 * @param {*} crc
 * @param {*} type
 * @param {*} [parentId=null]
 * @returns Promise of an insert or update.
 */
function registerTopLevelPackage(db, path, crc, type, version) {
    if (version === void 0) { version = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getPackageByPathAndType(db, path, type).then(function (row) {
                    if (row == null) {
                        return dbApi.dbInsert(db, 'INSERT INTO PACKAGE ( PATH, CRC, TYPE, PARENT_PACKAGE_REF, VERSION ) VALUES (?,?,?,?,?)', [path, crc, type, null, version]);
                    }
                    else {
                        return Promise.resolve(row.id);
                    }
                })];
        });
    });
}
/**
 * Updates a CRC in the table.
 *
 * @export
 * @param {*} db
 * @param {*} path
 * @param {*} crc
 * @returns Promise of an update.
 */
function updatePathCrc(db, path, crc, parentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, 'UPDATE PACKAGE SET CRC = ? WHERE PATH = ? AND PARENT_PACKAGE_REF = ?', [path, crc, parentId])];
        });
    });
}
/**
 * Inserts a mapping between session and package.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} packageId
 * @returns Promise of an insert.
 */
function insertSessionPackage(db, sessionId, packageId, required) {
    if (required === void 0) { required = false; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, 'INSERT OR REPLACE INTO SESSION_PACKAGE (SESSION_REF, PACKAGE_REF, REQUIRED, ENABLED) VALUES (?,?,?,1)', [sessionId, packageId, required])];
        });
    });
}
/**
 * @param {*} db
 * @param {*} sessionId
 * @param {*} packageType
 */
function deleteSessionPackage(db, sessionId, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbRemove(db, "UPDATE SESSION_PACKAGE SET ENABLED = 0 WHERE SESSION_REF = ? AND PACKAGE_REF = ?", [sessionId, packageId])];
        });
    });
}
/**
 * Returns session packages of a given type.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} packageType
 * @returns Promise that resolves into array of retrieve packages.
 */
function getSessionPackagesByType(db, sessionId, packageType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT \n  PACKAGE.PACKAGE_ID,\n  PACKAGE.PATH,\n  PACKAGE.TYPE,\n  PACKAGE.CRC,\n  PACKAGE.VERSION\nFROM PACKAGE\nINNER JOIN SESSION_PACKAGE\n  ON PACKAGE.PACKAGE_ID = SESSION_PACKAGE.PACKAGE_REF\nWHERE SESSION_PACKAGE.SESSION_REF = ? \n  AND PACKAGE.TYPE = ? \n  AND SESSION_PACKAGE.ENABLED = 1", [sessionId, packageType])
                    .then(function (rows) { return rows.map(dbMapping.map.package); })];
        });
    });
}
/**
 * Returns session generation template packages.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns Promise that resolves into array of retrieve packages.
 */
function getSessionGenTemplates(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\n      SELECT \n      PACKAGE.PACKAGE_ID,\n      PACKAGE.PATH,\n      PACKAGE.TYPE,\n      PACKAGE.CRC,\n      PACKAGE.VERSION\n    FROM PACKAGE\n    WHERE \n    PACKAGE.TYPE = ? AND\n    PACKAGE.PARENT_PACKAGE_REF = \n    (SELECT \n      PACKAGE.PACKAGE_ID\n    FROM PACKAGE\n    INNER JOIN SESSION_PACKAGE\n      ON PACKAGE.PACKAGE_ID = SESSION_PACKAGE.PACKAGE_REF\n    WHERE SESSION_PACKAGE.SESSION_REF = ? \n      AND PACKAGE.TYPE = ?\n      AND SESSION_PACKAGE.ENABLED = 1)\n      ORDER BY PACKAGE.PATH ASC", [
                    dbEnum.packageType.genSingleTemplate,
                    sessionId,
                    dbEnum.packageType.genTemplatesJson,
                ])
                    .then(function (rows) { return rows.map(dbMapping.map.package); })];
        });
    });
}
/**
 * Resolves into an array of package objects that all the ZCL queries should resolve into.
 * @param {*} db
 * @param {*} sessionId
 */
function getSessionZclPackages(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var inList;
        return __generator(this, function (_a) {
            inList = "('".concat(dbEnum.packageType.zclProperties, "', '").concat(dbEnum.packageType.zclXmlStandalone, "')");
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT \n  SP.PACKAGE_REF,\n  SP.SESSION_REF,\n  SP.REQUIRED\nFROM \n  SESSION_PACKAGE AS SP\nINNER JOIN \n  PACKAGE AS P\nON \n  SP.PACKAGE_REF = P.PACKAGE_ID\nWHERE\n  SP.SESSION_REF = ? AND SP.ENABLED = 1 AND P.TYPE IN ".concat(inList, "\n"), [sessionId])
                    .then(function (rows) { return rows.map(dbMapping.map.sessionPackage); })];
        });
    });
}
/**
 * Resolves into an array of IDs that are the packageIds that all the ZCL queries should resolve into.
 * @param {*} db
 * @param {*} sessionId
 */
function getSessionZclPackageIds(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getSessionZclPackages(db, sessionId).then(function (rows) {
                    return rows.map(function (r) { return r.packageRef; });
                })];
        });
    });
}
/**
 * Returns the session package IDs.
 * @param {*} db
 * @param {*} sessionId
 * @returns The promise that resolves into an array of package IDs.
 */
function getSessionPackages(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, 'SELECT PACKAGE_REF, SESSION_REF, REQUIRED FROM SESSION_PACKAGE WHERE SESSION_REF = ? AND ENABLED = 1', [sessionId])
                    .then(function (rows) { return rows.map(dbMapping.map.sessionPackage); })];
        });
    });
}
/**
 * Returns all packages associated w/ a given sessionId
 * @param {*} db
 * @param {*} packageId
 * @param {*} sessionId
 */
function getPackageSessionPackagePairBySessionId(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "SELECT \n        PACKAGE.PACKAGE_ID, \n        PACKAGE.PATH, \n        PACKAGE.TYPE, \n        PACKAGE.CRC, \n        PACKAGE.VERSION, \n        PACKAGE.PARENT_PACKAGE_REF,\n        SESSION_PACKAGE.PACKAGE_REF,\n        SESSION_PACKAGE.SESSION_REF,\n        SESSION_PACKAGE.REQUIRED\n       FROM \n        PACKAGE, \n        SESSION_PACKAGE \n       WHERE \n        PACKAGE.PACKAGE_ID = SESSION_PACKAGE.PACKAGE_REF \n        AND SESSION_PACKAGE.SESSION_REF = ?\n        AND SESSION_PACKAGE.ENABLED = 1", [sessionId])
                    .then(function (rows) {
                    return rows.map(function (x) {
                        return {
                            pkg: dbMapping.map.package(x),
                            sessionPackage: dbMapping.map.sessionPackage(x),
                        };
                    });
                })];
        });
    });
}
/**
 * This async function inserts an option and its values into the DB.
 *
 * @param {*} db
 * @param {*} packageId - Package Reference
 * @param {*} optionCategory - The name of the option.
 * @param {*} optionCodeLabels - The array of values associated with this option.
 */
function insertOptionsKeyValues(db, packageId, optionCategory, optionCodeLabels) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, "INSERT INTO PACKAGE_OPTION\n        (PACKAGE_REF, OPTION_CATEGORY, OPTION_CODE, OPTION_LABEL) \n       VALUES \n        (?, ?, ?, ?)\n       ON CONFLICT\n        (PACKAGE_REF, OPTION_CATEGORY, OPTION_CODE)\n       DO NOTHING", optionCodeLabels.map(function (optionValue) {
                    return [packageId, optionCategory, optionValue.code, optionValue.label];
                }))];
        });
    });
}
/**
 * This async function returns all options associated with a specific category.
 * @param {*} db
 * @param {*} packageId
 * @param {*} optionCategory
 * @returns promise to return option that matches arguments.
 */
function selectAllOptionsValues(db, packageId, optionCategory) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "SELECT OPTION_ID, PACKAGE_REF, OPTION_CATEGORY, OPTION_CODE, OPTION_LABEL FROM PACKAGE_OPTION WHERE PACKAGE_REF = ? AND OPTION_CATEGORY = ?", [packageId, optionCategory])
                    .then(function (rows) { return rows.map(dbMapping.map.options); })];
        });
    });
}
/**
 *
 * This async function returns option associated with a specific category and code.
 * @param {*} db
 * @param {*} packageId
 * @param {*} optionCategory
 * @param {*} optionCode
 * @returns promise to return option that matches arguments.
 */
function selectSpecificOptionValue(db, packageId, optionCategory, optionCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "SELECT OPTION_ID, PACKAGE_REF, OPTION_CATEGORY, OPTION_CODE, OPTION_LABEL FROM PACKAGE_OPTION WHERE PACKAGE_REF = ? AND OPTION_CATEGORY = ? AND OPTION_CODE = ?", [packageId, optionCategory, optionCode])
                    .then(dbMapping.map.options)];
        });
    });
}
/**
 * This async function returns a specific option value given an option reference.
 * @param {*} db
 * @param {*} optionDefaultId
 */
function selectOptionValueByOptionDefaultId(db, optionDefaultId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "SELECT OPTION_ID, PACKAGE_REF, OPTION_CATEGORY, OPTION_CODE, OPTION_LABEL FROM PACKAGE_OPTION WHERE OPTION_ID = ?", [optionDefaultId])
                    .then(dbMapping.map.options)];
        });
    });
}
/**
 * Returns a promise of an insertion of option value.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} optionCategory
 * @param {*} optionRef
 * @returns promise to insert option value
 */
function insertDefaultOptionValue(db, packageId, optionCategory, optionRef) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbInsert(db, 'INSERT INTO PACKAGE_OPTION_DEFAULT ( PACKAGE_REF, OPTION_CATEGORY, OPTION_REF) VALUES (?, ?, ?) ON CONFLICT DO NOTHING', [packageId, optionCategory, optionRef])];
        });
    });
}
/**
 * Returns a promise for all option values.
 * @param {*} db
 * @param {*} packageId
 */
function selectAllDefaultOptions(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "SELECT OPTION_DEFAULT_ID, PACKAGE_REF, OPTION_CATEGORY, OPTION_REF FROM PACKAGE_OPTION_DEFAULT WHERE PACKAGE_REF = ?", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.optionDefaults); })];
        });
    });
}
/**
 * Inserts an array of extension default values to a specific extension ID.
 *
 * @param {*} db
 * @param {*} packageExtensionId
 * @param {*} defaultArray Array containing objects with 'entityCode', 'parentCode', 'manufacturerCode', 'entityQualifier', 'value'
 * @returns Promise of insertion for defaults.
 */
function insertPackageExtensionDefault(db, packageExtensionId, defaultArray) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, "\nINSERT INTO PACKAGE_EXTENSION_DEFAULT\n  (PACKAGE_EXTENSION_REF, ENTITY_CODE, ENTITY_QUALIFIER, PARENT_CODE, MANUFACTURER_CODE, VALUE)\nVALUES\n  ( ?, ?, ?, ?, ?, ?)\nON CONFLICT DO NOTHING\n    ", defaultArray.map(function (d) {
                    return [
                        packageExtensionId,
                        d.entityCode,
                        d.entityQualifier,
                        d.parentCode,
                        d.manufacturerCode,
                        d.value,
                    ];
                }))];
        });
    });
}
/**
 * Returns a promise of insertion of package extension
 *
 * @param {*} db
 * @param {*} packageId
 * @param propertyArray. Array of objects that contain property, type, configurability, label, globalDefault
 * @param defaultsArrayOfArrays For each item in propertyArray, it contains array of default rows, or null.
 */
function insertPackageExtension(db, packageId, entity, propertyArray, defaultsArrayOfArrays) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbMultiInsert(db, "\nINSERT INTO PACKAGE_EXTENSION \n  (PACKAGE_REF, ENTITY, PROPERTY, TYPE, CONFIGURABILITY, LABEL, GLOBAL_DEFAULT) \nVALUES \n  (?, ?, ?, ?, ?, ?, ?)\nON CONFLICT DO NOTHING", propertyArray.map(function (p) {
                    return [
                        packageId,
                        entity,
                        p.property,
                        p.type,
                        p.configurability,
                        p.label,
                        p.globalDefault,
                    ];
                }))
                    .then(function (rowIds) {
                    var promises = [];
                    // now, for each rowId in this list, we populate corresponding defaults
                    if (rowIds.length == defaultsArrayOfArrays.length) {
                        for (var i = 0; i < rowIds.length; i++) {
                            var rowId = rowIds[i];
                            var defaultsArray = defaultsArrayOfArrays[i];
                            if (defaultsArray != null) {
                                promises.push(insertPackageExtensionDefault(db, rowId, defaultsArray));
                            }
                        }
                    }
                    return Promise.all(promises);
                })];
        });
    });
}
/**
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} property
 * @param {*} entityType One of the packageExtensionEntity enums
 */
function selectPackageExtensionByPropertyAndEntity(db, packageId, property, entity) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "\nSELECT\n  PE.TYPE,\n  PE.CONFIGURABILITY,\n  PE.LABEL,\n  PE.GLOBAL_DEFAULT,\n  PED.ENTITY_CODE,\n  PED.ENTITY_QUALIFIER,\n  PED.PARENT_CODE,\n  PED.MANUFACTURER_CODE,\n  PED.VALUE\nFROM \n  PACKAGE_EXTENSION AS PE\nLEFT OUTER JOIN\n  PACKAGE_EXTENSION_DEFAULT AS PED\nON\n  PE.PACKAGE_EXTENSION_ID = PED.PACKAGE_EXTENSION_REF\nWHERE\n  PE.PACKAGE_REF = ?\n  AND PE.ENTITY = ?\n  AND PE.PROPERTY = ?\nORDER BY\n  PE.PROPERTY,\n  PED.PARENT_CODE,\n  PED.ENTITY_CODE", [packageId, entity, property])];
                case 1:
                    rows = _a.sent();
                    if (rows != null && rows.length > 0) {
                        res = {
                            type: rows[0].TYPE,
                            configurability: rows[0].CONFIGURABILITY,
                            label: rows[0].LABEL,
                            globalDefault: rows[0].GLOBAL_DEFAULT,
                            defaults: [],
                        };
                        return [2 /*return*/, rows.reduce(function (acc, x) {
                                acc.defaults.push({
                                    entityCode: x.ENTITY_CODE,
                                    parentCode: x.PARENT_CODE,
                                    manufacturerCode: x.MANUFACURER_CODE,
                                    qualifier: x.ENTITY_QUALIFIER,
                                    value: x.VALUE,
                                });
                                return acc;
                            }, res)];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Select extensions for a given entity type for a package.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} entity
 * @returns promise that resolve into an array of packageExtensions for a given entity
 */
function selectPackageExtension(db, packageId, entity) {
    return __awaiter(this, void 0, void 0, function () {
        var acc;
        return __generator(this, function (_a) {
            acc = [];
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  PE.ENTITY,\n  PE.PROPERTY,\n  PE.TYPE,\n  PE.CONFIGURABILITY,\n  PE.LABEL,\n  PE.GLOBAL_DEFAULT,\n  PED.ENTITY_CODE,\n  PED.ENTITY_QUALIFIER,\n  PED.PARENT_CODE,\n  PED.MANUFACTURER_CODE,\n  PED.VALUE\nFROM \n  PACKAGE_EXTENSION AS PE\nLEFT OUTER JOIN\n  PACKAGE_EXTENSION_DEFAULT AS PED\nON\n  PE.PACKAGE_EXTENSION_ID = PED.PACKAGE_EXTENSION_REF\nWHERE\n  PE.PACKAGE_REF = ?\n  AND PE.ENTITY = ?\nORDER BY\n  PE.PROPERTY,\n  PED.PARENT_CODE,\n  PED.ENTITY_CODE", [packageId, entity])
                    .then(function (rows) {
                    return rows.reduce(function (a, x) {
                        var newPropRequired;
                        if (a.length == 0 || a[a.length - 1].property != x.PROPERTY) {
                            newPropRequired = true;
                        }
                        else {
                            newPropRequired = false;
                        }
                        var prop;
                        if (newPropRequired) {
                            prop = dbMapping.map.packageExtension(x);
                            prop.defaults = [];
                            a.push(prop);
                        }
                        else {
                            prop = a[a.length - 1];
                        }
                        prop.defaults.push(dbMapping.map.packageExtensionDefault(x));
                        return a;
                    }, acc);
                })];
        });
    });
}
// exports
exports.getPackageByPathAndParent = getPackageByPathAndParent;
exports.getPackageByPackageId = getPackageByPackageId;
exports.getPackagesByType = getPackagesByType;
exports.getPackageByParent = getPackageByParent;
exports.getPackageIdByPathAndTypeAndVersion =
    getPackageIdByPathAndTypeAndVersion;
exports.getPackageSessionPackagePairBySessionId =
    getPackageSessionPackagePairBySessionId;
exports.getPathCrc = getPathCrc;
exports.insertPathCrc = insertPathCrc;
exports.updatePathCrc = updatePathCrc;
exports.registerTopLevelPackage = registerTopLevelPackage;
exports.updateVersion = updateVersion;
exports.insertSessionPackage = insertSessionPackage;
exports.getSessionPackages = getSessionPackages;
exports.insertOptionsKeyValues = insertOptionsKeyValues;
exports.selectAllOptionsValues = selectAllOptionsValues;
exports.selectSpecificOptionValue = selectSpecificOptionValue;
exports.insertDefaultOptionValue = insertDefaultOptionValue;
exports.getSessionPackagesByType = getSessionPackagesByType;
exports.getSessionGenTemplates = getSessionGenTemplates;
exports.selectAllDefaultOptions = selectAllDefaultOptions;
exports.selectOptionValueByOptionDefaultId = selectOptionValueByOptionDefaultId;
exports.getPackagesByParentAndType = getPackagesByParentAndType;
exports.getSessionZclPackages = getSessionZclPackages;
exports.getSessionZclPackageIds = getSessionZclPackageIds;
exports.insertPackageExtension = insertPackageExtension;
exports.selectPackageExtension = selectPackageExtension;
exports.selectPackageExtensionByPropertyAndEntity =
    selectPackageExtensionByPropertyAndEntity;
exports.deleteSessionPackage = deleteSessionPackage;
//# sourceMappingURL=query-package.js.map