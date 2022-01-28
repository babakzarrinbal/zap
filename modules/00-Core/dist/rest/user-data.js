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
 * @module REST API: user data
 */
var env = require('../util/env');
var queryZcl = require('../db/query-zcl.js');
var queryAttribute = require('../db/query-attribute.js');
var queryConfig = require('../db/query-config.js');
var queryEndpointType = require('../db/query-endpoint-type.js');
var queryEndpoint = require('../db/query-endpoint.js');
var querySession = require('../db/query-session.js');
var queryPackage = require('../db/query-package.js');
var asyncValidation = require('../validation/async-validation.js');
var validation = require('../validation/validation.js');
var restApi = require('../src-shared/rest-api.js');
var zclLoader = require('../zcl/zcl-loader.js');
var dbEnum = require('../.src-shared/db-enum.js');
var StatusCodes = require('http-status-codes').StatusCodes;
/**
 * HTTP GET: session key values
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpGetSessionKeyValues(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, sessionKeyValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, querySession.getAllSessionKeyValues(db, sessionId)];
                case 1:
                    sessionKeyValues = _a.sent();
                    response.status(StatusCodes.OK).json(sessionKeyValues);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: save session key value
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostSaveSessionKeyValue(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, key, value, sessionId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, key = _a.key, value = _a.value;
                    sessionId = request.zapSessionId;
                    env.logDebug("[".concat(sessionId, "]: Saving: ").concat(key, " => ").concat(value));
                    return [4 /*yield*/, querySession.updateSessionKeyValue(db, sessionId, key, value)];
                case 1:
                    _b.sent();
                    response.status(StatusCodes.OK).json({
                        key: key,
                        value: value,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: cluster
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostCluster(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, id, side, flag, endpointTypeIdList, sessionId, pkgs, packageId_1, states, insertDefaults_1, promises, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, id = _a.id, side = _a.side, flag = _a.flag, endpointTypeIdList = _a.endpointTypeIdList;
                    sessionId = request.zapSessionId;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, queryPackage.getSessionPackagesByType(db, sessionId, dbEnum.packageType.zclProperties)];
                case 2:
                    pkgs = _b.sent();
                    packageId_1 = pkgs[0].id;
                    if (endpointTypeIdList.length == 0) {
                        throw new Error('Invalid function parameter: endpointTypeIdList');
                    }
                    return [4 /*yield*/, Promise.all(endpointTypeIdList.map(function (endpointTypeId) {
                            return queryConfig.selectClusterState(db, endpointTypeId, id, side);
                        }))];
                case 3:
                    states = _b.sent();
                    insertDefaults_1 = states.length == 0;
                    promises = endpointTypeIdList.map(function (endpointTypeId) {
                        return queryConfig
                            .insertOrReplaceClusterState(db, endpointTypeId, id, side, flag)
                            .then(function () {
                            if (insertDefaults_1) {
                                return queryConfig.insertClusterDefaults(db, endpointTypeId, packageId_1, {
                                    clusterRef: id,
                                    side: side,
                                });
                            }
                        });
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 4:
                    _b.sent();
                    response
                        .status(StatusCodes.OK)
                        .json({
                        endpointTypeIdList: endpointTypeIdList,
                        id: id,
                        side: side,
                        flag: flag,
                    })
                        .send();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST attribute update
 *
 * @param {*} db
 * @returns callback for the express uri registration */
function httpPostAttributeUpdate(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, action, endpointTypeId, endpointTypeIdList, id, value, listType, clusterRef, attributeSide, reportMinInterval, reportMaxInterval, reportableChange, paramType, paramArray, eptAttr, validationData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, action = _a.action, endpointTypeId = _a.endpointTypeId, endpointTypeIdList = _a.endpointTypeIdList, id = _a.id, value = _a.value, listType = _a.listType, clusterRef = _a.clusterRef, attributeSide = _a.attributeSide, reportMinInterval = _a.reportMinInterval, reportMaxInterval = _a.reportMaxInterval, reportableChange = _a.reportableChange;
                    if (!Array.isArray(endpointTypeIdList) || !endpointTypeIdList.length) {
                        if (endpointTypeId == 'undefined') {
                            response.status(StatusCodes.BAD_REQUEST).json();
                        }
                        else {
                            endpointTypeIdList = [endpointTypeId];
                        }
                    }
                    switch (listType) {
                        case restApi.updateKey.attributeStorage:
                        case restApi.updateKey.attributeDefault:
                            paramType = 'text';
                            break;
                        default:
                            paramType = '';
                            break;
                    }
                    paramArray = listType == restApi.updateKey.init
                        ? null
                        : [{ key: listType, value: value, type: paramType }];
                    // all endpoints
                    return [4 /*yield*/, Promise.all(endpointTypeIdList.map(function (endpointTypeId) {
                            return queryConfig.insertOrUpdateAttributeState(db, endpointTypeId, clusterRef, attributeSide, id, paramArray, reportMinInterval, reportMaxInterval, reportableChange);
                        }))
                        // send latest value to frontend to update UI
                    ];
                case 1:
                    // all endpoints
                    _b.sent();
                    return [4 /*yield*/, queryZcl.selectEndpointTypeAttribute(db, endpointTypeIdList[0], id, clusterRef)
                        // only return 1 validation result.
                        // error isn't endpoint specific.
                        // endpointTypeId doesn't matter since all attributes are the seame.
                    ];
                case 2:
                    eptAttr = _b.sent();
                    return [4 /*yield*/, validation.validateAttribute(db, endpointTypeIdList[0], id, clusterRef)];
                case 3:
                    validationData = _b.sent();
                    response.status(StatusCodes.OK).json({
                        action: action,
                        endpointTypeIdList: endpointTypeIdList,
                        clusterRef: clusterRef,
                        id: id,
                        added: value,
                        listType: listType,
                        validationIssues: validationData,
                        endpointTypeAttributeData: eptAttr,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: command update
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostCommandUpdate(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, action, endpointTypeId, endpointTypeIdList, id, value, listType, clusterRef, commandSide, isIncoming;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, action = _a.action, endpointTypeId = _a.endpointTypeId, endpointTypeIdList = _a.endpointTypeIdList, id = _a.id, value = _a.value, listType = _a.listType, clusterRef = _a.clusterRef, commandSide = _a.commandSide;
                    isIncoming = null;
                    switch (listType) {
                        case 'selectedIn':
                            isIncoming = true;
                            break;
                        case 'selectedOut':
                            isIncoming = false;
                            break;
                        default:
                            break;
                    }
                    return [4 /*yield*/, Promise.all(endpointTypeIdList.map(function (endpointTypeId) {
                            return queryConfig.insertOrUpdateCommandState(db, endpointTypeId, clusterRef, commandSide, id, value, isIncoming);
                        }))];
                case 1:
                    _b.sent();
                    response.status(StatusCodes.OK).json({
                        action: action,
                        endpointTypeIdList: endpointTypeIdList,
                        id: id,
                        added: value,
                        listType: listType,
                        side: commandSide,
                        clusterRef: clusterRef,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: command update
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpPostEventUpdate(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, action, endpointTypeId, id, value, listType, clusterRef, eventSide;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.body, action = _a.action, endpointTypeId = _a.endpointTypeId, id = _a.id, value = _a.value, listType = _a.listType, clusterRef = _a.clusterRef, eventSide = _a.eventSide;
                    return [4 /*yield*/, queryConfig.insertOrUpdateEventState(db, endpointTypeId, clusterRef, eventSide, id, value)];
                case 1:
                    _b.sent();
                    response.status(StatusCodes.OK).json({
                        action: action,
                        endpointTypeId: endpointTypeId,
                        id: id,
                        added: value,
                        listType: listType,
                        side: eventSide,
                        clusterRef: clusterRef,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP GET: initial state
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpGetInitialState(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, state, session, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    state = {};
                    return [4 /*yield*/, querySession.getSessionFromSessionId(db, sessionId)];
                case 1:
                    session = _a.sent();
                    asyncValidation.initAsyncValidation(db, session);
                    return [4 /*yield*/, Promise.all([
                            queryEndpointType.selectAllEndpointTypes(db, sessionId),
                            queryEndpoint.selectAllEndpoints(db, sessionId),
                            querySession.getAllSessionKeyValues(db, sessionId),
                        ])];
                case 2:
                    results = _a.sent();
                    state.endpointTypes = results[0];
                    state.endpoints = results[1];
                    state.sessionKeyValues = results[2];
                    response.status(StatusCodes.OK).json(state);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP GET: option
 *
 * @param {*} db
 * @returns callback for the express uri registration
 */
function httpGetOption(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var category, sessionId, packages, p, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    category = request.params.category;
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, queryPackage.getSessionPackages(db, sessionId)];
                case 1:
                    packages = _a.sent();
                    p = packages.map(function (pkg) {
                        return queryPackage.selectAllOptionsValues(db, pkg.packageRef, category);
                    });
                    return [4 /*yield*/, Promise.all(p)];
                case 2:
                    data = _a.sent();
                    data = data.flat(1);
                    response.status(StatusCodes.OK).json(data);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP GET: Project packages
 */
function httpGetPackages(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, packageSessionPackagePairs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = request.zapSessionId;
                    return [4 /*yield*/, queryPackage.getPackageSessionPackagePairBySessionId(db, sessionId)];
                case 1:
                    packageSessionPackagePairs = _a.sent();
                    response.status(StatusCodes.OK).json(packageSessionPackagePairs);
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: Add new project package
 */
function httpPostAddNewPackage(db) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, filePath, data, status, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.zapSessionId;
                    filePath = req.body.path;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, zclLoader.loadIndividualFile(db, filePath, sessionId)];
                case 2:
                    data = _a.sent();
                    status = void 0;
                    if (!data.err) return [3 /*break*/, 3];
                    status = {
                        isValid: false,
                        err: data.err.message,
                    };
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, queryPackage.insertSessionPackage(db, sessionId, data.packageId, false)];
                case 4:
                    _a.sent();
                    status = {
                        isValid: true,
                        sessionId: sessionId,
                    };
                    _a.label = 5;
                case 5:
                    res.status(StatusCodes.OK).json(status);
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: Unify all Attributes configuration into one presentation.
 *
 * 1) In Zigbee world, the Attribute configuration is a global singleton entity.
 *    To emulate the global singleton entity, this function ensures Attribute changes
 *    are applied to all endpoint specific attribute fields.
 * 2) (native case in ZAP) In Matter, the Attribute configuration are endpoint specific.
 *
 */
function httpPostUnifyAttributesAcrossEndpoints(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var endpointTypeIdList, resp, endpointsAndClusters, unifiedAttributesInfo_1, oldEndpointAttributesInfo_1, newEndpointClusterInfos_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointTypeIdList = request.body.endpointTypeIdList;
                    resp = { oldState: {}, newState: {} };
                    if (!(!Array.isArray(endpointTypeIdList) || !endpointTypeIdList.length)) return [3 /*break*/, 1];
                    response.status(StatusCodes.BAD_REQUEST).json();
                    return [3 /*break*/, 6];
                case 1:
                    if (endpointTypeIdList.length == 1) {
                        return [2 /*return*/, response.status(StatusCodes.OK).json(resp)];
                    }
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(db, endpointTypeIdList.map(function (x) {
                            return { endpointTypeId: x };
                        }))];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeDetailsFromEnabledClusters(db, endpointsAndClusters)];
                case 3:
                    unifiedAttributesInfo_1 = _a.sent();
                    unifiedAttributesInfo_1.forEach(function (entry) {
                        // global attribute do not have cluserRefs field
                        // let's fix it up for the attribute update API.
                        if (entry.clusterRef == null) {
                            entry.clusterRef = entry.clusterId;
                        }
                    });
                    return [4 /*yield*/, Promise.all(endpointsAndClusters.map(function (endpointsAndCluster) {
                            return queryAttribute
                                .selectAttributeDetailsFromEnabledClusters(db, [
                                endpointsAndCluster,
                            ])
                                .then(function (attrDetails) {
                                // global attributes are not tied to specific Clusters
                                if (attrDetails.clusterRef == null) {
                                    queryEndpoint.selectEndpointClusters(db);
                                }
                            });
                        }))
                        // align all cluster states
                    ];
                case 4:
                    oldEndpointAttributesInfo_1 = _a.sent();
                    // align all cluster states
                    if (endpointTypeIdList.length > 1) {
                        endpointTypeIdList.forEach(function (endpointTypeId) {
                            unifiedAttributesInfo_1.forEach(function (attr) {
                                return queryConfig.insertOrUpdateAttributeState(db, endpointTypeId, attr.clusterRef, attr.side, attr.id, [
                                    { key: restApi.updateKey.attributeSelected, value: 1 },
                                    {
                                        key: restApi.updateKey.attributeStorage,
                                        value: "\"".concat(attr.storageOption, "\""),
                                    },
                                    {
                                        key: restApi.updateKey.attributeSingleton,
                                        value: attr.isSingleton,
                                    },
                                    {
                                        key: restApi.updateKey.attributeBounded,
                                        value: attr.isAttributeBounded,
                                    },
                                    {
                                        key: restApi.updateKey.attributeDefault,
                                        value: attr.defaultValue,
                                    },
                                    {
                                        key: restApi.updateKey.attributeReporting,
                                        value: attr.isAttributeReportable,
                                    },
                                ], attr.attributeReportableMinValue, attr.attributeReportableMaxValue, attr.attributeReportableChange);
                            });
                        });
                    }
                    resp.oldState = [];
                    endpointTypeIdList.forEach(function (endpointTypeId, index) {
                        resp.oldState.push({
                            endpointTypeId: endpointTypeId,
                            attributes: oldEndpointAttributesInfo_1[index],
                        });
                    });
                    return [4 /*yield*/, Promise.all(endpointTypeIdList.map(function (endpointTypeId) {
                            return queryEndpointType.selectAllClustersDetailsFromEndpointTypes(db, [
                                { endpointTypeId: endpointTypeId },
                            ]);
                        })).then(function (endpointClusterInfos) {
                            // sort by name
                            return endpointClusterInfos.map(function (clus) {
                                return clus.sort(function (a, b) { return a.name.localeCompare(b.name); });
                            });
                        })];
                case 5:
                    newEndpointClusterInfos_1 = _a.sent();
                    resp.newState = [];
                    endpointTypeIdList.forEach(function (endpointTypeId, index) {
                        resp.newState.push({
                            endpointTypeId: endpointTypeId,
                            attributes: newEndpointClusterInfos_1[index],
                        });
                    });
                    response.status(StatusCodes.OK).json(resp);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * HTTP POST: Unify all Clusters configuration into one presentation.
 *
 * 1) In Zigbee world, the Clusters configuration is a global singleton entity.
 *    To emulate the global singleton entity, this function ensures changes 1 cluster
 *    are applied to all endpoint specific cluster fields.
 * 2) (native case in ZAP) In Matter, the Cluster configuration are endpoint specific.
 *
 */
function httpPostUnifyClustersAcrossEndpoints(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var endpointTypeIdList, resp, unifiedClustersInfo_1, oldEndpointAttributesInfo_2, newEndpointClusterInfos_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointTypeIdList = request.body.endpointTypeIdList;
                    resp = { oldState: {}, newState: {} };
                    if (!(!Array.isArray(endpointTypeIdList) || !endpointTypeIdList.length)) return [3 /*break*/, 1];
                    response.status(StatusCodes.BAD_REQUEST).send();
                    return [3 /*break*/, 5];
                case 1:
                    if (endpointTypeIdList.length == 1) {
                        return [2 /*return*/, response.status(StatusCodes.OK).json(resp)];
                    }
                    return [4 /*yield*/, queryEndpointType.selectAllClustersDetailsFromEndpointTypes(db, endpointTypeIdList.map(function (x) {
                            return { endpointTypeId: x };
                        }))];
                case 2:
                    unifiedClustersInfo_1 = _a.sent();
                    return [4 /*yield*/, Promise.all(endpointTypeIdList.map(function (endpointTypeId) {
                            return queryEndpointType.selectAllClustersDetailsFromEndpointTypes(db, [
                                { endpointTypeId: endpointTypeId },
                            ]);
                        })).then(function (endpointClusterInfos) {
                            // sort by name
                            return endpointClusterInfos.map(function (clus) {
                                return clus.sort(function (a, b) { return a.name.localeCompare(b.name); });
                            });
                        })
                        // align all cluster states
                    ];
                case 3:
                    oldEndpointAttributesInfo_2 = _a.sent();
                    // align all cluster states
                    if (endpointTypeIdList.length > 1) {
                        endpointTypeIdList.forEach(function (endpointTypeId) {
                            unifiedClustersInfo_1.forEach(function (clus) {
                                queryConfig.insertOrReplaceClusterState(db, endpointTypeId, clus.id, clus.side, clus.enabled);
                            });
                        });
                    }
                    resp.oldState = [];
                    endpointTypeIdList.forEach(function (endpointTypeId, index) {
                        resp.oldState.push({
                            endpointTypeId: endpointTypeId,
                            clusters: oldEndpointAttributesInfo_2[index],
                        });
                    });
                    return [4 /*yield*/, Promise.all(endpointTypeIdList.map(function (endpointTypeId) {
                            return queryEndpointType.selectAllClustersDetailsFromEndpointTypes(db, [
                                { endpointTypeId: endpointTypeId },
                            ]);
                        })).then(function (endpointClusterInfos) {
                            // sort by name
                            return endpointClusterInfos.map(function (clus) {
                                return clus.sort(function (a, b) { return a.name.localeCompare(b.name); });
                            });
                        })];
                case 4:
                    newEndpointClusterInfos_2 = _a.sent();
                    resp.newState = [];
                    endpointTypeIdList.forEach(function (endpointTypeId, index) {
                        resp.newState.push({
                            endpointTypeId: endpointTypeId,
                            clusters: newEndpointClusterInfos_2[index],
                        });
                    });
                    // env.logInfo(`Unifying cluster states across endpoint`)
                    // env.logInfo(`Before:`)
                    // resp.oldState.forEach((ep) => {
                    //   ep.clusters.forEach((clus) => {
                    //     env.logInfo(
                    //       `ep_id: ${ep.endpointTypeId}, clus_id:${clus.id}, name:${clus.name}, side:${clus.side}, enabled:${clus.enabled}`
                    //     )
                    //   })
                    // })
                    // env.logInfo(`After:`)
                    // resp.newState.forEach((ep) => {
                    //   ep.clusters.forEach((clus) => {
                    //     env.logInfo(
                    //       `ep_id: ${ep.endpointTypeId}, clus_id:${clus.id}, name:${clus.name}, side:${clus.side}, enabled:${clus.enabled}`
                    //     )
                    //   })
                    // })
                    response.status(StatusCodes.OK).json(resp);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
function httpDeleteSessionPackage(db) {
    var _this = this;
    return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var _a, sessionRef, packageRef, removed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = request.query, sessionRef = _a.sessionRef, packageRef = _a.packageRef;
                    return [4 /*yield*/, queryPackage.deleteSessionPackage(db, sessionRef, packageRef)];
                case 1:
                    removed = _b.sent();
                    response.status(StatusCodes.OK).json({
                        successful: removed > 0,
                        sessionRef: sessionRef,
                        packageRef: packageRef,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.post = [
    {
        uri: restApi.uri.cluster,
        callback: httpPostCluster,
    },
    {
        uri: restApi.uri.attributeUpdate,
        callback: httpPostAttributeUpdate,
    },
    {
        uri: restApi.uri.commandUpdate,
        callback: httpPostCommandUpdate,
    },
    {
        uri: restApi.uri.eventUpdate,
        callback: httpPostEventUpdate,
    },
    {
        uri: restApi.uri.saveSessionKeyValue,
        callback: httpPostSaveSessionKeyValue,
    },
    {
        uri: restApi.uri.addNewPackage,
        callback: httpPostAddNewPackage,
    },
    {
        uri: restApi.uri.unifyClustersAcrossEndpoints,
        callback: httpPostUnifyClustersAcrossEndpoints,
    },
    {
        uri: restApi.uri.unifyAttributesAcrossEndpoints,
        callback: httpPostUnifyAttributesAcrossEndpoints,
    },
];
exports.get = [
    {
        uri: restApi.uri.getAllSessionKeyValues,
        callback: httpGetSessionKeyValues,
    },
    {
        uri: restApi.uri.initialState,
        callback: httpGetInitialState,
    },
    {
        uri: "".concat(restApi.uri.option, "/:category"),
        callback: httpGetOption,
    },
    {
        uri: restApi.uri.packages,
        callback: httpGetPackages,
    },
];
exports.delete = [
    {
        uri: restApi.uri.sessionPackage,
        callback: httpDeleteSessionPackage,
    },
];
//# sourceMappingURL=user-data.js.map