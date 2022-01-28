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
/**
 * This module contains the API for templating. For more detailed instructions, read {@tutorial template-tutorial}
 *
 * @module Templating API: user-data specific helpers
 */
var templateUtil = require('./template-util.js');
var queryImpexp = require('../db/query-impexp.js');
var queryCluster = require('../db/query-cluster.js');
var queryEndpointType = require('../db/query-endpoint-type.js');
var queryCommand = require('../db/query-command.js');
var queryAttribute = require('../db/query-attribute.js');
var queryConfig = require('../db/query-config.js');
var querySession = require('../db/query-session.js');
var helperZcl = require('./helper-zcl.js');
var dbEnum = require('../src-shared/db-enum.js');
var iteratorUtil = require('../util/iterator-util.js');
/**
 * Creates block iterator over the endpoints.
 *
 * @param {*} options
 */
function user_endpoints(options) {
    var _this = this;
    var promise = templateUtil
        .ensureEndpointTypeIds(this)
        .then(function (endpointTypes) {
        return queryImpexp.exportEndpoints(_this.global.db, _this.global.sessionId, endpointTypes);
    })
        .then(function (endpoints) {
        return endpoints.map(function (x) {
            x.endpointTypeId = x.endpointTypeRef;
            return x;
        });
    })
        .then(function (endpoints) { return templateUtil.collectBlocks(endpoints, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Creates block iterator helper over the endpoint types.
 *
 * @tutorial template-tutorial
 * @param {*} options
 */
function user_endpoint_types(options) {
    var _this = this;
    var promise = queryImpexp
        .exportEndpointTypes(this.global.db, this.global.sessionId)
        .then(function (endpointTypes) {
        return templateUtil.collectBlocks(endpointTypes, options, _this);
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Creates cluster iterator over the endpoint types.
 * This works ony inside user_endpoint_types.
 *
 * @param {*} options
 */
function user_clusters(options) {
    var _this = this;
    var promise = queryImpexp
        .exportClustersFromEndpointType(this.global.db, this.endpointTypeId)
        .then(function (endpointClusters) {
        return templateUtil.collectBlocks(endpointClusters, options, _this);
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Creates endpoint type cluster attribute iterator. This works only
 * inside user_clusters.
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster attributes.
 */
function user_cluster_attributes(options) {
    var _this = this;
    var promise = queryImpexp
        .exportAttributesFromEndpointTypeCluster(this.global.db, this.parent.endpointTypeId, this.endpointClusterId)
        .then(function (endpointAttributes) {
        return templateUtil.collectBlocks(endpointAttributes, options, _this);
    });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Creates endpoint type cluster command iterator. This works only inside
 * user_clusters.
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster commands.
 */
function user_cluster_commands(options) {
    var _this = this;
    var promise = queryImpexp
        .exportCommandsFromEndpointTypeCluster(this.global.db, this.parent.endpointTypeId, this.endpointClusterId)
        .then(function (endpointAttributes) {
        return templateUtil.collectBlocks(endpointAttributes, options, _this);
    });
    return templateUtil.templatePromise(this.global, promise);
}
function user_endpoint_type_count() {
    var promise = queryConfig.selectEndpointTypeCount(this.global.db, this.global.sessionId);
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Retrieve the number of endpoints which possess the specified
 * cluster type
 *
 * @param {*} clusterTypeId
 * @return Promise of the number of endpoint
 */
function user_endpoint_count_by_cluster(clusterTypeId, side) {
    var promise = queryConfig.selectEndpointTypeCountByCluster(this.global.db, this.global.sessionId, clusterTypeId, side);
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Iterates over all attributes required by the user configuration.
 *
 * @param {*} options
 * @return Promise of the resolved blocks iterating over cluster commands.
 */
function user_all_attributes(options) {
    var _this = this;
    var promise = queryConfig
        .selectAllSessionAttributes(this.global.db, this.global.sessionId)
        .then(function (atts) { return templateUtil.collectBlocks(atts, options, _this); });
    return templateUtil.templatePromise(this.global, promise);
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * commands which have been enabled on added endpoints
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster commands.
 */
function all_user_cluster_commands(options) {
    var _this = this;
    var promise = iteratorUtil.all_user_cluster_commands_helper
        .call(this, options)
        .then(function (endpointCommands) {
        return templateUtil.collectBlocks(endpointCommands, options, _this);
    });
    return promise;
}
/**
 *
 * @param name
 * @param side
 * @param options
 * @param currentContext
 * @param isManufacturingSpecific
 * @param isIrrespectiveOfManufacturingSpecification
 * Returns: Promise of the resolved blocks iterating over manufacturing specific,
 * non-manufacturing specific or both of the cluster commands.
 */
function all_user_cluster_command_util(name, side, options, currentContext, isManufacturingSpecific, isIrrespectiveOfManufacturingSpecification) {
    if (isIrrespectiveOfManufacturingSpecification === void 0) { isIrrespectiveOfManufacturingSpecification = false; }
    var promise = templateUtil
        .ensureEndpointTypeIds(currentContext)
        .then(function (endpointTypes) {
        return queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(currentContext.global.db, endpointTypes);
    })
        .then(function (endpointsAndClusters) {
        if (isIrrespectiveOfManufacturingSpecification) {
            return queryCommand.selectCommandDetailsFromAllEndpointTypesAndClusters(currentContext.global.db, endpointsAndClusters, true);
        }
        else if (isManufacturingSpecific) {
            return queryCommand.selectManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters(currentContext.global.db, endpointsAndClusters);
        }
        else {
            return queryCommand.selectNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters(currentContext.global.db, endpointsAndClusters);
        }
    })
        .then(function (endpointCommands) {
        return new Promise(function (resolve, reject) {
            var availableCommands = [];
            for (var i = 0; i < endpointCommands.length; i++) {
                if (helperZcl.isStrEqual(name, endpointCommands[i].clusterName)) {
                    if (helperZcl.isCommandAvailable(side, endpointCommands[i].incoming, endpointCommands[i].outgoing, endpointCommands[i].commandSource, endpointCommands[i].name)) {
                        availableCommands.push(endpointCommands[i]);
                    }
                }
            }
            resolve(availableCommands);
        });
    })
        .then(function (endpointCommands) {
        return templateUtil.collectBlocks(endpointCommands, options, currentContext);
    });
    return promise;
}
function all_user_cluster_attribute_util(name, side, options, currentContext, isManufacturingSpecific, isIrrespectiveOfManufacturingSpecification) {
    if (isIrrespectiveOfManufacturingSpecification === void 0) { isIrrespectiveOfManufacturingSpecification = false; }
    var promise = templateUtil
        .ensureEndpointTypeIds(currentContext)
        .then(function (endpointTypes) {
        return queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(currentContext.global.db, endpointTypes);
    })
        .then(function (endpointsAndClusters) {
        return isIrrespectiveOfManufacturingSpecification
            ? queryAttribute.selectAllAttributeDetailsFromEnabledClusters(currentContext.global.db, endpointsAndClusters)
            : isManufacturingSpecific
                ? queryAttribute.selectManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters(currentContext.global.db, endpointsAndClusters)
                : queryAttribute.selectNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters(currentContext.global.db, endpointsAndClusters);
    })
        .then(function (endpointAttributes) {
        return new Promise(function (resolve, reject) {
            var availableAttributes = [];
            for (var i = 0; i < endpointAttributes.length; i++) {
                if (helperZcl.isStrEqual(name, endpointAttributes[i].clusterName)) {
                    availableAttributes.push(endpointAttributes[i]);
                }
            }
            resolve(availableAttributes);
        });
    })
        .then(function (endpointCommands) {
        return templateUtil.collectBlocks(endpointCommands, options, currentContext);
    });
    return promise;
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * manufacturing specific commands which have been enabled on added endpoints
 *
 * @param options
 * @returns Promise of the resolved blocks iterating over manufacturing specific
 * cluster commands.
 */
function all_user_cluster_manufacturer_specific_commands(name, side, options) {
    return all_user_cluster_command_util(name, side, options, this, true);
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * non-manufacturing specific commands which have been enabled on added endpoints
 *
 * @param options
 * @returns Promise of the resolved blocks iterating over non-manufacturing specific
 * cluster commands.
 */
function all_user_cluster_non_manufacturer_specific_commands(name, side, options) {
    return all_user_cluster_command_util(name, side, options, this, false);
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * manufacturing specific commands which have been enabled on added endpoints
 *
 * @param options
 * @returns Promise of the resolved blocks iterating over manufacturing specific
 * cluster commands.
 */
function all_user_cluster_manufacturer_specific_attributes(name, side, options) {
    return all_user_cluster_attribute_util(name, side, options, this, true);
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * non-manufacturing specific commands which have been enabled on added endpoints
 *
 * @param options
 * @returns Promise of the resolved blocks iterating over non-manufacturing specific
 * cluster commands.
 */
function all_user_cluster_non_manufacturer_specific_attributes(name, side, options) {
    return all_user_cluster_attribute_util(name, side, options, this, false);
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * commands which have been enabled on added endpoints
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster commands.
 */
function all_commands_for_user_enabled_clusters(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllCommandDetailsFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointCommands, options, this)];
            }
        });
    });
}
/**
 * This helper returns all commands which have cli within the list of enabled
 * clusters.
 *
 * @param options
 * @returns all commands with cli from the list of enabled clusters
 *
 */
function all_cli_commands_for_user_enabled_clusters(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllCliCommandDetailsFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointCommands, options, this)];
            }
        });
    });
}
/**
 * Creates cluster iterator for all endpoints.
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster commands.
 */
function all_user_clusters(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, clusters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectAllClustersDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    clusters = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clusters, options, this)];
            }
        });
    });
}
/**
 * Creates cluster command iterator for all endpoints.
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster commands.
 */
