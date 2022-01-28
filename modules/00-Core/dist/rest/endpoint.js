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
 * This module provides the REST API to the user specific data.
 *
 * @module REST API: endpoint
 */
var queryEndpointType = require('../db/query-endpoint-type.js');
var queryEndpoint = require('../db/query-endpoint.js');
var queryConfig = require('../db/query-config.js');
var validation = require('../validation/validation.js');
var restApi = require('../src-shared/rest-api.js');
var StatusCodes = require('http-status-codes').StatusCodes;
/**
 * HTTP DELETE: endpoint
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpDeleteEndpoint(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var id, removed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = request.query.id;
                    return [4 /*yield*/, queryEndpoint.deleteEndpoint(db, id)];
                case 1:
                    removed = _a.sent();
                    response.status(StatusCodes.OK).json({
                        successful: removed > 0,
                        id: id,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP DELETE: endpoint type
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpDeleteEndpointType(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var id, removed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = request.query.id;
                    return [4 /*yield*/, queryEndpointType.deleteEndpointType(db, id)];
                case 1:
                    removed = _a.sent();
                    response.status(StatusCodes.OK).json({
                        successful: removed > 0,
                        id: id,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: endpoint
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostEndpoint(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, endpointId, networkId, profileId, endpointType, endpointVersion, deviceIdentifier, sessionId, newId, validationData, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, endpointId = _a.endpointId, networkId = _a.networkId, profileId = _a.profileId, endpointType = _a.endpointType, endpointVersion = _a.endpointVersion, deviceIdentifier = _a.deviceIdentifier;
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, queryEndpoint.insertEndpoint(db, sessionId, endpointId, endpointType, networkId, profileId, endpointVersion, deviceIdentifier)];
                case 1:
                    newId = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, validation.validateEndpoint(db, newId)];
                case 3:
                    validationData = _b.sent();
                    response.status(StatusCodes.OK).json({
                        id: newId,
                        endpointId: endpointId,
                        endpointType: endpointType,
                        networkId: networkId,
                        deviceId: deviceIdentifier,
                        profileId: profileId,
                        endpointVersion: endpointVersion,
                        validationIssues: validationData,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: endpoint
 *
 * @param {*} db Main database to use for the operation.
 * @returns callback for the express uri registration
 */
function httpPatchEndpoint(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var context, sessionIdexport, changes, validationData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = request.body;
                    sessionIdexport = request.zapSessionId;
                    changes = context.changes.map(function (data) {
                        var paramType = '';
                        return {
                            key: data.updatedKey,
                            value: data.value,
                            type: paramType,
                        };
                    });
                    return [4 /*yield*/, queryConfig.updateEndpoint(db, sessionIdexport, context.id, changes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, validation.validateEndpoint(db, context.id)];
                case 2:
                    validationData = _a.sent();
                    response.status(StatusCodes.OK).json({
                        endpointId: context.id,
                        changes: context.changes,
                        validationIssues: validationData,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST endpoint type
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostEndpointType(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name, deviceTypeRef, sessionId, newId, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, name = _a.name, deviceTypeRef = _a.deviceTypeRef;
                    sessionId = request.zapSessionId;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryConfig.insertEndpointType(db, sessionId, name, deviceTypeRef)];
                case 2:
                    newId = _b.sent();
                    response.status(StatusCodes.OK).json({
                        id: newId,
                        name: name,
                        deviceTypeRef: deviceTypeRef,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: endpoint type update
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPatchEndpointType(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, endpointTypeId, updatedKey, updatedValue, sessionId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, endpointTypeId = _a.endpointTypeId, updatedKey = _a.updatedKey, updatedValue = _a.updatedValue;
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, queryConfig.updateEndpointType(db, sessionId, endpointTypeId, updatedKey, updatedValue)];
                case 1:
                    _b.sent();
                    response.status(StatusCodes.OK).json({
                        endpointTypeId: endpointTypeId,
                        updatedKey: updatedKey,
                        updatedValue: updatedValue,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.post = [
    {
        uri: restApi.uri.endpoint,
        callback: httpPostEndpoint,
    },
    {
        uri: restApi.uri.endpointType,
        callback: httpPostEndpointType,
    },
];
exports.patch = [
    {
        uri: restApi.uri.endpoint,
        callback: httpPatchEndpoint,
    },
    {
        uri: restApi.uri.endpointType,
        callback: httpPatchEndpointType,
    },
];
exports.delete = [
    {
        uri: restApi.uri.endpoint,
        callback: httpDeleteEndpoint,
    },
    {
        uri: restApi.uri.endpointType,
        callback: httpDeleteEndpointType,
    },
];
//# sourceMappingURL=endpoint.js.map