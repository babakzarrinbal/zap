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
/**
 * This module provides the API to access various zcl utilities.
 *
 * @module REST API: various zcl utilities
 */
var toposort = require('toposort');
var queryZcl = require('../db/query-zcl');
var dbEnum = require('../src-shared/db-enum');
var env = require('./env');
var types = require('./types');
/**
 * Comparator for sorting clusters.
 *
 * @param {*} a
 * @param {*} b
 * @returns -1, 0 or 1
 */
function clusterComparator(a, b) {
    if (a.code < b.code)
        return -1;
    if (a.code > b.code)
        return 1;
    if (a.side < b.side)
        return -1;
    if (a.side > b.side)
        return 1;
    return 0;
}
/**
 * Comparator for sorting attribute.
 *
 * @param {*} a
 * @param {*} b
 * @returns -1, 0 or 1
 */
function attributeComparator(a, b) {
    if (a.hexCode < b.hexCode)
        return -1;
    if (a.hexCode > b.hexCode)
        return 1;
    return 0;
}
/**
 * Comparator for sorting commands.
 *
 * @param {*} a
 * @param {*} b
 * @returns -1, 0 or 1
 */
function commandComparator(a, b) {
    if (a.manufacturerCode < b.manufacturerCode)
        return -1;
    if (a.manufacturerCode > b.manufacturerCode)
        return 1;
    if (a.hexCode < b.hexCode)
        return -1;
    if (a.hexCode > b.hexCode)
        return 1;
    return 0;
}
function findStructByName(structs, name) {
    var e_1, _a;
    try {
        for (var structs_1 = __values(structs), structs_1_1 = structs_1.next(); !structs_1_1.done; structs_1_1 = structs_1.next()) {
            var s = structs_1_1.value;
            if (s.name == name) {
                return s;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (structs_1_1 && !structs_1_1.done && (_a = structs_1.return)) _a.call(structs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
}
/**
 * This method retrieves a bunch of structs sorted
 * alphabetically. It's expected to resort the structs into a list
 * where they are sorted in a way where dependency is observed.
 *
 * It uses the DFS-based topological sort algorithm.
 *
 * @param {*} structs
 * @returns sorted structs according to topological search.
 */
function sortStructsByDependency(structs) {
    return __awaiter(this, void 0, void 0, function () {
        var allStructNames, edges, sortedEdges, finalSort;
        return __generator(this, function (_a) {
            allStructNames = structs.map(function (s) { return s.name; });
            edges = [];
            // Add edges
            structs.forEach(function (s) {
                s.items.forEach(function (i) {
                    var type = i.type;
                    if (allStructNames.includes(type)) {
                        edges.push([s.name, type]);
                    }
                });
            });
            sortedEdges = toposort(edges).reverse();
            finalSort = [];
            sortedEdges.forEach(function (s) {
                finalSort.push(findStructByName(structs, s));
            });
            allStructNames.forEach(function (s) {
                if (!sortedEdges.includes(s))
                    finalSort.push(findStructByName(structs, s));
            });
            return [2 /*return*/, finalSort];
        });
    });
}
/**
 * This function calculates the number of bytes in the data type and based on
 * that returns the option specified in the template.
 * for eg: Given that options are as follows:
 * options.hash.array="b"
 * options.hash.one_byte="u"
 * options.hash.two_byte="v"
 * options.hash.three_byte="x"
 * options.hash.four_byte="w"
 * options.hash.short_string="s"
 * options.hash.long_string="l"
 * options.hash.default="b"
 *
 * calculateBytes("char_string", options)
 * will return 's'
 *
 * @param {*} res
 * @param {*} options
 */
function calculateBytes(res, options, db, packageId, isStructType) {
    if (!isStructType) {
        return calculateBytesForTypes(res, options, db, packageId);
    }
    else {
        return calculateBytesForStructs(res, options, db, packageId);
    }
}
/**
 *
 * @param options
 * @param optionsKey
 * @param defaultValue
 * Given the values determine to give the user defined value or the calculated value
 */
function optionsHashOrDefault(options, optionsKey, defaultValue) {
    if (optionsKey in options.hash) {
        return options.hash[optionsKey];
    }
    else {
        return defaultValue;
    }
}
function calculateBytesForTypes(res, options, db, packageId) {
    return queryZcl
        .selectAtomicSizeFromType(db, packageId, res.toLowerCase())
        .then(function (x) {
        return new Promise(function (resolve, reject) {
            var result = 0;
            switch (x) {
                case 1:
                    result = optionsHashOrDefault(options, 'one_byte', x);
                    break;
                case 2:
                    result = optionsHashOrDefault(options, 'two_byte', x);
                    break;
                case 3:
                    result = optionsHashOrDefault(options, 'three_byte', x);
                    break;
                case 4:
                    result = optionsHashOrDefault(options, 'four_byte', x);
                    break;
                case 5:
                    result = optionsHashOrDefault(options, 'five_byte', x);
                    break;
                case 6:
                    result = optionsHashOrDefault(options, 'six_byte', x);
                    break;
                case 7:
                    result = optionsHashOrDefault(options, 'seven_byte', x);
                    break;
                case 8:
                    result = optionsHashOrDefault(options, 'eight_byte', x);
                    break;
                case 9:
                    result = optionsHashOrDefault(options, 'nine_byte', x);
                    break;
                case 10:
                    result = optionsHashOrDefault(options, 'ten_byte', x);
                    break;
                case 11:
                    result = optionsHashOrDefault(options, 'eleven_byte', x);
                    break;
                case 12:
                    result = optionsHashOrDefault(options, 'twelve_byte', x);
                    break;
                case 13:
                    result = optionsHashOrDefault(options, 'thirteen_byte', x);
                    break;
                case 14:
                    result = optionsHashOrDefault(options, 'fourteen_byte', x);
                    break;
                case 15:
                    result = optionsHashOrDefault(options, 'fifteen_byte', x);
                    break;
                case 16:
                    result = optionsHashOrDefault(options, 'sixteen_byte', x);
                    break;
                default:
                    if (res != null &&
                        res.includes('long') &&
                        res.includes(dbEnum.zclType.string)) {
                        result = optionsHashOrDefault(options, 'long_string', 'l');
                    }
                    else if (res != null &&
                        !res.includes('long') &&
                        res.includes(dbEnum.zclType.string)) {
                        result = optionsHashOrDefault(options, 'short_string', 's');
                    }
                    else if ('default' in options.hash) {
                        result = options.hash.default;
                    }
                    break;
            }
            resolve(result);
        });
    })
        .catch(function (err) {
        env.logError('Could not find size of the given type in' +
            ' calculateBytesForTypes: ' +
            err);
    });
}
function calculateBytesForStructs(res, options, db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ('struct' in options.hash) {
                return [2 /*return*/, options.hash.struct];
            }
            else {
                return [2 /*return*/, queryZcl
                        .selectAllStructItemsByStructName(db, res, packageId)
                        .then(function (items) {
                        var promises = [];
                        items.forEach(function (item) {
                            return promises.push(dataTypeCharacterFormatter(db, packageId, item, options, type));
                        });
                        return Promise.all(promises);
                    })
                        .then(function (resolvedPromises) {
                        return resolvedPromises.reduce(function (acc, cur) { return acc + cur; }, 0);
                    })
                        .catch(function (err) {
                        env.logError('Could not find size of struct in' +
                            ' calculate_size_for_structs: ' +
                            err);
                        return 0;
                    })];
            }
            return [2 /*return*/];
        });
    });
}
/**
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} type
 * @param {*} options
 * @param {*} resType
 * Character associated to a zcl/c data type.
 */
