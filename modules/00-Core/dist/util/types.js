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
var dbEnum = require('../src-shared/db-enum.js');
var bin = require('./bin');
var env = require('./env');
/**
 * @module JS API: type related utilities
 */
/**
 * This function resolves with the size of a given type.
 * -1 means that this size is variable.
 *
 * @param {*} db
 * @param {*} zclPackageId
 * @param {*} type
 */
function typeSize(db, zclPackageId, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, queryZcl.selectAtomicSizeFromType(db, zclPackageId, type)];
        });
    });
}
/**
 * Returns the size of a real attribute, taking type size and defaults
 * into consideration, so that strings are properly sized.
 *
 * @param {*} db
 * @param {*} zclPackageId
 * @param {*} at
 * @param {*} [defaultValue=null]
 * @returns Promise that resolves into the size of the attribute.
 */
function typeSizeAttribute(db, zclPackageId, at, defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    return __awaiter(this, void 0, void 0, function () {
        var sizeType, size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (at.typeInfo) {
                        if (!at.typeInfo.atomicType) {
                            if (at.storage != dbEnum.storageOption.external) {
                                throw new Error("ERROR: Unknown size for non-external attribute: ".concat(at.label, " / ").concat(at.code));
                            }
                            return [2 /*return*/, 0];
                        }
                        sizeType = at.typeInfo.atomicType;
                    }
                    else {
                        sizeType = at.type;
                    }
                    return [4 /*yield*/, queryZcl.selectAtomicSizeFromType(db, zclPackageId, sizeType)];
                case 1:
                    size = _a.sent();
                    if (size) {
                        return [2 /*return*/, size];
                    }
                    else if (at.maxLength != null) {
                        return [2 /*return*/, at.maxLength];
                    }
                    else if (at.defaultValue) {
                        return [2 /*return*/, at.defaultValue.length + 1];
                    }
                    else {
                        if (defaultValue != null) {
                            return [2 /*return*/, defaultValue];
                        }
                        else {
                            throw new Error("ERROR: Unknown size for attribute: ".concat(at.label, " / ").concat(at.code));
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * If the type is more than 2 bytes long, then this method creates
 * the default byte array.
 *
 * @param {*} size Size of bytes generated.
 * @param {*} type Type of the object.
 * @param {*} value Default value.
 * @returns string which is a C-formatted byte array.
 */
function longTypeDefaultValue(size, type, value) {
    var v;
    if (value == null || value.length == 0) {
        v = '0x00, '.repeat(size);
    }
    else if (isNaN(value)) {
        if (isOneBytePrefixedString(type)) {
            v = bin.stringToOneByteLengthPrefixCBytes(value, size).content;
        }
        else if (isTwoBytePrefixedString(type)) {
            v = bin.stringToTwoByteLengthPrefixCBytes(value, size).content;
        }
        else {
            v = bin.hexToCBytes(bin.stringToHex(value));
        }
    }
    else {
        // First strip off the 0x.
        if (value.startsWith('0x') || value.startsWith('0X'))
            value = value.substring(2);
        // Now pad the zeroes to the required size
        if (size > 0) {
            while (value.length / 2 < size) {
                value = '0' + value;
            }
        }
        v = bin.hexToCBytes(value) + ', ';
    }
    return v;
}
/**
 * Conversion to a CLI type. THis is here temporarily until we come up
 * with a proper type engine.
 *
 * @param {*} str
 * @returns converted type
 */
function convertToCliType(str) {
    str = str.trim();
    if (str.toLowerCase().endsWith('u')) {
        str = str.substring(0, str.length - 1);
        str = 'u' + str;
    }
    else if (str.toLowerCase().startsWith('int') &&
        str.toLowerCase().endsWith('s')) {
        str = str.substring(0, str.length - 1);
    }
    else if (str.toLowerCase().endsWith('char_string')) {
        str = 'string';
    }
    else if (str.toLowerCase().startsWith('bitmap')) {
        str = str.toLowerCase().replace('bitmap', 'uint');
    }
    else if (str.toLowerCase().startsWith('enum')) {
        str = str.toLowerCase().replace('enum', 'uint');
    }
    else {
        env.logInfo('Cli type not found: ' + str);
    }
    return str;
}
/**
 * Returns true if a given ZCL type is a string type.
 * @param {*} type
 * @returns true if type is string, false otherwise
 */
function isString(type) {
    switch (type.toUpperCase()) {
        case 'CHAR_STRING':
        case 'OCTET_STRING':
        case 'LONG_CHAR_STRING':
        case 'LONG_OCTET_STRING':
            return true;
        default:
            return false;
    }
}
/**
 * Returns true if a given ZCL type is a float type.
 * @param {*} type
 * @returns true if type is float, false otherwise
 */
function isFloat(type) {
    switch (type) {
        case 'FLOAT_SEMI':
        case 'FLOAT_SINGLE':
        case 'FLOAT_DOUBLE':
            return true;
        default:
            return false;
    }
}
/**
 * Returns true if a given ZCL type is a signed integer.
 * @param {*} type
 * @returns true if type is signed integer, false otherwise
 */
function isSignedInteger(type) {
    switch (type) {
        case 'int8s':
        case 'int16s':
        case 'int24s':
        case 'int32s':
        case 'int40s':
        case 'int48s':
        case 'int56s':
        case 'int64s':
            return true;
        default:
            return false;
    }
}
/**
 * Checks if type is a one-byte lengh string.
 *
 * @param {*} type
 * @returns true if the said type is a string prefixed by one byte length
 */
function isOneBytePrefixedString(type) {
    type = type.toLowerCase();
    return type == 'char_string' || type == 'octet_string';
}
/**
 * Checks if type is a two-byte lengh string.
 *
 * @param {*} type
 * @returns true if the said type is a string prefixed by two byte length
 */
function isTwoBytePrefixedString(type) {
    type = type.toLowerCase();
    return type == 'long_char_string' || type == 'long_octet_string';
}
exports.typeSize = typeSize;
exports.typeSizeAttribute = typeSizeAttribute;
exports.longTypeDefaultValue = longTypeDefaultValue;
exports.isOneBytePrefixedString = isOneBytePrefixedString;
exports.isTwoBytePrefixedString = isTwoBytePrefixedString;
exports.convertToCliType = convertToCliType;
exports.isString = isString;
exports.isFloat = isFloat;
exports.isSignedInteger = isSignedInteger;
//# sourceMappingURL=types.js.map