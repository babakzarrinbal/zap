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
/**
 * This module provides queries for ZCL loading
 *
 * @module DB API: zcl loading queries
 */
var env = require('../util/env');
var dbApi = require('./db-api.js');
// Some loading queries that are reused few times.
var INSERT_CLUSTER_QUERY = "\nINSERT INTO CLUSTER (\n  PACKAGE_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  DEFINE,\n  DOMAIN_NAME,\n  IS_SINGLETON,\n  REVISION,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF\n) VALUES (\n  ?, ?, ?, ?, ?, ?, ?, ?, ?,\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?),\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?)\n)\n";
var INSERT_EVENT_QUERY = "\nINSERT INTO EVENT (\n  CLUSTER_REF,\n  PACKAGE_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SIDE,\n  IS_OPTIONAL,\n  PRIORITY,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF\n) VALUES (\n  ?, ?, ?, ?, ?, ?, ?, ?, ?,\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?),\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?)\n)\n";
var INSERT_EVENT_FIELD_QUERY = "\nINSERT INTO EVENT_FIELD (\n  EVENT_REF,\n  FIELD_IDENTIFIER,\n  NAME,\n  TYPE,\n  IS_ARRAY,\n  IS_NULLABLE,\n  IS_OPTIONAL,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF\n) VALUES (\n  ?, ?, ?, ?, ?, ?, ?,\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?),\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?)\n)\n";
var INSERT_COMMAND_QUERY = "\nINSERT INTO COMMAND (\n  CLUSTER_REF,\n  PACKAGE_REF,\n  CODE,\n  NAME,\n  DESCRIPTION,\n  SOURCE,\n  IS_OPTIONAL,\n  MUST_USE_TIMED_INVOKE,\n  RESPONSE_NAME,\n  MANUFACTURER_CODE,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF\n) VALUES (\n  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?),\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?)\n)";
var INSERT_COMMAND_ARG_QUERY = "\nINSERT INTO COMMAND_ARG (\n  COMMAND_REF,\n  NAME,\n  TYPE,\n  IS_ARRAY,\n  PRESENT_IF,\n  IS_NULLABLE,\n  IS_OPTIONAL,\n  COUNT_ARG,\n  FIELD_IDENTIFIER,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF\n) VALUES (\n  ?, ?, ?, ?, ?, ?, ?, ?, ?,\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?),\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?)\n)";
var INSERT_ATTRIBUTE_QUERY = "\nINSERT INTO ATTRIBUTE (\n  CLUSTER_REF,\n  PACKAGE_REF,\n  CODE,\n  NAME,\n  TYPE,\n  SIDE,\n  DEFINE,\n  MIN,\n  MAX,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  REPORT_MIN_INTERVAL,\n  REPORT_MAX_INTERVAL,\n  REPORTABLE_CHANGE,\n  REPORTABLE_CHANGE_LENGTH,\n  IS_WRITABLE,\n  DEFAULT_VALUE,\n  IS_OPTIONAL,\n  IS_REPORTABLE,\n  IS_NULLABLE,\n  IS_SCENE_REQUIRED,\n  ARRAY_TYPE,\n  MUST_USE_TIMED_WRITE,\n  MANUFACTURER_CODE,\n  INTRODUCED_IN_REF,\n  REMOVED_IN_REF\n) VALUES (\n  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?),\n  (SELECT SPEC_ID FROM SPEC WHERE CODE = ? AND PACKAGE_REF = ?)\n)";
function attributeMap(clusterId, packageId, attributes) {
    return attributes.map(function (attribute) { return [
        clusterId,
        packageId,
        attribute.code,
        attribute.name,
        attribute.type,
        attribute.side,
        attribute.define,
        attribute.min,
        attribute.max,
        attribute.minLength,
        attribute.maxLength,
        attribute.reportMinInterval,
        attribute.reportMaxInterval,
        attribute.reportableChange,
        attribute.reportableChangeLength,
        attribute.isWritable,
        attribute.defaultValue,
        dbApi.toDbBool(attribute.isOptional),
        dbApi.toDbBool(attribute.isReportable),
        dbApi.toDbBool(attribute.isNullable),
        dbApi.toDbBool(attribute.isSceneRequired),
        attribute.entryType,
        dbApi.toDbBool(attribute.mustUseTimedWrite),
        attribute.manufacturerCode,
        attribute.introducedIn,
        packageId,
        attribute.removedIn,
        packageId,
    ]; });
}
function eventMap(clusterId, packageId, events) {
    return events.map(function (event) { return [
        clusterId,
        packageId,
        event.code,
        event.manufacturerCode,
        event.name,
        event.description,
        event.side,
        dbApi.toDbBool(event.isOptional),
        event.priority,
        event.introducedIn,
        packageId,
        event.removedIn,
        packageId,
    ]; });
}
function commandMap(clusterId, packageId, commands) {
    return commands.map(function (command) { return [
        clusterId,
        packageId,
        command.code,
        command.name,
        command.description,
        command.source,
        dbApi.toDbBool(command.isOptional),
        dbApi.toDbBool(command.mustUseTimedInvoke),
        command.responseName,
        command.manufacturerCode,
        command.introducedIn,
        packageId,
        command.removedIn,
        packageId,
    ]; });
}
function fieldMap(eventId, packageId, fields) {
    return fields.map(function (field) { return [
        eventId,
        field.fieldIdentifier,
        field.name,
        field.type,
        dbApi.toDbBool(field.isArray),
        dbApi.toDbBool(field.isNullable),
        dbApi.toDbBool(field.isOptional),
        field.introducedIn,
        packageId,
        field.removedIn,
        packageId,
    ]; });
}
function argMap(cmdId, packageId, args) {
    return args.map(function (arg) { return [
        cmdId,
        arg.name,
        arg.type,
        dbApi.toDbBool(arg.isArray),
        arg.presentIf,
        dbApi.toDbBool(arg.isNullable),
        dbApi.toDbBool(arg.isOptional),
        arg.countArg,
        arg.fieldIdentifier,
        arg.introducedIn,
        packageId,
        arg.removedIn,
        packageId,
    ]; });
}
// access data is array of objects, containing id/op/role/modifier
function insertAttributeAccessData(db, packageId, accessData) {
    return __awaiter(this, void 0, void 0, function () {
        var rowIds, insertData, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createAccessRows(db, packageId, accessData)];
                case 1:
                    rowIds = _a.sent();
                    insertData = [];
                    for (i = 0; i < rowIds.length; i++) {
                        insertData.push([accessData[i].id, rowIds[i]]);
                    }
                    return [2 /*return*/, dbApi.dbMultiInsert(db, "INSERT INTO ATTRIBUTE_ACCESS (ATTRIBUTE_REF, ACCESS_REF) VALUES (?,?)", insertData)];
            }
        });
    });
}
// access data is array of objects, containing id/op/role/modifier
function insertCommandAccessData(db, packageId, accessData) {
    return __awaiter(this, void 0, void 0, function () {
        var rowIds, insertData, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createAccessRows(db, packageId, accessData)];
                case 1:
                    rowIds = _a.sent();
                    insertData = [];
                    for (i = 0; i < rowIds.length; i++) {
                        insertData.push([accessData[i].id, rowIds[i]]);
                    }
                    return [2 /*return*/, dbApi.dbMultiInsert(db, "INSERT INTO COMMAND_ACCESS (COMMAND_REF, ACCESS_REF) VALUES (?,?)", insertData)];
            }
        });
    });
}
// access data is array of objects, containing id/op/role/modifier
function insertEventAccessData(db, packageId, accessData) {
    return __awaiter(this, void 0, void 0, function () {
        var rowIds, insertData, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createAccessRows(db, packageId, accessData)];
                case 1:
                    rowIds = _a.sent();
                    insertData = [];
                    for (i = 0; i < rowIds.length; i++) {
                        insertData.push([accessData[i].id, rowIds[i]]);
                    }
                    return [2 /*return*/, dbApi.dbMultiInsert(db, "INSERT INTO EVENT_ACCESS (EVENT_REF, ACCESS_REF) VALUES (?,?)", insertData)];
            }
        });
    });
}
function insertAttributes(db, packageId, attributes) {
    return __awaiter(this, void 0, void 0, function () {
        var data, access, attributeIds, accessData, i, atId, atAccess, atAccess_1, atAccess_1_1, ac;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = attributes.data;
                    access = attributes.access;
                    if (data == null || data.length == 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, INSERT_ATTRIBUTE_QUERY, data)];
                case 1:
                    attributeIds = _b.sent();
                    accessData = [];
                    for (i = 0; i < attributeIds.length; i++) {
                        atId = attributeIds[i];
                        atAccess = access[i] // Array of accesses
                        ;
                        if (atAccess != null && atAccess.length > 0) {
                            try {
                                for (atAccess_1 = (e_1 = void 0, __values(atAccess)), atAccess_1_1 = atAccess_1.next(); !atAccess_1_1.done; atAccess_1_1 = atAccess_1.next()) {
                                    ac = atAccess_1_1.value;
                                    accessData.push({
                                        id: atId,
                                        op: ac.op,
                                        role: ac.role,
                                        modifier: ac.modifier,
                                    });
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (atAccess_1_1 && !atAccess_1_1.done && (_a = atAccess_1.return)) _a.call(atAccess_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                    }
                    if (!(accessData.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, insertAttributeAccessData(db, packageId, accessData)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function insertEvents(db, packageId, events) {
    return __awaiter(this, void 0, void 0, function () {
        var data, fieldData, access, eventIds, fieldsToLoad, i, lastEventId, fields, accessData, i, evId, evAccess, evAccess_1, evAccess_1_1, ac;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = events.data;
                    fieldData = events.fields;
                    access = events.access;
                    if (data == null || data.length == 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, INSERT_EVENT_QUERY, data)];
                case 1:
                    eventIds = _b.sent();
                    fieldsToLoad = [];
                    for (i = 0; i < eventIds.length; i++) {
                        lastEventId = eventIds[i];
                        fields = fieldData[i];
                        if (fields != undefined && fields != null) {
                            fieldsToLoad.push.apply(fieldsToLoad, __spreadArray([], __read(fieldMap(lastEventId, packageId, fields)), false));
                        }
                    }
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, INSERT_EVENT_FIELD_QUERY, fieldsToLoad)];
                case 2:
                    _b.sent();
                    accessData = [];
                    for (i = 0; i < eventIds.length; i++) {
                        evId = eventIds[i];
                        evAccess = access[i] // Array of accesses
                        ;
                        if (evAccess != null && evAccess.length > 0) {
                            try {
                                for (evAccess_1 = (e_2 = void 0, __values(evAccess)), evAccess_1_1 = evAccess_1.next(); !evAccess_1_1.done; evAccess_1_1 = evAccess_1.next()) {
                                    ac = evAccess_1_1.value;
                                    accessData.push({
                                        id: evId,
                                        op: ac.op,
                                        role: ac.role,
                                        modifier: ac.modifier,
                                    });
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (evAccess_1_1 && !evAccess_1_1.done && (_a = evAccess_1.return)) _a.call(evAccess_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                    }
                    if (!(accessData.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, insertEventAccessData(db, packageId, accessData)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function insertCommands(db, packageId, commands) {
    return __awaiter(this, void 0, void 0, function () {
        var data, argData, access, commandIds, argsToLoad, i, lastCmdId, args, accessData, i, cmdId, cmdAccess, cmdAccess_1, cmdAccess_1_1, ac;
        var e_3, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = commands.data;
                    argData = commands.args;
                    access = commands.access;
                    if (data == null || data.length == 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, INSERT_COMMAND_QUERY, data)];
                case 1:
                    commandIds = _b.sent();
                    argsToLoad = [];
                    for (i = 0; i < commandIds.length; i++) {
                        lastCmdId = commandIds[i];
                        args = argData[i];
                        if (args != undefined && args != null) {
                            argsToLoad.push.apply(argsToLoad, __spreadArray([], __read(argMap(lastCmdId, packageId, args)), false));
                        }
                    }
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, INSERT_COMMAND_ARG_QUERY, argsToLoad)];
                case 2:
                    _b.sent();
                    accessData = [];
                    for (i = 0; i < commandIds.length; i++) {
                        cmdId = commandIds[i];
                        cmdAccess = access[i] // Array of accesses
                        ;
                        if (cmdAccess != null && cmdAccess.length > 0) {
                            try {
                                for (cmdAccess_1 = (e_3 = void 0, __values(cmdAccess)), cmdAccess_1_1 = cmdAccess_1.next(); !cmdAccess_1_1.done; cmdAccess_1_1 = cmdAccess_1.next()) {
                                    ac = cmdAccess_1_1.value;
                                    accessData.push({
                                        id: cmdId,
                                        op: ac.op,
                                        role: ac.role,
                                        modifier: ac.modifier,
                                    });
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (cmdAccess_1_1 && !cmdAccess_1_1.done && (_a = cmdAccess_1.return)) _a.call(cmdAccess_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                        }
                    }
                    if (!(accessData.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, insertCommandAccessData(db, packageId, accessData)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Inserts globals into the database.
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data
 * @returns Promise of globals insertion.
 */
function insertGlobals(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var commands, attributes, i, cmds, atts, pCommand, pAttribute;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            env.logDebug("Insert globals: ".concat(data.length));
            commands = {
                data: [],
                args: [],
                access: [],
            };
            attributes = {
                data: [],
                access: [],
            };
            for (i = 0; i < data.length; i++) {
                if ('commands' in data[i]) {
                    cmds = data[i].commands;
                    (_a = commands.data).push.apply(_a, __spreadArray([], __read(commandMap(null, packageId, cmds)), false));
                    (_b = commands.args).push.apply(_b, __spreadArray([], __read(cmds.map(function (command) { return command.args; })), false));
                }
                if ('attributes' in data[i]) {
                    atts = data[i].attributes;
                    (_c = attributes.data).push.apply(_c, __spreadArray([], __read(attributeMap(null, packageId, atts)), false));
                }
            }
            pCommand = insertCommands(db, packageId, commands);
            pAttribute = insertAttributes(db, packageId, attributes);
            return [2 /*return*/, Promise.all([pCommand, pAttribute])];
        });
    });
}
/**
 *  Inserts cluster extensions into the database.
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data
 * @returns Promise of cluster extension insertion.
 */
function insertClusterExtensions(db, packageId, knownPackages, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbMultiSelect(db, "SELECT CLUSTER_ID FROM CLUSTER WHERE PACKAGE_REF IN (".concat(knownPackages.toString(), ") AND CODE = ?"), data.map(function (cluster) { return [cluster.code]; }))
                    .then(function (rows) {
                    var _a, _b, _c;
                    var commands = {
                        data: [],
                        args: [],
                        access: [],
                    };
                    var attributes = {
                        data: [],
                        access: [],
                    };
                    var i, lastId;
                    for (i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if (row != null) {
                            lastId = row.CLUSTER_ID;
                            if ('commands' in data[i]) {
                                var cmds = data[i].commands;
                                (_a = commands.data).push.apply(_a, __spreadArray([], __read(commandMap(lastId, packageId, cmds)), false));
                                (_b = commands.args).push.apply(_b, __spreadArray([], __read(cmds.map(function (command) { return command.args; })), false));
                            }
                            if ('attributes' in data[i]) {
                                var atts = data[i].attributes;
                                (_c = attributes.data).push.apply(_c, __spreadArray([], __read(attributeMap(lastId, packageId, atts)), false));
                            }
                        }
                        else {
                            // DANGER: We got here, but we don't have rows. Why not?
                            // Because clusters at this point have not yet been created? Odd.
                            env.logWarning("Attempting to insert cluster extension, but the cluster was not found: ".concat(data[i].code));
                        }
                    }
                    var pCommand = insertCommands(db, packageId, commands);
                    var pAttribute = insertAttributes(db, packageId, attributes);
                    return Promise.all([pCommand, pAttribute]);
                })];
        });
    });
}
/**
 * Inserts clusters into the database.
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data an array of objects that must contain: code, name, description, define. It also contains commands: and attributes:
 * @returns Promise of cluster insertion.
 */
function insertClusters(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // If data is extension, we only have code there and we need to simply add commands and clusters.
            // But if it's not an extension, we need to insert the cluster and then run with
            return [2 /*return*/, dbApi
                    .dbMultiInsert(db, INSERT_CLUSTER_QUERY, data.map(function (cluster) {
                    return [
                        packageId,
                        cluster.code,
                        cluster.manufacturerCode,
                        cluster.name,
                        cluster.description,
                        cluster.define,
                        cluster.domain,
                        cluster.isSingleton,
                        cluster.revision,
                        cluster.introducedIn,
                        packageId,
                        cluster.removedIn,
                        packageId,
                    ];
                }))
                    .then(function (lastIdsArray) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    var commands = {
                        data: [],
                        args: [],
                        access: [],
                    };
                    var events = {
                        data: [],
                        fields: [],
                        access: [],
                    };
                    var attributes = {
                        data: [],
                        access: [],
                    };
                    var pTags = null;
                    var i;
                    for (i = 0; i < lastIdsArray.length; i++) {
                        var lastId = lastIdsArray[i];
                        if ('commands' in data[i]) {
                            var cmds = data[i].commands;
                            (_a = commands.data).push.apply(_a, __spreadArray([], __read(commandMap(lastId, packageId, cmds)), false));
                            (_b = commands.args).push.apply(_b, __spreadArray([], __read(cmds.map(function (command) { return command.args; })), false));
                            (_c = commands.access).push.apply(_c, __spreadArray([], __read(cmds.map(function (command) { return command.access; })), false));
                        }
                        if ('attributes' in data[i]) {
                            var atts = data[i].attributes;
                            (_d = attributes.data).push.apply(_d, __spreadArray([], __read(attributeMap(lastId, packageId, atts)), false));
                            (_e = attributes.access).push.apply(_e, __spreadArray([], __read(atts.map(function (at) { return at.access; })), false));
                        }
                        if ('events' in data[i]) {
                            var evs = data[i].events;
                            (_f = events.data).push.apply(_f, __spreadArray([], __read(eventMap(lastId, packageId, evs)), false));
                            (_g = events.fields).push.apply(_g, __spreadArray([], __read(evs.map(function (event) { return event.fields; })), false));
                            (_h = events.access).push.apply(_h, __spreadArray([], __read(evs.map(function (event) { return event.access; })), false));
                        }
                        if ('tags' in data[i]) {
                            pTags = insertTags(db, packageId, data[i].tags, lastId);
                        }
                    }
                    var pCommand = insertCommands(db, packageId, commands);
                    var pAttribute = insertAttributes(db, packageId, attributes);
                    var pEvent = insertEvents(db, packageId, events);
                    var pArray = [pCommand, pAttribute, pEvent];
                    if (pTags != null)
                        pArray.push(pTags);
                    return Promise.all(pArray);
                })];
        });
    });
}
/**
 * Inserts tags into the database.
 * data is an array of objects, containing 'name' and 'description'
 * @param {*} db
 * @param {*} packageId
 * @param {*} data
 * @returns A promise that resolves with array of rowids.
 */
function insertTags(db, packageId, data, clusterRef) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO TAG (PACKAGE_REF, CLUSTER_REF, NAME, DESCRIPTION) VALUES (?, ?, ?, ?)', data.map(function (tag) { return [packageId, clusterRef, tag.name, tag.description]; }))];
        });
    });
}
/**
 *
 * Inserts domains into the database.
 * data is an array of objects that must contain: name
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data Data containing name and specRef
 * @returns A promise that resolves with an array of rowids of all inserted domains.
 */