function all_user_clusters_irrespective_of_side(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, clusters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectAllClustersDetailsIrrespectiveOfSideFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    clusters = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clusters, options, this)];
            }
        });
    });
}
/**
 * Creates cluster command iterator for all endpoints whitout any duplicates
 * cause by cluster side
 *
 * @param {*} options
 * @returns Promise of the resolved blocks iterating over cluster commands.
 */
function all_user_clusters_names(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, clusters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectAllClustersNamesFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    clusters = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clusters, options, this)];
            }
        });
    });
}
/**
 * Get the count of the number of clusters commands with cli for a cluster.
 * This is used under a cluster block helper
 */
function user_cluster_command_count_with_cli() {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [2 /*return*/, queryCommand.selectCliCommandCountFromEndpointTypeCluster(this.global.db, endpointTypes, this.endpointClusterId)];
            }
        });
    });
}
/**
 * This helper works within the the cluster block helpers. It is used to get
 * all commands of the cluster which have cli associated with them.
 *
 * param options
 * Returns: all commands with cli for a cluster
 *
 * Example:
 * {{#all_user_clusters_irrespective_of_side}}
 *  {{#user_cluster_commands_with_cli}}
 *  {{/user_cluster_commands_with_cli}}
 * {{/all_user_clusters_irrespective_of_side}}
 */
