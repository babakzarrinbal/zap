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
 * This module contains the API functions for the post-load
 * scripting functionality.
 *
 *  @module JS API: post-import.
 */
var queryEndpoint = require('../db/query-endpoint.js');
var queryConfig = require('../db/query-config.js');
var dbEnum = require('../src-shared/db-enum.js');
var queryPackage = require('../db/query-package.js');
var querySessionZcl = require('../db/query-session-zcl.js');
var queryZcl = require('../db/query-zcl.js');
var restApi = require('../src-shared/rest-api.js');
/**
 * Prints a text to console.
 *
 * @param {*} text
 */
function print(text) {
    console.log(text);
}
/**
 * Prints error message to the console.
 *
 * @param {*} text
 */
function printError(text) {
    console.log("\u26D4 SCRIPT API ERROR: ".concat(text));
}
/**
 * Returns an array of endpoints.
 *
 * @param {*} context
 */
function endpoints(context) {
    return queryEndpoint.selectAllEndpoints(context.db, context.sessionId);
}
/**
 * Deletes an endpoint
 *
 * @param {*} context
 * @param {*} endpoint
 */
function deleteEndpoint(context, endpoint) {
    return queryEndpoint.deleteEndpoint(context.db, endpoint.id);
}
/**
 * Returns an array of clusters defined on a given endpoint.
 *
 * @param {*} context
 * @param {*} endpoint
 */
function clusters(context, endpoint) {
    return queryEndpoint.selectEndpointClusters(context.db, endpoint.endpointTypeRef);
}
/**
 * Returns an array of attributes for a given cluster.
 * The cluster input is required to come from a script-api in this module.
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} cluster
 */
function attributes(context, endpoint, cluster) {
    return queryEndpoint.selectEndpointClusterAttributes(context.db, cluster.clusterId, cluster.side, endpoint.endpointTypeRef);
}
/**
 * Returns an array of commands for a given cluster
 * The clusters input is required to come from a script-api in this module.
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} cluster
 */
function commands(context, endpoint, cluster) {
    return queryEndpoint.selectEndpointClusterCommands(context.db, cluster.clusterId, endpoint.endpointTypeRef);
}
/**
 * Returns array of function names available in this module.
 */
function functions() {
    return Object.keys(exports);
}
/**
 * Returns the session id in the context.
 *
 * @param {*} context
 * @returns sessionId
 */
function sessionId(context) {
    return context.sessionId;
}
function dbEnums() {
    return dbEnum;
}
/**
 * Returns all available clusters.
 *
 * @param {*} context
 * @returns all available clusters
 */
function availableClusters(context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, querySessionZcl.selectAllSessionClusters(context.db, context.sessionId)];
        });
    });
}
// Finds the cluster database primary key from code,manufacturing code, and context.
// Note that by default, a standard ZCL library cluster will have manufacturing code of null
// in the database.
function findCluster(context, code, mfgCode) {
    if (mfgCode === void 0) { mfgCode = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, querySessionZcl.selectSessionClusterByCode(context.db, context.sessionId, code, mfgCode)];
        });
    });
}
function findAttribute(context, clusterCode, side, attributeCode, mfgCode) {
    if (mfgCode === void 0) { mfgCode = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, querySessionZcl.selectSessionAttributeByCode(context.db, context.sessionId, clusterCode, side, attributeCode, mfgCode)];
        });
    });
}
function findCommand(context, clusterCode, commandCode, source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, querySessionZcl.selectSessionCommandByCode(context.db, context.sessionId, clusterCode, commandCode, source)];
        });
    });
}
// Non-public, common function to modify cluster.
function modifyCluster(context, endpoint, code, side, enabled) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCluster(context, code)];
                case 1:
                    cluster = _a.sent();
                    if (cluster == null) {
                        printError("Cluster 0x".concat(code.toString(16), " does not exist."));
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, queryConfig.insertOrReplaceClusterState(context.db, endpoint.endpointTypeRef, cluster.id, side, enabled)];
            }
        });
    });
}
// Non-public, common function to modify attribute.
function modifyAttribute(context, endpoint, clusterCode, attributeCode, side, enable) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, attribute, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCluster(context, clusterCode)];
                case 1:
                    cluster = _a.sent();
                    if (cluster == null) {
                        printError("Cluster 0x".concat(clusterCode.toString(16), " does not exist."));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, findAttribute(context, clusterCode, side, attributeCode)];
                case 2:
                    attribute = _a.sent();
                    if (attribute == null) {
                        printError("Attribute 0x".concat(attributeCode.toString(16), " in cluster 0x").concat(clusterCode.toString(16), " does not exist."));
                        return [2 /*return*/, null];
                    }
                    params = [
                        {
                            key: restApi.updateKey.attributeSelected,
                            value: enable,
                        },
                    ];
                    return [2 /*return*/, queryConfig.insertOrUpdateAttributeState(context.db, endpoint.endpointTypeRef, cluster.id, side, attribute.id, params, attribute.reportMinInterval, attribute.reportMaxInterval, attribute.reportableChange)];
            }
        });
    });
}
// Non-public, common function to modify command.
function modifyCommand(context, endpoint, clusterCode, commandCode, source, isIncoming, enable) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findCluster(context, clusterCode)];
                case 1:
                    cluster = _a.sent();
                    if (cluster == null) {
                        printError("Cluster 0x".concat(clusterCode.toString(16), " does not exist."));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, findCommand(context, clusterCode, commandCode, source)];
                case 2:
                    command = _a.sent();
                    if (command == null) {
                        printError("Command 0x".concat(commandCode.toString(16), " in cluster 0x").concat(clusterCode.toString(16), " does not exist."));
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, queryConfig.insertOrUpdateCommandState(context.db, endpoint.endpointTypeRef, cluster.id, command.source, command.id, enable ? 1 : 0, isIncoming)];
            }
        });
    });
}
/**
 * Disables the client cluster on an endpoint.
 * @param {*} context
 * @param {*} endpoint
 * @param {*} code
 */
