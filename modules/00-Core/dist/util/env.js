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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStaticContent = exports.versionsCheck = exports.isMatchingVersion = exports.logDebug = exports.logIpc = exports.logBrowser = exports.logSql = exports.logWarning = exports.logError = exports.logInfo = exports.log = exports.printToStderr = exports.baseUrl = exports.zapVersion = exports.pathFromProjBaseDir = exports.zapVersionAsString = exports.sqliteTestFile = exports.sqliteFile = exports.schemaFile = exports.iconsDirectory = exports.appDirectory = exports.setAppDirectory = exports.logInitLogFile = exports.logInitStdout = exports.setProductionEnv = exports.setDevelopmentEnv = exports.environmentVariable = exports.builtinTemplateMetafile = exports.builtinDotdotZclMetafile = exports.builtinMatterZclMetafile = exports.builtinSilabsZclMetafile = void 0;
var path = require('path');
var os = require('os');
var fs_1 = __importDefault(require("fs"));
var pino = require('pino');
var zapBaseUrl = 'http://localhost:';
var zapUrlLog = 'zap.url';
function builtinSilabsZclMetafile() {
    return pathFromProjBaseDir('./zcl-builtin/silabs/zcl.json');
}
exports.builtinSilabsZclMetafile = builtinSilabsZclMetafile;
function builtinMatterZclMetafile() {
    return pathFromProjBaseDir('./zcl-builtin/matter/zcl.json');
}
exports.builtinMatterZclMetafile = builtinMatterZclMetafile;
function builtinDotdotZclMetafile() {
    return pathFromProjBaseDir('./zcl-builtin/dotdot/library.xml');
}
exports.builtinDotdotZclMetafile = builtinDotdotZclMetafile;
function builtinTemplateMetafile() {
    return null; // No default.
}
exports.builtinTemplateMetafile = builtinTemplateMetafile;
exports.environmentVariable = {
    logLevel: {
        name: 'ZAP_LOGLEVEL',
        description: 'Sets the log level. If unset, then default is: warn.',
    },
    uniqueStateDir: {
        name: 'ZAP_TEMPSTATE',
        description: 'If set to 1, then instead of .zap, a unique temporary state directory will be created.',
    },
    stateDir: {
        name: 'ZAP_DIR',
        description: 'Sets a state directory. Can be overriden by --stateDirectory option. If unset, default is: ~/.zap',
    },
    skipPostGen: {
        name: 'ZAP_SKIP_POST_GENERATION',
        description: 'If there is a defined post-generation action for zap, you can set this to variable to 1 to skip it.',
    },
    reuseZapInstance: {
        name: 'ZAP_REUSE_INSTANCE',
        description: 'If set to 1, default behavior of zap will be to reuse existing instance.',
    },
};
// builtin pino levels: trace=10, debug=20, info=30, warn=40
var pinoOptions = {
    name: 'zap',
    level: process.env[exports.environmentVariable.logLevel.name] || 'info',
    customLevels: {
        fatal: 60,
        error: 50,
        warn: 40,
        info: 30,
        ipc: 27,
        browser: 25,
        sql: 22,
        debug: 20,
        trace: 10,
        all: 1,
    },
};
// Basic environment tie-ins
var pino_logger = pino(pinoOptions);
var explicit_logger_set = false;
var httpStaticContentPath = path.join(__dirname, '../../../spa');
var versionObject = null;
var applicationStateDirectory = null;
function setDevelopmentEnv() {
    // @ts-ignore
    process.env.DEV = true;
    // @ts-ignore
    global.__statics = path.join('src', 'statics').replace(/\\/g, '\\\\');
    httpStaticContentPath = path.join(__dirname, '../../spa');
    // @ts-ignore
    global.__backend = path.join(__dirname, '../').replace(/\\/g, '\\\\');
}
exports.setDevelopmentEnv = setDevelopmentEnv;
function setProductionEnv() {
    // @ts-ignore
    global.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\');
    // @ts-ignore
    global.__backend = path
        .join(__dirname, '../../../src-electron')
        .replace(/\\/g, '\\\\');
    httpStaticContentPath = path
        .join(__dirname, '../../../spa')
        .replace(/\\/g, '\\\\');
}
exports.setProductionEnv = setProductionEnv;
function logInitStdout() {
    if (!explicit_logger_set) {
        pino_logger = pino(pinoOptions, pino.destination(1));
        explicit_logger_set = true;
    }
}
exports.logInitStdout = logInitStdout;
function logInitLogFile() {
    if (!explicit_logger_set) {
        pino_logger = pino(pinoOptions, pino.destination(path.join(appDirectory(), 'zap.log')));
        explicit_logger_set = true;
    }
}
exports.logInitLogFile = logInitLogFile;
/**
 * Set the state directory. This method is intended to be called
 * only at the application startup, when CLI args are being parsed.
 * This method honors '~/' being the first characters in its argument.
 *
 * @param {*} path Absolute path. Typically '~/.zap'.
 */