function dataTypeCharacterFormatter(db, packageId, type, options, resType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (resType) {
                case dbEnum.zclType.array:
                    if (dbEnum.zclType.array in options.hash) {
                        return [2 /*return*/, options.hash.array];
                    }
                    else {
                        return [2 /*return*/, 'b'];
                    }
                case dbEnum.zclType.bitmap:
                    return [2 /*return*/, queryZcl
                            .selectBitmapByName(db, packageId, type)
                            .then(function (bitmap) { return queryZcl.selectAtomicType(db, packageId, bitmap.type); })
                            .then(function (res) { return calculateBytes(res.name, options, db, packageId, false); })];
                case dbEnum.zclType.enum:
                    return [2 /*return*/, queryZcl
                            .selectEnumByName(db, type, packageId)
                            .then(function (enumRec) {
                            return queryZcl.selectAtomicType(db, packageId, enumRec.type);
                        })
                            .then(function (res) { return calculateBytes(res.name, options, db, packageId, false); })];
                case dbEnum.zclType.struct:
                    if (dbEnum.zclType.struct in options.hash) {
                        return [2 /*return*/, options.hash.struct];
                    }
                    else {
                        return [2 /*return*/, calculateBytes(type, options, db, packageId, true)];
                    }
                case dbEnum.zclType.atomic:
                case dbEnum.zclType.unknown:
                default:
                    return [2 /*return*/, queryZcl
                            .selectAtomicType(db, packageId, type)
                            .then(function (atomic) {
                            if (atomic &&
                                (atomic.name == 'char_string' ||
                                    atomic.name == 'octet_string' ||
                                    atomic.name == 'long_octet_string' ||
                                    atomic.name == 'long_char_string')) {
                                return atomic.name;
                            }
                            else {
                                return type;
                            }
                        })
                            .then(function (res) { return calculateBytes(res, options, db, packageId, false); })];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Local function that checks if an enum by the name exists
 *
 * @param {*} db
 * @param {*} enum_name
 * @param {*} packageId
 * @returns Promise of content.
 */
function isEnum(db, enum_name, packageId) {
    return queryZcl
        .selectEnumByName(db, enum_name, packageId)
        .then(function (enums) { return (enums ? dbEnum.zclType.enum : dbEnum.zclType.unknown); });
}
/**
 * Local function that checks if an enum by the name exists
 *
 * @param {*} db
 * @param {*} struct_name
 * @param {*} packageId
 * @returns Promise of content.
 */
function isStruct(db, struct_name, packageId) {
    return queryZcl
        .selectStructByName(db, struct_name, packageId)
        .then(function (st) { return (st ? dbEnum.zclType.struct : dbEnum.zclType.unknown); });
}
/**
 * Local function that checks if a bitmap by the name exists
 *
 * @param {*} db
 * @param {*} bitmap_name
 * @param {*} packageId
 * @returns Promise of content.
 */
function isBitmap(db, bitmap_name, packageId) {
    return queryZcl
        .selectBitmapByName(db, packageId, bitmap_name)
        .then(function (st) { return (st ? dbEnum.zclType.bitmap : dbEnum.zclType.unknown); });
}
/**
 *
 * @param {*} fromType
 * @param {*} toType
 * @param {*} noWarning
 *
 * Type warning message. If noWarning is set to true then the warning message
 * will not be shown.
 */
function defaultMessageForTypeConversion(fromType, toType, noWarning) {
    if (!noWarning) {
        return "/* TYPE WARNING: ".concat(fromType, " defaults to */ ") + toType;
    }
    else {
        return toType;
    }
}
/**
 *
 *
 * @param {*} type
 * @param {*} options
 * @param {*} packageId
 * @param {*} db
 * @param {*} resolvedType
 * @param {*} overridable
 * @returns the data type associated with the resolvedType
 */
function dataTypeHelper(type, options, packageId, db, resolvedType, overridable) {
    switch (resolvedType) {
        case dbEnum.zclType.array:
            if ('array' in options.hash) {
                return defaultMessageForTypeConversion("".concat(type, " array"), options.hash.array, options.hash.no_warning);
            }
            else {
                return queryZcl
                    .selectAtomicType(db, packageId, dbEnum.zclType.array)
                    .then(function (atomic) { return overridable.atomicType(atomic); });
            }
        case dbEnum.zclType.bitmap:
            if ('bitmap' in options.hash) {
                return defaultMessageForTypeConversion("".concat(type), options.hash.bitmap, options.hash.no_warning);
            }
            else {
                return queryZcl
                    .selectBitmapByName(db, packageId, type)
                    .then(function (bitmap) {
                    return queryZcl.selectAtomicType(db, packageId, bitmap.type);
                })
                    .then(function (res) { return overridable.atomicType(res); });
            }
        case dbEnum.zclType.enum:
            if ('enum' in options.hash) {
                return defaultMessageForTypeConversion("".concat(type), options.hash.enum, options.hash.no_warning);
            }
            else {
                return queryZcl
                    .selectEnumByName(db, type, packageId)
                    .then(function (enumRec) {
                    return queryZcl.selectAtomicType(db, packageId, enumRec.type);
                })
                    .then(function (res) { return overridable.atomicType(res); });
            }
        case dbEnum.zclType.struct:
            if ('struct' in options.hash) {
                return defaultMessageForTypeConversion("".concat(type), options.hash.struct, options.hash.no_warning);
            }
            else {
                return type;
            }
        case dbEnum.zclType.atomic:
        case dbEnum.zclType.unknown:
        default:
            return queryZcl
                .selectAtomicType(db, packageId, type)
                .then(function (atomic) { return overridable.atomicType(atomic); });
    }
}
/**
 *
 * @param type
 * @param options
 * @param packageId
 * @param currentInstance
 *
 * Note: If the options has zclCharFormatter set to true then the function will
 * return the user defined data associated with the zcl data type and not the
 * actual data type. It can also be used to calculate the size of the data types
 *
 * This is a utility function which is called from other helper functions using ut current
 * instance. See comments in asUnderlyingZclType for usage instructions.
 */
function asUnderlyingZclTypeWithPackageId(type, options, packageId, currentInstance) {
    return Promise.all([
        new Promise(function (resolve, reject) {
            if ('isArray' in currentInstance && currentInstance.isArray)
                resolve(dbEnum.zclType.array);
            else
                resolve(dbEnum.zclType.unknown);
        }),
        isEnum(currentInstance.global.db, type, packageId),
        isStruct(currentInstance.global.db, type, packageId),
        isBitmap(currentInstance.global.db, type, packageId),
    ])
        .then(function (res) {
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < res.length; i++) {
                if (res[i] != 'unknown') {
                    resolve(res[i]);
                    return;
                }
            }
            resolve(dbEnum.zclType.unknown);
        });
    })
        .then(function (resType) {
        if (dbEnum.zclType.zclCharFormatter in options.hash) {
            return dataTypeCharacterFormatter(currentInstance.global.db, packageId, type, options, resType);
        }
        else {
            return dataTypeHelper(type, options, packageId, currentInstance.global.db, resType, currentInstance.global.overridable);
        }
    })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
}
/**
 * Returns a promise that resolves into an object containing:
 *   type:
 *   atomicType:
 * Base type for struct is a null.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} type
 */