function insertDomains(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT OR IGNORE INTO DOMAIN (PACKAGE_REF, NAME, LATEST_SPEC_REF) VALUES (?, ?, (SELECT SPEC_ID FROM SPEC WHERE PACKAGE_REF = ? AND CODE = ? ))', data.map(function (domain) { return [packageId, domain.name, packageId, domain.specCode]; }))];
        });
    });
}
/**
 * Inserts a spec into the database.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} data Data contining specCode and specDescription.
 * @returns Promise of insertion.
 */
function insertSpecs(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var olders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    olders = [];
                    data.forEach(function (domain) {
                        if ('older' in domain) {
                            domain.older.forEach(function (older) { return olders.push(older); });
                        }
                    });
                    if (!(olders.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, 'INSERT OR IGNORE INTO SPEC (PACKAGE_REF, CODE, DESCRIPTION, CERTIFIABLE) VALUES (?, ?, ?, ?)', olders.map(function (older) { return [
                            packageId,
                            older.specCode,
                            older.specDescription,
                            older.specCertifiable ? 1 : 0,
                        ]; }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT OR IGNORE INTO SPEC (PACKAGE_REF, CODE, DESCRIPTION, CERTIFIABLE) VALUES (?, ?, ?, ?)', data.map(function (domain) { return [
                        packageId,
                        domain.specCode,
                        domain.specDescription,
                        domain.specCertifiable ? 1 : 0,
                    ]; }))];
            }
        });
    });
}
/**
 * Inserts global attribute defaults into the database.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} clusterData array of objects that contain: code, manufacturerCode and subarrays of globalAttribute[] which contain: side, code, value
 * @returns Promise of data insertion.
 */