function setAppDirectory(directoryPath) {
    var appDir;
    if (directoryPath.startsWith('~/')) {
        appDir = path.join(os.homedir(), directoryPath.substring(2));
    }
    else {
        appDir = directoryPath;
    }
    if (!fs_1.default.existsSync(appDir)) {
        fs_1.default.mkdirSync(appDir, { recursive: true });
    }
    applicationStateDirectory = appDir;
}
exports.setAppDirectory = setAppDirectory;
/**
 * Returns an app directory. It creates it, if it doesn't exist
 *
 * @returns state directory, which is guaranteed to be already existing
 */
function appDirectory() {
    if (applicationStateDirectory == null) {
        var appDir = path.join(os.homedir(), '.zap');
        if (!fs_1.default.existsSync(appDir)) {
            fs_1.default.mkdirSync(appDir, { recursive: true });
        }
        applicationStateDirectory = appDir;
        return appDir;
    }
    return applicationStateDirectory;
}
exports.appDirectory = appDirectory;
function iconsDirectory() {
    // @ts-ignore
    return path.join(global.__backend, '/icons');
}
exports.iconsDirectory = iconsDirectory;
function schemaFile() {
    // @ts-ignore
    return path.join(global.__backend, '/db/zap-schema.sql');
}
exports.schemaFile = schemaFile;
function sqliteFile(filename) {
    if (filename === void 0) { filename = 'zap'; }
    return path.join(appDirectory(), "".concat(filename, ".sqlite"));
}
exports.sqliteFile = sqliteFile;
function sqliteTestFile(id, deleteExistingFile) {
    if (deleteExistingFile === void 0) { deleteExistingFile = true; }
    var dir = path.join(__dirname, '../../test/.zap');
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    var fileName = path.join(dir, "test-".concat(id, ".sqlite"));
    if (deleteExistingFile && fs_1.default.existsSync(fileName))
        fs_1.default.unlinkSync(fileName);
    return fileName;
}
exports.sqliteTestFile = sqliteTestFile;
/**
 * Returns a version as a single on-line string.
 *
 */
function zapVersionAsString() {
    var vo = zapVersion();
    return "ver. ".concat(vo.version, ", featureLevel ").concat(vo.featureLevel, ", commit: ").concat(vo.hash, " from ").concat(vo.date);
}
exports.zapVersionAsString = zapVersionAsString;
function pathFromProjBaseDir(filePath) {
    if (process.env.DEV) {
        return path.join(__dirname, '../../', filePath);
    }
    else {
        return path.join(__dirname, '../../../', filePath);
    }
}
exports.pathFromProjBaseDir = pathFromProjBaseDir;
/**
 * Returns the zap version.
 *
 * @returns zap version, which is an object that
 * contains 'version', 'featureLevel', 'hash', 'timestamp' and 'date'
 */
function zapVersion() {
    if (versionObject == null) {
        versionObject = {
            version: '',
            featureLevel: 0,
            hash: 0,
            timestamp: 0,
            date: '',
        };
        try {
            var p = require(pathFromProjBaseDir('./package.json'));
            versionObject.version = p.version;
        }
        catch (err) {
            logError('Could not retrieve version from package.json');
            versionObject.version = '0.0.0';
        }
        try {
            var p = require(pathFromProjBaseDir('./apack.json'));
            versionObject.featureLevel = p.featureLevel;
        }
        catch (err) {
            logError('Could not retrieve featureLevel from apack.json');
            versionObject.featureLevel = 0;
        }
        try {
            var ver = require(pathFromProjBaseDir('./.version.json'));
            versionObject.hash = ver.hash;
            versionObject.timestamp = ver.timestamp;
            versionObject.date = ver.date;
        }
        catch (_a) {
            logError('Could not retrieve version from .version.json');
        }
    }
    return versionObject;
}
exports.zapVersion = zapVersion;
function baseUrl() {
    return zapBaseUrl;
}
exports.baseUrl = baseUrl;
/**
 * Prints the data to stderr, without much fuss.
 * @param msg
 */
