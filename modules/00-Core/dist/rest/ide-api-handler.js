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
 * This module provides the REST API to the IDE component handling.
 *
 * @module REST API: generation functions
 */
var env = require('../util/env');
var studio = require('../ide-integration/studio-rest-api');
var restApi = require('../../src-shared/rest-api.js');
var querySession = require('../db/query-session.js');
var StatusCodes = require('http-status-codes').StatusCodes;
function httpGetComponentTree(db) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var r, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, studio.getProjectInfo(db, req.zapSessionId)];
                case 1:
                    r = _a.sent();
                    res.status(StatusCodes.OK).send(r.data);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (err_1.response) {
                        res.send(err_1.response.data);
                    }
                    else {
                        res.send(err_1.message);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
function httpPostComponentUpdateHandler(db, request, response, add) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, clusterId, side, componentIds, res, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, clusterId = _a.clusterId, side = _a.side, componentIds = _a.componentIds;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, studio.updateComponentByClusterIdAndComponentId(db, request.zapSessionId, componentIds, clusterId, add, side)];
                case 2:
                    res = _b.sent();
                    studio.sendComponentUpdateStatus(db, request.zapSessionId, {
                        data: res,
                        added: add,
                    });
                    response.send(res);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    response.send(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 *  Enable components by 'componentId' or corresponding components specified, via 'defaults', by 'clusterId' / 'roles'
 *
 * @param {*} db
 */
function httpPostComponentAdd(db) {
    return function (request, response) {
        return httpPostComponentUpdateHandler(db, request, response, true);
    };
}
function httpPostComponentRemove(db) {
    return function (request, response) {
        return httpPostComponentUpdateHandler(db, request, response, false);
    };
}
exports.get = [
    {
        uri: restApi.uc.componentTree,
        callback: httpGetComponentTree,
    },
];
exports.post = [
    {
        uri: restApi.uc.componentAdd,
        callback: httpPostComponentAdd,
    },
    {
        uri: restApi.uc.componentRemove,
        callback: httpPostComponentRemove,
    },
];
//# sourceMappingURL=ide-api-handler.js.map