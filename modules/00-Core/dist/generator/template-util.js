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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var queryPackage = require('../db/query-package.js');
var queryEndpointType = require('../db/query-endpoint-type.js');
var dbEnum = require('../src-shared/db-enum.js');
var env = require('../util/env');
var _ = require('lodash');
/**
 * @module JS API: generator logic
 */
/**
 * All promises used by the templates should be synchronizable.
 *
 * @param {*} promise
 */
function makeSynchronizablePromise(promise) {
    // If promise is already synchronizable, just return it.
    if (promise.isResolved)
        return promise;
    // Set initial state of flags
    var isPending = true;
    var isRejected = false;
    var isResolved = false;
    // Resolve the promise, observing its rejection or resolution.
    var synchronizablePromise = promise.then(function (resolutionValue) {
        isResolved = true;
        isPending = false;
        return resolutionValue;
    }, function (rejectionError) {
        isRejected = true;
        isPending = false;
        throw rejectionError;
    });
    // Inject check functions.
    synchronizablePromise.isResolved = function () {
        return isResolved;
    };
    synchronizablePromise.isPending = function () {
        return isPending;
    };
    synchronizablePromise.isRejected = function () {
        return isRejected;
    };
    return synchronizablePromise;
}
/**
 * Helpful function that collects the individual blocks by using elements of an array as a context,
 * executing promises for each, and collecting them into the outgoing string.
 *
 * @param {*} resultArray
 * @param {*} options Options passed from a block helper.
 * @param {*} context The context from within this was called.
 * @returns Promise that resolves with a content string.
 */
function collectBlocks(resultArray, options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, index;
        return __generator(this, function (_a) {
            promises = [];
            index = 0;
            resultArray.forEach(function (element) {
                var newContext = __assign({ global: context.global, parent: context, index: index++, count: resultArray.length }, element);
                var block = options.fn(newContext);
                promises.push(block);
            });
            // The else block gets executed if the list is empty.
            if (resultArray.length == 0) {
                promises.push(options.inverse({
                    global: context.global,
                    parent: context,
                }));
            }
            return [2 /*return*/, Promise.all(promises).then(function (blocks) {
                    var ret = '';
                    blocks.forEach(function (b) {
                        ret = ret.concat(b);
                    });
                    return ret;
                })];
        });
    });
}
/**
 * Returns the promise that resolves with the ZCL properties package id.
 *
 * @param {*} context
 * @returns promise that resolves with the package id.
 */
function ensureZclPackageId(context) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclPackageId' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclPackageId];
                case 1: return [4 /*yield*/, queryPackage.getSessionPackagesByType(context.global.db, context.global.sessionId, dbEnum.packageType.zclProperties)];
                case 2:
                    pkgs = _a.sent();
                    if (pkgs.length == 0) {
                        return [2 /*return*/, null];
                    }
                    else {
                        context.global.zclPackageId = pkgs[0].id;
                        return [2 /*return*/, pkgs[0].id];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns the promise that resolves with the ZCL properties package id.
 *
 * @param {*} context
 * @returns promise that resolves with the package id.
 */
function ensureTemplatePackageId(context) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('templatePackageId' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.templatePackageId];
                case 1: return [4 /*yield*/, queryPackage.getSessionPackagesByType(context.global.db, context.global.sessionId, dbEnum.packageType.genTemplatesJson)];
                case 2:
                    pkgs = _a.sent();
                    if (pkgs.length == 0) {
                        return [2 /*return*/, null];
                    }
                    else {
                        context.global.templatePackageId = pkgs[0].id;
                        return [2 /*return*/, pkgs[0].id];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Populate the endpoint type ids into the global context.
 * @param {*} context
 * @returns endpoint type ids
 */
function ensureEndpointTypeIds(context) {
    return __awaiter(this, void 0, void 0, function () {
        var epts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('endpointTypeIds' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.endpointTypeIds];
                case 1: return [4 /*yield*/, queryEndpointType.selectEndpointTypeIds(context.global.db, context.global.sessionId)];
                case 2:
                    epts = _a.sent();
                    context.global.endpointTypeIds = epts;
                    return [2 /*return*/, epts];
            }
        });
    });
}
/**
 * Resolves with cached cluster extensions, but if they don't
 * exist, it will populate them.
 *
 * @param {*} context
 * @param {*} templatePackageId
 * @returns promise that resolves with cluster extensions.
 */
