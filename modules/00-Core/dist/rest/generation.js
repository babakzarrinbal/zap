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
 * This module provides the REST API to the generation.
 *
 * @module REST API: generation functions
 */
var generationEngine = require('../generator/generation-engine.js');
var queryPackage = require('../db/query-package.js');
var restApi = require('../src-shared/rest-api.js');
var dbEnum = require('../src-shared/db-enum.js');
var StatusCodes = require('http-status-codes').StatusCodes;
/**
 * HTTP GET: preview single file with index.
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpGetPreviewNameIndex(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, previewObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, generationEngine.generateSingleFileForPreview(db, sessionId, request.params.name)];
                case 1:
                    previewObject = _a.sent();
                    if (request.params.index in previewObject) {
                        response.status(StatusCodes.OK).json({
                            result: previewObject[request.params.index],
                            size: Object.keys(previewObject).length,
                        });
                    }
                    else {
                        response.status(StatusCodes.OK).json({});
                    }
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP GET: Preview a single file.
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpGetPreviewName(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, previewObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, generationEngine.generateSingleFileForPreview(db, sessionId, request.params.name)];
                case 1:
                    previewObject = _a.sent();
                    response.status(StatusCodes.OK).json(previewObject);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP GET: total preview object.
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpGetPreview(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, previewObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, queryPackage.getSessionGenTemplates(db, sessionId)];
                case 1:
                    previewObject = _a.sent();
                    response.status(StatusCodes.OK).json(previewObject);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP PUT: performs local generation into a specified directory.
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPutGenerate(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, generationDirectory, pkgs, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    generationDirectory = request.body.generationDirectory;
                    return [4 /*yield*/, queryPackage.getSessionPackagesByType(db, sessionId, dbEnum.packageType.genTemplatesJson)];
                case 1:
                    pkgs = _a.sent();
                    promises = [];
                    pkgs.forEach(function (pkg) {
                        promises.push(generationEngine.generateAndWriteFiles(db, sessionId, pkg.id, generationDirectory));
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _a.sent();
                    response.status(StatusCodes.OK).send();
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.get = [
    {
        uri: restApi.uri.previewNameIndex,
        callback: httpGetPreviewNameIndex,
    },
    {
        uri: restApi.uri.previewName,
        callback: httpGetPreviewName,
    },
    {
        uri: restApi.uri.preview,
        callback: httpGetPreview,
    },
];
exports.put = [
    {
        uri: restApi.uri.generate,
        callback: httpPutGenerate,
    },
];
//# sourceMappingURL=generation.js.map