function printToStderr(msg) {
    console.error(msg);
}
exports.printToStderr = printToStderr;
/**
 * Base level common logger.
 *
 * @param {*} level
 * @param {*} msg
 * @param {*} err
 */
function log(level, msg, err) {
    if (err === void 0) { err = null; }
    var objectToLog = {
        msg: msg,
        err: {
            alert: '',
        },
    };
    if (err != null) {
        objectToLog.err = err;
        // @ts-ignore
        objectToLog.err.alert = '⛔';
    }
    pino_logger[level](objectToLog);
}
exports.log = log;
/**
 * Info level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logInfo(msg, err) {
    if (err === void 0) { err = null; }
    log('info', msg, err);
}
exports.logInfo = logInfo;
/**
 * Error level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logError(msg, err) {
    if (err === void 0) { err = null; }
    log('error', msg, err);
}
exports.logError = logError;
/**
 * Warning level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logWarning(msg, err) {
    if (err === void 0) { err = null; }
    log('warn', msg, err);
}
exports.logWarning = logWarning;
/**
 * Sql level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logSql(msg, query, args) {
    if (query === void 0) { query = null; }
    if (args === void 0) { args = null; }
    if (query == null) {
        log('sql', msg);
    }
    else {
        // If you want a printout of all the queries for someting,
        // you can uncomment this next line. This is sometimes useful
        // in development environment to build a map of which queries
        // are bottlenecks, so they should be cached.
        //console.log(`SQL: ${query.replace(/\s/g, ' ')}`)
        log('sql', "".concat(msg, " => ").concat(query, ": ").concat(args));
    }
}
exports.logSql = logSql;
/**
 * Browser level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logBrowser(msg, err) {
    if (err === void 0) { err = null; }
    log('browser', msg, err);
}
exports.logBrowser = logBrowser;
/**
 * IPC level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logIpc(msg, err) {
    if (err === void 0) { err = null; }
    log('ipc', msg, err);
}
exports.logIpc = logIpc;
/**
 * Debug level message.
 *
 * @param {*} msg
 * @param {*} err
 */
function logDebug(msg, err) {
    if (err === void 0) { err = null; }
    log('debug', msg, err);
}
exports.logDebug = logDebug;
// Returns true if major or minor component of versions is different.
function isMatchingVersion(versionsArray, providedVersion) {
    var ret = false;
    var v2 = providedVersion.split('.');
    versionsArray.forEach(function (element) {
        var v1 = element.split('.');
        if (v1.length != 3 || v2.length != 3)
            return;
        if (v1[0] != 'x' && v1[0] != v2[0])
            return;
        if (v1[1] != 'x' && v1[1] != v2[1])
            return;
        if (v1[2] != 'x' && v1[2] != v2[2])
            return;
        ret = true;
    });
    return ret;
}
exports.isMatchingVersion = isMatchingVersion;
/**
 * Returns true if versions of node and electron are matching.
 * If versions are not matching, it  prints out a warhing
 * and returns false.
 *
 * @returns true or false, depending on match
 */
function versionsCheck() {
    var expectedNodeVersion = ['v14.x.x', 'v12.x.x'];
    var expectedElectronVersion = ['12.2.x'];
    var nodeVersion = process.version;
    var electronVersion = process.versions.electron;
    var ret = true;
    if (!isMatchingVersion(expectedNodeVersion, nodeVersion)) {
        ret = false;
        console.log("Expected node versions: ".concat(expectedNodeVersion));
        console.log("Provided node version: ".concat(nodeVersion));
        console.log('WARNING: you are using different node version than recommended.');
    }
    if (electronVersion != null &&
        !isMatchingVersion(expectedElectronVersion, electronVersion)) {
        ret = false;
        console.log("Expected electron version: ".concat(expectedElectronVersion));
        console.log("Provided electron version: ".concat(electronVersion));
        console.log('WARNING: you are using different electron version that recommended.');
    }
    return ret;
}
exports.versionsCheck = versionsCheck;
/**
 * Returns path to HTTP static content while taking into account DEV / PROD modes.
 *
 * @returns full path to HTTP static content
 */
function httpStaticContent() {
    return httpStaticContentPath;
}
exports.httpStaticContent = httpStaticContent;
//# sourceMappingURL=env.js.map