function user_cluster_commands_with_cli(options) {
    return __awaiter(this, void 0, void 0, function () {
        var cliCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryCommand.selectCliCommandsFromCluster(this.global.db, this.id)];
                case 1:
                    cliCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(cliCommands, options, this)];
            }
        });
    });
}
/**
 * Creates endpoint type cluster command iterator. This works only inside
 * cluster block helpers.
 *
 * @param options
 * Returns: Promise of the resolved blocks iterating over cluster commands.
 */
function user_cluster_commands_all_endpoints(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectCommandDetailsFromAllEndpointTypeCluster(this.global.db, endpointTypes, this.endpointClusterId)];
                case 2:
                    endpointCommands = _a.sent();
                    return [2 /*return*/, endpointsAndClusterstemplateUtil.collectBlocks(endpointCommands, options, this)];
            }
        });
    });
}
/**
 * Check if the cluster (name) has any enabled commands. This works only inside
 * cluster block helpers.
 *
 * @param {*} name : Cluster name
 * @param {*} side : Cluster side
 * @returns True if cluster has enabled commands otherwise false
 */
function user_cluster_has_enabled_command(name, side) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointCommands, cmdCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryCommand.selectCommandDetailsFromAllEndpointTypesAndClusters(this.global.db, endpointsAndClusters, false)];
                case 3:
                    endpointCommands = _a.sent();
                    cmdCount = 0;
                    endpointCommands.forEach(function (command) {
                        if (helperZcl.isStrEqual(name, command.clusterName)) {
                            if (helperZcl.isCommandAvailable(side, command.incoming, command.outgoing, command.commandSource, command.name)) {
                                cmdCount++;
                            }
                        }
                    });
                    return [2 /*return*/, cmdCount != 0];
            }
        });
    });
}
/**
 * Creates endpoint type cluster command iterator. This fetches all
 * manufacturing and non-manufaturing specific commands which have been enabled
 * on added endpoints
 *
 * @param options
 * @returns Promise of the resolved blocks iterating over manufacturing specific
 * and non-manufacturing specific cluster commands.
 */