function insertGlobalAttributeDefault(db, packageId, clusterData) {
    return __awaiter(this, void 0, void 0, function () {
        var individualClusterPromise;
        return __generator(this, function (_a) {
            individualClusterPromise = [];
            clusterData.forEach(function (cluster) {
                var args = [];
                cluster.globalAttribute.forEach(function (ga) {
                    args.push([
                        packageId,
                        cluster.code,
                        packageId,
                        ga.code,
                        ga.side,
                        ga.value,
                    ]);
                });
                var p = dbApi
                    .dbMultiInsert(db, "\n    INSERT OR IGNORE INTO GLOBAL_ATTRIBUTE_DEFAULT (\n      CLUSTER_REF, ATTRIBUTE_REF, DEFAULT_VALUE\n    ) VALUES (\n      ( SELECT CLUSTER_ID FROM CLUSTER WHERE PACKAGE_REF = ? AND CODE = ? ),\n      ( SELECT ATTRIBUTE_ID FROM ATTRIBUTE WHERE PACKAGE_REF = ? AND CODE = ? AND SIDE = ? ),\n      ?)\n      ", args)
                    .then(function (individualGaIds) {
                    var featureBitArgs = [];
                    var _loop_1 = function (i) {
                        var id = individualGaIds[i];
                        var ga = cluster.globalAttribute[i];
                        if (id != null && 'featureBit' in ga) {
                            ga.featureBit.forEach(function (fb) {
                                featureBitArgs.push([
                                    id,
                                    fb.bit,
                                    dbApi.toDbBool(fb.value),
                                    packageId,
                                    fb.tag,
                                ]);
                            });
                        }
                    };
                    for (var i = 0; i < individualGaIds.length; i++) {
                        _loop_1(i);
                    }
                    if (featureBitArgs.length == 0) {
                        return;
                    }
                    else {
                        return dbApi.dbMultiInsert(db, "\nINSERT OR IGNORE INTO GLOBAL_ATTRIBUTE_BIT (\n  GLOBAL_ATTRIBUTE_DEFAULT_REF,\n  BIT,\n  VALUE,\n  TAG_REF\n) VALUES (\n  ?,\n  ?,\n  ?,\n  (SELECT TAG_ID FROM TAG WHERE PACKAGE_REF = ? AND NAME = ?)\n)\n        ", featureBitArgs);
                    }
                });
                individualClusterPromise.push(p);
            });
            return [2 /*return*/, Promise.all(individualClusterPromise)];
        });
    });
}
/**
 *
 * Inserts structs into the database.
 * data is an array of objects that must contain: name
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data
 * @returns A promise that resolves with an array of struct item rowids.
 */
