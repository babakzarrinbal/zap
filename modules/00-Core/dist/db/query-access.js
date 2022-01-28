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
/**
 * This module provides queries related to access.
 *
 * @module DB API: access queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
function selectAccessOperations(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT NAME, DESCRIPTION FROM OPERATION WHERE PACKAGE_REF = ? ORDER BY NAME\n", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.accessOperation); })];
        });
    });
}
function selectAccessRoles(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT NAME, DESCRIPTION, LEVEL FROM ROLE WHERE PACKAGE_REF = ? ORDER BY NAME\n    ", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.accessRole); })];
        });
    });
}
function selectAccessModifiers(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT NAME, DESCRIPTION FROM ACCESS_MODIFIER WHERE PACKAGE_REF = ? ORDER BY NAME\n    ", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.accessModifier); })];
        });
    });
}
/**
 * Retrieves the default access list for a given type.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} type
 * @returns array of {operation/role/accessModifier} objects.
 */
function selectDefaultAccess(db, packageId, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  OPERATION.NAME AS OP_NAME,\n  ROLE.NAME AS ROLE_NAME,\n  ACCESS_MODIFIER.NAME AS MODIFIER_NAME\nFROM\n  DEFAULT_ACCESS AS DA\nINNER JOIN\n  ACCESS AS A\nON\n  DA.ACCESS_REF = A.ACCESS_ID\nLEFT JOIN OPERATION\nON A.OPERATION_REF = OPERATION.OPERATION_ID\nLEFT JOIN ROLE\nON A.ROLE_REF = ROLE.ROLE_ID\nLEFT JOIN ACCESS_MODIFIER\nON A.ACCESS_MODIFIER_REF = ACCESS_MODIFIER.ACCESS_MODIFIER_ID\nWHERE DA.PACKAGE_REF = ? AND DA.ENTITY_TYPE = ?\nORDER BY OPERATION.NAME, ROLE.NAME, ACCESS_MODIFIER.NAME\n", [packageId, type])
                    .then(function (rows) { return rows.map(dbMapping.map.access); })];
        });
    });
}
function selectAttributeAccess(db, attributeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  OPERATION.NAME AS OP_NAME,\n  ROLE.NAME AS ROLE_NAME,\n  ACCESS_MODIFIER.NAME AS MODIFIER_NAME\nFROM\n  ATTRIBUTE_ACCESS AS AA\nINNER JOIN\n  ACCESS AS A\nON\n  AA.ACCESS_REF = A.ACCESS_ID\nLEFT JOIN OPERATION\nON A.OPERATION_REF = OPERATION.OPERATION_ID\nLEFT JOIN ROLE\nON A.ROLE_REF = ROLE.ROLE_ID\nLEFT JOIN ACCESS_MODIFIER\nON A.ACCESS_MODIFIER_REF = ACCESS_MODIFIER.ACCESS_MODIFIER_ID\nWHERE AA.ATTRIBUTE_REF = ?\nORDER BY OPERATION.NAME, ROLE.NAME, ACCESS_MODIFIER.NAME\n", [attributeId])
                    .then(function (rows) { return rows.map(dbMapping.map.access); })];
        });
    });
}
function selectCommandAccess(db, commandId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\nOPERATION.NAME AS OP_NAME,\nROLE.NAME AS ROLE_NAME,\nACCESS_MODIFIER.NAME AS MODIFIER_NAME\nFROM\nCOMMAND_ACCESS AS CA\nINNER JOIN\nACCESS AS A\nON\nCA.ACCESS_REF = A.ACCESS_ID\nLEFT JOIN OPERATION\nON A.OPERATION_REF = OPERATION.OPERATION_ID\nLEFT JOIN ROLE\nON A.ROLE_REF = ROLE.ROLE_ID\nLEFT JOIN ACCESS_MODIFIER\nON A.ACCESS_MODIFIER_REF = ACCESS_MODIFIER.ACCESS_MODIFIER_ID\nWHERE CA.COMMAND_REF = ?\nORDER BY OPERATION.NAME, ROLE.NAME, ACCESS_MODIFIER.NAME\n", [commandId])
                    .then(function (rows) { return rows.map(dbMapping.map.access); })];
        });
    });
}
function selectEventAccess(db, eventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\nOPERATION.NAME AS OP_NAME,\nROLE.NAME AS ROLE_NAME,\nACCESS_MODIFIER.NAME AS MODIFIER_NAME\nFROM\nEVENT_ACCESS AS EA\nINNER JOIN\nACCESS AS A\nON\nEA.ACCESS_REF = A.ACCESS_ID\nLEFT JOIN OPERATION\nON A.OPERATION_REF = OPERATION.OPERATION_ID\nLEFT JOIN ROLE\nON A.ROLE_REF = ROLE.ROLE_ID\nLEFT JOIN ACCESS_MODIFIER\nON A.ACCESS_MODIFIER_REF = ACCESS_MODIFIER.ACCESS_MODIFIER_ID\nWHERE EA.EVENT_REF = ?\nORDER BY OPERATION.NAME, ROLE.NAME, ACCESS_MODIFIER.NAME\n", [eventId])
                    .then(function (rows) { return rows.map(dbMapping.map.access); })];
        });
    });
}
exports.selectAccessModifiers = selectAccessModifiers;
exports.selectAccessRoles = selectAccessRoles;
exports.selectAccessOperations = selectAccessOperations;
exports.selectDefaultAccess = selectDefaultAccess;
exports.selectAttributeAccess = selectAttributeAccess;
exports.selectCommandAccess = selectCommandAccess;
exports.selectEventAccess = selectEventAccess;
//# sourceMappingURL=query-access.js.map