function all_user_cluster_commands_irrespective_of_manufaturing_specification(name, side, options) {
    return all_user_cluster_command_util(name, side, options, this, false, true);
}
/**
 * Creates endpoint type cluster attribute iterator. This fetches all
 * manufacturing and non-manufaturing specific attributes which have been enabled
 * on added endpoints
 *
 * @param options
 * @returns Promise of the resolved blocks iterating over manufacturing specific
 * and non-manufacturing specific cluster attributes.
 */
function all_user_cluster_attributes_irrespective_of_manufatucuring_specification(name, side, options) {
    return all_user_cluster_attribute_util(name, side, options, this, false, true);
}
/**
 * Helper that resolves into a user session key value.
 *
 * @param {*} options
 * @returns Promise of value of the session key or undefined.
 */
function user_session_key(options) {
    return __awaiter(this, void 0, void 0, function () {
        var key, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = options.hash.key;
                    return [4 /*yield*/, querySession.getSessionKeyValue(this.global.db, this.global.sessionId, key)];
                case 1:
                    value = _a.sent();
                    if (options.hash.toupper == 'true' && value != null)
                        return [2 /*return*/, value.toUpperCase()];
                    else
                        return [2 /*return*/, value];
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * If helper that checks if command discovery is enabled
 *
 * example:
 * {{#if_command_discovery_enabled}}
 * command discovery is enabled
 * {{else}}
 * command discovery is not enabled
 * {{/if_command_discovery_enabled}}
 */
function if_command_discovery_enabled(options) {
    return __awaiter(this, void 0, void 0, function () {
        var key, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = 'commandDiscovery';
                    return [4 /*yield*/, querySession.getSessionKeyValue(this.global.db, this.global.sessionId, key)];
                case 1:
                    value = _a.sent();
                    if (value == 1) {
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
function user_manufacturer_code(options) {
    return __awaiter(this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, querySession.getSessionKeyValue(this.global.db, this.global.sessionId, dbEnum.sessionOption.manufacturerCodes)];
                case 1:
                    value = _a.sent();
                    if (options.hash.toupper == 'true' && value != null)
                        return [2 /*return*/, value.toUpperCase()];
                    else
                        return [2 /*return*/, value];
                    return [2 /*return*/];
            }
        });
    });
}
function user_default_response_policy(options) {
    return __awaiter(this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, querySession.getSessionKeyValue(this.global.db, this.global.sessionId, dbEnum.sessionOption.defaultResponsePolicy)];
                case 1:
                    value = _a.sent();
                    if (options.hash.toupper == 'true' && value != null)
                        return [2 /*return*/, value.toUpperCase()];
                    else
                        return [2 /*return*/, value];
                    return [2 /*return*/];
            }
        });
    });
}
/*
 * @param {*} endpointTypeId
 * Returns the endpoint type identifier for an endpoint type
 */
function endpoint_type_identifier(endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpoints, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryImpexp.exportEndpoints(this.global.db, this.global.sessionId, endpointTypes)];
                case 2:
                    endpoints = _a.sent();
                    for (i = 0; i < endpoints.length; i++) {
                        if (endpointTypeId == endpoints[i].endpointTypeRef) {
                            if (endpoints[i].endpointId == null) {
                                return [2 /*return*/, '0'];
                            }
                            else {
                                return [2 /*return*/, "".concat(endpoints[i].endpointId)];
                            }
                        }
                    }
                    return [2 /*return*/, '0'];
            }
        });
    });
}
/*
 * @param {*} endpointTypeId
 * Returns the index of the endpoint whose endpointTypeId is endpointTypeId
 * Will return -1 if the given endpoint type is not present.
 */
function endpoint_type_index(endpointTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpoints, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryImpexp.exportEndpoints(this.global.db, this.global.sessionId, endpointTypes)];
                case 2:
                    endpoints = _a.sent();
                    for (i = 0; i < endpoints.length; i++) {
                        if (endpointTypeId == endpoints[i].endpointTypeRef) {
                            return [2 /*return*/, i];
                        }
                    }
                    return [2 /*return*/, -1];
            }
        });
    });
}
/**
 * Default values for the attributes longer than a pointer.
 * All attribute values with size greater than 2 bytes.
 * Excluding 0 values and externally saved values
 *
 * @param name
 * @param side
 * @param options
 * @returns Attribute values greater than 2 bytes and not 0 nor externally saved.
 */
