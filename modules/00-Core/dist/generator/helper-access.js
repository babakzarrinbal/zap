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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var queryAccess = require('../db/query-access');
var templateUtil = require('./template-util');
/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: Access helpers
 */
function collectAccesslist(ctx, options) {
    return __awaiter(this, void 0, void 0, function () {
        var entityType, includeDefault, accessList, _a, packageId, defaultAccess;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entityType = null;
                    includeDefault = true;
                    if ('entity' in options.hash) {
                        entityType = options.hash.entity;
                    }
                    else {
                        entityType = ctx.entityType;
                    }
                    if ('includeDefault' in options.hash) {
                        includeDefault = options.hash.includeDefault == 'true';
                    }
                    if (entityType == null) {
                        throw new Error('Access helper requires entityType, either from context, or from the entity="<entityType>" option.');
                    }
                    _a = entityType;
                    switch (_a) {
                        case 'attribute': return [3 /*break*/, 1];
                        case 'command': return [3 /*break*/, 3];
                        case 'event': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, queryAccess.selectAttributeAccess(ctx.global.db, ctx.id)];
                case 2:
                    accessList = _b.sent();
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, queryAccess.selectCommandAccess(ctx.global.db, ctx.id)];
                case 4:
                    accessList = _b.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, queryAccess.selectEventAccess(ctx.global.db, ctx.id)];
                case 6:
                    accessList = _b.sent();
                    return [3 /*break*/, 8];
                case 7: throw new Error("Entity type ".concat(entityType, " not supported. Requires: attribute/command/event."));
                case 8:
                    if (!includeDefault) return [3 /*break*/, 11];
                    return [4 /*yield*/, templateUtil.ensureZclPackageId(ctx)];
                case 9:
                    packageId = _b.sent();
                    return [4 /*yield*/, queryAccess.selectDefaultAccess(ctx.global.db, packageId, entityType)];
                case 10:
                    defaultAccess = _b.sent();
                    accessList.push.apply(accessList, __spreadArray([], __read(defaultAccess), false));
                    _b.label = 11;
                case 11: return [2 /*return*/, accessList];
            }
        });
    });
}
/**
 * This helper creates a context for the aggregates of access.
 *
 * @param {*} options
 */
function access_aggregate(options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, accessList, ignoreEmpty, allOps, allMods, allRoles, roleLevels, aggregate, blocks, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, collectAccesslist(this, options)];
                case 2:
                    accessList = _a.sent();
                    if ('ignoreEmpty' in options.hash) {
                        ignoreEmpty = options.hash.ignoreEmpty == 'true';
                    }
                    else {
                        ignoreEmpty = false;
                    }
                    return [4 /*yield*/, queryAccess.selectAccessOperations(this.global.db, packageId)];
                case 3:
                    allOps = _a.sent();
                    return [4 /*yield*/, queryAccess.selectAccessModifiers(this.global.db, packageId)];
                case 4:
                    allMods = _a.sent();
                    return [4 /*yield*/, queryAccess.selectAccessRoles(this.global.db, packageId)];
                case 5:
                    allRoles = _a.sent();
                    roleLevels = {};
                    allRoles.forEach(function (r) {
                        roleLevels[r.name] = r.level;
                    });
                    aggregate = {
                        count: accessList.length,
                    };
                    allOps.forEach(function (r) {
                        aggregate[r.name + 'Highest'] = 'NONE';
                        aggregate[r.name + 'Lowest'] = 'NONE';
                    });
                    allMods.forEach(function (r) {
                        aggregate[r.name] = false;
                    });
                    accessList.forEach(function (a) {
                        var role = a.role;
                        var operation = a.operation;
                        var accessModifier = a.accessModifier;
                        if (accessModifier != null) {
                            aggregate[accessModifier] = true;
                        }
                        if (role != null) {
                            if (aggregate[operation + 'Highest'] === 'NONE') {
                                aggregate[operation + 'Highest'] = role;
                                aggregate[operation + 'Lowest'] = role;
                            }
                            else {
                                var highestRole = aggregate[operation + 'Highest'];
                                var lowestRole = aggregate[operation + 'Lowest'];
                                if (roleLevels[role] < roleLevels[lowestRole]) {
                                    aggregate[operation + 'Lowest'] = role;
                                }
                                if (roleLevels[role] > roleLevels[highestRole]) {
                                    aggregate[operation + 'Highest'] = role;
                                }
                            }
                        }
                    });
                    if (ignoreEmpty && aggregate.count == 0) {
                        blocks = [];
                    }
                    else {
                        blocks = [aggregate];
                    }
                    p = templateUtil.collectBlocks(blocks, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, p)];
            }
        });
    });
}
/**
 * Access helper iterates across all the access triplets associated with the element.
 * For each element, context contains role, operation, accessModifier.
 * Additionally it creates booleans hasRole, hasOperation and hasAccessModifier
 * and hasAtLeastOneAccessElement and hasAllAccessElements
 * @param {*} options
 */
function access(options) {
    return __awaiter(this, void 0, void 0, function () {
        var accessList, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, collectAccesslist(this, options)];
                case 1:
                    accessList = _a.sent();
                    accessList.forEach(function (element) {
                        element.hasRole = element.role != null && element.role.length > 0;
                        element.hasOperation =
                            element.operation != null && element.operation.length > 0;
                        element.hasAccessModifier =
                            element.accessModifier != null && element.accessModifier.length > 0;
                        element.hasAllAccessElements =
                            element.hasRole && element.hasOperation && element.hasAccessModifier;
                        element.hasAtLeastOneAccessElement =
                            element.hasRole || element.hasOperation || element.hasAccessModifier;
                    });
                    p = templateUtil.collectBlocks(accessList, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, p)];
            }
        });
    });
}
exports.access = access;
exports.access_aggregate = access_aggregate;
//# sourceMappingURL=helper-access.js.map