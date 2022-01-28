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
 * This module provides queries related to events.
 *
 * @module DB API: event queries.
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
/**
 * Retrieves events for a given cluster Id.
 *
 * @param {*} db
 * @param {*} clusterId
 * @returns promise of an array of event rows, which represent per-cluster events.
 */
function selectEventsByClusterId(db, clusterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  EVENT_ID,\n  CLUSTER_REF,\n  CODE,\n  MANUFACTURER_CODE,\n  NAME,\n  DESCRIPTION,\n  SIDE,\n  IS_OPTIONAL,\n  PRIORITY\nFROM\n  EVENT\nWHERE\n  CLUSTER_REF = ?\nORDER BY\n  CODE", [clusterId])
                    .then(function (rows) { return rows.map(dbMapping.map.event); })];
        });
    });
}
/**
 * Retrieves all events under a given package
 *
 * @param {*} db
 * @param {*} packageId
 * @returns promise of an array of events
 */
function selectAllEvents(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  E.EVENT_ID,\n  E.CLUSTER_REF,\n  E.CODE,\n  C.CODE AS CLUSTER_CODE,\n  E.MANUFACTURER_CODE,\n  E.NAME,\n  E.DESCRIPTION,\n  E.SIDE,\n  E.PRIORITY\nFROM\n  EVENT AS E\nINNER JOIN\n  CLUSTER AS C\nON\n  E.CLUSTER_REF = C.CLUSTER_ID\nWHERE\n  E.PACKAGE_REF = ?\nORDER BY\n  C.CODE, E.CODE", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.event); })];
        });
    });
}
function selectAllEventFields(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  EF.FIELD_IDENTIFIER,\n  EF.NAME,\n  EF.TYPE,\n  EF.IS_ARRAY,\n  EF.IS_NULLABLE,\n  EF.IS_OPTIONAL\nFROM\n  EVENT_FIELD AS EF\nINNER JOIN\n  EVENT\nON\n  EVENT_FIELD.EVENT_REF = EVENT.EVENT_ID\nWHERE\n  EVENT.PACKAGE_REF = ?\nORDER BY\n  EF.FIELD_IDENTIFIER\n", [packageId])
                    .then(function (rows) { return rows.map(dbMapping.map.eventField); })];
        });
    });
}
function selectEventFieldsByEventId(db, eventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbAll(db, "\nSELECT\n  FIELD_IDENTIFIER,\n  NAME,\n  TYPE,\n  IS_ARRAY,\n  IS_NULLABLE,\n  IS_OPTIONAL\nFROM\n  EVENT_FIELD\nWHERE\n  EVENT_REF = ?\nORDER BY\n  FIELD_IDENTIFIER\n  ", [eventId])
                    .then(function (rows) { return rows.map(dbMapping.map.eventField); })];
        });
    });
}
exports.selectEventsByClusterId = selectEventsByClusterId;
exports.selectAllEvents = selectAllEvents;
exports.selectAllEventFields = selectAllEventFields;
exports.selectEventFieldsByEventId = selectEventFieldsByEventId;
//# sourceMappingURL=query-event.js.map