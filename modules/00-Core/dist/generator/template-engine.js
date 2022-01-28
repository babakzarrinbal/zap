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
 * @module JS API: generator logic
 */
var _ = require('lodash');
var nativeRequire = require('../util/native-require');
var fsPromise = require('fs').promises;
var promisedHandlebars = require('promised-handlebars');
var handlebars = promisedHandlebars(require('handlebars'));
var includedHelpers = [
    require('./helper-zcl'),
    require('./helper-zap'),
    require('./helper-c'),
    require('./helper-session'),
    require('./helper-endpointconfig'),
    require('./helper-sdkextension'),
    require('./helper-tokens'),
    require('./helper-attribute'),
    require('./helper-command'),
    require('./helper-future'),
    require('./helper-access'),
];
var helpersInitializationList = null;
var templateCompileOptions = {
    noEscape: true,
};
var precompiledTemplates = {};
/**
 * Resolves into a precompiled template, either from previous precompile or freshly compiled.
 * @param {*} singleTemplatePkg
 * @returns templates
 */
function produceCompiledTemplate(singleTemplatePkg) {
    return __awaiter(this, void 0, void 0, function () {
        var data, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(singleTemplatePkg.id in precompiledTemplates)) return [3 /*break*/, 1];
                    return [2 /*return*/, precompiledTemplates[singleTemplatePkg.id]];
                case 1: return [4 /*yield*/, fsPromise.readFile(singleTemplatePkg.path, 'utf8')];
                case 2:
                    data = _a.sent();
                    template = handlebars.compile(data, templateCompileOptions);
                    precompiledTemplates[singleTemplatePkg.id] = template;
                    return [2 /*return*/, template];
            }
        });
    });
}
/**
 * Given db connection, session and a single template package, produce the output.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} singlePkg
 * @param {*} overridePath: if passed, it provides a path to the override file that can override the overridable.js
 * @returns Promise that resolves with the 'utf8' string that contains the generated content.
 */
function produceContent(db, sessionId, singleTemplatePkg, genTemplateJsonPackageId, options) {
    if (options === void 0) { options = {
        overridePath: null,
        disableDeprecationWarnings: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var template, context, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, produceCompiledTemplate(singleTemplatePkg)];
                case 1:
                    template = _a.sent();
                    context = {
                        global: {
                            disableDeprecationWarnings: options.disableDeprecationWarnings,
                            deprecationWarnings: {},
                            db: db,
                            sessionId: sessionId,
                            templatePath: singleTemplatePkg.path,
                            promises: [],
                            genTemplatePackageId: genTemplateJsonPackageId,
                            overridable: loadOverridable(options.overridePath),
                            stats: {},
                        },
                    };
                    return [4 /*yield*/, template(context)];
                case 2:
                    content = _a.sent();
                    return [2 /*return*/, {
                            content: content,
                            stats: context.global.stats,
                        }];
            }
        });
    });
}
/**
 * This function attemps to call override function, but if override function
 * throws an exception, it calls the original function.
 *
 * @param {*} originalFn
 * @param {*} overrideFn
 * @returns result from override function, unless it throws an exception, in which case return result from original function.
 */
function wrapOverridable(originalFn, overrideFn) {
    return function () {
        try {
            return overrideFn.apply(this, arguments);
        }
        catch (_a) {
            return originalFn.apply(this, arguments);
        }
    };
}
/**
 * This function is responsible to load the overridable function container.
 *
 * @param {*} genTemplatePackageId
 */
function loadOverridable(overridePath) {
    var originals = require('./overridable.js');
    var shallowCopy = Object.assign({}, originals);
    if (overridePath == null) {
        return shallowCopy;
    }
    else {
        var overrides_1 = nativeRequire(overridePath);
        Object.keys(overrides_1).forEach(function (name) {
            if (name in shallowCopy) {
                shallowCopy[name] = wrapOverridable(shallowCopy[name], overrides_1[name]);
            }
            else {
                shallowCopy[name] = overrides_1[name];
            }
        });
        return shallowCopy;
    }
}
/**
 * Function that loads the partials.
 *
 * @param {*} path
 */