function insertStructs(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var lastIdsArray, clustersToLoad, _loop_2, i, itemsToLoad, _loop_3, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbMultiInsert(db, 'INSERT INTO STRUCT (PACKAGE_REF, NAME) VALUES (?, ?)', data.map(function (struct) {
                        return [packageId, struct.name];
                    }))];
                case 1:
                    lastIdsArray = _a.sent();
                    clustersToLoad = [];
                    _loop_2 = function (i) {
                        if ('clusters' in data[i]) {
                            var lastId_1 = lastIdsArray[i];
                            var clusters = data[i].clusters;
                            clustersToLoad.push.apply(clustersToLoad, __spreadArray([], __read(clusters.map(function (cl) { return [lastId_1, cl]; })), false));
                        }
                    };
                    for (i = 0; i < lastIdsArray.length; i++) {
                        _loop_2(i);
                    }
                    if (!(clustersToLoad.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, "INSERT INTO STRUCT_CLUSTER ( STRUCT_REF, CLUSTER_CODE) VALUES (?,?)", clustersToLoad)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    itemsToLoad = [];
                    _loop_3 = function (i) {
                        if ('items' in data[i]) {
                            var lastId_2 = lastIdsArray[i];
                            var items = data[i].items;
                            itemsToLoad.push.apply(itemsToLoad, __spreadArray([], __read(items.map(function (item) { return [
                                lastId_2,
                                item.name,
                                item.type,
                                item.fieldIdentifier,
                                dbApi.toDbBool(item.isArray),
                                dbApi.toDbBool(item.isEnum),
                                item.minLength,
                                item.maxLength,
                                dbApi.toDbBool(item.isWritable),
                                dbApi.toDbBool(item.isNullable),
                                dbApi.toDbBool(item.isOptional),
                                dbApi.toDbBool(item.isFabricSensitive),
                            ]; })), false));
                        }
                    };
                    for (i = 0; i < lastIdsArray.length; i++) {
                        _loop_3(i);
                    }
                    if (!(itemsToLoad.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, "\nINSERT INTO STRUCT_ITEM (\n  STRUCT_REF,\n  NAME,\n  TYPE,\n  FIELD_IDENTIFIER,\n  IS_ARRAY,\n  IS_ENUM,\n  MIN_LENGTH,\n  MAX_LENGTH,\n  IS_WRITABLE,\n  IS_NULLABLE,\n  IS_OPTIONAL,\n  IS_FABRIC_SENSITIVE\n) VALUES (?,?,?,?,?,?,?,?,?,?,?, ?)", itemsToLoad)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Inserts enums into the database.
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data an array of objects that must contain: name, type
 * @returns A promise of enum insertion.
 */
function insertEnums(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var lastIdsArray, clustersToLoad, _loop_4, i, itemsToLoad, _loop_5, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbMultiInsert(db, 'INSERT INTO ENUM (PACKAGE_REF, NAME, TYPE) VALUES (?, ?, ?)', data.map(function (en) {
                        return [packageId, en.name, en.type];
                    }))];
                case 1:
                    lastIdsArray = _a.sent();
                    clustersToLoad = [];
                    _loop_4 = function (i) {
                        if ('clusters' in data[i]) {
                            var lastId_3 = lastIdsArray[i];
                            var clusters = data[i].clusters;
                            clustersToLoad.push.apply(clustersToLoad, __spreadArray([], __read(clusters.map(function (cl) { return [lastId_3, cl]; })), false));
                        }
                    };
                    for (i = 0; i < lastIdsArray.length; i++) {
                        _loop_4(i);
                    }
                    if (!(clustersToLoad.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, "INSERT INTO ENUM_CLUSTER ( ENUM_REF, CLUSTER_CODE) VALUES (?,?)", clustersToLoad)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    itemsToLoad = [];
                    _loop_5 = function (i) {
                        if ('items' in data[i]) {
                            var lastId_4 = lastIdsArray[i];
                            var items = data[i].items;
                            itemsToLoad.push.apply(itemsToLoad, __spreadArray([], __read(items.map(function (item) { return [
                                lastId_4,
                                item.name,
                                item.value,
                                item.fieldIdentifier,
                            ]; })), false));
                        }
                    };
                    for (i = 0; i < lastIdsArray.length; i++) {
                        _loop_5(i);
                    }
                    return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO ENUM_ITEM (ENUM_REF, NAME, VALUE, FIELD_IDENTIFIER) VALUES (?, ?, ?, ?)', itemsToLoad)];
            }
        });
    });
}
/**
 * Inserts bitmaps into the database. Data is an array of objects that must contain: name, type
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data Array of object containing 'name' and 'type'.
 * @returns A promise of bitmap insertions.
 */