function all_user_cluster_attributes_for_generated_defaults(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeBoundDetails(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointAttributes, options, this)];
            }
        });
    });
}
/**
 * Entails the list of all attributes which have been enabled. Given the
 * cluster is enabled as well. The helper retrieves the attributes across
 * all endpoints.
 * @param options
 * @returns enabled attributes
 */
function all_user_cluster_generated_attributes(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeDetailsFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointAttributes, options, this)];
            }
        });
    });
}
/**
 * Entails the list of reportable attributes which have been enabled. Given the
 * cluster is enabled as well. The helper retrieves the reportable attributes
 * per endpoint per cluster.
 * @param options
 * @returns Reportable attributes
 */
function all_user_reportable_attributes(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectReportableAttributeDetailsFromEnabledClustersAndEndpoints(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointAttributes, options, this)];
            }
        });
    });
}
/**
 * All available cluster commands across all endpoints and clusters.
 * @param options
 * @returns All available cluster commands across all endpoints and clusters
 */
function all_user_cluster_generated_commands(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryEndpointType.selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllAvailableClusterCommandDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointCommands, options, this)];
            }
        });
    });
}
/**
 * All clusters with side that have available incoming commands
 * @param options
 * @returns All clusters with side that have available incoming commands across
 * all endpoints.
 */
function all_user_clusters_with_incoming_commands(options) {
    var _this = this;
    return queryEndpointType
        .selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)
        .then(function (endpointTypes) {
        return 'uniqueClusterCodes' in options.hash &&
            options.hash.uniqueClusterCodes == 'true'
            ? queryCommand.selectAllClustersWithIncomingCommands(_this.global.db, endpointTypes, true)
            : queryCommand.selectAllClustersWithIncomingCommands(_this.global.db, endpointTypes, false);
    })
        .then(function (clustersWithIncomingCommands) {
        return templateUtil.collectBlocks(clustersWithIncomingCommands, options, _this);
    });
}
/**
 * Provide all manufacturing specific clusters that have incoming commands with
 * the given cluster code.
 * @param clusterCode
 * @param options
 * @returns Details of manufacturing specific clusters that have incoming
 * commands with the given cluster code
 */
function manufacturing_clusters_with_incoming_commands(clusterCode, options) {
    var _this = this;
    return queryEndpointType
        .selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)
        .then(function (endpointTypes) {
        return queryCommand.selectMfgClustersWithIncomingCommandsForClusterCode(_this.global.db, endpointTypes, clusterCode);
    })
        .then(function (clustersWithIncomingCommands) {
        return templateUtil.collectBlocks(clustersWithIncomingCommands, options, _this);
    });
}
/**
 * All clusters that have available incoming commands.
 * If there is a client and server enabled on the endpoint, this combines them
 * into a single entry.
 * @param options
 * @returns All clusters that have available incoming commands across
 * all endpoints.
 */
function all_user_clusters_with_incoming_commands_combined(options) {
    var _this = this;
    return queryEndpointType
        .selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)
        .then(function (endpointTypes) {
        return queryCommand.selectAllClustersWithIncomingCommandsCombined(_this.global.db, endpointTypes);
    })
        .then(function (clustersWithIncomingCommands) {
        return templateUtil.collectBlocks(clustersWithIncomingCommands, options, _this);
    });
}
/**
 * All commands that need to be parsed for a given cluster. This takes in booleans
 * for if the client and or server are included.
 * @param clusterName
 * @param clientSide
 * @param serverSide
 * @param options
 * @returns all commands that need to be parsed for a given cluster
 */