function ensureZclClusterSdkExtensions(context, templatePackageId) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclClusterSdkExtension' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclClusterSdkExtension];
                case 1: return [4 /*yield*/, queryPackage.selectPackageExtension(context.global.db, templatePackageId, dbEnum.packageExtensionEntity.cluster)];
                case 2:
                    extensions = _a.sent();
                    context.global.zclClusterSdkExtension = extensions;
                    return [2 /*return*/, extensions];
            }
        });
    });
}
/**
 * Resolves with cached cluster extensions, but if they don't
 * exist, it will populate them.
 *
 * @param {*} context
 * @param {*} templatePackageId
 * @returns promise that resolves with cluster extensions.
 */
function ensureZclDeviceTypeSdkExtensions(context, templatePackageId) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclDeviceTypeExtension' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclDeviceTypeExtension];
                case 1: return [4 /*yield*/, queryPackage.selectPackageExtension(context.global.db, templatePackageId, dbEnum.packageExtensionEntity.deviceType)];
                case 2:
                    extensions = _a.sent();
                    context.global.zclDeviceTypeExtension = extensions;
                    return [2 /*return*/, extensions];
            }
        });
    });
}
/**
 * Resolves with cached attribute extensions, but if they don't
 * exist, it will populate them.
 *
 * @param {*} context
 * @param {*} templatePackageId
 * @returns promise that resolves with attribute extensions.
 */
function ensureZclAttributeSdkExtensions(context, templatePackageId) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclAttributeSdkExtension' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclAttributeSdkExtension];
                case 1: return [4 /*yield*/, queryPackage.selectPackageExtension(context.global.db, templatePackageId, dbEnum.packageExtensionEntity.attribute)];
                case 2:
                    extensions = _a.sent();
                    context.global.zclAttributeSdkExtension = extensions;
                    return [2 /*return*/, extensions];
            }
        });
    });
}
/**
 * Resolves with cached attribute type extensions, but if they don't
 * exist, it will populate them.
 *
 * @param {*} context
 * @param {*} templatePackageId
 * @returns promise that resolves with attribute type extensions.
 */
function ensureZclAttributeTypeSdkExtensions(context, templatePackageId) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclAttributeTypeSdkExtension' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclAttributeTypeSdkExtension];
                case 1: return [4 /*yield*/, queryPackage.selectPackageExtension(context.global.db, templatePackageId, dbEnum.packageExtensionEntity.attributeType)];
                case 2:
                    extensions = _a.sent();
                    context.global.zclAttributeTypeSdkExtension = extensions;
                    return [2 /*return*/, extensions];
            }
        });
    });
}
/**
 * Resolves with cached command extensions, but if they don't
 * exist, it will populate them.
 *
 * @param {*} context
 * @param {*} templatePackageId
 * @returns promise that resolves with command extensions.
 */
function ensureZclCommandSdkExtensions(context, templatePackageId) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclCommandSdkExtension' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclCommandSdkExtension];
                case 1: return [4 /*yield*/, queryPackage.selectPackageExtension(context.global.db, templatePackageId, dbEnum.packageExtensionEntity.command)];
                case 2:
                    extensions = _a.sent();
                    context.global.zclCommandSdkExtension = extensions;
                    return [2 /*return*/, extensions];
            }
        });
    });
}
/**
 * Resolves with cached command extensions, but if they don't
 * exist, it will populate them.
 *
 * @param {*} context
 * @param {*} templatePackageId
 * @returns promise that resolves with command extensions.
 */
