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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * @module JS API: generator logic
 */
var _ = require('lodash');
var fs = require('fs');
var fsPromise = fs.promises;
var path = require('path');
var util = require('../util/util.js');
var queryPackage = require('../db/query-package.js');
var dbEnum = require('../src-shared/db-enum.js');
var env = require('../util/env');
var templateEngine = require('./template-engine.js');
var dbApi = require('../db/db-api.js');
/**
 * Given a path, it will read generation template object into memory.
 *
 * @param {*} context.path
 * @returns context.templates, context.crc
 */
function loadGenTemplate(context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, requiredFeatureLevel, status;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = context;
                    return [4 /*yield*/, fsPromise.readFile(context.path, 'utf8')];
                case 1:
                    _a.data = _b.sent();
                    context.crc = util.checksum(context.data);
                    context.templateData = JSON.parse(context.data);
                    requiredFeatureLevel = 0;
                    if ('requiredFeatureLevel' in context.templateData) {
                        requiredFeatureLevel = context.templateData.requiredFeatureLevel;
                    }
                    status = util.matchFeatureLevel(requiredFeatureLevel, context.path);
                    if (status.match) {
                        return [2 /*return*/, context];
                    }
                    else {
                        throw status.message;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function recordPackageIfNonexistent(db, packagePath, parentId, packageType, version) {
    return __awaiter(this, void 0, void 0, function () {
        var pkg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryPackage.getPackageByPathAndParent(db, packagePath, parentId)];
                case 1:
                    pkg = _a.sent();
                    if (pkg == null) {
                        // doesn't exist
                        return [2 /*return*/, queryPackage.insertPathCrc(db, packagePath, null, packageType, parentId, version)];
                    }
                    else {
                        // Already exists
                        return [2 /*return*/, pkg.id];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function loadTemplateOptionsFromJsonFile(db, packageId, category, externalPath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, jsonData, codeLabels, _a, _b, code;
        var e_1, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fsPromise.readFile(externalPath, 'utf8')];
                case 1:
                    content = _d.sent();
                    jsonData = JSON.parse(content);
                    codeLabels = [];
                    try {
                        for (_a = __values(Object.keys(jsonData)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            code = _b.value;
                            codeLabels.push({ code: code, label: jsonData[code] });
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return [2 /*return*/, queryPackage.insertOptionsKeyValues(db, packageId, category, codeLabels)];
            }
        });
    });
}
/**
 * Given a loading context, it records the package into the packages table and adds the packageId field into the resolved context.
 *
 * @param {*} context
 * @returns promise that resolves with the same context passed in, except packageId added to it
 */
function recordTemplatesPackage(context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, promises, _b, _c, category, data, externalPath, codeLabelArray, _d, _e, code, overridePath, zclExtension;
        var e_2, _f, e_3, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = context;
                    return [4 /*yield*/, queryPackage.registerTopLevelPackage(context.db, context.path, context.crc, dbEnum.packageType.genTemplatesJson, context.templateData.version)];
                case 1:
                    _a.packageId = _h.sent();
                    promises = [];
                    env.logDebug("Loading ".concat(context.templateData.templates.length, " templates."));
                    // Add templates queries to the list of promises
                    context.templateData.templates.forEach(function (template) {
                        var templatePath = path.resolve(path.join(path.dirname(context.path), template.path));
                        if (!template.ignore) {
                            promises.push(recordPackageIfNonexistent(context.db, templatePath, context.packageId, dbEnum.packageType.genSingleTemplate, template.output));
                        }
                    });
                    // Add options to the list of promises
                    if (context.templateData.options != null) {
                        try {
                            for (_b = __values(Object.keys(context.templateData.options)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                category = _c.value;
                                data = context.templateData.options[category];
                                if (_.isString(data)) {
                                    externalPath = path.resolve(path.join(path.dirname(context.path), data));
                                    promises.push(loadTemplateOptionsFromJsonFile(context.db, context.packageId, category, externalPath));
                                }
                                else {
                                    codeLabelArray = [];
                                    try {
                                        for (_d = (e_3 = void 0, __values(Object.keys(data))), _e = _d.next(); !_e.done; _e = _d.next()) {
                                            code = _e.value;
                                            codeLabelArray.push({ code: code, label: data[code] });
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (_e && !_e.done && (_g = _d.return)) _g.call(_d);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                    promises.push(queryPackage.insertOptionsKeyValues(context.db, context.packageId, category, codeLabelArray));
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    // Deal with helpers
                    if (context.templateData.helpers != null) {
                        context.templateData.helpers.forEach(function (helper) {
                            var helperPath = path.join(path.dirname(context.path), helper);
                            promises.push(recordPackageIfNonexistent(context.db, helperPath, context.packageId, dbEnum.packageType.genHelper, null));
                        });
                    }
                    // Deal with overrides
                    if (context.templateData.override != null) {
                        overridePath = path.join(path.dirname(context.path), context.templateData.override);
                        promises.push(recordPackageIfNonexistent(context.db, overridePath, context.packageId, dbEnum.packageType.genOverride, null));
                    }
                    // Deal with partials
                    if (context.templateData.partials != null) {
                        context.templateData.partials.forEach(function (partial) {
                            var partialPath = path.join(path.dirname(context.path), partial.path);
                            promises.push(queryPackage.insertPathCrc(context.db, partialPath, null, dbEnum.packageType.genPartial, context.packageId, partial.name));
                        });
                    }
                    // Deal with zcl extensions
                    if (context.templateData.zcl != null) {
                        zclExtension = context.templateData.zcl;
                        promises.push(loadZclExtensions(context.db, context.packageId, zclExtension, context.path));
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _h.sent();
                    return [2 /*return*/, context];
            }
        });
    });
}
/**
 * This method takes extension data in JSON, and converts it into
 * an object that contains:
 *    entityCode, entityQualifier, parentCode, manufacturerCode and value
 * @param {*} entityType
 * @param {*} entity
 * @returns object that can be used for database injection
 */
function decodePackageExtensionEntity(entityType, entity) {
    switch (entityType) {
        case dbEnum.packageExtensionEntity.cluster:
            return {
                entityCode: entity.clusterCode,
                entityQualifier: entity.role,
                manufacturerCode: null,
                parentCode: null,
                value: entity.value,
            };
        case dbEnum.packageExtensionEntity.command:
            return {
                entityCode: parseInt(entity.commandCode),
                entityQualifier: entity.source,
                manufacturerCode: null,
                parentCode: parseInt(entity.clusterCode),
                value: entity.value,
            };
        case dbEnum.packageExtensionEntity.event:
            return {
                entityCode: parseInt(entity.eventCode),
                manufacturerCode: null,
                parentCode: parseInt(entity.clusterCode),
                value: entity.value,
            };
        case dbEnum.packageExtensionEntity.attribute:
            return {
                entityCode: parseInt(entity.attributeCode),
                entityQualifier: null,
                manufacturerCode: null,
                parentCode: parseInt(entity.clusterCode),
                value: entity.value,
            };
        case dbEnum.packageExtensionEntity.deviceType:
            return {
                entityCode: entity.device,
                entityQualifier: null,
                manufacturerCode: null,
                parentCode: null,
                value: entity.value,
            };
        case dbEnum.packageExtensionEntity.attributeType:
            return {
                entityCode: null,
                entityQualifier: entity.type,
                manufacturerCode: null,
                parentCode: null,
                value: entity.value,
            };
        default:
            // We don't know how to process defaults otherwise
            return null;
    }
}
/**
 * Returns a promise that will load the zcl extensions.
 *
 * @param {*} zclExt
 * @returns Promise of loading the zcl extensions.
 */
function loadZclExtensions(db, packageId, zclExt, defaultsPath) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, _loop_1, _a, _b, entity, e_4_1;
        var e_4, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    promises = [];
                    _loop_1 = function (entity) {
                        var entityExtension, propertyArray, defaultArrayOfArrays, _loop_2, _e, _f, property, e_5_1;
                        var e_5, _g;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    entityExtension = zclExt[entity];
                                    propertyArray = [];
                                    defaultArrayOfArrays = [];
                                    _loop_2 = function (property) {
                                        var prop, externalPath, data;
                                        return __generator(this, function (_j) {
                                            switch (_j.label) {
                                                case 0:
                                                    prop = entityExtension[property];
                                                    propertyArray.push({
                                                        property: property,
                                                        type: prop.type,
                                                        configurability: prop.configurability,
                                                        label: prop.label,
                                                        globalDefault: prop.globalDefault,
                                                    });
                                                    if (!('defaults' in prop)) return [3 /*break*/, 4];
                                                    if (!(typeof prop.defaults === 'string' ||
                                                        prop.defaults instanceof String)) return [3 /*break*/, 2];
                                                    externalPath = path.resolve(path.join(path.dirname(defaultsPath), prop.defaults));
                                                    return [4 /*yield*/, fsPromise
                                                            .readFile(externalPath, 'utf8')
                                                            .then(function (content) { return JSON.parse(content); })
                                                            .catch(function (err) {
                                                            env.logWarning("Invalid file! Failed to load defaults from: ".concat(prop.defaults));
                                                        })];
                                                case 1:
                                                    data = _j.sent();
                                                    if (data) {
                                                        if (!Array.isArray(data)) {
                                                            env.logWarning("Invalid file format! Failed to load defaults from: ".concat(prop.defaults));
                                                        }
                                                        else {
                                                            defaultArrayOfArrays.push(data.map(function (x) { return decodePackageExtensionEntity(entity, x); }));
                                                        }
                                                    }
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    defaultArrayOfArrays.push(prop.defaults.map(function (x) { return decodePackageExtensionEntity(entity, x); }));
                                                    _j.label = 3;
                                                case 3: return [3 /*break*/, 5];
                                                case 4:
                                                    defaultArrayOfArrays.push(null);
                                                    _j.label = 5;
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _h.label = 1;
                                case 1:
                                    _h.trys.push([1, 6, 7, 8]);
                                    _e = (e_5 = void 0, __values(Object.keys(entityExtension))), _f = _e.next();
                                    _h.label = 2;
                                case 2:
                                    if (!!_f.done) return [3 /*break*/, 5];
                                    property = _f.value;
                                    return [5 /*yield**/, _loop_2(property)];
                                case 3:
                                    _h.sent();
                                    _h.label = 4;
                                case 4:
                                    _f = _e.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_5_1 = _h.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (_f && !_f.done && (_g = _e.return)) _g.call(_e);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                    return [7 /*endfinally*/];
                                case 8:
                                    promises.push(queryPackage.insertPackageExtension(db, packageId, entity, propertyArray, defaultArrayOfArrays));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    _a = __values(Object.keys(zclExt)), _b = _a.next();
                    _d.label = 2;
                case 2:
                    if (!!_b.done) return [3 /*break*/, 5];
                    entity = _b.value;
                    return [5 /*yield**/, _loop_1(entity)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _b = _a.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_4_1 = _d.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, Promise.all(promises)];
            }
        });
    });
}
/**
 * Main API async function to load templates from a gen-template.json file.
 *
 * @param {*} db Database
 * @param {*} genTemplatesJson Path to the JSON file
 * @returns the loading context, contains: db, path, crc, packageId and templateData, or error
 */
function loadTemplates(db, genTemplatesJson) {
    return __awaiter(this, void 0, void 0, function () {
        var context, file;
        return __generator(this, function (_a) {
            context = {
                db: db,
            };
            if (genTemplatesJson == null) {
                context.error = 'No templates file specified.';
                env.logWarning(context.error);
                return [2 /*return*/, Promise.resolve(context)];
            }
            file = path.resolve(genTemplatesJson);
            if (!fs.existsSync(file)) {
                context.error = "Can't locate templates file: ".concat(file);
                env.logWarning(context.error);
                return [2 /*return*/, Promise.resolve(context)];
            }
            context.path = file;
            return [2 /*return*/, dbApi
                    .dbBeginTransaction(db)
                    .then(function () { return fsPromise.access(context.path, fs.constants.R_OK); })
                    .then(function () {
                    env.logDebug("Loading generation templates from: ".concat(context.path));
                    return loadGenTemplate(context);
                })
                    .then(function (ctx) { return recordTemplatesPackage(ctx); })
                    .catch(function (err) {
                    env.logInfo("Can not read templates from: ".concat(context.path));
                    throw err;
                })
                    .finally(function () {
                    dbApi.dbCommit(db);
                })];
        });
    });
}
/**
 * Generates all the templates inside a toplevel package.
 *
 * @param {*} genResult
 * @param {*} genTemplateJsonPkg Package that points to genTemplate.json file
 * @param {*} generateOnly if NULL then generate all templates, else only generate template whose out file name matches this.
 * @returns Promise that resolves with genResult, that contains all the generated templates, keyed by their 'output'
 */
function generateAllTemplates(genResult, genTemplateJsonPkg, options) {
    if (options === void 0) { options = {
        generateOnly: null,
        disableDeprecationWarnings: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, queryPackage
                    .getPackageByParent(genResult.db, genTemplateJsonPkg.id)
                    .then(function (packages) {
                    var generationTemplates = [];
                    var helperPromises = [];
                    var partialPromises = [];
                    var overridePath = null;
                    // First extract overridePath if one exists, as we need to
                    // pass it to the generation.
                    packages.forEach(function (singlePkg) {
                        if (singlePkg.type == dbEnum.packageType.genOverride) {
                            overridePath = singlePkg.path;
                        }
                    });
                    // Next load the partials
                    packages.forEach(function (singlePkg) {
                        if (singlePkg.type == dbEnum.packageType.genPartial) {
                            partialPromises.push(templateEngine.loadPartial(singlePkg.version, singlePkg.path));
                        }
                    });
                    // Initialize global helpers
                    templateEngine.initializeGlobalHelpers();
                    // Next load the addon helpers
                    packages.forEach(function (singlePkg) {
                        if (singlePkg.type == dbEnum.packageType.genHelper) {
                            helperPromises.push(templateEngine.loadHelper(singlePkg.path));
                        }
                    });
                    // Next prepare the templates
                    packages.forEach(function (singlePkg) {
                        if (singlePkg.type == dbEnum.packageType.genSingleTemplate) {
                            if (options.generateOnly == null ||
                                options.generateOnly == singlePkg.version) {
                                generationTemplates.push(singlePkg);
                            }
                        }
                    });
                    // And finally go over the actual templates.
                    return Promise.all(helperPromises).then(function () {
                        return Promise.all(partialPromises).then(function () {
                            var templates = generationTemplates.map(function (pkg) {
                                return generateSingleTemplate(genResult, pkg, genTemplateJsonPkg.id, {
                                    overridePath: overridePath,
                                    disableDeprecationWarnings: options.disableDeprecationWarnings,
                                });
                            });
                            return Promise.all(templates);
                        });
                    });
                })
                    .then(function () {
                    genResult.partial = false;
                    return genResult;
                })];
        });
    });
}
/**
 * Function that generates a single package and adds it to the generation result.
 *
 * @param {*} genResult
 * @param {*} singleTemplatePkg Single template package.
 * @returns promise that resolves with the genResult, with newly generated content added.
 */
function generateSingleTemplate(genResult, singleTemplatePkg, genTemplateJsonPackageId, options) {
    if (options === void 0) { options = {
        overridePath: null,
        disableDeprecationWarnings: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, templateEngine.produceContent(genResult.db, genResult.sessionId, singleTemplatePkg, genTemplateJsonPackageId, options)];
                case 1:
                    result = _a.sent();
                    genResult.content[singleTemplatePkg.version] = result.content;
                    genResult.stats[singleTemplatePkg.version] = result.stats;
                    genResult.partial = true;
                    return [2 /*return*/, genResult];
                case 2:
                    err_1 = _a.sent();
                    genResult.errors[singleTemplatePkg.version] = err_1;
                    genResult.hasErrors = true;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Main API async function to generate stuff.
 *
 * @param {*} db Database
 * @param {*} packageId packageId Template package id. It can be either single template or gen template json.
 * @returns Promise that resolves into a generation result.
 */
function generate(db, sessionId, templatePackageId, templateGeneratorOptions, options) {
    if (templateGeneratorOptions === void 0) { templateGeneratorOptions = {}; }
    if (options === void 0) { options = {
        generateOnly: null,
        disableDeprecationWarnings: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, queryPackage
                    .getPackageByPackageId(db, templatePackageId)
                    .then(function (pkg) {
                    if (pkg == null)
                        throw new Error("Invalid packageId: ".concat(templatePackageId));
                    var genResult = {
                        db: db,
                        sessionId: sessionId,
                        content: {},
                        stats: {},
                        errors: {},
                        hasErrors: false,
                        generatorOptions: templateGeneratorOptions,
                        templatePath: path.dirname(pkg.path),
                    };
                    if (pkg.type === dbEnum.packageType.genTemplatesJson) {
                        return generateAllTemplates(genResult, pkg, options);
                    }
                    else {
                        throw new Error("Invalid package type: ".concat(pkg.type));
                    }
                })];
        });
    });
}
/**
 * Promise to write out a file, optionally creating a backup.
 *
 * @param {*} fileName
 * @param {*} content
 * @param {*} doBackup
 * @returns promise of a written file.
 */