function insertBitmaps(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var lastIdsArray, clustersToLoad, _loop_6, i, fieldsToLoad, _loop_7, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbMultiInsert(db, 'INSERT INTO BITMAP (PACKAGE_REF, NAME, TYPE) VALUES (?, ?, ?)', data.map(function (bm) { return [packageId, bm.name, bm.type]; }))];
                case 1:
                    lastIdsArray = _a.sent();
                    clustersToLoad = [];
                    _loop_6 = function (i) {
                        if ('clusters' in data[i]) {
                            var lastId_5 = lastIdsArray[i];
                            var clusters = data[i].clusters;
                            clustersToLoad.push.apply(clustersToLoad, __spreadArray([], __read(clusters.map(function (cl) { return [lastId_5, cl]; })), false));
                        }
                    };
                    for (i = 0; i < lastIdsArray.length; i++) {
                        _loop_6(i);
                    }
                    if (!(clustersToLoad.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, dbApi.dbMultiInsert(db, "INSERT INTO BITMAP_CLUSTER ( BITMAP_REF, CLUSTER_CODE) VALUES (?,?)", clustersToLoad)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    fieldsToLoad = [];
                    _loop_7 = function (i) {
                        if ('fields' in data[i]) {
                            var lastId_6 = lastIdsArray[i];
                            var fields = data[i].fields;
                            fieldsToLoad.push.apply(fieldsToLoad, __spreadArray([], __read(fields.map(function (field) { return [
                                lastId_6,
                                field.name,
                                field.mask,
                                field.type,
                                field.fieldIdentifier,
                            ]; })), false));
                        }
                    };
                    for (i = 0; i < lastIdsArray.length; i++) {
                        _loop_7(i);
                    }
                    return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO BITMAP_FIELD (BITMAP_REF, NAME, MASK, TYPE, FIELD_IDENTIFIER) VALUES (?, ?, ?, ?, ?)', fieldsToLoad)];
            }
        });
    });
}
/**
 * Insert atomics into the database.
 * Data is an array of objects that must contains: name, id, description.
 * Object might also contain 'size', but possibly not.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} data
 */
