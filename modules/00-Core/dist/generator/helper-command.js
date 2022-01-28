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
var queryCommand = require('../db/query-command.js');
var templateUtil = require('./template-util.js');
var types = require('../util/types.js');
/**
 *
 * @param {*} commandId
 * @param {*} argument_return
 * @param {*} no_argument_return
 *
 * If the command arguments for a command exist then returns argument_return
 * else returns no_argument_return
 * Example: {{if_command_arguments_exist [command-id] "," ""}}
 * The above will return ',' if the command arguments for a command exist
 * and will return nothing if the command arguments for a command do not exist.
 *
 */
function if_command_arguments_exist(commandId, argument_return, no_argument_return) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, promise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    promise = queryCommand
                        .selectCommandArgumentsCountByCommandId(this.global.db, commandId, packageId)
                        .then(function (res) {
                        if (res > 0) {
                            return argument_return;
                        }
                        else {
                            return no_argument_return;
                        }
                    });
                    return [2 /*return*/, templateUtil.templatePromise(this.global, promise)];
            }
        });
    });
}
/**
 * If helper which checks if command arguments exist for a command or not
 * example:
 * {{#if_command_args_exist commandId}}
 *  command arguments exist for the command
 * {{else}}
 *  command arguments do not exist for the command
 * {{/if_command_args_exist}}
 *
 * @param commandId
 * @param options
 * @returns Returns content in the handlebar template based on whether the
 * command arguments are present or not.
 *
 */
function if_command_args_exist(commandId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageId, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureZclPackageId(this)];
                case 1:
                    packageId = _a.sent();
                    return [4 /*yield*/, queryCommand.selectCommandArgumentsCountByCommandId(this.global.db, commandId, packageId)];
                case 2:
                    res = _a.sent();
                    if (res > 0) {
                        return [2 /*return*/, options.fn(this)];
                    }
                    return [2 /*return*/, options.inverse(this)];
            }
        });
    });
}
/**
 *
 * @param commandArg
 * @param trueReturn
 * @param falseReturn
 * @returns trueReturn if command argument is always present and there is a
 * presentIf condition else returns false
 */
function if_ca_always_present_with_presentif(commandArg, trueReturn, falseReturn) {
    if (!(commandArg.introducedInRef || commandArg.removedInRef) &&
        commandArg.presentIf) {
        return trueReturn;
    }
    else {
        return falseReturn;
    }
}
/**
 * If helper that checks if a command argument is always present with a
 * presentIf condition.
 * example:
 * {{#if_command_arg_always_present_with_presentif commandArg}}
 *  command argument has a presentIf condition
 * {{else}}
 *  command argument does not have a presentIf condition
 * {{/if_command_arg_always_present_with_presentif}}
 *
 * @param commandArg
 * @param options
 * @returns Returns content in the handlebar template based on the command
 * argument having a presentIf condition or not
 */
function if_command_arg_always_present_with_presentif(commandArg, options) {
    if (!(commandArg.introducedInRef || commandArg.removedInRef) &&
        commandArg.presentIf) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
}
/**
 *
 * @param command
 * @param commandArg
 * @param trueReturn
 * @param falseReturn
 * @returns trueReturn if command is not fixed length but command argument is
 * always present else returns falseReturn
 */
