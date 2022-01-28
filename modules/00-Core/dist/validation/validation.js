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
 * This module provides the APIs for validating inputs to the database, and returning flags indicating if
 * things were successful or not.
 *
 */
var queryZcl = require('../db/query-zcl.js');
var queryConfig = require('../db/query-config.js');
var queryEndpoint = require('../db/query-endpoint.js');
var types = require('../util/types.js');
function validateAttribute(db, endpointTypeId, attributeRef, clusterRef) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointAttribute, attribute;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectEndpointTypeAttribute(db, endpointTypeId, attributeRef, clusterRef)];
                case 1:
                    endpointAttribute = _a.sent();
                    return [4 /*yield*/, queryZcl.selectAttributeById(db, attributeRef)];
                case 2:
                    attribute = _a.sent();
                    return [2 /*return*/, validateSpecificAttribute(endpointAttribute, attribute)];
            }
        });
    });
}
function validateEndpoint(db, endpointId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, currentIssues, noDuplicates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryEndpoint.selectEndpoint(db, endpointId)];
                case 1:
                    endpoint = _a.sent();
                    currentIssues = validateSpecificEndpoint(endpoint);
                    return [4 /*yield*/, validateNoDuplicateEndpoints(db, endpoint.endpointId, endpoint.sessionRef)];
                case 2:
                    noDuplicates = _a.sent();
                    if (!noDuplicates) {
                        currentIssues.endpointId.push('Duplicate EndpointIds Exist');
                    }
                    return [2 /*return*/, currentIssues];
            }
        });
    });
}
function validateNoDuplicateEndpoints(db, endpointIdentifier, sessionRef) {
    return __awaiter(this, void 0, void 0, function () {
        var count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryConfig.selectCountOfEndpointsWithGivenEndpointIdentifier(db, endpointIdentifier, sessionRef)];
                case 1:
                    count = _a.sent();
                    return [2 /*return*/, count.length <= 1];
            }
        });
    });
}
function validateSpecificAttribute(endpointAttribute, attribute) {
    var defaultAttributeIssues = [];
    if (!types.isString(attribute.type)) {
        if (types.isFloat(attribute.type)) {
            if (!isValidFloat(endpointAttribute.defaultValue))
                defaultAttributeIssues.push('Invalid Float');
            //Interpreting float values
            if (!checkAttributeBoundsFloat(attribute, endpointAttribute))
                defaultAttributeIssues.push('Out of range');
        }
        else if (types.isSignedInteger(attribute.type)) {
            if (!isValidSignedNumberString(endpointAttribute.defaultValue))
                defaultAttributeIssues.push('Invalid Integer');
            if (!checkAttributeBoundsInteger(attribute, endpointAttribute))
                defaultAttributeIssues.push('Out of range');
        }
        else {
            if (!isValidNumberString(endpointAttribute.defaultValue))
                defaultAttributeIssues.push('Invalid Integer');
            if (!checkAttributeBoundsInteger(attribute, endpointAttribute))
                defaultAttributeIssues.push('Out of range');
        }
    }
    return { defaultValue: defaultAttributeIssues };
}
function validateSpecificEndpoint(endpoint) {
    var zclEndpointIdIssues = [];
    var zclNetworkIdIssues = [];
    if (!isValidNumberString(endpoint.endpointId))
        zclEndpointIdIssues.push('EndpointId is invalid number string');
    if (extractIntegerValue(endpoint.endpointId) > 0xffff ||
        extractIntegerValue(endpoint.endpointId) < 0)
        zclEndpointIdIssues.push('EndpointId is out of valid range');
    if (!isValidNumberString(endpoint.networkId))
        zclNetworkIdIssues.push('NetworkId is invalid number string');
    if (extractIntegerValue(endpoint.endpointId) == 0)
        zclEndpointIdIssues.push('0 is not a valid endpointId');
    return {
        endpointId: zclEndpointIdIssues,
        networkId: zclNetworkIdIssues,
    };
}
//This applies to both actual numbers as well as octet strings.
function isValidNumberString(value) {
    //We test to see if the number is valid in hex. Decimals numbers also pass this test
    return /^(0x)?[\dA-F]+$/i.test(value) || Number.isInteger(Number(value));
}
function isValidFloat(value) {
    return !/^0x/i.test(value) && !isNaN(Number(value));
}
function extractFloatValue(value) {
    return parseFloat(value);
}
function extractIntegerValue(value) {
    if (/^-?\d+$/.test(value)) {
        return parseInt(value);
    }
    else if (/^[0-9A-F]+$/i.test(value)) {
        return parseInt(value, 16);
    }
    else {
        return parseInt(value, 16);
    }
}
function getBoundsInteger(attribute) {
    return {
        min: extractIntegerValue(attribute.min),
        max: extractIntegerValue(attribute.max),
    };
}
function checkAttributeBoundsInteger(attribute, endpointAttribute) {
    var _a = getBoundsInteger(attribute), min = _a.min, max = _a.max;
    var defaultValue = extractIntegerValue(endpointAttribute.defaultValue);
    return checkBoundsInteger(defaultValue, min, max);
}
function checkBoundsInteger(defaultValue, min, max) {
    if (Number.isNaN(min))
        min = Number.MIN_SAFE_INTEGER;
    if (Number.isNaN(max))
        max = Number.MAX_SAFE_INTEGER;
    return defaultValue >= min && defaultValue <= max;
}
function checkAttributeBoundsFloat(attribute, endpointAttribute) {
    var _a = getBoundsFloat(attribute), min = _a.min, max = _a.max;
    var defaultValue = extractFloatValue(endpointAttribute.defaultValue);
    return checkBoundsFloat(defaultValue, min, max);
}
function getBoundsFloat(attribute) {
    return {
        min: extractFloatValue(attribute.min),
        max: extractFloatValue(attribute.max),
    };
}
function checkBoundsFloat(defaultValue, min, max) {
    if (Number.isNaN(min))
        min = Number.MIN_VALUE;
    if (Number.isNaN(max))
        max = Number.MAX_VALUE;
    return defaultValue >= min && defaultValue <= max;
}
// exports
exports.validateAttribute = validateAttribute;
exports.validateEndpoint = validateEndpoint;
exports.validateNoDuplicateEndpoints = validateNoDuplicateEndpoints;
exports.validateSpecificAttribute = validateSpecificAttribute;
exports.validateSpecificEndpoint = validateSpecificEndpoint;
exports.isValidNumberString = isValidNumberString;
exports.isValidFloat = isValidFloat;
exports.extractFloatValue = extractFloatValue;
exports.extractIntegerValue = extractIntegerValue;
exports.getBoundsInteger = getBoundsInteger;
exports.checkBoundsInteger = checkBoundsInteger;
exports.getBoundsFloat = getBoundsFloat;
exports.checkBoundsFloat = checkBoundsFloat;
//# sourceMappingURL=validation.js.map