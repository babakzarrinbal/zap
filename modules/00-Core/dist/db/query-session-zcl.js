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
 * This module provides queries for ZCL static entities
 * inside a single session. Things like:
 *    all visible clusters, etc.
 *
 * @module DB API: zcl database access
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
var dbEnum = require('../src-shared/db-enum.js');
/**
 * Returns the cluster available to this session by the code.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns all the cluster objects for a given session.
 */
function selectSessionClusterByCode(db, sessionId, code, mfgCode) {
    return __awaiter(this, void 0, void 0, function () {
        var args;
        return __generator(this, function (_a) {
            args = [sessionId, code];
            if (!(mfgCode == 0 || mfgCode == null))
                args.push(mfgCode);
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  C.CLUSTER_ID,\n  C.PACKAGE_REF,\n  C.CODE,\n  C.MANUFACTURER_CODE,\n  C.NAME,\n  C.DESCRIPTION,\n  C.DEFINE,\n  C.DOMAIN_NAME,\n  C.IS_SINGLETON,\n  C.REVISION\nFROM\n  CLUSTER AS C\nINNER JOIN\n  SESSION_PACKAGE AS SP\nON\n  C.PACKAGE_REF = SP.PACKAGE_REF\nWHERE\n  SP.SESSION_REF = ? AND C.CODE = ? AND ".concat(mfgCode == 0 || mfgCode == null
                    ? 'C.MANUFACTURER_CODE IS NULL'
                    : 'C.MANUFACTURER_CODE = ?', "\n"), args)
                    .then(dbMapping.map.cluster)];
        });
    });
}
/**
 * Returns all the clusters visible for a given session.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns all the cluster objects for a given session.
 */
function selectAllSessionClusters(db, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  C.CLUSTER_ID,\n  C.PACKAGE_REF,\n  C.CODE,\n  C.MANUFACTURER_CODE,\n  C.NAME,\n  C.DESCRIPTION,\n  C.DEFINE,\n  C.DOMAIN_NAME,\n  C.IS_SINGLETON,\n  C.REVISION\nFROM\n  CLUSTER AS C\nINNER JOIN\n  SESSION_PACKAGE AS SP\nON\n  C.PACKAGE_REF = SP.PACKAGE_REF\nWHERE\n  SP.SESSION_REF = ?\n", [sessionId])
                    .then(function (rows) { return rows.map(dbMapping.map.cluster); })];
        });
    });
}
/**
 * Returns the attribute available to this session by the code.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns the session attribute
 */
function selectSessionAttributeByCode(db, sessionId, clusterCode, side, attributeCode, mfgCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  ATTRIBUTE.ATTRIBUTE_ID,\n  ATTRIBUTE.CLUSTER_REF,\n  ATTRIBUTE.CODE,\n  ATTRIBUTE.MANUFACTURER_CODE,\n  ATTRIBUTE.NAME,\n  ATTRIBUTE.TYPE,\n  ATTRIBUTE.SIDE,\n  ATTRIBUTE.DEFINE,\n  ATTRIBUTE.MIN,\n  ATTRIBUTE.MAX,\n  ATTRIBUTE.REPORT_MIN_INTERVAL,\n  ATTRIBUTE.REPORT_MAX_INTERVAL,\n  ATTRIBUTE.REPORTABLE_CHANGE,\n  ATTRIBUTE.REPORTABLE_CHANGE_LENGTH,\n  ATTRIBUTE.IS_WRITABLE,\n  ATTRIBUTE.DEFAULT_VALUE,\n  ATTRIBUTE.IS_OPTIONAL,\n  ATTRIBUTE.IS_REPORTABLE,\n  ATTRIBUTE.IS_NULLABLE,\n  ATTRIBUTE.IS_SCENE_REQUIRED,\n  ATTRIBUTE.ARRAY_TYPE,\n  ATTRIBUTE.MUST_USE_TIMED_WRITE\nFROM\n  ATTRIBUTE, CLUSTER, SESSION_PACKAGE\nWHERE\n  SESSION_PACKAGE.SESSION_REF = ? AND\n  ATTRIBUTE.PACKAGE_REF = SESSION_PACKAGE.PACKAGE_REF AND ATTRIBUTE.CODE = ? AND\n  ((ATTRIBUTE.CLUSTER_REF = CLUSTER.CLUSTER_ID AND CLUSTER.CODE = ?) OR \n  (ATTRIBUTE.CLUSTER_REF IS NULL)) AND ATTRIBUTE.SIDE = ?\n", [sessionId, attributeCode, clusterCode, side])
                    .then(dbMapping.map.attribute)];
        });
    });
}
/**
 * Returns the command available to this session by the code.
 *
 * @param {*} db
 * @param {*} sessionId
 * @returns the session attribute
 */
function selectSessionCommandByCode(db, sessionId, clusterCode, commandCode, source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "\nSELECT\n  CMD.COMMAND_ID,\n  CMD.CLUSTER_REF,\n  CMD.PACKAGE_REF,\n  CMD.CODE,\n  CMD.MANUFACTURER_CODE,\n  CMD.NAME,\n  CMD.DESCRIPTION,\n  CMD.SOURCE,\n  CMD.IS_OPTIONAL,\n  CMD.MUST_USE_TIMED_INVOKE,\n  CMD.RESPONSE_REF\nFROM\n  COMMAND AS CMD\nINNER JOIN\n  CLUSTER AS C\nON\n  CMD.CLUSTER_REF = C.CLUSTER_ID\nINNER JOIN\n  SESSION_PACKAGE AS SP\nON\n  C.PACKAGE_REF = SP.PACKAGE_REF\nWHERE\n  SP.SESSION_REF = ? AND C.CODE = ? AND CMD.CODE = ? AND CMD.SOURCE = ?\n", [sessionId, clusterCode, commandCode, source])
                    .then(dbMapping.map.command)];
        });
    });
}
exports.selectAllSessionClusters = selectAllSessionClusters;
exports.selectSessionClusterByCode = selectSessionClusterByCode;
exports.selectSessionAttributeByCode = selectSessionAttributeByCode;
exports.selectSessionCommandByCode = selectSessionCommandByCode;
//# sourceMappingURL=query-session-zcl.js.map