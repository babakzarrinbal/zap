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
var dbEnum = require('../src-shared/db-enum.js');
var templateUtil = require('./template-util.js');
var util = require('../util/util.js');
/**
 * This module contains the API for accessing SDK extensions.
 *
 * @module Templating API: C formatting helpers
 */
function clusterExtension(context, prop, clusterCode, role) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, templateUtil
                    .ensureTemplatePackageId(context)
                    .then(function (packageId) {
                    return templateUtil.ensureZclClusterSdkExtensions(context, packageId);
                })
                    .then(function (extensions) {
                    return util.getClusterExtensionDefault(extensions, prop, clusterCode, role);
                })];
        });
    });
}
/**
 * When inside a context that contains 'code', this
 * helper will output the value of the cluster extension
 * specified by property="propName" attribute.
 *
 * @param {*} options
 * @returns Value of the cluster extension property.
 */
function cluster_extension(options) {
    var prop = options.hash.property;
    var role = options.hash.role;
    var code = options.hash.code;
    if (code == null) {
        code = 'code';
    }
    if (prop == null) {
        return '';
    }
    else {
        return clusterExtension(this, prop, this[code], role);
    }
}
/**
 * When inside a context that contains 'code', this
 * helper will output the value of the cluster extension
 * specified by property="propName" attribute.
 *
 * @param {*} options
 * @returns Value of the cluster extension property.
 */