function determineType(db, type, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        var atomic, theEnum, struct, theBitmap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectAtomicType(db, packageId, type)];
                case 1:
                    atomic = _a.sent();
                    if (atomic != null)
                        return [2 /*return*/, {
                                type: dbEnum.zclType.atomic,
                                atomicType: atomic.name,
                            }];
                    return [4 /*yield*/, queryZcl.selectEnumByName(db, type, packageId)];
                case 2:
                    theEnum = _a.sent();
                    if (theEnum != null)
                        return [2 /*return*/, {
                                type: dbEnum.zclType.enum,
                                atomicType: theEnum.type,
                            }];
                    return [4 /*yield*/, queryZcl.selectStructByName(db, type, packageId)];
                case 3:
                    struct = _a.sent();
                    if (struct != null)
                        return [2 /*return*/, {
                                type: dbEnum.zclType.struct,
                                atomicType: null,
                            }];
                    return [4 /*yield*/, queryZcl.selectBitmapByName(db, packageId, type)];
                case 4:
                    theBitmap = _a.sent();
                    if (theBitmap != null)
                        return [2 /*return*/, {
                                type: dbEnum.zclType.bitmap,
                                atomicType: theBitmap.type,
                            }];
                    return [2 /*return*/, {
                            type: dbEnum.zclType.unknown,
                            atomicType: null,
                        }];
            }
        });
    });
}
function createCommandSignature(db, packageId, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var sig, isSimple, index, _a, _b, arg, single, t, recordedType, e_2_1;
        var e_2, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sig = [];
                    isSimple = true;
                    index = 0;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    _a = __values(cmd.commandArgs), _b = _a.next();
                    _d.label = 2;
                case 2:
                    if (!!_b.done) return [3 /*break*/, 5];
                    arg = _b.value;
                    single = '';
                    return [4 /*yield*/, determineType(db, arg.type, packageId)];
                case 3:
                    t = _d.sent();
                    recordedType = void 0;
                    if (t.atomicType == null) {
                        // if it's not a last arg, we call it not simple.
                        if (index < cmd.commandArgs.length - 1) {
                            isSimple = false;
                            recordedType = 'NULL';
                        }
                        else {
                            recordedType = 'POINTER';
                        }
                    }
                    else {
                        recordedType = t.atomicType.toLowerCase();
                    }
                    arg.baseType = recordedType;
                    single += "".concat(recordedType);
                    // Deal with arrays
                    if (arg.isArray) {
                        single += '[]';
                        arg.baseType = 'ARRAY';
                        if (index < cmd.commandArgs.length - 1)
                            isSimple = false;
                    }
                    // Deal with optionality
                    arg.isOptional = false;
                    if (arg.removedIn != null ||
                        arg.introducedIn != null ||
                        arg.presentIf != null) {
                        single += '?';
                        arg.isOptional = true;
                        if (arg.presentIf != null)
                            isSimple = false;
                    }
                    sig.push(single);
                    index++;
                    _d.label = 4;
                case 4:
                    _b = _a.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_2_1 = _d.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, {
                        signature: sig.toString(),
                        isSimple: isSimple,
                    }];
            }
        });
    });
}
exports.clusterComparator = clusterComparator;
exports.attributeComparator = attributeComparator;
exports.commandComparator = commandComparator;
exports.sortStructsByDependency = sortStructsByDependency;
exports.isEnum = isEnum;
exports.isBitmap = isBitmap;
exports.isStruct = isStruct;
exports.asUnderlyingZclTypeWithPackageId = asUnderlyingZclTypeWithPackageId;
exports.determineType = determineType;
exports.dataTypeCharacterFormatter = dataTypeCharacterFormatter;
exports.calculateBytes = calculateBytes;
exports.createCommandSignature = createCommandSignature;
//# sourceMappingURL=zcl-util.js.map