function all_incoming_commands_for_cluster_combined(clusterName, clientSide, serverSide, options) {
    return __awaiter(this, void 0, void 0, function () {
        var isMfgSpec, endpointTypes, clustersWithIncomingCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isMfgSpec = 'isMfgSpecific' in options.hash
                        ? options.hash.isMfgSpecific.toLowerCase() === 'true'
                        : undefined;
                    return [4 /*yield*/, queryEndpointType.selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllIncomingCommandsForClusterCombined(this.global.db, endpointTypes, clusterName, clientSide, serverSide, isMfgSpec)];
                case 2:
                    clustersWithIncomingCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clustersWithIncomingCommands, options, this)];
            }
        });
    });
}
function all_user_incoming_commands_for_all_clusters(options) {
    return __awaiter(this, void 0, void 0, function () {
        var isMfgSpec, endpointTypes, clustersWithIncomingCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isMfgSpec = 'isMfgSpecific' in options.hash
                        ? options.hash.isMfgSpecific.toLowerCase() === 'true'
                        : undefined;
                    return [4 /*yield*/, queryEndpointType.selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllIncomingCommands(this.global.db, endpointTypes, isMfgSpec)];
                case 2:
                    clustersWithIncomingCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clustersWithIncomingCommands, options, this)];
            }
        });
    });
}
/**
 * All commands that need to be parsed for a given cluster
 * @param clusterName
 * @param options
 * @returns all commands that need to be parsed for a given cluster
 */
function all_incoming_commands_for_cluster(clusterName, clusterSide, options) {
    return __awaiter(this, void 0, void 0, function () {
        var isMfgSpec, endpointTypes, clustersWithIncomingCommands;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isMfgSpec = 'isMfgSpecific' in options.hash
                        ? options.hash.isMfgSpecific.toLowerCase() === 'true'
                        : undefined;
                    return [4 /*yield*/, queryEndpointType.selectUsedEndpointTypeIds(this.global.db, this.global.sessionId)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryCommand.selectAllIncomingCommandsForCluster(this.global.db, endpointTypes, clusterName, clusterSide, isMfgSpec)];
                case 2:
                    clustersWithIncomingCommands = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clustersWithIncomingCommands, options, this)];
            }
        });
    });
}
/**
 * Entails the Cluster details per endpoint
 * @param {*} options
 * @returns Cluster Details per endpoint with attribute summaries within the clusters
 */
function generated_clustes_details(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, clusterDetails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryCluster.selectClusterDetailsFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    clusterDetails = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(clusterDetails, options, this)];
            }
        });
    });
}
/**
 * Entails Endpoint type details along with their cluster summaries
 * @param options
 * @returns Endpoint type details along with their cluster summaries
 */
function generated_endpoint_type_details(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointDetails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectEndpointDetailsFromAddedEndpoints(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointDetails = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointDetails, options, this)];
            }
        });
    });
}
/**
 * Returns attributes inside an endpoint type that either have a default or a
 * bounded attribute.
 *
 * @param name
 * @param side
 * @param options
 * @returns endpoints with bounds or defaults
 */
function all_user_cluster_attributes_min_max_defaults(options) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeDetailsWithABoundFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    return [2 /*return*/, templateUtil.collectBlocks(endpointAttributes, options, this)];
            }
        });
    });
}
/**
 *
 * @param clusterName
 * @param attributeName
 * @param attributeSide
 * @param attributeValue
 * @param attributeValueType
 * @param endpointAttributes
 * @returns arrayIndex
 */