function ensureZclEventSdkExtensions(context, templatePackageId) {
    return __awaiter(this, void 0, void 0, function () {
        var extensions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('zclEventSdkExtension' in context.global)) return [3 /*break*/, 1];
                    return [2 /*return*/, context.global.zclEventSdkExtension];
                case 1: return [4 /*yield*/, queryPackage.selectPackageExtension(context.global.db, templatePackageId, dbEnum.packageExtensionEntity.event)];
                case 2:
                    extensions = _a.sent();
                    context.global.zclEventSdkExtension = extensions;
                    return [2 /*return*/, extensions];
            }
        });
    });
}
/**
 * Every helper that returns a promise, should
 * not return the promise directly. So instead of
 * returning the promise directly, it should return:
 *    return templatePromise(this.global, promise)
 *
 * This will ensure that after tag works as expected.
 *
 * @param {*} global
 * @param {*} promise
 */
function templatePromise(global, promise) {
    var syncPromise = makeSynchronizablePromise(promise);
    global.promises.push(syncPromise);
    return syncPromise;
}
/**
 * Function wrapper that can be used when a helper is deprecated.
 *
 * @param {*} fn
 * @param {*} explanation can contain `text`, or `from`/`to`, or just be a string message itself.
 * @returns a function that wraps the original function, with deprecation message.
 */
function deprecatedHelper(fn, explanation) {
    var msg;
    var to = null;
    if (explanation == null) {
        msg = "Deprecated helper resolved into ".concat(fn.name, ". Please use the new helper directly.");
    }
    else if (_.isString(explanation)) {
        msg = explanation;
    }
    else if ('text' in explanation) {
        msg = explanation.text;
    }
    else if ('from' in explanation && 'to' in explanation) {
        msg = "Helper ".concat(explanation.from, " is deprecated. Use ").concat(explanation.to, " instead.");
        to = explanation.to;
    }
    else if ('to' in explanation) {
        msg = "Helper ".concat(fn.name, " is deprecated. Use ").concat(explanation.to, " instead.");
        to = explanation.to;
    }
    else if ('from' in explanation) {
        msg = "Helper ".concat(explanation.from, " is deprecated. Use ").concat(fn.name, " instead.");
    }
    else {
        msg = "Deprecated helper resolved into ".concat(fn.name, ". Please use the new helper directly.");
    }
    var f = function () {
        if (this.global != undefined &&
            this.global.disableDeprecationWarnings != true &&
            this.global.deprecationWarnings != undefined &&
            this.global.deprecationWarnings[fn.name] == null) {
            this.global.deprecationWarnings[fn.name] = true;
            env.logWarning("".concat(this.global.templatePath, " : ").concat(msg));
        }
        return fn.apply(this, arguments);
    };
    f.originalHelper = fn.name;
    f.isDeprecated = true;
    if (to != null)
        f.replacementHelper = to;
    return f;
}
exports.collectBlocks = collectBlocks;
exports.ensureZclPackageId = ensureZclPackageId;
exports.ensureTemplatePackageId = ensureTemplatePackageId;
exports.ensureZclClusterSdkExtensions = ensureZclClusterSdkExtensions;
exports.ensureZclAttributeSdkExtensions = ensureZclAttributeSdkExtensions;
exports.ensureZclAttributeTypeSdkExtensions =
    ensureZclAttributeTypeSdkExtensions;
exports.ensureZclCommandSdkExtensions = ensureZclCommandSdkExtensions;
exports.ensureZclEventSdkExtensions = ensureZclEventSdkExtensions;
exports.ensureZclDeviceTypeSdkExtensions = ensureZclDeviceTypeSdkExtensions;
exports.ensureEndpointTypeIds = ensureEndpointTypeIds;
exports.makeSynchronizablePromise = makeSynchronizablePromise;
exports.templatePromise = templatePromise;
exports.deprecatedHelper = deprecatedHelper;
//# sourceMappingURL=template-util.js.map