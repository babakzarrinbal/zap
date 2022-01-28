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
var queryZcl = require('../db/query-zcl');
var queryCommand = require('../db/query-command');
var queryEvent = require('../db/query-event');
var dbEnum = require('../../src-shared/db-enum');
var templateUtil = require('./template-util');
var helperC = require('./helper-c');
var env = require('../util/env');
var types = require('../util/types');
var zclUtil = require('../util/zcl-util');
var _ = require('lodash');
/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: static zcl helpers
 */
/**
 * Block helper iterating over all bitmaps.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_bitmaps(options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, ens, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    if (!(this.id != null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, queryZcl.selectClusterBitmaps(this.global.db, packageId, this.id)];
                case 2:
                    ens = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, queryZcl.selectAllBitmaps(this.global.db, packageId)];
                case 4:
                    ens = _a.sent();
                    _a.label = 5;
                case 5:
                    promise = templateUtil.collectBlocks(ens, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Iterates over enum items. Valid only inside zcl_enums.
 * @param {*} options
 */
function zcl_bitmap_items(options) {
    var _this = this;
    var promise = queryZcl
        .selectAllBitmapFieldsById(this.global.db, this.id)
        .then(function (items) { return templateUtil.collectBlocks(items, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all enums.
 * If existing independently, it iterates over ALL the enums.
 * Within a context of a cluster, it iterates only over the
 * enums belonging to a cluster.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_enums(options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, ens, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    if (!(this.id != null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, queryZcl.selectClusterEnums(this.global.db, packageId, this.id)];
                case 2:
                    ens = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, queryZcl.selectAllEnums(this.global.db, packageId)];
                case 4:
                    ens = _a.sent();
                    _a.label = 5;
                case 5:
                    promise = templateUtil.collectBlocks(ens, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Block helper iterating over all structs.
 * If existing independently, it iterates over ALL the structs.
 * Within a context of a cluster, it iterates only over the
 * structs belonging to a cluster.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_structs(options) {
    return __awaiter(this, void 0, void 0, function () {
        var checkForDoubleNestedArray, packageId, structs, structs_1, structs_1_1, st, _a, _b, i, sis, sis_1, sis_1_1, ss, e_1_1, e_2_1, promise;
        var e_2, _c, e_1, _d, e_3, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    checkForDoubleNestedArray = options.hash.checkForDoubleNestedArray == 'true';
                    return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _f.sent();
                    if (!(this.id != null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, queryZcl.selectClusterStructsWithItems(this.global.db, packageId, this.id)];
                case 2:
                    structs = _f.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, queryZcl.selectAllStructsWithItems(this.global.db, packageId)];
                case 4:
                    structs = _f.sent();
                    _f.label = 5;
                case 5: return [4 /*yield*/, zclUtil.sortStructsByDependency(structs)];
                case 6:
                    structs = _f.sent();
                    structs.forEach(function (st) {
                        st.struct_contains_array = false;
                        st.struct_is_fabric_scoped = false;
                        st.has_no_clusters = st.struct_cluster_count < 1;
                        st.has_one_cluster = st.struct_cluster_count == 1;
                        st.has_more_than_one_cluster = st.struct_cluster_count > 1;
                        st.items.forEach(function (i) {
                            if (i.isArray) {
                                st.struct_contains_array = true;
                            }
                            if (i.type && i.type.toLowerCase() == 'fabric_idx') {
                                st.struct_is_fabric_scoped = true;
                                st.struct_fabric_idx_field = i.label;
                            }
                        });
                    });
                    if (!checkForDoubleNestedArray) return [3 /*break*/, 20];
                    _f.label = 7;
                case 7:
                    _f.trys.push([7, 18, 19, 20]);
                    structs_1 = __values(structs), structs_1_1 = structs_1.next();
                    _f.label = 8;
                case 8:
                    if (!!structs_1_1.done) return [3 /*break*/, 17];
                    st = structs_1_1.value;
                    st.struct_contains_nested_array = false;
                    _f.label = 9;
                case 9:
                    _f.trys.push([9, 14, 15, 16]);
                    _a = (e_1 = void 0, __values(st.items)), _b = _a.next();
                    _f.label = 10;
                case 10:
                    if (!!_b.done) return [3 /*break*/, 13];
                    i = _b.value;
                    if (!i.isArray) return [3 /*break*/, 12];
                    return [4 /*yield*/, queryZcl.selectAllStructItemsByStructName(this.global.db, i.type, packageId)];
                case 11:
                    sis = _f.sent();
                    if (sis.length > 0) {
                        try {
                            for (sis_1 = (e_3 = void 0, __values(sis)), sis_1_1 = sis_1.next(); !sis_1_1.done; sis_1_1 = sis_1.next()) {
                                ss = sis_1_1.value;
                                if (ss.isArray) {
                                    st.struct_contains_nested_array = true;
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (sis_1_1 && !sis_1_1.done && (_e = sis_1.return)) _e.call(sis_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                    _f.label = 12;
                case 12:
                    _b = _a.next();
                    return [3 /*break*/, 10];
                case 13: return [3 /*break*/, 16];
                case 14:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 15:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 16:
                    structs_1_1 = structs_1.next();
                    return [3 /*break*/, 8];
                case 17: return [3 /*break*/, 20];
                case 18:
                    e_2_1 = _f.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 20];
                case 19:
                    try {
                        if (structs_1_1 && !structs_1_1.done && (_c = structs_1.return)) _c.call(structs_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 20:
                    promise = templateUtil.collectBlocks(structs, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Iterates over enum items. Valid only inside zcl_enums.
 * @param {*} options
 */
function zcl_enum_items(options) {
    var _this = this;
    var promise = queryZcl
        .selectAllEnumItemsById(this.global.db, this.id)
        .then(function (items) { return templateUtil.collectBlocks(items, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all struct items. Valid only inside zcl_structs.

 * @param {*} options
 * @returns Promise of content.
 */
function zcl_struct_items(options) {
    return __awaiter(this, void 0, void 0, function () {
        var checkForDoubleNestedArray, packageId, sis, sis_2, sis_2_1, si, structItems, structItems_1, structItems_1_1, s, e_4_1, promise;
        var e_4, _a, e_5, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkForDoubleNestedArray = options.hash.checkForDoubleNestedArray == 'true';
                    return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _c.sent();
                    return [4 /*yield*/, queryZcl.selectAllStructItemsById(this.global.db, this.id)];
                case 2:
                    sis = _c.sent();
                    if (!checkForDoubleNestedArray) return [3 /*break*/, 10];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, 9, 10]);
                    sis_2 = __values(sis), sis_2_1 = sis_2.next();
                    _c.label = 4;
                case 4:
                    if (!!sis_2_1.done) return [3 /*break*/, 7];
                    si = sis_2_1.value;
                    si.struct_item_contains_nested_array = false;
                    return [4 /*yield*/, queryZcl.selectAllStructItemsByStructName(this.global.db, si.type, packageId)];
                case 5:
                    structItems = _c.sent();
                    if (structItems.length > 0) {
                        try {
                            for (structItems_1 = (e_5 = void 0, __values(structItems)), structItems_1_1 = structItems_1.next(); !structItems_1_1.done; structItems_1_1 = structItems_1.next()) {
                                s = structItems_1_1.value;
                                if (s.isArray)
                                    si.struct_item_contains_nested_array = true;
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (structItems_1_1 && !structItems_1_1.done && (_b = structItems_1.return)) _b.call(structItems_1);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    }
                    _c.label = 6;
                case 6:
                    sis_2_1 = sis_2.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_4_1 = _c.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (sis_2_1 && !sis_2_1.done && (_a = sis_2.return)) _a.call(sis_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 10:
                    promise = templateUtil.collectBlocks(sis, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Block helper iterating over all struct items given the struct name.
 *
 * @param name
 * @param options
 * @returns Promise of content.
 */
function zcl_struct_items_by_struct_name(name, options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, promise;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    promise = queryZcl
                        .selectAllStructItemsByStructName(this.global.db, name, packageId)
                        .then(function (st) { return templateUtil.collectBlocks(st, options, _this); });
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Block helper iterating over all deviceTypes.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_device_types(options) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        return queryZcl.selectAllDeviceTypes(_this.global.db, packageId);
    })
        .then(function (cl) { return templateUtil.collectBlocks(cl, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all clusters.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_clusters(options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, cl, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, queryZcl.selectAllClusters(this.global.db, packageId)];
                case 2:
                    cl = _a.sent();
                    promise = templateUtil.collectBlocks(cl, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Block helper iterating over all commands.
 * There are two modes of this helper:
 *   when used in a global context, it iterates over ALL commands in the database.
 *   when used inside a `zcl_cluster` block helper, it iterates only over the commands for that cluster.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_commands(options) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        if ('id' in _this) {
            // We're functioning inside a nested context with an id, so we will only query for this cluster.
            return queryCommand.selectCommandsByClusterId(_this.global.db, _this.id, packageId);
        }
        else {
            return queryCommand.selectAllCommands(_this.global.db, packageId);
        }
    })
        .then(function (cmds) { return templateUtil.collectBlocks(cmds, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all commands with cluster information.
 * Note: Similar to zcl_commands but has cluster information as well.
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_commands_with_cluster_info(options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, cmds, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllCommandsWithClusterInfo(this.global.db, packageId)];
                case 2:
                    cmds = _a.sent();
                    promise = templateUtil.collectBlocks(cmds, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Helper that retrieves all commands that contain arguments.
 *
 * @param {*} options
 */
function zcl_commands_with_arguments(options) {
    return __awaiter(this, void 0, void 0, function () {
        var sortBy, packageId, cmds, cmds_1, cmds_1_1, cmd, sig, e_6_1, promise;
        var e_6, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sortBy = options.hash.sortBy;
                    return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _b.sent();
                    return [4 /*yield*/, queryCommand.selectAllCommandsWithArguments(this.global.db, packageId)];
                case 2:
                    cmds = _b.sent();
                    if (!('signature' == sortBy)) return [3 /*break*/, 11];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 8, 9, 10]);
                    cmds_1 = __values(cmds), cmds_1_1 = cmds_1.next();
                    _b.label = 4;
                case 4:
                    if (!!cmds_1_1.done) return [3 /*break*/, 7];
                    cmd = cmds_1_1.value;
                    return [4 /*yield*/, zclUtil.createCommandSignature(this.global.db, packageId, cmd)];
                case 5:
                    sig = _b.sent();
                    cmd.signature = sig.signature;
                    cmd.isSignatureSimple = sig.isSimple;
                    _b.label = 6;
                case 6:
                    cmds_1_1 = cmds_1.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_6_1 = _b.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1.return)) _a.call(cmds_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 10:
                    cmds.sort(function (a, b) {
                        if (a.isSignatureSimple && !b.isSignatureSimple)
                            return -1;
                        if (!a.isSignatureSimple && b.isSignatureSimple)
                            return 1;
                        return a.signature.localeCompare(b.signature);
                    });
                    _b.label = 11;
                case 11:
                    promise = templateUtil.collectBlocks(cmds, options, this);
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * Block helper iterating over all commands based on the source.
 * There are two modes of this helper:
 *   when used in a global context, it iterates over ALL commands in the database based on the source.
 *   when used inside a `zcl_cluster` block helper, it iterates only over the source commands for that cluster.
 *
 * @param {*} options
 * @param {*} source
 * @returns Promise of content.
 * @ignore
 */
function zcl_commands_by_source(options, source) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        if ('id' in _this) {
            // We're functioning inside a nested context with an id, so we will only query for this cluster.
            return queryCommand.selectCommandsByClusterIdAndSource(_this.global.db, _this.id, source, packageId);
        }
        else {
            return queryCommand.selectAllCommandsBySource(_this.global.db, source, packageId);
        }
    })
        .then(function (cmds) { return templateUtil.collectBlocks(cmds, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all client commands.
 * There are two modes of this helper:
 *   when used in a global context, it iterates over ALL client commands in the database.
 *   when used inside a `zcl_cluster` block helper, it iterates only over the commands for that client cluster.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_commands_source_client(options) {
    return zcl_commands_by_source.bind(this)(options, dbEnum.source.client);
}
/**
 * Block helper iterating over all server commands.
 * There are two modes of this helper:
 *   when used in a global context, it iterates over ALL server commands in the database.
 *   when used inside a `zcl_cluster` block helper, it iterates only over the commands for that server cluster.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_commands_source_server(options) {
    return zcl_commands_by_source.bind(this)(options, dbEnum.source.server);
}
/**
 * Block helper iterating over all events.
 * There are two modes of this helper:
 *   when used in a global context, it iterates over ALL events in the database.
 *   when used inside a `zcl_cluster` block helper, it iterates only over the events for that cluster.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_events(options) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        if ('id' in _this) {
            // We're functioning inside a nested context with an id, so we will only query for this cluster.
            return queryEvent.selectEventsByClusterId(_this.global.db, _this.id, packageId);
        }
        else {
            return queryEvent.selectAllEvents(_this.global.db, packageId);
        }
    })
        .then(function (cmds) { return templateUtil.collectBlocks(cmds, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all commands, including their arguments and clusters.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_command_tree(options) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        return queryCommand.selectCommandTree(_this.global.db, packageId);
    })
        .then(function (cmds) {
        // Now reduce the array by collecting together arguments.
        var reducedCommands = [];
        cmds.forEach(function (el) {
            var newCommand;
            var lastCommand;
            if (reducedCommands.length == 0) {
                newCommand = true;
            }
            else {
                lastCommand = reducedCommands[reducedCommands.length - 1];
                if (el.code == lastCommand.code &&
                    el.clusterCode == lastCommand.clusterCode &&
                    el.source == lastCommand.source) {
                    newCommand = false;
                }
                else {
                    newCommand = true;
                }
            }
            var arg;
            if (el.argName == null) {
                arg = null;
            }
            else {
                arg = {
                    name: el.argName,
                    type: el.argType,
                    isArray: el.argIsArray,
                    hasLength: el.argIsArray,
                    nameLength: el.argName.concat('Len'),
                };
                if (el.argIsArray) {
                    arg.formatChar = 'b';
                }
                else if (types.isOneBytePrefixedString(el.argType)) {
                    arg.formatChar = 's';
                }
                else if (types.isTwoBytePrefixedString(el.argType)) {
                    arg.formatChar = 'l';
                }
                else {
                    arg.formatChar = 'u';
                }
            }
            if (newCommand) {
                el.commandArgs = [];
                if (arg != null) {
                    el.commandArgs.push(arg);
                    el.argsstring = arg.formatChar;
                }
                else {
                    el.argsstring = '';
                }
                var n = '';
                if (el.clusterCode == null) {
                    n = n.concat('Global');
                }
                else {
                    n = n.concat(_.upperFirst(_.camelCase(el.clusterDefineName)));
                }
                if (el.source == dbEnum.source.either) {
                    // We will need to create two here.
                    n = n.concat('ClientToServer');
                }
                n = n.concat(el.name);
                el.clientMacroName = n;
                el.isGlobal = el.clusterCode == null;
                reducedCommands.push(el);
            }
            else {
                if (arg != null) {
                    lastCommand.commandArgs.push(arg);
                    lastCommand.argsstring = lastCommand.argsstring.concat(arg.formatChar);
                }
            }
        });
        return reducedCommands;
    })
        .then(function (cmds) { return templateUtil.collectBlocks(cmds, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Helper to iterate over all global commands.
 *
 * @param {*} options
 * @returns Promise of global command iteration.
 */
function zcl_global_commands(options) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        return queryCommand.selectAllGlobalCommands(_this.global.db, packageId);
    })
        .then(function (cmds) { return templateUtil.collectBlocks(cmds, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Iterator over the attributes. If it is used at toplevel, if iterates over all the attributes
 * in the database. If used within zcl_cluster context, it iterates over all the attributes
 * that belong to that cluster.
 *
 * @param {*} options
 * @returns Promise of attribute iteration.
 */
function zcl_attributes(options) {
    var _this = this;
    // If used at the toplevel, 'this' is the toplevel context object.
    // when used at the cluster level, 'this' is a cluster
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        if ('id' in _this) {
            // We're functioning inside a nested context with an id, so we will only query for this cluster.
            return queryZcl.selectAttributesByClusterIdIncludingGlobal(_this.global.db, _this.id, packageId);
        }
        else {
            return queryZcl.selectAllAttributes(_this.global.db, packageId);
        }
    })
        .then(function (atts) { return templateUtil.collectBlocks(atts, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Iterator over the client attributes. If it is used at toplevel, if iterates over all the client attributes
 * in the database. If used within zcl_cluster context, it iterates over all the client attributes
 * that belong to that cluster.
 *
 * @param {*} options
 * @returns Promise of attribute iteration.
 */
function zcl_attributes_client(options) {
    var _this = this;
    // If used at the toplevel, 'this' is the toplevel context object.
    // when used at the cluster level, 'this' is a cluster
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        if ('id' in _this) {
            return queryZcl.selectAttributesByClusterIdAndSideIncludingGlobal(_this.global.db, _this.id, packageId, dbEnum.side.client);
        }
        else {
            return queryZcl.selectAllAttributesBySide(_this.global.db, dbEnum.side.client, packageId);
        }
    })
        .then(function (atts) { return templateUtil.collectBlocks(atts, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Iterator over the server attributes. If it is used at toplevel, if iterates over all the server attributes
 * in the database. If used within zcl_cluster context, it iterates over all the server attributes
 * that belong to that cluster.
 *
 * @param {*} options
 * @returns Promise of attribute iteration.
 */
function zcl_attributes_server(options) {
    var _this = this;
    // If used at the toplevel, 'this' is the toplevel context object.
    // when used at the cluster level, 'this' is a cluster
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        if ('id' in _this) {
            // We're functioning inside a nested context with an id, so we will only query for this cluster.
            return queryZcl.selectAttributesByClusterIdAndSideIncludingGlobal(_this.global.db, _this.id, packageId, dbEnum.side.server);
        }
        else {
            return queryZcl.selectAllAttributesBySide(_this.global.db, dbEnum.side.server, packageId);
        }
    })
        .then(function (atts) { return templateUtil.collectBlocks(atts, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Block helper iterating over all atomic types.
 *
 * @param {*} options
 * @returns Promise of content.
 */
function zcl_atomics(options) {
    return __awaiter(this, void 0, void 0, function () {
        var promise;
        var _this = this;
        return __generator(this, function (_a) {
            promise = templateUtil
                .ensureZclPackageId(this)
                .then(function (packageId) { return queryZcl.selectAllAtomics(_this.global.db, packageId); })
                .then(function (ats) { return templateUtil.collectBlocks(ats, options, _this); });
            return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
        });
    });
}
/**
 *
 *
 * Given: N/A
 * @returns the length of largest cluster name in a list of clusters
 */
function zcl_cluster_largest_label_length() {
    return __awaiter(this, void 0, void 0, function () {
        var promise;
        var _this = this;
        return __generator(this, function (_a) {
            promise = templateUtil
                .ensureZclPackageId(this)
                .then(function (packageId) { return queryZcl.selectAllClusters(_this.global.db, packageId); })
                .then(function (cl) { return largestLabelLength(cl); });
            return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
        });
    });
}
/**
 *
 *
 * @param {*} An Array
 * @returns the length of largest object name in an array. Helper for
 * zcl_cluster_largest_label_length
 */
function largestLabelLength(arrayOfClusters) {
    return Math.max.apply(Math, __spreadArray([], __read(arrayOfClusters.map(function (cl) { return cl.label.length; })), false));
}
/**
 * Helper to extract the number of command arguments in a command
 *
 * @param {*} commandId
 * @returns Number of command arguments as an integer
 */
function zcl_command_arguments_count(commandId) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        return queryCommand.selectCommandArgumentsCountByCommandId(_this.global.db, commandId, packageId);
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 *
 * @param commandId
 * @param fixedLengthReturn
 * @param notFixedLengthReturn
 * @param currentContext
 * Returns fixedLengthReturn or notFixedLengthReturn based on whether the
 * command is fixed length or not
 */
function ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, fixedLengthReturn, notFixedLengthReturn, currentContext) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, commandArgs, isFixedLength, argIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(currentContext)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, queryCommand.selectCommandArgumentsByCommandId(currentContext.global.db, commandId)];
                case 2:
                    commandArgs = _a.sent();
                    isFixedLength = true;
                    for (argIndex = 0; argIndex < commandArgs.length; argIndex++) {
                        if (commandArgs[argIndex].isArray ||
                            types.isString(commandArgs[argIndex].type)) {
                            isFixedLength = false;
                        }
                    }
                    if (isFixedLength) {
                        return [2 /*return*/, fixedLengthReturn];
                    }
                    else {
                        return [2 /*return*/, notFixedLengthReturn];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *
 * @param commandId
 * @param fixedLengthReturn
 * @param notFixedLengthReturn
 * Returns fixedLengthReturn or notFixedLengthReturn based on whether the
 * command is fixed length or not. Does not check if command
 * arguments are always present or not.
 */
function if_command_arguments_have_fixed_length(commandId, fixedLengthReturn, notFixedLengthReturn) {
    return ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, fixedLengthReturn, notFixedLengthReturn, this);
}
/**
 *
 * @param type
 * @param command
 * @param commandArg
 * @param appendString
 * @param options
 * @returns the underlying zcl type of a command argument if the argument is
 * not fixed length but is always present. If the condition is not met then
 * returns an empty string.
 */
function as_underlying_zcl_type_command_is_not_fixed_length_but_command_argument_is_always_present(type, command, commandArg, appendString, options) {
    var _this = this;
    return templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        return queryCommand.selectCommandArgumentsByCommandId(_this.global.db, command);
    })
        .then(function (commandArgs) {
        return new Promise(function (resolve, reject) {
            var e_7, _a;
            try {
                for (var commandArgs_1 = __values(commandArgs), commandArgs_1_1 = commandArgs_1.next(); !commandArgs_1_1.done; commandArgs_1_1 = commandArgs_1.next()) {
                    var ca = commandArgs_1_1.value;
                    if (ca.isArray ||
                        types.isString(ca.type) ||
                        ca.introducedInRef ||
                        ca.removedInRef ||
                        ca.presentIf) {
                        resolve(false);
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (commandArgs_1_1 && !commandArgs_1_1.done && (_a = commandArgs_1.return)) _a.call(commandArgs_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            resolve(true);
        });
    })
        .then(function (isFixedLengthCommand) {
        if (isFixedLengthCommand) {
            return '';
        }
        else if (!(commandArg.isArray ||
            commandArg.introducedInRef ||
            commandArg.removedInRef ||
            commandArg.presentIf)) {
            return templateUtil
                .ensureZclPackageId(_this)
                .then(function (packageId) {
                return zclUtil.asUnderlyingZclTypeWithPackageId(type, options, packageId, _this);
            });
        }
        return '';
    })
        .then(function (res) { return (res ? res + appendString : res); })
        .catch(function (err) {
        env.logError('Failure in as_underlying_zcl_type_command_is_not_fixed_length_but_command_argument_is_always_present: ' +
            err);
    });
}
/**
 *
 * @param type
 * @param commandId
 * @param appendString
 * @param options
 * Returns: Given the commandId and the type of one of its arguments, based on
 * whether the command is fixed length or not either return nothing or return
 * the underlying zcl type appended with the appendString.
 */
function as_underlying_zcl_type_if_command_is_not_fixed_length(type, commandId, appendString, options) {
    var _this = this;
    var promise = ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this)
        .then(function (res) {
        if (res) {
            return '';
        }
        else {
            return templateUtil
                .ensureZclPackageId(_this)
                .then(function (packageId) {
                return zclUtil.asUnderlyingZclTypeWithPackageId(type, options, packageId, _this);
            });
        }
    })
        .then(function (res) { return (res ? res + appendString : res); })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 *
 * @param commandId
 * Returns the size of the command by calculating the sum total of the command arguments
 * Note: This helper should be called on fixed length commands only. It should not be
 * called with commands which do not have a fixed length.
 */
function command_arguments_total_length(commandId) {
    var _this = this;
    return templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        var res = queryCommand.selectCommandArgumentsByCommandId(_this.global.db, commandId);
        return res;
    })
        .then(function (commandArgs) {
        return new Promise(function (resolve, reject) {
            var argsLength = [];
            var _loop_1 = function (argIndex) {
                var argType = commandArgs[argIndex].type;
                var argOptions = {};
                argOptions.hash = {};
                argOptions.hash[dbEnum.zclType.zclCharFormatter] = true;
                var argLength = templateUtil
                    .ensureZclPackageId(_this)
                    .then(function (packageId) {
                    return zclUtil.asUnderlyingZclTypeWithPackageId(argType, argOptions, packageId, _this);
                });
                argsLength.push(argLength);
            };
            for (var argIndex = 0; argIndex < commandArgs.length; argIndex++) {
                _loop_1(argIndex);
            }
            resolve(argsLength);
        }).then(function (argsLength) {
            return Promise.all(argsLength).then(function (lengths) {
                return lengths.reduce(function (a, b) { return a + b; }, 0);
            });
        });
    })
        .catch(function (err) {
        return env.logError('Unable to get the length of the command arguments: ' + err);
    });
}
/**
 * Block helper iterating over command arguments within a command
 * or a command tree.
 *
 * @param {*} options
 * @returns Promise of command argument iteration.
 */
function zcl_command_arguments(options) {
    return __awaiter(this, void 0, void 0, function () {
        var commandArgs, p, promise;
        var _this = this;
        return __generator(this, function (_a) {
            commandArgs = this.commandArgs;
            // When we are coming from commant_tree, then
            // the commandArgs are already present and there is no need
            // to do additional queries.
            if (commandArgs == null) {
                p = templateUtil.ensureZclPackageId(this).then(function (packageId) {
                    if ('id' in _this) {
                        // We're functioning inside a nested context with an id, so we will only query for this cluster.
                        return queryCommand.selectCommandArgumentsByCommandId(_this.global.db, _this.id);
                    }
                    else {
                        return queryCommand.selectAllCommandArguments(_this.global.db, packageId);
                    }
                });
            }
            else {
                p = Promise.resolve(commandArgs);
            }
            promise = p.then(function (args) {
                return templateUtil.collectBlocks(args, options, _this);
            });
            return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
        });
    });
}
/**
 * Block helper iterating over the event fields inside an event.
 *
 * @param {*} options
 */
function zcl_event_fields(options) {
    var _this = this;
    var eventFields = this.eventField;
    var p;
    if (eventFields == null) {
        p = templateUtil.ensureZclPackageId(this).then(function (packageId) {
            if ('id' in _this) {
                return queryEvent.selectEventFieldsByEventId(_this.global.db, _this.id);
            }
            else {
                return queryEvent.selectAllEventFields(_this.global.db, packageId);
            }
        });
    }
    else {
        p = Promise.resolve(eventFields);
    }
    var promise = p.then(function (fields) {
        return templateUtil.collectBlocks(fields, options, _this);
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Helper that deals with the type of the argument.
 *
 * @param {*} typeName
 * @param {*} options
 */
function zcl_command_argument_data_type(type, options) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) {
        return Promise.all([
            zclUtil.isEnum(_this.global.db, type, packageId),
            zclUtil.isStruct(_this.global.db, type, packageId),
            zclUtil.isBitmap(_this.global.db, type, packageId),
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
            switch (resType) {
                case dbEnum.zclType.bitmap:
                    return helperC.data_type_for_bitmap(_this.global.db, type, packageId);
                case dbEnum.zclType.enum:
                    return helperC.data_type_for_enum(_this.global.db, type, packageId);
                case dbEnum.zclType.struct:
                    return options.hash.struct;
                case dbEnum.zclType.atomic:
                case dbEnum.zclType.unknown:
                default:
                    return helperC.as_cli_type(type);
            }
        })
            .catch(function (err) {
            env.logError(err);
            throw err;
        });
    })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 *
 * @param currentContext
 * @param packageId
 * @param type
 * @param options
 * @returns zcl cli type for an array
 */
function array_to_cli_data_type(currentContext, packageId, type, options) {
    return __awaiter(this, void 0, void 0, function () {
        var arrayAtomicResult, arrayAtomicSize;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectAtomicType(currentContext.global.db, packageId, type)];
                case 1:
                    arrayAtomicResult = _a.sent();
                    arrayAtomicSize = undefined;
                    if (!arrayAtomicResult) return [3 /*break*/, 3];
                    return [4 /*yield*/, zclUtil.calculateBytes(arrayAtomicResult.name, options, currentContext.global.db, packageId, false)];
                case 2:
                    arrayAtomicSize = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, zclUtil.calculateBytes(type, options, currentContext.global.db, packageId, false)];
                case 4:
                    arrayAtomicSize = _a.sent();
                    _a.label = 5;
                case 5:
                    if (arrayAtomicSize == undefined || arrayAtomicSize.isNaN) {
                        return [2 /*return*/, helperC.as_zcl_cli_type(dbEnum.zclType.string, true, false)];
                    }
                    else {
                        if (arrayAtomicResult) {
                            return [2 /*return*/, helperC.as_zcl_cli_type(arrayAtomicSize, true, arrayAtomicResult.isSigned)];
                        }
                        else {
                            return [2 /*return*/, helperC.as_zcl_cli_type(arrayAtomicSize, true, false)];
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *
 * @param currentContext
 * @param packageId
 * @param type
 * @param options
 * @returns zcl cli type for an enum
 */
function enum_to_cli_data_type(currentContext, packageId, type, options) {
    return __awaiter(this, void 0, void 0, function () {
        var enumRecord, enumType, enumSize;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectEnumByName(currentContext.global.db, type, packageId)];
                case 1:
                    enumRecord = _a.sent();
                    return [4 /*yield*/, queryZcl.selectAtomicType(currentContext.global.db, packageId, enumRecord.type)];
                case 2:
                    enumType = _a.sent();
                    return [4 /*yield*/, zclUtil.calculateBytes(enumType.name, options, currentContext.global.db, packageId, false)];
                case 3:
                    enumSize = _a.sent();
                    return [2 /*return*/, helperC.as_zcl_cli_type(enumSize, false, false)];
            }
        });
    });
}
/**
 *
 * @param currentContext
 * @param packageId
 * @param type
 * @param options
 * @returns zcl cli type for a bitmap
 */
function bitmap_to_cli_data_type(currentContext, packageId, type, options) {
    return __awaiter(this, void 0, void 0, function () {
        var bitmapRecord, bitmapType, bitmapSize;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectBitmapByName(currentContext.global.db, packageId, type)];
                case 1:
                    bitmapRecord = _a.sent();
                    return [4 /*yield*/, queryZcl.selectAtomicType(currentContext.global.db, packageId, bitmapRecord.type)];
                case 2:
                    bitmapType = _a.sent();
                    return [4 /*yield*/, zclUtil.calculateBytes(bitmapType.name, options, currentContext.global.db, packageId, false)];
                case 3:
                    bitmapSize = _a.sent();
                    return [2 /*return*/, helperC.as_zcl_cli_type(bitmapSize, false, false)];
            }
        });
    });
}
/**
 * Helper that deals with the type of the argument.
 *
 * @param {*} typeName
 * @param {*} options
 */
function zcl_command_argument_type_to_cli_data_type(type, options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, isEnumType, isBitmapType, atomicResult, atomicSize, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _b.sent();
                    return [4 /*yield*/, zclUtil.isEnum(this.global.db, type, packageId)];
                case 2:
                    isEnumType = _b.sent();
                    return [4 /*yield*/, zclUtil.isBitmap(this.global.db, type, packageId)];
                case 3:
                    isBitmapType = _b.sent();
                    if (!('isArray' in this && this.isArray)) return [3 /*break*/, 4];
                    return [2 /*return*/, array_to_cli_data_type(this, packageId, type, options)];
                case 4:
                    if (!(isEnumType == dbEnum.zclType.enum)) return [3 /*break*/, 5];
                    return [2 /*return*/, enum_to_cli_data_type(this, packageId, type, options)];
                case 5:
                    if (!(isBitmapType == dbEnum.zclType.bitmap)) return [3 /*break*/, 6];
                    return [2 /*return*/, bitmap_to_cli_data_type(this, packageId, type, options)];
                case 6: return [4 /*yield*/, queryZcl.selectAtomicType(this.global.db, packageId, type)];
                case 7:
                    atomicResult = _b.sent();
                    if (!atomicResult) return [3 /*break*/, 9];
                    return [4 /*yield*/, zclUtil.calculateBytes(atomicResult.name, options, this.global.db, packageId, false)];
                case 8:
                    _a = _b.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, zclUtil.calculateBytes(type, options, this.global.db, packageId, false)];
                case 10:
                    _a = _b.sent();
                    _b.label = 11;
                case 11:
                    atomicSize = _a;
                    if (atomicSize == undefined || atomicSize.isNaN) {
                        return [2 /*return*/, helperC.as_zcl_cli_type(dbEnum.zclType.string, false, false)];
                    }
                    else {
                        if (atomicResult) {
                            return [2 /*return*/, helperC.as_zcl_cli_type(atomicSize, false, atomicResult.isSigned)];
                        }
                        else {
                            return [2 /*return*/, helperC.as_zcl_cli_type(atomicSize, false, false)];
                        }
                    }
                    _b.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Helper that deals with the type of the argument.
 *
 * @param {*} typeName
 * @param {*} options
 * Note: If the options has zclCharFormatter set to true then the function will
 * return the user defined data associated with the zcl data type and not the
 * actual data type.
 *
 * example:
 * {{asUnderlyingZclType [array type] array="b" one_byte="u" two_byte="v" three_byte="x"
 *  four_byte="w" short_string="s" long_string="l" default="b"
 *  zclCharFormatter="true"}}
 *
 * For the above if asUnderlyingZclType was given [array type] then the above
 * will return 'b'
 */
function asUnderlyingZclType(type, options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    promise = zclUtil
                        .asUnderlyingZclTypeWithPackageId(type, options, packageId, this)
                        .catch(function (err) {
                        env.logError(err);
                        throw err;
                    });
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 *
 * @param type
 * @param options
 * Returns the data mentioned in the helper options based on whether the type
 * is short string, long string or not a string
 * Example:
 * {{zcl_string_type_return type short_string="short string output"
 *                               long_string="short string output"
 *                               default="Output when not a string")
 *
 */
function zcl_string_type_return(type, options) {
    if (!('short_string' in options.hash &&
        'long_string' in options.hash &&
        'default' in options.hash)) {
        throw new Error('Specify all options for the helper');
    }
    if (types.isOneBytePrefixedString(type.toLowerCase())) {
        return options.hash.short_string;
    }
    else if (types.isTwoBytePrefixedString(type.toLowerCase())) {
        return options.hash.long_string;
    }
    else {
        return options.hash.default;
    }
}
/**
 *
 * @param type
 * Return: true or false based on whether the type is a string or not.
 */
function is_zcl_string(type) {
    return types.isString(type);
}
/**
 * If helper that checks if a type is a bitmap
 *
 * example:
 * {{#if_is_bitmap type}}
 * type is bitmap
 * {{else}}
 * type is not bitmap
 * {{/if_is_bitmap}}
 *
 * @param {*} type
 * @returns Promise of content.
 */
function if_is_bitmap(type, options) {
    var _this = this;
    var promise = templateUtil.ensureZclPackageId(this).then(function (packageId) {
        return queryZcl.selectBitmapByName(_this.global.db, packageId, type).then(function (st) {
            if (st || type.startsWith('map')) {
                return options.fn(_this);
            }
            return options.inverse(_this);
        });
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * If helper that checks if a type is an enum
 *
 * * example:
 * {{#if_is_enum type}}
 * type is enum
 * {{else}}
 * type is not enum
 * {{/if_is_enum}}
 *
 * @param {*} type
 * @returns Promise of content.
 */
function if_is_enum(type, options) {
    var _this = this;
    var promise = templateUtil.ensureZclPackageId(this).then(function (packageId) {
        return queryZcl.selectEnumByName(_this.global.db, type, packageId).then(function (st) {
            if (st || type.startsWith('enum')) {
                return options.fn(_this);
            }
            return options.inverse(_this);
        });
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * If helper that checks if a type is an struct
 *
 * * example:
 * {{#if_is_struct type}}
 * type is struct
 * {{else}}
 * type is not struct
 * {{/if_is_struct}}
 *
 * @param type
 * @returns Promise of content.
 */
function if_is_struct(type, options) {
    var _this = this;
    var promise = templateUtil.ensureZclPackageId(this).then(function (packageId) {
        return queryZcl.selectStructByName(_this.global.db, type, packageId).then(function (st) {
            if (st) {
                return options.fn(_this);
            }
            return options.inverse(_this);
        });
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Checks if the side is client or not
 *
 * @param {*} side
 * @returns boolean
 */
function isClient(side) {
    return 0 == side.localeCompare(dbEnum.side.client);
}
/**
 * Checks if the side is server or not
 *
 * @param {*} side
 * @returns boolean
 */
function isServer(side) {
    return 0 == side.localeCompare(dbEnum.side.server);
}
function isStrEqual(str1, str2) {
    return 0 == str1.localeCompare(str2);
}
function isLastElement(index, count) {
    return index == count - 1;
}
function isFirstElement(index, count) {
    return index == 0;
}
function isEnabled(enable) {
    return 1 == enable;
}
function isCommandAvailable(clusterSide, incoming, outgoing, source, name) {
    if (0 == clusterSide.localeCompare(source)) {
        return false;
    }
    return ((isClient(clusterSide) && incoming) || (isServer(clusterSide) && incoming));
}
/**
 *
 *
 * @param type: type of argument
 * @param commandId: command id
 * @param appendString: append the string to the argument
 * @param introducedInRef: If the command argument is not present in all zcl
 * specifications and was introduced in a certain specification version then this will not be null
 * @param removedInRef: If the command argument is not present in all zcl
 * specifications and was removed in a certain specification version then this will not be null
 * @param presentIf: If the command argument is present conditionally then this will be a condition
 * and not null
 *
 * @param options: options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed length and the command
 * argument is always present in all zcl specifications.
 */
function as_underlying_zcl_type_command_argument_always_present(type, commandId, appendString, introducedInRef, removedInRef, presentIf, options) {
    var _this = this;
    var promise = ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this)
        .then(function (res) {
        if (res) {
            return '';
        }
        else {
            // Return the underlying zcl type since command argument is always present
            if (introducedInRef || removedInRef || presentIf) {
                // Return nothing if the command argument is not always present
                return '';
            }
            else {
                // Return the underlying zcl type if the command argument is always present.
                return templateUtil
                    .ensureZclPackageId(_this)
                    .then(function (packageId) {
                    return zclUtil.asUnderlyingZclTypeWithPackageId(type, options, packageId, _this);
                });
            }
        }
    })
        // Adding the appendString for the underlying zcl type
        .then(function (res) { return (res ? res + appendString : res); })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 *
 *
 * @param commandId
 * @param introducedInRef
 * @param removedInRef
 * @param presentIf
 * @param argumentPresentReturn
 * @param argumentNotPresentReturn
 * @returns argumentPresentReturn if the command is not fixed length and command
 * argument is always present without conditions(introducedInRef, removedInRef,
 * presentIf) else returns argumentNotPresentReturn
 */
function if_command_argument_always_present(commandId, introducedInRef, removedInRef, presentIf, argumentPresentReturn, argumentNotPresentReturn) {
    return ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this).then(function (res) {
        if (res) {
            return ''; // Return nothing since command is a fixed length command
        }
        else {
            if (introducedInRef || removedInRef || presentIf) {
                return argumentNotPresentReturn;
            }
            return argumentPresentReturn;
        }
    });
}
/**
 *
 *
 * @param type: type of argument
 * @param commandId: command id
 * @param appendString: append the string to the argument
 * @param introducedInRef: If the command argument is not present in all zcl
 * specifications and was introduced in a certain specification version then this will not be null
 * @param removedInRef: If the command argument is not present in all zcl
 * specifications and was removed in a certain specification version then this will not be null
 * @param presentIf: If the command argument is present conditionally then this will be a condition
 * and not null
 * @param options: options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed length, the command
 * argument is not always present in all zcl specifications and there is no present if conditionality
 * on the command argument.
 */
function as_underlying_zcl_type_command_argument_not_always_present_no_presentif(type, commandId, appendString, introducedInRef, removedInRef, presentIf, options) {
    var _this = this;
    var promise = ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this)
        .then(function (res) {
        if (res) {
            return ''; // Return nothing since the command is of fixed length
        }
        else {
            // Return the underlying zcl type since command argument is not always present and there is no present if conditionality
            if ((introducedInRef || removedInRef) && !presentIf) {
                return templateUtil
                    .ensureZclPackageId(_this)
                    .then(function (packageId) {
                    return zclUtil.asUnderlyingZclTypeWithPackageId(type, options, packageId, _this);
                });
            }
            else {
                return '';
            }
        }
    })
        // Adding the appendString for the underlying zcl type
        .then(function (res) { return (res ? res + appendString : res); })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * @param commandArg command argument
 * @param appendString append the string to the argument
 * @param options options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed
 * length, the command argument is not always present in all zcl specifications
 * and there is no present if conditionality on the command argument.
 */
function as_underlying_zcl_type_ca_not_always_present_no_presentif(commandArg, appendString, options) {
    var _this = this;
    // Return the underlying zcl type since command argument is not always
    // present and there is no present if conditionality
    if ((commandArg.introducedInRef || commandArg.removedInRef) &&
        !commandArg.presentIf) {
        var promise = templateUtil
            .ensureZclPackageId(this)
            .then(function (packageId) {
            return zclUtil.asUnderlyingZclTypeWithPackageId(commandArg.type, options, packageId, _this);
        }) // Adding the appendString for the underlying zcl type
            .then(function (res) { return (res ? res + appendString : res); })
            .catch(function (err) {
            env.logError('Error in as_underlying_zcl_type_ca_not_always_present_no_presentif ' +
                err);
            throw err;
        });
        return templateUtil.templatePromise(this.global, promise);
    }
    else {
        return '';
    }
}
/**
 *
 *
 * @param commandId
 * @param introducedInRef
 * @param removedInRef
 * @param presentIf
 * @param argumentNotInAllVersionsReturn
 * @param argumentInAllVersionsReturn
 * @returns argumentNotInAllVersionsReturn if the command is not fixed length and command
 * argument is present with conditions introducedInRef or removedInRef but no presentIf
 * conditions else returns argumentNotPresentReturn
 */
function if_command_argument_not_always_present_no_presentif(commandId, introducedInRef, removedInRef, presentIf, argumentNotInAllVersionsReturn, argumentInAllVersionsReturn) {
    return ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this).then(function (res) {
        if (res) {
            return ''; // Return nothing since it is a fixed length command
        }
        else {
            if ((introducedInRef || removedInRef) && !presentIf) {
                return argumentNotInAllVersionsReturn;
            }
            return argumentInAllVersionsReturn;
        }
    });
}
/**
 *
 *
 * @param type: type of argument
 * @param commandId: command id
 * @param appendString: append the string to the argument
 * @param introducedInRef: If the command argument is not present in all zcl
 * specifications and was introduced in a certain specification version then this will not be null
 * @param removedInRef: If the command argument is not present in all zcl
 * specifications and was removed in a certain specification version then this will not be null
 * @param presentIf: If the command argument is present conditionally then this will be a condition
 * and not null
 * @param options: options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed length, the command
 * argument is not always present in all zcl specifications and there is a present if conditionality
 * on the command argument.
 */
function as_underlying_zcl_type_command_argument_not_always_present_with_presentif(type, commandId, appendString, introducedInRef, removedInRef, presentIf, options) {
    var _this = this;
    var promise = ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this)
        .then(function (res) {
        if (res) {
            return ''; // Return nothing since the command is of fixed length
        }
        else {
            // Return the underlying zcl type since command argument is not always present and there is present if conditionality.
            if ((introducedInRef || removedInRef) && presentIf) {
                return templateUtil
                    .ensureZclPackageId(_this)
                    .then(function (packageId) {
                    return zclUtil.asUnderlyingZclTypeWithPackageId(type, options, packageId, _this);
                });
            }
            else {
                return '';
            }
        }
    })
        // Adding the appendString for the underlying zcl type
        .then(function (res) { return (res ? res + appendString : res); })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * @param commandArg command argument
 * @param appendString append the string to the argument
 * @param options options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed
 * length, the command argument is not always present in all zcl specifications
 * but there is a present if conditionality on the command argument.
 */
function as_underlying_zcl_type_ca_not_always_present_with_presentif(commandArg, appendString, options) {
    var _this = this;
    // Return the underlying zcl type since command argument is not always
    // present and there is a present if conditionality
    if ((commandArg.introducedInRef || commandArg.removedInRef) &&
        commandArg.presentIf) {
        var promise = templateUtil
            .ensureZclPackageId(this)
            .then(function (packageId) {
            return zclUtil.asUnderlyingZclTypeWithPackageId(commandArg.type, options, packageId, _this);
        }) // Adding the appendString for the underlying zcl type
            .then(function (res) { return (res ? res + appendString : res); })
            .catch(function (err) {
            env.logError('Error in as_underlying_zcl_type_ca_not_always_present_with_presentif ' +
                err);
            throw err;
        });
        return templateUtil.templatePromise(this.global, promise);
    }
    else {
        return '';
    }
}
/**
 *
 *
 * @param commandId
 * @param introducedInRef
 * @param removedInRef
 * @param presentIf
 * @param argumentNotInAllVersionsPresentIfReturn
 * @param argumentInAllVersionsReturn
 * @returns argumentNotInAllVersionsReturn if the command is not fixed length, command
 * argument is present with conditions introducedInRef or removedInRef and presentIf
 * conditions exist as well else returns argumentNotPresentReturn
 */
function if_command_argument_not_always_present_with_presentif(commandId, introducedInRef, removedInRef, presentIf, argumentNotInAllVersionsPresentIfReturn, argumentInAllVersionsReturn) {
    return ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this).then(function (res) {
        if (res) {
            return ''; // Return nothing since it is a fixed length command
        }
        else {
            if ((introducedInRef || removedInRef) && presentIf) {
                return argumentNotInAllVersionsPresentIfReturn;
            }
            return argumentInAllVersionsReturn;
        }
    });
}
/**
 *
 *
 * @param type: type of argument
 * @param commandId: command id
 * @param appendString: append the string to the argument
 * @param introducedInRef: If the command argument is not present in all zcl
 * specifications and was introduced in a certain specification version then this will not be null
 * @param removedInRef: If the command argument is not present in all zcl
 * specifications and was removed in a certain specification version then this will not be null
 * @param presentIf: If the command argument is present conditionally then this will be a condition
 * and not null
 * @param options: options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed length, the command
 * argument is always present in all zcl specifications and there is a present if conditionality
 * on the command argument.
 */
function as_underlying_zcl_type_command_argument_always_present_with_presentif(type, commandId, appendString, introducedInRef, removedInRef, presentIf, options) {
    var _this = this;
    var promise = ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this)
        .then(function (res) {
        if (res) {
            return ''; // Return nothing since the command is of fixed length
        }
        else {
            // Return the underlying zcl type since command argument is always present and there is a present if condition
            if (!(introducedInRef || removedInRef) && presentIf) {
                return templateUtil
                    .ensureZclPackageId(_this)
                    .then(function (packageId) {
                    return zclUtil.asUnderlyingZclTypeWithPackageId(type, options, packageId, _this);
                });
            }
            else {
                return '';
            }
        }
    })
        // Adding the appendString for the underlying zcl type
        .then(function (res) { return (res ? res + appendString : res); })
        .catch(function (err) {
        env.logError(err);
        throw err;
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * @param commandArg command argument
 * @param appendString append the string to the argument
 * @param options options which can be passed to zclUtil.asUnderlyingZclTypeWithPackageId
 * for determining the underlying zcl type for the provided argument type
 * @returns A string as an underlying zcl type if the command is not fixed
 * length, the command argument is always present in all zcl specifications
 * but there is a present if conditionality on the command argument.
 */
function as_underlying_zcl_type_ca_always_present_with_presentif(commandArg, appendString, options) {
    var _this = this;
    // Return the underlying zcl type since command argument is always
    // present and there is a present if conditionality
    if (!(commandArg.introducedInRef || commandArg.removedInRef) &&
        commandArg.presentIf) {
        var promise = templateUtil
            .ensureZclPackageId(this)
            .then(function (packageId) {
            return zclUtil.asUnderlyingZclTypeWithPackageId(commandArg.type, options, packageId, _this);
        }) // Adding the appendString for the underlying zcl type
            .then(function (res) { return (res ? res + appendString : res); })
            .catch(function (err) {
            env.logError('Error in as_underlying_zcl_type_ca_always_present_with_presentif ' +
                err);
            throw err;
        });
        return templateUtil.templatePromise(this.global, promise);
    }
    else {
        return '';
    }
}
/**
 *
 *
 * @param commandId
 * @param introducedInRef
 * @param removedInRef
 * @param presentIf
 * @param argumentNotInAllVersionsPresentIfReturn
 * @param argumentInAllVersionsReturn
 * @returns argumentInAllVersionsPresentIfReturn if the command is not fixed length, command
 * argument is always present and presentIf conditions exist else returns argumentNotPresentReturn
 */
function if_command_argument_always_present_with_presentif(commandId, introducedInRef, removedInRef, presentIf, argumentInAllVersionsPresentIfReturn, argumentNotAlwaysThereReturn) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ifCommandArgumentsHaveFixedLengthWithCurrentContext(commandId, true, false, this)];
                case 1:
                    res = _a.sent();
                    if (res) {
                        return [2 /*return*/, '']; // Return nothing since it is a fixed length command
                    }
                    else {
                        if (!(introducedInRef || removedInRef) && presentIf) {
                            return [2 /*return*/, argumentInAllVersionsPresentIfReturn];
                        }
                        return [2 /*return*/, argumentNotAlwaysThereReturn];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *
 *
 * @param {*} clusterId
 * @param {*} manufacturer_specific_return
 * @param {*} null_manufacturer_specific_return
 * @returns manufacturer_specific_return if the cluster is manufacturer
 * specific or returns null_manufacturer_specific_return if cluster is
 * not manufacturer specific.
 */
function if_manufacturing_specific_cluster(clusterId, manufacturer_specific_return, null_manufacturer_specific_return) {
    var _this = this;
    var promise = templateUtil
        .ensureZclPackageId(this)
        .then(function (packageId) { return queryZcl.selectClusterById(_this.global.db, clusterId); })
        .then(function (res) {
        if (res.manufacturerCode != null) {
            return manufacturer_specific_return;
        }
        else {
            return null_manufacturer_specific_return;
        }
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * If helper which checks if cluster is manufacturing specific or not
 * example:
 * {{#if_mfg_specific_cluster clusterId}}
 *  cluster is manufacturing specific
 * {{else}}
 *  cluster is not manufacturing specific
 * {{/if_mfg_specific_cluster}}
 *
 * @param clusterId
 * @param options
 * @returns Returns content in the handlebar template based on whether the
 * command is manufacturing specific or not.
 */
function if_mfg_specific_cluster(clusterId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryZcl.selectClusterById(this.global.db, clusterId)];
                case 1:
                    res = _a.sent();
                    if (res.manufacturerCode != null) {
                        return [2 /*return*/, options.fn(this)];
                    }
                    else {
                        return [2 /*return*/, options.inverse(this)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Given the value and size of an attribute along with endian as an option.
 * This helper returns the attribute value as big/little endian.
 * Example: {{as_generated_default_macro 0x00003840 4 endian="big"}}
 * will return: 0x00, 0x00, 0x38, 0x40,
 * @param value
 * @param attributeSize
 * @param options
 * @returns Formatted attribute value based on given arguments
 */
function as_generated_default_macro(value, attributeSize, options) {
    return __awaiter(this, void 0, void 0, function () {
        var default_macro_signature, default_macro, padding_length, i, default_macro_1, default_macro_1_1, m;
        var e_8, _a;
        return __generator(this, function (_b) {
            default_macro_signature = '';
            if (attributeSize > 2) {
                default_macro = helperC
                    .asHex(value, null, null)
                    .replace('0x', '')
                    .match(/.{1,2}/g);
                padding_length = attributeSize - default_macro.length;
                for (i = 0; i < padding_length; i++) {
                    default_macro_signature += '0x00, ';
                }
                try {
                    for (default_macro_1 = __values(default_macro), default_macro_1_1 = default_macro_1.next(); !default_macro_1_1.done; default_macro_1_1 = default_macro_1.next()) {
                        m = default_macro_1_1.value;
                        default_macro_signature += ' 0x' + m + ',';
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (default_macro_1_1 && !default_macro_1_1.done && (_a = default_macro_1.return)) _a.call(default_macro_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                // Applying endianess to attributes with size less than equal to 8 bytes.
                // Thus only swapping int64u or smaller
                if (options.hash.endian != 'big' && attributeSize <= 8) {
                    default_macro_signature = default_macro_signature
                        .split(' ')
                        .reverse()
                        .join(' ');
                }
            }
            return [2 /*return*/, default_macro_signature];
        });
    });
}
/**
 * Given the attributes of a zcl attribute. Creates an attribute mask based on
 * the given options
 * @param writable
 * @param storageOption
 * @param minMax
 * @param mfgSpecific
 * @param clusterCode
 * @param client
 * @param isSingleton
 * @param prefixString
 * @param postfixString
 * @returns attribute mask based on given values
 */
function attribute_mask(writable, storageOption, minMax, mfgSpecific, clusterCode, client, isSingleton, prefixString, postfixString) {
    return __awaiter(this, void 0, void 0, function () {
        var attributeMask;
        return __generator(this, function (_a) {
            attributeMask = '';
            // mask for isWritable
            if (writable) {
                attributeMask +=
                    (attributeMask ? '| ' : '') + prefixString + 'WRITABLE' + postfixString;
            }
            // mask for storage option
            if (storageOption === 'NVM') {
                attributeMask +=
                    (attributeMask ? '| ' : '') + prefixString + 'TOKENIZE' + postfixString;
            }
            else if (storageOption === 'External') {
                attributeMask +=
                    (attributeMask ? '| ' : '') +
                        prefixString +
                        'EXTERNAL_STORAGE' +
                        postfixString;
            }
            // mask for bound
            if (minMax) {
                attributeMask +=
                    (attributeMask ? '| ' : '') + prefixString + 'MIN_MAX' + postfixString;
            }
            // mask for manufacturing specific attributes
            if (mfgSpecific && clusterCode < 64512) {
                attributeMask +=
                    (attributeMask ? '| ' : '') +
                        prefixString +
                        'MANUFACTURER_SPECIFIC' +
                        postfixString;
            }
            // mask for client side attribute
            if (client === 'client') {
                attributeMask +=
                    (attributeMask ? '| ' : '') + prefixString + 'CLIENT' + postfixString;
            }
            //mask for singleton attirbute
            if (isSingleton) {
                attributeMask +=
                    (attributeMask ? '| ' : '') + prefixString + 'SINGLETON' + postfixString;
            }
            if (!attributeMask) {
                attributeMask = '0x00';
            }
            return [2 /*return*/, attributeMask];
        });
    });
}
/**
 * Given the attributes of a zcl command. Creates a command mask based on
 * the given options
 * @param commmandSource
 * @param clusterSide
 * @param isIncomingEnabled
 * @param isOutgoingEnabled
 * @param manufacturingCode
 * @param prefixForMask
 * @returns command mask based on given values
 */
function command_mask(commmandSource, clusterSide, isIncomingEnabled, isOutgoingEnabled, manufacturingCode, prefixForMask) {
    return __awaiter(this, void 0, void 0, function () {
        var commandMask;
        return __generator(this, function (_a) {
            commandMask = '';
            if (isClient(commmandSource)) {
                if ((isIncomingEnabled && commmandSource != clusterSide) ||
                    (isIncomingEnabled && clusterSide == 'either')) {
                    commandMask += command_mask_sub_helper(commandMask, prefixForMask + 'INCOMING_SERVER');
                }
                if ((isOutgoingEnabled && commmandSource == clusterSide) ||
                    (isOutgoingEnabled && clusterSide == 'either')) {
                    commandMask += command_mask_sub_helper(commandMask, prefixForMask + 'OUTGOING_CLIENT');
                }
            }
            else {
                if ((isIncomingEnabled && commmandSource != clusterSide) ||
                    (isIncomingEnabled && clusterSide == 'either')) {
                    commandMask += command_mask_sub_helper(commandMask, prefixForMask + 'INCOMING_CLIENT');
                }
                if ((isOutgoingEnabled && commmandSource == clusterSide) ||
                    (isOutgoingEnabled && clusterSide == 'either')) {
                    commandMask += command_mask_sub_helper(commandMask, prefixForMask + 'OUTGOING_SERVER');
                }
            }
            if (manufacturingCode && commandMask) {
                commandMask += command_mask_sub_helper(commandMask, prefixForMask + 'MANUFACTURER_SPECIFIC');
            }
            return [2 /*return*/, commandMask];
        });
    });
}
/**
 * A Sub helper api for command_mask to reduce code redundancy
 * @param commandMask
 * @param str
 * @returns command mask addition based on the arguments
 */
function command_mask_sub_helper(commandMask, str) {
    if (commandMask) {
        return ' | ' + str;
    }
    else {
        return str;
    }
}
/**
 * This may be used within all_user_cluster_attributes_for_generated_defaults
 * for example:
 * {{format_zcl_string_as_characters_for_generated_defaults 'abc' 5}}
 * will return as follows:
 * 3, 'a', 'b', 'c' 0x00, 0x00
 * @param stringVal
 * @param sizeOfString
 * @returns Formatted string for generated defaults starting with the lenth of a
 * string then each character and then filler for the size allocated for the
 * string
 */
function format_zcl_string_as_characters_for_generated_defaults(stringVal, sizeOfString) {
    return __awaiter(this, void 0, void 0, function () {
        var lengthOfString, formatted_string, i, i;
        return __generator(this, function (_a) {
            lengthOfString = stringVal.length;
            formatted_string = lengthOfString + ', ';
            for (i = 0; i < lengthOfString; i++) {
                formatted_string += "'" + stringVal.charAt(i) + "', ";
            }
            for (i = lengthOfString + 1; i < sizeOfString; i++) {
                formatted_string += '0x00' + ', ';
            }
            return [2 /*return*/, formatted_string];
        });
    });
}
var dep = templateUtil.deprecatedHelper;
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.zcl_bitmaps = zcl_bitmaps;
exports.zcl_bitmap_items = zcl_bitmap_items;
exports.zcl_enums = zcl_enums;
exports.zcl_enum_items = zcl_enum_items;
exports.zcl_structs = zcl_structs;
exports.zcl_struct_items = zcl_struct_items;
exports.zcl_struct_items_by_struct_name = zcl_struct_items_by_struct_name;
exports.zcl_clusters = zcl_clusters;
exports.zcl_device_types = zcl_device_types;
exports.zcl_commands = zcl_commands;
exports.zcl_commands_source_client = zcl_commands_source_client;
exports.zcl_commands_source_server = zcl_commands_source_server;
exports.zcl_events = zcl_events;
exports.zcl_event_fields = zcl_event_fields;
exports.zcl_command_tree = zcl_command_tree;
exports.zcl_attributes = zcl_attributes;
exports.zcl_attributes_client = zcl_attributes_client;
exports.zcl_attributes_server = zcl_attributes_server;
exports.zcl_atomics = zcl_atomics;
exports.zcl_global_commands = zcl_global_commands;
exports.zcl_cluster_largest_label_length = zcl_cluster_largest_label_length;
exports.zcl_command_arguments_count = zcl_command_arguments_count;
exports.zcl_command_arguments = zcl_command_arguments;
exports.zcl_command_argument_data_type = zcl_command_argument_data_type;
exports.is_client = isClient;
exports.isClient = dep(isClient, { to: 'is_client' });
exports.is_server = isServer;
exports.isServer = dep(isServer, { to: 'is_server' });
exports.is_str_equal = isStrEqual;
exports.isStrEqual = dep(isStrEqual, { to: 'is_str_equal' });
exports.is_last_element = isLastElement;
exports.isLastElement = dep(isLastElement, {
    to: 'is_last_element',
});
exports.is_first_element = isFirstElement;
exports.isFirstElement = dep(isFirstElement, {
    to: 'is_first_element',
});
exports.is_enabled = isEnabled;
exports.isEnabled = dep(isEnabled, { to: 'is_enabled' });
exports.is_command_available = isCommandAvailable;
exports.isCommandAvailable = dep(isCommandAvailable, {
    to: 'is_command_available',
});
exports.as_underlying_zcl_type = asUnderlyingZclType;
exports.asUnderlyingZclType = dep(asUnderlyingZclType, {
    to: 'as_underlying_zcl_type',
});
exports.if_is_bitmap = if_is_bitmap;
exports.if_is_enum = if_is_enum;
exports.is_bitmap = zclUtil.isBitmap;
exports.isBitmap = dep(zclUtil.isBitmap, { to: 'is_bitmap' });
exports.is_struct = zclUtil.isStruct;
exports.isStruct = dep(zclUtil.isStruct, { to: 'is_struct' });
exports.is_enum = zclUtil.isEnum;
exports.isEnum = dep(zclUtil.isEnum, { to: 'is_enum' });
exports.if_manufacturing_specific_cluster = dep(if_manufacturing_specific_cluster, { to: 'if_mfg_specific_cluster' });
exports.zcl_command_argument_type_to_cli_data_type =
    zcl_command_argument_type_to_cli_data_type;
exports.zcl_string_type_return = zcl_string_type_return;
exports.is_zcl_string = is_zcl_string;
exports.if_command_arguments_have_fixed_length =
    if_command_arguments_have_fixed_length;
exports.command_arguments_total_length = command_arguments_total_length;
exports.as_underlying_zcl_type_if_command_is_not_fixed_length =
    as_underlying_zcl_type_if_command_is_not_fixed_length;
exports.if_command_argument_always_present = dep(if_command_argument_always_present, {
    to: 'if_command_is_not_fixed_length_but_command_argument_is_always_present',
});
exports.as_underlying_zcl_type_command_argument_always_present = dep(as_underlying_zcl_type_command_argument_always_present, {
    to: 'as_underlying_zcl_type_command_is_not_fixed_length_but_command_argument_is_always_present',
});
exports.if_command_argument_always_present_with_presentif = dep(if_command_argument_always_present_with_presentif, { to: 'if_ca_always_present_with_presentif' });
exports.as_underlying_zcl_type_command_argument_always_present_with_presentif =
    dep(as_underlying_zcl_type_command_argument_always_present_with_presentif, {
        to: 'as_underlying_zcl_type_ca_always_present_with_presentif',
    });
exports.if_command_argument_not_always_present_with_presentif = dep(if_command_argument_not_always_present_with_presentif, { to: 'if_ca_not_always_present_with_presentif' });
exports.as_underlying_zcl_type_command_argument_not_always_present_with_presentif =
    dep(as_underlying_zcl_type_command_argument_not_always_present_with_presentif, { to: 'as_underlying_zcl_type_ca_not_always_present_with_presentif' });
exports.if_command_argument_not_always_present_no_presentif = dep(if_command_argument_not_always_present_no_presentif, { to: 'if_ca_not_always_present_no_presentif' });
exports.as_underlying_zcl_type_command_argument_not_always_present_no_presentif =
    dep(as_underlying_zcl_type_command_argument_not_always_present_no_presentif, {
        to: 'as_underlying_zcl_type_ca_not_always_present_no_presentif',
    });
exports.as_generated_default_macro = as_generated_default_macro;
exports.attribute_mask = attribute_mask;
exports.command_mask = command_mask;
exports.format_zcl_string_as_characters_for_generated_defaults =
    format_zcl_string_as_characters_for_generated_defaults;
exports.as_underlying_zcl_type_command_is_not_fixed_length_but_command_argument_is_always_present =
    dep(as_underlying_zcl_type_command_is_not_fixed_length_but_command_argument_is_always_present, 'as_underlying_zcl_type_command_is_not_fixed_length_but_command_argument_is_always_present has been deprecated. Use as_underlying_zcl_type and if_command_not_fixed_length_command_argument_always_present instead');
exports.as_underlying_zcl_type_ca_not_always_present_no_presentif = dep(as_underlying_zcl_type_ca_not_always_present_no_presentif, 'as_underlying_zcl_type_ca_not_always_present_no_presentif has been deprecated. Use as_underlying_zcl_type and if_command_arg_not_always_present_no_presentif instead');
exports.as_underlying_zcl_type_ca_not_always_present_with_presentif = dep(as_underlying_zcl_type_ca_not_always_present_with_presentif, 'as_underlying_zcl_type_ca_not_always_present_with_presentif has been deprecated. Use as_underlying_zcl_type and if_command_arg_not_always_present_with_presentif instead');
exports.as_underlying_zcl_type_ca_always_present_with_presentif = dep(as_underlying_zcl_type_ca_always_present_with_presentif, 'as_underlying_zcl_type_ca_always_present_with_presentif has been deprecated. Use as_underlying_zcl_type and if_command_arg_always_present_with_presentif instead.');
exports.if_is_struct = if_is_struct;
exports.if_mfg_specific_cluster = if_mfg_specific_cluster;
exports.zcl_commands_with_cluster_info = zcl_commands_with_cluster_info;
exports.zcl_commands_with_arguments = zcl_commands_with_arguments;
//# sourceMappingURL=helper-zcl.js.map