function device_type_extension(options) {
    return __awaiter(this, void 0, void 0, function () {
        var prop, packageId, extensions, f, val_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prop = options.hash.property;
                    if (prop == null)
                        return [2 /*return*/, ''];
                    return [4 /*yield*/, templateUtil.ensureTemplatePackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, templateUtil.ensureZclDeviceTypeSdkExtensions(this, packageId)];
                case 2:
                    extensions = _a.sent();
                    f = extensions.filter(function (x) { return x.property == prop; });
                    if (f.length == 0) {
                        return [2 /*return*/, ''];
                    }
                    else {
                        val_1 = null;
                        f[0].defaults.forEach(function (d) {
                            if (d.entityCode == _this.code)
                                val_1 = d.value;
                            if (d.entityCode == _this.label)
                                val_1 = d.value;
                        });
                        if (val_1 == null)
                            val_1 = f[0].globalDefault;
                        if (val_1 == null)
                            val_1 = '';
                        return [2 /*return*/, val_1];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * When inside a context that contains 'type', this
 * helper will output the value of the attribute type extension
 * specified by property="propName" attribute.
 *
 * @param {*} options
 * @returns Value of the attribute type extension property.
 */
function attribute_type_extension(options) {
    return __awaiter(this, void 0, void 0, function () {
        var prop, packageId, extensions, f, val_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prop = options.hash.property;
                    if (prop == null)
                        return [2 /*return*/, ''];
                    return [4 /*yield*/, templateUtil.ensureTemplatePackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, templateUtil.ensureZclAttributeTypeSdkExtensions(this, packageId)];
                case 2:
                    extensions = _a.sent();
                    f = extensions.filter(function (x) { return x.property == prop; });
                    if (f.length == 0) {
                        return [2 /*return*/, ''];
                    }
                    else {
                        val_2 = null;
                        f[0].defaults.forEach(function (d) {
                            if (d.entityQualifier == _this.type)
                                val_2 = d.value;
                        });
                        if (val_2 == null)
                            val_2 = f[0].globalDefault;
                        if (val_2 == null)
                            val_2 = '';
                        return [2 /*return*/, val_2];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function subentityExtension(context, prop, entityType) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, extensions, f, val;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (prop == null)
                        return [2 /*return*/, ''];
                    return [4 /*yield*/, templateUtil.ensureTemplatePackageId(context)];
                case 1:
                    packageId = _a.sent();
                    if (!(entityType == dbEnum.packageExtensionEntity.attribute)) return [3 /*break*/, 3];
                    return [4 /*yield*/, templateUtil.ensureZclAttributeSdkExtensions(context, packageId)];
                case 2:
                    extensions = _a.sent();
                    return [3 /*break*/, 8];
                case 3:
                    if (!(entityType == dbEnum.packageExtensionEntity.command)) return [3 /*break*/, 5];
                    return [4 /*yield*/, templateUtil.ensureZclCommandSdkExtensions(context, packageId)];
                case 4:
                    extensions = _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    if (!(entityType == dbEnum.packageExtensionEntity.event)) return [3 /*break*/, 7];
                    return [4 /*yield*/, templateUtil.ensureZclEventSdkExtensions(context, packageId)];
                case 6:
                    extensions = _a.sent();
                    return [3 /*break*/, 8];
                case 7: throw new Error("Invalid subentity: ".concat(entityType));
                case 8:
                    f = extensions.filter(function (x) { return x.property == prop; });
                    if (f.length == 0)
                        return [2 /*return*/, ''];
                    val = null;
                    // Iterate over all the extension defaults for this property
                    f[0].defaults.forEach(function (d) {
                        var clusterCode = context.clusterCode;
                        // ClusterCode may be on the parent.
                        if (clusterCode == null && context.parent)
                            clusterCode = context.parent.code;
                        if (d.entityCode == context.code && d.parentCode == clusterCode) {
                            // Now let's deal with qualifier:
                            if (d.entityQualifier != null &&
                                entityType == dbEnum.packageExtensionEntity.command) {
                                if (d.entityQualifier == context.source ||
                                    d.entityQualifier == context.commandSource) {
                                    val = d.value;
                                }
                            }
                            else {
                                // No special conditions, we match
                                if (val == null)
                                    val = d.value;
                            }
                        }
                    });
                    // Wasn't set, set global default
                    if (val == null)
                        val = f[0].globalDefault;
                    // No global default either, use empty string.
                    if (val == null)
                        val = '';
                    return [2 /*return*/, val];
            }
        });
    });
}
function if_command_extension_true(options) {
    var _this = this;
    var prop = options.hash.property;
    if (prop == '')
        return '';
    return subentityExtension(this, prop, dbEnum.packageExtensionEntity.command).then(function (val) {
        if (val == true || val == 1) {
            return options.fn(_this);
        }
        else {
            return '';
        }
    });
}
function if_command_extension_false(options) {
    var _this = this;
    var prop = options.hash.property;
    if (prop == '')
        return '';
    return subentityExtension(this, prop, dbEnum.packageExtensionEntity.command).then(function (val) {
        if (val == false || val == 0) {
            return options.fn(_this);
        }
        else {
            return '';
        }
    });
}
function if_cluster_extension_true(options) {
    var _this = this;
    var prop = options.hash.property;
    var code = options.hash.code;
    if (prop == '')
        return '';
    if (code == null)
        code = 'clusterCode';
    return clusterExtension(this, prop, this[code], null).then(function (val) {
        if (val == true || val == 1) {
            return options.fn(_this);
        }
        else {
            return '';
        }
    });
}
function if_cluster_extension_false(options) {
    var _this = this;
    var prop = options.hash.property;
    var code = options.hash.code;
    if (prop == '')
        return '';
    if (code == null)
        code = 'clusterCode';
    return clusterExtension(this, prop, this[code], null).then(function (val) {
        if (val == false || val == 0) {
            return options.fn(_this);
        }
        else {
            return '';
        }
    });
}
/**
 * When inside a context that contains 'code' and parent 'code', this
 * helper will output the value of the attribute extension
 * specified by property="propName" attribute.
 *
 * @param {*} options
 * @returns Value of the attribute extension property.
 */
function attribute_extension(options) {
    var prop = options.hash.property;
    return subentityExtension(this, prop, dbEnum.packageExtensionEntity.attribute);
}
/**
 * When inside a context that contains 'code' and parent 'code', this
 * helper will output the value of the command extension
 * specified by property="propName" attribute.
 *
 * @param {*} options
 * @returns Value of the command extension property.
 */
function command_extension(options) {
    var prop = options.hash.property;
    return subentityExtension(this, prop, dbEnum.packageExtensionEntity.command);
}
/**
 * When inside a context that contains 'code' and parent 'code', this
 * helper will output the value of the command extension
 * specified by property="propName" attribute.
 *
 * @param {*} options
 * @returns Value of the command extension property.
 */
function event_extension(options) {
    var prop = options.hash.property;
    return subentityExtension(this, prop, dbEnum.packageExtensionEntity.event);
}
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.cluster_extension = cluster_extension;
exports.command_extension = command_extension;
exports.event_extension = event_extension;
exports.attribute_extension = attribute_extension;
exports.attribute_type_extension = attribute_type_extension;
exports.device_type_extension = device_type_extension;
exports.if_command_extension_true = if_command_extension_true;
exports.if_command_extension_false = if_command_extension_false;
exports.if_cluster_extension_true = if_cluster_extension_true;
exports.if_cluster_extension_false = if_cluster_extension_false;
//# sourceMappingURL=helper-sdkextension.js.map