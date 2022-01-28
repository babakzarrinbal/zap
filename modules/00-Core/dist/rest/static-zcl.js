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
 * This module provides the REST API to the static zcl queries.
 *
 * @module REST API: static zcl functions
 */
var queryZcl = require('../db/query-zcl.js');
var queryCommand = require('../db/query-command.js');
var queryEvent = require('../db/query-event.js');
var queryPackage = require('../db/query-package.js');
var dbEnum = require('../src-shared/db-enum.js');
var restApi = require('../src-shared/rest-api.js');
var util = require('../util/util.js');
var env = require('../util/env');
var StatusCodes = require('http-status-codes').StatusCodes;
// This function builds a function that has the following skeleton.
// This is used to simplify all the logic where we have selectAll and selectById for
// each of the different ZCL entities.
function zclEntityQuery(selectAllFunction, selectByIdFunction) {
    return function (db, id, packageId) {
        if (packageId === void 0) { packageId = null; }
        if (id == 'all') {
            return selectAllFunction(db, packageId);
        }
        else {
            return selectByIdFunction(db, id, packageId);
        }
    };
}
// For the CLUSTER path, we have special handling to also sideload attributes and commands relevant to that cluster.
function returnZclEntitiesForClusterId(db, clusterId, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, zclEntityQuery(queryZcl.selectAllClusters, queryZcl.selectClusterById)(db, clusterId, packageId).then(function (x) {
                    return zclEntityQuery(queryZcl.selectAllAttributes, queryZcl.selectAttributesByClusterIdIncludingGlobal)(db, clusterId, packageId).then(function (y) {
                        return zclEntityQuery(queryCommand.selectAllCommands, queryCommand.selectCommandsByClusterId)(db, clusterId, packageId).then(function (z) {
                            return zclEntityQuery(queryEvent.selectAllEvents, queryEvent.selectEventsByClusterId)(db, clusterId, packageId).then(function (g) {
                                return {
                                    clusterData: x,
                                    attributeData: y,
                                    commandData: z,
                                    eventData: g,
                                };
                            });
                        });
                    });
                })];
        });
    });
}
// This is the special merge function used for the CLUSTER path
function mergeZclClusterAttributeCommandEventData(accumulated, currentValue) {
    return {
        clusterData: [accumulated.clusterData, currentValue.clusterData].flat(1),
        commandData: [accumulated.commandData, currentValue.commandData].flat(1),
        attributeData: [accumulated.attributeData, currentValue.attributeData].flat(1),
        eventData: [accumulated.eventData, currentValue.eventData].flat(1),
    };
}
//This maps over each packageId, and runs the query callback.
function reduceAndConcatenateZclEntity(db, id, packageIdArray, zclQueryCallback, mergeFunction, defaultValue) {
    if (mergeFunction === void 0) { mergeFunction = function (accumulated, currentValue) {
        return [accumulated, currentValue].flat(1);
    }; }
    if (defaultValue === void 0) { defaultValue = []; }
    var dataArray = packageIdArray.map(function (packageId) {
        return zclQueryCallback(db, id, packageId);
    });
    return Promise.all(dataArray).then(function (x) {
        return x.reduce(mergeFunction, defaultValue);
    });
}
function parseForZclData(db, entity, id, packageIdArray) {
    switch (entity) {
        case 'atomics':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, zclEntityQuery(queryZcl.selectAllAtomics, queryZcl.selectAtomicById));
        case 'cluster':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, returnZclEntitiesForClusterId, mergeZclClusterAttributeCommandEventData, { clusterData: [], attributeData: [], commandData: [], eventData: [] }).then(function (data) {
                return {
                    clusterData: data.clusterData,
                    attributeData: data.attributeData,
                    commandData: data.commandData,
                    eventData: data.eventData,
                };
            });
        case 'domain':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, zclEntityQuery(queryZcl.selectAllDomains, queryZcl.selectDomainById));
        case 'bitmap':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, zclEntityQuery(queryZcl.selectAllBitmaps, queryZcl.selectBitmapById));
        case 'enum':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, zclEntityQuery(queryZcl.selectAllEnums, queryZcl.selectEnumById));
        case 'struct':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, zclEntityQuery(queryZcl.selectAllStructsWithItemCount, queryZcl.selectStructById));
        case 'deviceType':
            return reduceAndConcatenateZclEntity(db, id, packageIdArray, zclEntityQuery(queryZcl.selectAllDeviceTypes, queryZcl.selectDeviceTypeById));
        case 'endpointTypeClusters':
            return queryZcl.selectEndpointTypeClustersByEndpointTypeId(db, id);
        case 'endpointTypeAttributes':
            return queryZcl.selectEndpointTypeAttributesByEndpointId(db, id);
        case 'endpointTypeCommands':
            return queryZcl.selectEndpointTypeCommandsByEndpointId(db, id);
        case "deviceTypeClusters":
            return queryZcl.selectDeviceTypeClustersByDeviceTypeRef(db, id);
        case "deviceTypeAttributes":
            return queryZcl.selectDeviceTypeAttributesByDeviceTypeRef(db, id);
        case "deviceTypeCommands":
            return queryZcl.selectDeviceTypeCommandsByDeviceTypeRef(db, id);
        default:
            return { type: 'Unknown' };
    }
}
/**
 * API: /zcl/:entity/:id
 *
 * @export
 * @param {*} app Express instance.
 */
function httpGetZclEntity(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, id, entity, sessionId, packageIdArray, resultData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.params, id = _a.id, entity = _a.entity;
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, queryPackage.getSessionZclPackageIds(db, sessionId)];
                case 1:
                    packageIdArray = _b.sent();
                    return [4 /*yield*/, parseForZclData(db, entity, id, packageIdArray)];
                case 2:
                    resultData = _b.sent();
                    response.status(StatusCodes.OK).json(resultData);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * API: /zclExtension/:entity/:extension
 *
 * @param {*} db
 * @returns zcl extension handler
 */
function httpGetZclExtension(db) {
    return function (request, response) {
        var _a = request.params, entity = _a.entity, extensionId = _a.extensionId;
        var sessionId = request.zapSessionId;
        if (!sessionId) {
            var err = 'Unable to retrieve zcl extension. Invalid sessionId!';
            env.logError(err);
            return response.status(StatusCodes.NOT_FOUND).send(err);
        }
        // enable components
        queryPackage
            .getSessionPackagesByType(db, sessionId, dbEnum.packageType.genTemplatesJson)
            .then(function (pkgs) { return (pkgs.length == 0 ? null : pkgs[0].id); })
            .then(function (packageId) {
            if (!packageId) {
                throw new Error('Unable to retrieve valid packageId!');
            }
            return queryPackage.selectPackageExtension(db, packageId, entity);
        })
            .then(function (exts) {
            var clusterExt = util.getClusterExtension(exts, extensionId);
            if (clusterExt.length) {
                return response.status(StatusCodes.OK).json(clusterExt[0]);
            }
            else {
                throw new Error("Unable to find cluster extension by ".concat(extensionId, "."));
            }
        })
            .catch(function (err) {
            env.logError(err);
            return response.status(StatusCodes.NOT_FOUND).send(err);
        });
    };
}
exports.get = [
    {
        uri: restApi.uri.zclEntity,
        callback: httpGetZclEntity,
    },
    {
        uri: restApi.uri.zclExtension,
        callback: httpGetZclExtension,
    },
];
//# sourceMappingURL=static-zcl.js.map