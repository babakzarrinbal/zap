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
var queryZcl = require('../db/query-zcl.js');
var queryPackage = require('../db/query-package.js');
var templateUtil = require('./template-util.js');
var bin = require('../util/bin');
var types = require('../util/types.js');
var string = require('../util/string');
var _ = require('lodash');
var dbEnum = require('../src-shared/db-enum.js');
/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: C formatting helpers
 */
/**
 * Given a hex number, it prints the offset, which is the index of the first non-zero bit.
 * @param {*} hex
 */
function asOffset(number) {
    var num = parseInt(number);
    return bin.bitOffset(bin.hexToBinary(num.toString(16)));
}
/**
 * Takes a label, and delimits is on camelcasing.
 * For example:
 *    VerySimpleLabel will turn into VERY_SIMPLE_LABEL
 * @param {*} label
 */
function asDelimitedMacro(label) {
    return string.toSnakeCaseAllCaps(label);
}
/**
 * Formats label as a C hex constant.
 * If value starts as 0x or 0X it is already treated as hex,
 * otherwise it is assumed decimal and converted to hex.
 *
 * @param {*} label
 * @returns Label formatted as C hex constant.
 */
function asHex(rawValue, padding, nullValue) {
    if (rawValue == null) {
        if (nullValue != null && _.isString(nullValue))
            return nullValue;
        else
            rawValue = 0;
    }
    var value = rawValue.toString();
    var ret = value.trim();
    if (ret.startsWith('0x') || ret.startsWith('0X')) {
        return "0x".concat(value.slice(2).toUpperCase());
    }
    else {
        var val = parseInt(value);
        return "0x".concat(val.toString(16).padStart(padding, '0').toUpperCase());
    }
}
/**
 * Converts the actual zcl type into an underlying usable C type.
 * @param {*} value
 */
function asUnderlyingType(value) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, atomic, bitmap, struct, opt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, queryZcl.selectAtomicType(this.global.db, packageId, value)];
                case 2:
                    atomic = _a.sent();
                    if (!(atomic == null)) return [3 /*break*/, 5];
                    return [4 /*yield*/, queryZcl.selectBitmapByName(this.global.db, this.global.zclPackageId, value)];
                case 3:
                    bitmap = _a.sent();
                    if (!(bitmap != null)) return [3 /*break*/, 5];
                    return [4 /*yield*/, queryZcl.selectAtomicType(this.global.db, this.global.zclPackageId, bitmap.type)];
                case 4:
                    atomic = _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, queryZcl.selectStructByName(this.global.db, value, this.global.zclPackageId)];
                case 6:
                    struct = _a.sent();
                    if (!(atomic == null)) return [3 /*break*/, 7];
                    return [2 /*return*/, this.global.overridable.nonAtomicType({
                            name: value,
                            isStruct: struct != null,
                        })];
                case 7: return [4 /*yield*/, queryPackage.selectSpecificOptionValue(this.global.db, this.global.genTemplatePackageId, 'types', atomic.name)];
                case 8:
                    opt = _a.sent();
                    if (opt == null)
                        return [2 /*return*/, this.global.overridable.atomicType(atomic)];
                    else
                        return [2 /*return*/, opt.optionLabel];
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * Formats label as a C type.
 *
 * @param {*} label
 * @returns Label formatted as C type.
 */
function asType(value) {
    return value.replace(/[ |-]/g, '');
}
/**
 * Formats label as a C symbol.
 *
 * @param {*} label
 * @returns Label formatted as C symbol.
 */