function writeFileWithBackup(fileName, content, doBackup) {
    return __awaiter(this, void 0, void 0, function () {
        var backupName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(doBackup && fs.existsSync(fileName))) return [3 /*break*/, 2];
                    backupName = fileName.concat('~');
                    return [4 /*yield*/, fsPromise.rename(fileName, backupName)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, fsPromise.writeFile(fileName, content)];
                case 2: 
                // we need to ensure that directories exist.
                return [4 /*yield*/, fsPromise.mkdir(path.dirname(fileName), { recursive: true })];
                case 3:
                    // we need to ensure that directories exist.
                    _a.sent();
                    return [2 /*return*/, fsPromise.writeFile(fileName, content)];
            }
        });
    });
}
/**
 * Returns a promise that resolves into a content that should be written out to gen result file.
 *
 * @param {*} genResult
 */
function generateGenerationContent(genResult, timing) {
    if (timing === void 0) { timing = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var out, _a, _b, statKey, _c, _d, f, allHelpers, _e, _f, _g, template, stat, _h, _j, _k, helper, value, count;
        var e_6, _l, e_7, _m, e_8, _o, e_9, _p;
        return __generator(this, function (_q) {
            out = {
                writeTime: new Date().toString(),
                featureLevel: env.zapVersion().featureLevel,
                creator: 'zap',
                content: [],
                timing: timing,
                stats: {},
            };
            out.stats.templates = {};
            try {
                for (_a = __values(Object.keys(genResult.stats).sort()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    statKey = _b.value;
                    out.stats.templates[statKey] = genResult.stats[statKey];
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_l = _a.return)) _l.call(_a);
                }
                finally { if (e_6) throw e_6.error; }
            }
            try {
                for (_c = __values(Object.keys(genResult.content).sort()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    f = _d.value;
                    out.content.push(f);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_m = _c.return)) _m.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
            out.stats.allHelpers = {};
            allHelpers = __spreadArray([], __read(templateEngine.globalHelpersList()), false).sort();
            allHelpers.forEach(function (h) {
                out.stats.allHelpers[h] = 0;
            });
            try {
                for (_e = __values(Object.entries(out.stats.templates)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    _g = __read(_f.value, 2), template = _g[0], stat = _g[1];
                    try {
                        for (_h = (e_9 = void 0, __values(Object.entries(stat))), _j = _h.next(); !_j.done; _j = _h.next()) {
                            _k = __read(_j.value, 2), helper = _k[0], value = _k[1];
                            count = value.useCount;
                            out.stats.allHelpers[helper] += count;
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_p = _h.return)) _p.call(_h);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_o = _e.return)) _o.call(_e);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return [2 /*return*/, Promise.resolve(JSON.stringify(out, null, 2))];
        });
    });
}
/**
 * Generate files and write them into the given directory.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} packageId
 * @param {*} outputDirectory
 * @returns a promise which will resolve when all the files are written.
 */