function insertAtomics(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO ATOMIC (PACKAGE_REF, NAME, DESCRIPTION, ATOMIC_IDENTIFIER, ATOMIC_SIZE, IS_DISCRETE, IS_SIGNED, IS_STRING, IS_LONG, IS_CHAR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data.map(function (at) { return [
                    packageId,
                    at.name,
                    at.description,
                    at.id,
                    at.size,
                    at.isDiscrete,
                    at.isSigned,
                    at.isString,
                    at.isLong,
                    at.isChar,
                ]; }))];
        });
    });
}
/**
 * Inserts device types into the database.
 *
 * @export
 * @param {*} db
 * @param {*} packageId
 * @param {*} data an array of objects that must contain: domain, code, profileId, name, description
 * @returns Promise of an insertion of device types.
 */
function insertDeviceTypes(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbMultiInsert(db, 'INSERT INTO DEVICE_TYPE (PACKAGE_REF, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?)', data.map(function (dt) {
                    return [
                        packageId,
                        dt.domain,
                        dt.code,
                        dt.profileId,
                        dt.name,
                        dt.description,
                    ];
                }))
                    .then(function (lastIdsArray) {
                    var zclIdsPromises = [];
                    var _loop_8 = function (i) {
                        if ('clusters' in data[i]) {
                            var lastId_7 = lastIdsArray[i];
                            var clusters = data[i].clusters;
                            // This is an array that links the generated deviceTyepRef to the cluster via generating an array of arrays,
                            zclIdsPromises = Promise.all(clusters.map(function (cluster) {
                                return dbApi
                                    .dbInsert(db, 'INSERT INTO DEVICE_TYPE_CLUSTER (DEVICE_TYPE_REF, CLUSTER_NAME, INCLUDE_CLIENT, INCLUDE_SERVER, LOCK_CLIENT, LOCK_SERVER) VALUES (?,?,?,?,?,?)', [
                                    lastId_7,
                                    cluster.clusterName,
                                    cluster.client,
                                    cluster.server,
                                    cluster.clientLocked,
                                    cluster.serverLocked,
                                ], true)
                                    .then(function (deviceTypeClusterRef) {
                                    return {
                                        dtClusterRef: deviceTypeClusterRef,
                                        clusterData: cluster,
                                    };
                                });
                            })).then(function (dtClusterRefDataPairs) {
                                var promises = [];
                                promises.push(insertDeviceTypeAttributes(db, dtClusterRefDataPairs));
                                promises.push(insertDeviceTypeCommands(db, dtClusterRefDataPairs));
                                return Promise.all(promises);
                            });
                        }
                    };
                    for (var i = 0; i < lastIdsArray.length; i++) {
                        _loop_8(i);
                    }
                    return zclIdsPromises;
                })];
        });
    });
}
/**
 * This handles the loading of device type attribute requirements into the database.
 * There is a need to post-process to attach the actual attribute ref after the fact
 * @param {*} db
 * @param {*} dtClusterRefDataPairs
 */