function asSymbol(value) {
    return value;
}
// Formats the default value into an attribute of a given length
function formatValue(value, length, type) {
    var out = '';
    if (length < 0) {
        out = out.concat(value.length);
        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i);
            out = out.concat(",'").concat(ch).concat("'");
        }
    }
    else {
        var val = 0;
        if (value.startsWith('0x') || value.startsWith('0X')) {
            val = parseInt(value.slice(2), 16);
        }
        else {
            val = parseInt(value);
        }
        if (Number.isNaN(val)) {
            val = 0;
        }
        switch (length) {
            case 1:
                out = out.concat(bin.hexToCBytes(bin.int8ToHex(val)));
                break;
            case 2:
                out = out.concat(bin.hexToCBytes(bin.int16ToHex(val)));
                break;
            case 4:
                out = out.concat(bin.hexToCBytes(bin.int32ToHex(val)));
                break;
        }
    }
    return out;
}
/**
 * Given a default value of attribute, this method converts it into bytes
 *
 * @param {*} value
 */
function asBytes(value, type) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (type == null) {
                return [2 /*return*/, value];
            }
            else {
                return [2 /*return*/, templateUtil
                        .ensureZclPackageId(this)
                        .then(function (packageId) {
                        return queryZcl.selectAtomicSizeFromType(_this.global.db, packageId, type);
                    })
                        .then(function (x) {
                        if (x == null) {
                            if (value == null) {
                                return '0x00';
                            }
                            else {
                                return bin.hexToCBytes(bin.stringToHex(value));
                            }
                        }
                        else {
                            return formatValue(value, x, type);
                        }
                    })];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Given a string convert it into a camelCased string
 *
 * @param {*} str
 * @returns a spaced out string in lowercase
 */
function asCamelCased(label, firstLower) {
    if (firstLower === void 0) { firstLower = true; }
    return string.toCamelCase(label, firstLower);
}
/**
 * returns a string after converting ':' and '-' into '_'
 * @param {*} label
 */
function cleanseLabel(label) {
    return string.toCleanSymbol(label);
}
/**
 * Given a camel case string, convert it into one with underscore and lowercase
 *
 * @param {*} str
 * @returns String in lowercase with underscores
 */
function asUnderscoreLowercase(str) {
    return string.toSnakeCase(str);
}
/**
 * returns a string after converting ':' and ' ' into '-'
 * @param {*} label
 */
function cleanseLabelAsKebabCase(label) {
    return string.toCleanSymbolAsKebabCase(label);
}
/**
 * Given a camel case string convert it into one with space and lowercase
 *
 * @param {*} str
 * @returns a spaced out string in lowercase
 */
function asSpacedLowercase(str) {
    return string.toSpacedLowercase(str);
}
/**
 * Given a camel case string convert it into one with underscore and uppercase
 *
 * @param {*} str
 * @returns String in uppercase with underscores
 */
function asUnderscoreUppercase(str) {
    var label = str.replace(/\.?([A-Z][a-z])/g, function (x, y) {
        return '_' + y;
    });
    label = cleanseLabel(label);
    if (label.startsWith('_')) {
        label = label.substring(1);
    }
    return label.toUpperCase();
}
/**
 * Returns the cli type representation.
 *
 * @param str
 * @returns the type as represented for CLI.
 */
function asCliType(str) {
    return 'SL_CLI_ARG_' + types.convertToCliType(str).toUpperCase();
}
/**
 *
 * @param str
 * @param optional
 * @param isSigned
 * Return the data type of zcl cli
 */
function as_zcl_cli_type(str, optional, isSigned) {
    var zclType = '';
    switch (str) {
        case 1:
            zclType = 'SL_CLI_ARG_' + (isSigned ? '' : 'U') + 'INT8';
            break;
        case 2:
            zclType = 'SL_CLI_ARG_' + (isSigned ? '' : 'U') + 'INT16';
            break;
        case 3:
        case 4:
            zclType = 'SL_CLI_ARG_' + (isSigned ? '' : 'U') + 'INT32';
            break;
        case dbEnum.zclType.string:
        default:
            zclType = 'SL_CLI_ARG_STRING';
            break;
    }
    if (optional) {
        zclType += 'OPT';
    }
    return zclType;
}
/**
 * Returns the type of bitmap
 *
 * @param {*} db
 * @param {*} bitmap_name
 * @param {*} packageId
 */
function dataTypeForBitmap(db, bitmap_name, packageId) {
    return queryZcl.selectBitmapByName(db, packageId, bitmap_name).then(function (bm) {
        if (bm == null) {
            return "!!Invalid bitmap: ".concat(bitmap_name);
        }
        else {
            return asCliType(bm.type);
        }
    });
}
/**
 * Returns the type of enum
 *
 * @param {*} db
 * @param {*} enum_name
 * @param {*} packageId
 */
function dataTypeForEnum(db, enum_name, packageId) {
    return queryZcl.selectEnumByName(db, enum_name, packageId).then(function (e) {
        if (e == null) {
            return "!!Invalid enum: ".concat(enum_name);
        }
        else {
            return asCliType(e.type);
        }
    });
}
/**
 * Returns the number by adding 1 to it.
 * @param {*} number
 */
function addOne(number) {
    return number + 1;
}
/**
 * Return true if number1 is greater than number2
 * @param num1
 * @param num2
 * @returns true if num1 is greater than num2 else returns false
 */
function is_number_greater_than(num1, num2) {
    return num1 > num2;
}
var dep = templateUtil.deprecatedHelper;
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.as_hex = asHex;
exports.asHex = dep(asHex, { to: 'as_hex' });
exports.as_type = asType;
exports.asType = dep(asType, { to: 'as_type' });
exports.as_symbol = asSymbol;
exports.asSymbol = dep(asSymbol, { to: 'as_symbol' });
exports.as_bytes = asBytes;
exports.asBytes = dep(asBytes, { to: 'as_bytes' });
exports.as_delimited_macro = asDelimitedMacro;
exports.asDelimitedMacro = dep(asDelimitedMacro, { to: 'as_delimited_macro' });
exports.as_offset = asOffset;
exports.asOffset = dep(asOffset, { to: 'as_offset' });
exports.as_underlying_type = asUnderlyingType;
exports.asUnderlyingType = dep(asUnderlyingType, { to: 'as_underlying_type' });
exports.as_camel_cased = asCamelCased;
exports.asCamelCased = dep(asCamelCased, { to: 'as_camel_cased' });
exports.cleanse_label = cleanseLabel;
exports.cleanseLabel = dep(cleanseLabel, { to: 'cleanse_label' });
exports.as_snake_case = asUnderscoreLowercase;
exports.as_underscore_lowercase = asUnderscoreLowercase;
exports.asUnderscoreLowercase = dep(asUnderscoreLowercase, {
    to: 'as_underscore_lowercase',
});
exports.as_spaced_lowercase = asSpacedLowercase;
exports.asSpacedLowercase = dep(asSpacedLowercase, {
    to: 'as_spaced_lowercase',
});
exports.as_underscore_uppercase = asUnderscoreUppercase;
exports.asUnderscoreUppercase = dep(asUnderscoreUppercase, {
    to: 'as_underscore_uppercase',
});
exports.as_cli_type = asCliType;
exports.asCliType = dep(asCliType, { to: 'as_cli_type' });
exports.data_type_for_bitmap = dataTypeForBitmap;
exports.dataTypeForBitmap = dep(dataTypeForBitmap, {
    to: 'data_type_for_bitmap',
});
exports.data_type_for_enum = dataTypeForEnum;
exports.dataTypeForEnum = dep(dataTypeForEnum, { to: 'data_type_for_enum' });
exports.add_one = addOne;
exports.addOne = dep(addOne, { to: 'add_one' });
exports.cleanse_label_as_kebab_case = cleanseLabelAsKebabCase;
exports.cleanseLabelAsKebabCase = dep(cleanseLabelAsKebabCase, {
    to: 'cleanse_label_as_kebab_case',
});
exports.format_value = formatValue;
exports.formatValue = dep(formatValue, { to: 'format_value' });
exports.as_zcl_cli_type = as_zcl_cli_type;
exports.is_number_greater_than = is_number_greater_than;
//# sourceMappingURL=helper-c.js.map