function disableClientCluster(context, endpoint, code) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCluster(context, endpoint, code, dbEnum.side.client, false)];
        });
    });
}
/**
 * Disables the server cluster on an endpoint.
 * @param {*} context
 * @param {*} endpoint
 * @param {*} code
 */
function disableServerCluster(context, endpoint, code) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCluster(context, endpoint, code, dbEnum.side.server, false)];
        });
    });
}
/**
 * Enables the client cluster on an endpoint.
 * @param {*} context
 * @param {*} endpoint
 * @param {*} code
 */
function enableClientCluster(context, endpoint, code) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCluster(context, endpoint, code, dbEnum.side.client, true)];
        });
    });
}
/**
 * Enables the server cluster on an endpoint.
 * @param {*} context
 * @param {*} endpoint
 * @param {*} code
 */
function enableServerCluster(context, endpoint, code) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCluster(context, endpoint, code, dbEnum.side.server, true)];
        });
    });
}
/**
 * Disable client attribute.
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} attributeCode
 */
function disableClientAttribute(context, endpoint, clusterCode, attributeCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyAttribute(context, endpoint, clusterCode, attributeCode, dbEnum.side.client, false)];
        });
    });
}
/**
 * Enable client attribute.
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} attributeCode
 */
function enableClientAttribute(context, endpoint, clusterCode, attributeCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyAttribute(context, endpoint, clusterCode, attributeCode, dbEnum.side.client, true)];
        });
    });
}
/**
 * Disable server attribute.
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} attributeCode
 */
function disableServerAttribute(context, endpoint, clusterCode, attributeCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyAttribute(context, endpoint, clusterCode, attributeCode, dbEnum.side.server, false)];
        });
    });
}
/**
 * Enable server attribute.
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} attributeCode
 */
function enableServerAttribute(context, endpoint, clusterCode, attributeCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyAttribute(context, endpoint, clusterCode, attributeCode, dbEnum.side.server, true)];
        });
    });
}
/**
 * Disable incoming commands.
 * Source should be derived from dbEnums().source.client/server
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} commandCode
 * @param {*} source
 */
function disableIncomingCommand(context, endpoint, clusterCode, commandCode, source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCommand(context, endpoint, clusterCode, commandCode, source, true, false)];
        });
    });
}
/**
 * Enable incoming commands.
 * Source should be derived from dbEnums().source.client/server
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} commandCode
 * @param {*} source
 */
function enableIncomingCommand(context, endpoint, clusterCode, commandCode, source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCommand(context, endpoint, clusterCode, commandCode, source, true, true)];
        });
    });
}
/**
 * Disable outgoing commands.
 * Source should be derived from dbEnums().source.client/server
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} commandCode
 * @param {*} source
 */
function disableOutgoingCommand(context, endpoint, clusterCode, commandCode, source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCommand(context, endpoint, clusterCode, commandCode, source, false, false)];
        });
    });
}
/**
 * Enable outgoing commands.
 * Source should be derived from dbEnums().source.client/server
 *
 * @param {*} context
 * @param {*} endpoint
 * @param {*} clusterCode
 * @param {*} commandCode
 * @param {*} source
 */
function enableOutgoingCommand(context, endpoint, clusterCode, commandCode, source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, modifyCommand(context, endpoint, clusterCode, commandCode, source, false, true)];
        });
    });
}
exports.availableClusters = availableClusters;
exports.print = print;
exports.functions = functions;
exports.sessionId = sessionId;
exports.dbEnums = dbEnums;
exports.endpoints = endpoints;
exports.deleteEndpoint = deleteEndpoint;
exports.clusters = clusters;
exports.attributes = attributes;
exports.commands = commands;
exports.findCluster = findCluster;
exports.disableClientCluster = disableClientCluster;
exports.disableServerCluster = disableServerCluster;
exports.enableClientCluster = enableClientCluster;
exports.enableServerCluster = enableServerCluster;
exports.disableClientAttribute = disableClientAttribute;
exports.enableClientAttribute = enableClientAttribute;
exports.disableServerAttribute = disableServerAttribute;
exports.enableServerAttribute = enableServerAttribute;
exports.disableClientAttribute = disableClientAttribute;
exports.enableClientAttribute = enableClientAttribute;
exports.disableServerAttribute = disableServerAttribute;
exports.enableServerAttribute = enableServerAttribute;
exports.disableIncomingCommand = disableIncomingCommand;
exports.enableIncomingCommand = enableIncomingCommand;
exports.disableOutgoingCommand = disableOutgoingCommand;
exports.enableOutgoingCommand = enableOutgoingCommand;
// Constants that are used a lot
exports.client = dbEnum.source.client;
exports.server = dbEnum.source.server;
//# sourceMappingURL=script-api.js.map