"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegecyEnv = exports.LegecyStartUp = exports.DB = exports.endPoint = exports.initiated = void 0;
exports.initiated = true;
exports.endPoint = __importStar(require("./endpoints"));
exports.DB = __importStar(require("./database"));
var legecyZap_1 = require("./legecyZap");
Object.defineProperty(exports, "LegecyStartUp", { enumerable: true, get: function () { return legecyZap_1.startUp; } });
var legecyZap_2 = require("./legecyZap");
Object.defineProperty(exports, "LegecyEnv", { enumerable: true, get: function () { return legecyZap_2.env; } });
//# sourceMappingURL=index.js.map