function generateAndWriteFiles(db, sessionId, templatePackageId, outputDirectory, options) {
    if (options === void 0) { options = {
        logger: function (msg) {
            // Empty logger is the default.
        },
        backup: false,
        genResultFile: false,
        skipPostGeneration: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var timing, hrstart, genOptions, templateGeneratorOptions, genResult, promises, _a, _b, f, content, fileName, _c, _d, f, err, fileName, nsDuration;
        var e_10, _e, e_11, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    timing = {};
                    if (options.fileLoadTime) {
                        timing.fileLoad = {
                            nsDuration: Number(options.fileLoadTime),
                            readableDuration: util.duration(options.fileLoadTime),
                        };
                    }
                    hrstart = process.hrtime.bigint();
                    return [4 /*yield*/, queryPackage.selectAllOptionsValues(db, templatePackageId, dbEnum.packageOptionCategory.generator)
                        // Reduce the long array from query into a single object
                    ];
                case 1:
                    genOptions = _g.sent();
                    templateGeneratorOptions = genOptions.reduce(function (acc, current) {
                        acc[current.optionCode] = current.optionLabel;
                        return acc;
                    }, {});
                    return [4 /*yield*/, generate(db, sessionId, templatePackageId, templateGeneratorOptions)];
                case 2:
                    genResult = _g.sent();
                    if (!fs.existsSync(outputDirectory)) {
                        options.logger("\u2705 Creating directory: ".concat(outputDirectory));
                        fs.mkdirSync(outputDirectory, { recursive: true });
                    }
                    options.logger('🤖 Generating files:');
                    promises = [];
                    try {
                        for (_a = __values(Object.keys(genResult.content)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            f = _b.value;
                            content = genResult.content[f];
                            fileName = path.join(outputDirectory, f);
                            options.logger("    \u270D  ".concat(fileName));
                            env.logDebug("Preparing to write file: ".concat(fileName));
                            promises.push(writeFileWithBackup(fileName, content, options.backup));
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                    if (genResult.hasErrors) {
                        options.logger('⚠️  Errors:');
                        try {
                            for (_c = __values(Object.keys(genResult.errors)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                f = _d.value;
                                err = genResult.errors[f];
                                fileName = path.join(outputDirectory, f);
                                options.logger("    \uD83D\uDC4E  ".concat(fileName, ": \u26D4 ").concat(err, "\nStack trace:\n"));
                                options.logger(err);
                            }
                        }
                        catch (e_11_1) { e_11 = { error: e_11_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                            }
                            finally { if (e_11) throw e_11.error; }
                        }
                    }
                    nsDuration = process.hrtime.bigint() - hrstart;
                    options.logger("\uD83D\uDD50 Generation time: ".concat(util.duration(nsDuration), " "));
                    timing.generation = {
                        nsDuration: Number(nsDuration),
                        readableDuration: util.duration(nsDuration),
                    };
                    promises.push(generateGenerationContent(genResult, timing).then(function (generatedContent) {
                        if (options.genResultFile) {
                            var resultPath = path.join(outputDirectory, 'genResult.json');
                            options.logger("    \u270D  Result: ".concat(resultPath));
                            return writeFileWithBackup(resultPath, generatedContent, options.backup);
                        }
                        else {
                            return;
                        }
                    }));
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    _g.sent();
                    if (options.skipPostGeneration) {
                        return [2 /*return*/, genResult];
                    }
                    else {
                        return [2 /*return*/, postProcessGeneratedFiles(outputDirectory, genResult, options.logger)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Executes post processing actions as defined by the gen-templates.json
 *
 * @param {*} outputDirectory
 * @param {*} genResult
 * @returns promise of a dealt-with post processing actions
 */
function postProcessGeneratedFiles(outputDirectory, genResult, logger) {
    if (logger === void 0) { logger = function (msg) {
        // Empty logger is the default.
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var doExecute, isEnabledS, f, isEnabled, postProcessPromises, cmd, _a, _b, genFile, fileName, cmd, _c, _d, genFile, fileName, singleCmd;
        var e_12, _e, e_13, _f;
        return __generator(this, function (_g) {
            doExecute = true;
            isEnabledS = genResult.generatorOptions[dbEnum.generatorOptions.enabled];
            f = genResult.generatorOptions[dbEnum.generatorOptions.postProcessConditionalFile];
            isEnabled = true;
            if (isEnabledS == 'false' || isEnabledS == '0')
                isEnabled = false;
            if (!isEnabled) {
                // If `enabled` is false, then we do nothing.
                doExecute = false;
            }
            else if (f != null) {
                // If `postProcessConditionalFile' doesn't exist, we also do nothing.
                f = path.join(genResult.templatePath, f);
                if (!fs.existsSync(f))
                    doExecute = false;
            }
            postProcessPromises = [];
            if (doExecute &&
                dbEnum.generatorOptions.postProcessMulti in genResult.generatorOptions) {
                cmd = genResult.generatorOptions[dbEnum.generatorOptions.postProcessMulti];
                try {
                    for (_a = __values(Object.keys(genResult.content)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        genFile = _b.value;
                        fileName = path.join(outputDirectory, genFile);
                        cmd = cmd + ' ' + fileName;
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                postProcessPromises.push(util.executeExternalProgram(cmd, genResult.templatePath, {
                    rejectOnFail: false,
                    routeErrToOut: genResult.generatorOptions[dbEnum.generatorOptions.routeErrToOut],
                }));
            }
            if (doExecute &&
                dbEnum.generatorOptions.postProcessSingle in genResult.generatorOptions) {
                cmd = genResult.generatorOptions[dbEnum.generatorOptions.postProcessSingle];
                try {
                    for (_c = __values(Object.keys(genResult.content)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        genFile = _d.value;
                        fileName = path.join(outputDirectory, genFile);
                        singleCmd = cmd + ' ' + fileName;
                        postProcessPromises.push(util.executeExternalProgram(singleCmd, genResult.templatePath, {
                            rejectOnFail: false,
                        }));
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            }
            if (postProcessPromises.length > 0)
                logger('🤖 Executing post-processing actions:');
            return [2 /*return*/, Promise.all(postProcessPromises).then(function () { return genResult; })];
        });
    });
}
/**
 * This async function takes a string, and resolves a preview object out of it.
 *
 * @param {*} content String to form into preview.
 */
function contentIndexer(content, linesPerIndex) {
    if (linesPerIndex === void 0) { linesPerIndex = 2000; }
    return __awaiter(this, void 0, void 0, function () {
        var index, indexedResult, code, loc, i;
        return __generator(this, function (_a) {
            index = 0;
            indexedResult = {};
            code = content.split(/\n/);
            loc = code.length;
            if (content == null || content.length == 0) {
                return [2 /*return*/, Promise.resolve(indexedResult)];
            }
            // Indexing the generation result for faster preview pane generation
            for (i = 0; i < loc; i++) {
                if (i % linesPerIndex === 0) {
                    index++;
                    indexedResult[index] = '';
                }
                indexedResult[index] = indexedResult[index].concat(code[i]).concat('\n');
            }
            return [2 /*return*/, Promise.resolve(indexedResult)];
        });
    });
}
/**
 * Generates a single file and feeds it back for preview.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} fileName
 * @returns promise that resolves into a preview object.
 */
function generateSingleFileForPreview(db, sessionId, outFileName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, queryPackage
                    .getSessionPackagesByType(db, sessionId, dbEnum.packageType.genTemplatesJson)
                    .then(function (pkgs) {
                    var promises = [];
                    pkgs.forEach(function (pkg) {
                        promises.push(generate(db, sessionId, pkg.id, {}, {
                            generateOnly: outFileName,
                            disableDeprecationWarnings: true,
                        }));
                    });
                    return Promise.all(promises);
                })
                    .then(function (genResultArrays) {
                    var content = '';
                    genResultArrays.forEach(function (gr) {
                        if (outFileName in gr.content) {
                            content = gr.content[outFileName];
                        }
                    });
                    return content;
                })
                    .then(function (content) { return contentIndexer(content); })];
        });
    });
}
exports.loadTemplates = loadTemplates;
exports.generateAndWriteFiles = generateAndWriteFiles;
exports.generateSingleFileForPreview = generateSingleFileForPreview;
exports.contentIndexer = contentIndexer;
exports.generate = generate;
//# sourceMappingURL=generation-engine.js.map