function checkAttributeMatch(clusterName, attributeName, attributeSide, attributeValue, attributeValueType, endpointAttributes) {
    return __awaiter(this, void 0, void 0, function () {
        var dataPtr, endpointAttributes_1, endpointAttributes_1_1, ea;
        var e_1, _a;
        return __generator(this, function (_b) {
            try {
                for (endpointAttributes_1 = __values(endpointAttributes), endpointAttributes_1_1 = endpointAttributes_1.next(); !endpointAttributes_1_1.done; endpointAttributes_1_1 = endpointAttributes_1.next()) {
                    ea = endpointAttributes_1_1.value;
                    if (ea.clusterName === clusterName &&
                        ea.name === attributeName &&
                        ea.side === attributeSide &&
                        ea.attributeValueType === attributeValueType) {
                        dataPtr = ea.arrayIndex ? ea.arrayIndex : 0;
                        return [2 /*return*/, dataPtr];
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (endpointAttributes_1_1 && !endpointAttributes_1_1.done && (_a = endpointAttributes_1.return)) _a.call(endpointAttributes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return [2 /*return*/, attributeValue];
        });
    });
}
/**
 * Extracts the index of generated defaults array which come from
 * all_user_cluster_attributes_for_generated_defaults
 * @param clusterName
 * @param attributeName
 * @param attributeValueType
 * @param attributeValue
 * @param prefixReturn
 * @param postFixReturn
 * @returns index of the generated default array
 */
function generated_defaults_index(clusterName, attributeName, attributeValueType, attributeValue, prefixReturn, postFixReturn) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes, dataPtr, endpointAttributes_2, endpointAttributes_2_1, ea;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _b.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _b.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeBoundDetails(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _b.sent();
                    dataPtr = attributeValue;
                    try {
                        for (endpointAttributes_2 = __values(endpointAttributes), endpointAttributes_2_1 = endpointAttributes_2.next(); !endpointAttributes_2_1.done; endpointAttributes_2_1 = endpointAttributes_2.next()) {
                            ea = endpointAttributes_2_1.value;
                            if (ea.clusterName === clusterName &&
                                ea.name === attributeName &&
                                ea.attributeValueType === attributeValueType) {
                                dataPtr = ea.arrayIndex ? ea.arrayIndex : 0;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (endpointAttributes_2_1 && !endpointAttributes_2_1.done && (_a = endpointAttributes_2.return)) _a.call(endpointAttributes_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    if (dataPtr === attributeValue) {
                        dataPtr = dataPtr ? '(uint8_t*)' + dataPtr : 'NULL';
                    }
                    else {
                        dataPtr = prefixReturn + dataPtr + postFixReturn;
                    }
                    return [2 /*return*/, dataPtr];
            }
        });
    });
}
/**
 * Extracts the index of generated defaults array which come from
 * all_user_cluster_attributes_for_generated_defaults
 * @param clusterName
 * @param attributeName
 * @param attributeSide
 * @param attributeValueType
 * @param attributeValue
 * @param prefixReturn
 * @param postFixReturn
 * @returns deafult value's index in the generated default array
 */
function generated_default_index(clusterName, attributeName, attributeSide, attributeValueType, attributeValue, prefixReturn, postFixReturn) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes, dataPtr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeBoundDetails(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    return [4 /*yield*/, checkAttributeMatch(clusterName, attributeName, attributeSide, attributeValue, attributeValueType, endpointAttributes)];
                case 4:
                    dataPtr = _a.sent();
                    if (dataPtr === attributeValue) {
                        dataPtr = dataPtr ? '(uint8_t*)' + dataPtr : 'NULL';
                    }
                    else {
                        dataPtr = prefixReturn + dataPtr + postFixReturn;
                    }
                    return [2 /*return*/, dataPtr];
            }
        });
    });
}
/**
 *
 * Extracts the index of generated min max defaults array which come from
 * all_user_cluster_attributes_min_max_defaults
 * @param name
 * @param side
 * @param options
 * @returns index of the generated min max default array
 */
function generated_attributes_min_max_index(clusterName, attributeName) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes, dataPtr, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeDetailsWithABoundFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    dataPtr = 0;
                    for (i = 0; i < endpointAttributes.length; i++) {
                        if (endpointAttributes[i].clusterName === clusterName &&
                            endpointAttributes[i].name === attributeName) {
                            dataPtr = i;
                        }
                    }
                    return [2 /*return*/, dataPtr];
            }
        });
    });
}
/**
 *
 * Extracts the index of generated min max defaults array which come from
 * all_user_cluster_attributes_min_max_defaults
 * @param clusterName
 * @param attributeName
 * @param attributeSide
 * @param options
 * @returns index of the generated min max default in the array
 */
function generated_attribute_min_max_index(clusterName, attributeName, attributeSide) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointTypes, endpointsAndClusters, endpointAttributes, dataPtr, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, templateUtil.ensureEndpointTypeIds(this)];
                case 1:
                    endpointTypes = _a.sent();
                    return [4 /*yield*/, queryEndpointType.selectClustersAndEndpointDetailsFromEndpointTypes(this.global.db, endpointTypes)];
                case 2:
                    endpointsAndClusters = _a.sent();
                    return [4 /*yield*/, queryAttribute.selectAttributeDetailsWithABoundFromEnabledClusters(this.global.db, endpointsAndClusters)];
                case 3:
                    endpointAttributes = _a.sent();
                    dataPtr = 0;
                    for (i = 0; i < endpointAttributes.length; i++) {
                        if (endpointAttributes[i].clusterName === clusterName &&
                            endpointAttributes[i].name === attributeName &&
                            endpointAttributes[i].side === attributeSide) {
                            dataPtr = i;
                        }
                    }
                    return [2 /*return*/, dataPtr];
            }
        });
    });
}
var dep = templateUtil.deprecatedHelper;
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.user_endpoint_types = user_endpoint_types;
exports.user_endpoints = user_endpoints;
exports.user_clusters = user_clusters;
exports.user_cluster_attributes = user_cluster_attributes;
exports.user_cluster_commands = user_cluster_commands;
exports.user_endpoint_type_count = user_endpoint_type_count;
exports.user_endpoint_count_by_cluster = user_endpoint_count_by_cluster;
exports.user_all_attributes = user_all_attributes;
exports.all_user_cluster_commands = all_user_cluster_commands;
exports.all_user_clusters = all_user_clusters;
exports.all_user_clusters_names = all_user_clusters_names;
exports.user_cluster_command_count_with_cli =
    user_cluster_command_count_with_cli;