function insertDeviceTypeAttributes(db, dtClusterRefDataPairs) {
    return __awaiter(this, void 0, void 0, function () {
        var attributes;
        return __generator(this, function (_a) {
            attributes = [];
            dtClusterRefDataPairs.map(function (dtClusterRefDataPair) {
                var dtClusterRef = dtClusterRefDataPair.dtClusterRef;
                var clusterData = dtClusterRefDataPair.clusterData;
                if ('requiredAttributes' in clusterData) {
                    clusterData.requiredAttributes.forEach(function (attributeName) {
                        attributes.push([dtClusterRef, attributeName]);
                    });
                }
            });
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO DEVICE_TYPE_ATTRIBUTE (DEVICE_TYPE_CLUSTER_REF, ATTRIBUTE_NAME) VALUES (?, ?)', attributes)];
        });
    });
}
/**
 * This handles the loading of device type command requirements into the database.
 * There is a need to post-process to attach the actual command ref after the fact
 * @param {*} db
 * @param {*} dtClusterRefDataPairs
 */
function insertDeviceTypeCommands(db, dtClusterRefDataPairs) {
    return __awaiter(this, void 0, void 0, function () {
        var commands;
        return __generator(this, function (_a) {
            commands = [];
            dtClusterRefDataPairs.map(function (dtClusterRefDataPair) {
                var dtClusterRef = dtClusterRefDataPair.dtClusterRef;
                var clusterData = dtClusterRefDataPair.clusterData;
                if ('requiredCommands' in clusterData) {
                    clusterData.requiredCommands.forEach(function (commandName) {
                        commands.push([dtClusterRef, commandName]);
                    });
                }
            });
            return [2 /*return*/, dbApi.dbMultiInsert(db, 'INSERT INTO DEVICE_TYPE_COMMAND (DEVICE_TYPE_CLUSTER_REF, COMMAND_NAME) VALUES (?, ?)', commands)];
        });
    });
}
function insertAccessOperations(db, packageId, operations) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            data = operations.map(function (o) { return [packageId, o.name, o.description]; });
            return [2 /*return*/, dbApi.dbMultiInsert(db, "\nINSERT INTO OPERATION\n  (PACKAGE_REF, NAME, DESCRIPTION)\nVALUES\n  (?, ?, ?)\n", data)];
        });
    });
}
function insertAccessRoles(db, packageId, roles) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            data = roles.map(function (r) { return [packageId, r.name, r.description, r.level]; });
            return [2 /*return*/, dbApi.dbMultiInsert(db, "\nINSERT INTO ROLE\n  (PACKAGE_REF, NAME, DESCRIPTION, LEVEL)\nVALUES\n  (?, ?, ?, ?)\n", data)];
        });
    });
}
function insertAccessModifiers(db, packageId, modifiers) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            data = modifiers.map(function (m) { return [packageId, m.name, m.description]; });
            return [2 /*return*/, dbApi.dbMultiInsert(db, "\nINSERT INTO ACCESS_MODIFIER\n  (PACKAGE_REF, NAME, DESCRIPTION)\nVALUES\n  (?, ?, ?)\n", data)];
        });
    });
}
/**
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} data array of objects that must have op/role/modifier
 */