function loadPartial(name, path) {
    return fsPromise
        .readFile(path, 'utf8')
        .then(function (data) { return handlebars.registerPartial(name, data); });
}
function helperWrapper(wrappedHelper) {
    return function w() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var helperName = wrappedHelper.name;
        if (wrappedHelper.originalHelper != null) {
            helperName = wrappedHelper.originalHelper;
        }
        var isDeprecated = false;
        if (wrappedHelper.isDeprecated) {
            isDeprecated = true;
        }
        if (helperName in this.global.stats) {
            this.global.stats[helperName].useCount++;
        }
        else {
            this.global.stats[helperName] = {
                useCount: 1,
                isDeprecated: isDeprecated,
            };
        }
        try {
            return wrappedHelper.call.apply(wrappedHelper, __spreadArray([this], __read(args), false));
        }
        catch (err) {
            var thrownObject = void 0;
            var opts = args[args.length - 1];
            if ('loc' in opts) {
                var locMsg = " [line: ".concat(opts.loc.start.line, ", column: ").concat(opts.loc.start.column, ", file: ").concat(this.global.templatePath, " ]");
                if (_.isString(err)) {
                    thrownObject = new Error(err + locMsg);
                }
                else {
                    thrownObject = err;
                    thrownObject.message = err.message + locMsg;
                }
            }
            throw thrownObject;
        }
    };
}
/**
 * Function that loads the helpers.
 *
 * @param {*} helpers - a string path if value is passed through CLI,
 *                      the nativeRequire() is leverage the native js function instead
 *                      of webpack's special sauce.
 *                      a required() module if invoked by backend js code.
 *                      this is required to force webpack to resolve the included files
 *                      as path will be difference after being packed for production.
 */
function loadHelper(helpers, collectionList) {
    var e_1, _a;
    if (collectionList === void 0) { collectionList = null; }
    // helper
    // when template path are passed via CLI
    // Other paths are 'required()' to workaround webpack path issue.
    if (_.isString(helpers)) {
        helpers = nativeRequire(helpers);
    }
    try {
        for (var _b = __values(Object.keys(helpers)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var singleHelper = _c.value;
            handlebars.registerHelper(singleHelper, helperWrapper(helpers[singleHelper]));
            if (collectionList != null) {
                collectionList.push(singleHelper);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
/**
 * Returns an object that contains all the helper functions, keyed
 * by their name
 *
 * @returns Object containing all the helper functions.
 */
function allGlobalHelpers() {
    var allHelpers = {
        api: {},
        duplicates: [], // array of duplicates
    };
    includedHelpers.forEach(function (helperPkg) {
        var e_2, _a;
        try {
            for (var _b = __values(Object.keys(helperPkg)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var singleHelper = _c.value;
                if (allHelpers.api[singleHelper] != null) {
                    allHelpers.duplicates.push(singleHelper);
                }
                allHelpers.api[singleHelper] = helperPkg[singleHelper];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
    return allHelpers;
}
/**
 * Global helper initialization
 */
function initializeGlobalHelpers() {
    if (helpersInitializationList != null)
        return;
    helpersInitializationList = [];
    includedHelpers.forEach(function (element) {
        loadHelper(element, helpersInitializationList);
    });
}
function globalHelpersList() {
    return helpersInitializationList;
}
exports.produceContent = produceContent;
exports.loadHelper = loadHelper;
exports.loadPartial = loadPartial;
exports.initializeGlobalHelpers = initializeGlobalHelpers;
exports.allGlobalHelpers = allGlobalHelpers;
exports.globalHelpersList = globalHelpersList;
//# sourceMappingURL=template-engine.js.map