exports.user_cluster_commands_all_endpoints =
    user_cluster_commands_all_endpoints;
exports.user_cluster_has_enabled_command = user_cluster_has_enabled_command;
exports.user_session_key = user_session_key;
exports.user_manufacturer_code = user_manufacturer_code;
exports.user_default_response_policy = user_default_response_policy;
exports.endpoint_type_identifier = endpoint_type_identifier;
exports.endpoint_type_index = endpoint_type_index;
exports.all_commands_for_user_enabled_clusters =
    all_commands_for_user_enabled_clusters;
exports.all_user_clusters_irrespective_of_side =
    all_user_clusters_irrespective_of_side;
exports.all_user_cluster_manufacturer_specific_commands =
    all_user_cluster_manufacturer_specific_commands;
exports.all_user_cluster_non_manufacturer_specific_commands =
    all_user_cluster_non_manufacturer_specific_commands;
exports.user_cluster_commands_with_cli = user_cluster_commands_with_cli;
exports.all_cli_commands_for_user_enabled_clusters =
    all_cli_commands_for_user_enabled_clusters;
exports.all_user_cluster_commands_irrespective_of_manufaturing_specification =
    all_user_cluster_commands_irrespective_of_manufaturing_specification;
exports.all_user_cluster_manufacturer_specific_attributes =
    all_user_cluster_manufacturer_specific_attributes;
exports.all_user_cluster_non_manufacturer_specific_attributes =
    all_user_cluster_non_manufacturer_specific_attributes;
exports.all_user_cluster_attributes_irrespective_of_manufatucuring_specification =
    all_user_cluster_attributes_irrespective_of_manufatucuring_specification;
exports.all_user_cluster_attributes_for_generated_defaults =
    all_user_cluster_attributes_for_generated_defaults;
exports.all_user_cluster_generated_attributes =
    all_user_cluster_generated_attributes;
exports.all_user_reportable_attributes = all_user_reportable_attributes;
exports.all_user_cluster_generated_commands =
    all_user_cluster_generated_commands;
exports.generated_clustes_details = generated_clustes_details;
exports.generated_endpoint_type_details = generated_endpoint_type_details;
exports.all_user_cluster_attributes_min_max_defaults =
    all_user_cluster_attributes_min_max_defaults;
exports.generated_defaults_index = dep(generated_defaults_index, {
    to: 'generated_default_index',
});
exports.generated_default_index = generated_default_index;
exports.generated_attributes_min_max_index = dep(generated_attributes_min_max_index, { to: 'generated_attribute_min_max_index' });
exports.generated_attribute_min_max_index = generated_attribute_min_max_index;
exports.all_user_clusters_with_incoming_commands =
    all_user_clusters_with_incoming_commands;
exports.all_user_incoming_commands_for_all_clusters =
    all_user_incoming_commands_for_all_clusters;
exports.all_user_clusters_with_incoming_commands_combined =
    all_user_clusters_with_incoming_commands_combined;
exports.all_user_clusters_with_incoming_commands_combined = dep(all_user_clusters_with_incoming_commands_combined, { to: 'all_user_incoming_commands_for_all_clusters' });
exports.all_incoming_commands_for_cluster = all_incoming_commands_for_cluster;
exports.all_incoming_commands_for_cluster_combined =
    all_incoming_commands_for_cluster_combined;
exports.all_incoming_commands_for_cluster_combined = dep(all_incoming_commands_for_cluster_combined, { to: 'all_user_incoming_commands_for_all_clusters' });
exports.if_command_discovery_enabled = if_command_discovery_enabled;
exports.manufacturing_clusters_with_incoming_commands =
    manufacturing_clusters_with_incoming_commands;
//# sourceMappingURL=helper-session.js.map