function if_command_is_not_fixed_length_but_command_argument_is_always_present(commandId, commandArg, trueReturn, falseReturn) {
    return __awaiter(this, void 0, void 0, function () {
        var commandArgs, isFixedLengthCommand, commandArgs_1, commandArgs_1_1, ca;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queryCommand.selectCommandArgumentsByCommandId(this.global.db, commandId)];
                case 1:
                    commandArgs = _b.sent();
                    isFixedLengthCommand = true;
                    try {
                        for (commandArgs_1 = __values(commandArgs), commandArgs_1_1 = commandArgs_1.next(); !commandArgs_1_1.done; commandArgs_1_1 = commandArgs_1.next()) {
                            ca = commandArgs_1_1.value;
                            if (ca.isArray ||
                                types.isString(ca.type) ||
                                ca.introducedInRef ||
                                ca.removedInRef ||
                                ca.presentIf) {
                                isFixedLengthCommand = false;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (commandArgs_1_1 && !commandArgs_1_1.done && (_a = commandArgs_1.return)) _a.call(commandArgs_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (isFixedLengthCommand) {
                        return [2 /*return*/, falseReturn];
                    }
                    else if (!(commandArg.isArray ||
                        commandArg.introducedInRef ||
                        commandArg.removedInRef ||
                        commandArg.presentIf)) {
                        return [2 /*return*/, trueReturn];
                    }
                    else {
                        return [2 /*return*/, falseReturn];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * If helper that checks if command is not fixed lenth and that the command is
 * always present.
 * example:
 * {{#if_command_not_fixed_length_command_argument_always_present commandId}}
 *  command is not fixed length and command argument is always present
 * {{else}}
 *  either command is fixed length or command argument is not always present
 * {{/if_command_not_fixed_length_command_argument_always_present}}
 *
 * @param command
 * @param commandArg
 * @param options
 * @returns Returns content in the handlebar template based on the command being
 * fixed length or not and whether the command argument is always present
 */
function if_command_not_fixed_length_command_argument_always_present(command, commandArg, options) {
    return __awaiter(this, void 0, void 0, function () {
        var commandArgs, isFixedLengthCommand, commandArgs_2, commandArgs_2_1, ca;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queryCommand.selectCommandArgumentsByCommandId(this.global.db, command)];
                case 1:
                    commandArgs = _b.sent();
                    isFixedLengthCommand = true;
                    try {
                        for (commandArgs_2 = __values(commandArgs), commandArgs_2_1 = commandArgs_2.next(); !commandArgs_2_1.done; commandArgs_2_1 = commandArgs_2.next()) {
                            ca = commandArgs_2_1.value;
                            if (ca.isArray ||
                                types.isString(ca.type) ||
                                ca.introducedInRef ||
                                ca.removedInRef ||
                                ca.presentIf) {
                                isFixedLengthCommand = false;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (commandArgs_2_1 && !commandArgs_2_1.done && (_a = commandArgs_2.return)) _a.call(commandArgs_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    if (isFixedLengthCommand) {
                        return [2 /*return*/, options.inverse(this)];
                    }
                    else if (!(commandArg.isArray ||
                        commandArg.introducedInRef ||
                        commandArg.removedInRef ||
                        commandArg.presentIf)) {
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
 *
 * @param commandArg
 * @param trueReturn
 * @param falseReturn
 * @returns trueReturn if command argument is not always present and there is no
 * presentIf condition else returns false
 */
function if_ca_not_always_present_no_presentif(commandArg, trueReturn, falseReturn) {
    if ((commandArg.introducedInRef || commandArg.removedInRef) &&
        !commandArg.presentIf) {
        return trueReturn;
    }
    return falseReturn;
}
/**
 * If helper that checks if a command argument is not always present because it
 * has a introduced in or removed in clause. The helper also checks that there
 * is no presentIf condition.
 * example:
 * {{#if_command_arg_not_always_present_no_presentif commandArg}}
 *  command argument is not always present and there is no presentIf condition
 * {{else}}
 *  Either command argument is always present or there is a presentIf condition
 * {{/if_command_arg_not_always_present_no_presentif}}
 *
 * @param commandArg
 * @param options
 * @returns Returns content in the handlebar template based on the command
 * argument being present and if there is a presentIf condition.
 */
function if_command_arg_not_always_present_no_presentif(commandArg, options) {
    if ((commandArg.introducedInRef || commandArg.removedInRef) &&
        !commandArg.presentIf) {
        return options.fn(this);
    }
    return options.inverse(this);
}
/**
 *
 * @param commandArg
 * @param trueReturn
 * @param falseReturn
 * @returns trueReturn if command argument is not always present and there is a
 * presentIf condition else returns false
 */
function if_ca_not_always_present_with_presentif(commandArg, trueReturn, falseReturn) {
    if ((commandArg.introducedInRef || commandArg.removedInRef) &&
        commandArg.presentIf) {
        return trueReturn;
    }
    else {
        return falseReturn;
    }
}
/**
 * If helper that checks if a command argument is not always present because it
 * has a introduced in or removed in clause. The helper also checks that there
 * is a presentIf condition.
 * example:
 * {{#if_command_arg_not_always_present_with_presentif commandArg}}
 *  command argument is not always present and there is a presentIf condition
 * {{else}}
 *  Either command argument is always present or there is no presentIf condition
 * {{/if_command_arg_not_always_present_with_presentif}}
 *
 * @param commandArg
 * @param options
 * @returns Returns content in the handlebar template based on the command
 * argument being present and if there is a presentIf condition.
 */
function if_command_arg_not_always_present_with_presentif(commandArg, options) {
    if ((commandArg.introducedInRef || commandArg.removedInRef) &&
        commandArg.presentIf) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
}
/**
 *
 * @param commandId
 * @param fixedLengthReturn
 * @param notFixedLengthReturn
 * Returns fixedLengthReturn or notFixedLengthReturn based on whether the
 * command is fixed length or not. Also checks if the command arguments are
 * always present or not.
 */
function if_command_is_fixed_length(commandId, fixedLengthReturn, notFixedLengthReturn) {
    return __awaiter(this, void 0, void 0, function () {
        var commandArgs, fixedLength, commandArgs_3, commandArgs_3_1, commandArg;
        var e_3, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queryCommand.selectCommandArgumentsByCommandId(this.global.db, commandId)];
                case 1:
                    commandArgs = _b.sent();
                    fixedLength = true;
                    try {
                        for (commandArgs_3 = __values(commandArgs), commandArgs_3_1 = commandArgs_3.next(); !commandArgs_3_1.done; commandArgs_3_1 = commandArgs_3.next()) {
                            commandArg = commandArgs_3_1.value;
                            if (commandArg.isArray ||
                                types.isString(commandArg.type) ||
                                commandArg.introducedInRef ||
                                commandArg.removedInRef ||
                                commandArg.presentIf) {
                                fixedLength = false;
                                break;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (commandArgs_3_1 && !commandArgs_3_1.done && (_a = commandArgs_3.return)) _a.call(commandArgs_3);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    if (fixedLength) {
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
 * If helper which checks if a command is fixed length or not
 *
 * example:
 * {{#if_command_fixed_length commandId}}
 * command is fixed length
 * {{else}}
 * command is not fixed length
 * {{/if_command_fixed_length}}
 *
 * @param commandId
 * @param options
 * Returns content in the handlebar template based on the command being fixed
 * length or not as shown in the example above.
 */
function if_command_fixed_length(commandId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var commandArgs, commandArgs_4, commandArgs_4_1, commandArg;
        var e_4, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queryCommand.selectCommandArgumentsByCommandId(this.global.db, commandId)];
                case 1:
                    commandArgs = _b.sent();
                    try {
                        for (commandArgs_4 = __values(commandArgs), commandArgs_4_1 = commandArgs_4.next(); !commandArgs_4_1.done; commandArgs_4_1 = commandArgs_4.next()) {
                            commandArg = commandArgs_4_1.value;
                            if (commandArg.isArray ||
                                types.isString(commandArg.type) ||
                                commandArg.introducedInRef ||
                                commandArg.removedInRef ||
                                commandArg.presentIf) {
                                return [2 /*return*/, options.inverse(this)];
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (commandArgs_4_1 && !commandArgs_4_1.done && (_a = commandArgs_4.return)) _a.call(commandArgs_4);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    return [2 /*return*/, options.fn(this)];
            }
        });
    });
}
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
var dep = templateUtil.deprecatedHelper;
exports.if_command_is_fixed_length = dep(if_command_is_fixed_length, {
    to: 'if_command_fixed_length',
});
exports.if_command_arguments_exist = dep(if_command_arguments_exist, {
    to: 'if_command_args_exist',
});
exports.if_ca_always_present_with_presentif = dep(if_ca_always_present_with_presentif, { to: 'if_command_arg_always_present_with_presentif' });
exports.if_command_is_not_fixed_length_but_command_argument_is_always_present =
    dep(if_command_is_not_fixed_length_but_command_argument_is_always_present, {
        to: 'if_command_not_fixed_length_command_argument_always_present',
    });
exports.if_ca_not_always_present_no_presentif = dep(if_ca_not_always_present_no_presentif, { to: 'if_command_arg_not_always_present_no_presentif' });
exports.if_ca_not_always_present_with_presentif = dep(if_ca_not_always_present_with_presentif, { to: 'if_command_arg_not_always_present_with_presentif' });
exports.if_command_fixed_length = if_command_fixed_length;
exports.if_command_not_fixed_length_command_argument_always_present =
    if_command_not_fixed_length_command_argument_always_present;
exports.if_command_arg_not_always_present_no_presentif =
    if_command_arg_not_always_present_no_presentif;
exports.if_command_arg_not_always_present_with_presentif =
    if_command_arg_not_always_present_with_presentif;
exports.if_command_arg_always_present_with_presentif =
    if_command_arg_always_present_with_presentif;
exports.if_command_args_exist = if_command_args_exist;
//# sourceMappingURL=helper-command.js.map