function createAccessRows(db, packageId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbMultiInsert(db, "\nINSERT INTO ACCESS\n  (OPERATION_REF, ROLE_REF, ACCESS_MODIFIER_REF)\nVALUES (\n  (SELECT OPERATION_ID FROM OPERATION WHERE NAME = ? AND PACKAGE_REF = ?),\n  (SELECT ROLE_ID FROM ROLE WHERE NAME = ? AND PACKAGE_REF = ?),\n  (SELECT ACCESS_MODIFIER_ID FROM ACCESS_MODIFIER WHERE NAME = ? AND PACKAGE_REF = ?)\n)\n    ", data.map(function (x) { return [x.op, packageId, x.role, packageId, x.modifier, packageId]; }))];
        });
    });
}
/**
 * Inserts a default access.
 * Default access is object that contains type and access array of {op,role,modifier}
 * @param {*} db
 * @param {*} packageId
 * @param {*} defaultAccess
 */
function insertDefaultAccess(db, packageId, defaultAccess) {
    return __awaiter(this, void 0, void 0, function () {
        var ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createAccessRows(db, packageId, defaultAccess.access)];
                case 1:
                    ids = _a.sent();
                    return [2 /*return*/, dbApi.dbMultiInsert(db, "INSERT INTO DEFAULT_ACCESS ( PACKAGE_REF, ENTITY_TYPE, ACCESS_REF) VALUES (?, ?, ?)", ids.map(function (id) { return [packageId, defaultAccess.type, id]; }))];
            }
        });
    });
}
function updateEnumClusterReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE\n  ENUM_CLUSTER\nSET\n  CLUSTER_REF =\n  (\n    SELECT\n      CLUSTER_ID\n    FROM\n      CLUSTER\n    WHERE\n      CLUSTER.CODE = ENUM_CLUSTER.CLUSTER_CODE\n    AND\n      CLUSTER.PACKAGE_REF = ?\n  )\nWHERE\n  ( SELECT PACKAGE_REF\n    FROM ENUM\n    WHERE ENUM.ENUM_ID = ENUM_CLUSTER.ENUM_REF\n  ) = ?\n  \n", [packageId, packageId])];
        });
    });
}
function updateStructClusterReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE\n  STRUCT_CLUSTER\nSET\n  CLUSTER_REF =\n  (\n    SELECT\n      CLUSTER_ID\n    FROM\n      CLUSTER\n    WHERE\n      CLUSTER.CODE = STRUCT_CLUSTER.CLUSTER_CODE\n    AND\n      CLUSTER.PACKAGE_REF = ?\n  )\nWHERE\n  (\n    SELECT PACKAGE_REF\n    FROM STRUCT\n    WHERE STRUCT.STRUCT_ID = STRUCT_CLUSTER.STRUCT_REF\n  ) = ?\n", [packageId, packageId])];
        });
    });
}
function updateBitmapClusterReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi.dbUpdate(db, "\nUPDATE\n  BITMAP_CLUSTER\nSET\n  CLUSTER_REF =\n  (\n    SELECT\n      CLUSTER_ID\n    FROM\n      CLUSTER\n    WHERE\n      CLUSTER.CODE = BITMAP_CLUSTER.CLUSTER_CODE\n    AND\n      CLUSTER.PACKAGE_REF = ?\n  )\nWHERE\n  (\n    SELECT PACKAGE_REF\n    FROM BITMAP\n    WHERE BITMAP.BITMAP_ID = BITMAP_CLUSTER.BITMAP_REF\n  ) = ?\n", [packageId, packageId])];
        });
    });
}
/**
 * Post loading actions.
 *
 * @param {*} db
 * @param {*} packageId
 */
function updateStaticEntityReferences(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateEnumClusterReferences(db, packageId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateStructClusterReferences(db, packageId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateBitmapClusterReferences(db, packageId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.insertGlobals = insertGlobals;
exports.insertClusterExtensions = insertClusterExtensions;
exports.insertClusters = insertClusters;
exports.insertDomains = insertDomains;
exports.insertSpecs = insertSpecs;
exports.insertGlobalAttributeDefault = insertGlobalAttributeDefault;
exports.insertAtomics = insertAtomics;
exports.insertStructs = insertStructs;
exports.insertEnums = insertEnums;
exports.insertBitmaps = insertBitmaps;
exports.insertDeviceTypes = insertDeviceTypes;
exports.insertTags = insertTags;
exports.insertAccessModifiers = insertAccessModifiers;
exports.insertAccessOperations = insertAccessOperations;
exports.insertAccessRoles = insertAccessRoles;
exports.insertDefaultAccess = insertDefaultAccess;
exports.updateStaticEntityReferences = updateStaticEntityReferences;
//# sourceMappingURL=query-loader.js.map