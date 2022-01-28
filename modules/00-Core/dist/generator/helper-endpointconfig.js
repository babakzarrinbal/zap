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
var cHelper = require('./helper-c.js');
var templateUtil = require('./template-util');
var queryEndpoint = require('../db/query-endpoint.js');
var queryEndpointType = require('../db/query-endpoint-type.js');
var bin = require('../util/bin');
var types = require('../util/types.js');
var zclUtil = require('../util/zcl-util.js');
var dbEnum = require('../src-shared/db-enum.js');
/**
 * Returns number of endpoint types.
 *
 * @param {*} options
 * @returns number of endpoint types
 */
function endpoint_type_count(options) {
    return this.endpointTypes.length;
}
/**
 * Returns number of endpoints.
 *
 * @param {*} options
 * @returns number of endpoints
 */
function endpoint_count(options) {
    return this.endpoints.length;
}
/**
 * Prints out all the macros that the endpoint config
 * configuration depends on. These macros are created
 * by ZAP, because the use of these macros is also
 * created by ZAP.
 *
 * @returns Macros that need to be created
 */
function endpoint_config_macros(options) {
    var longDef = options.hash.longDefaults;
    var minMaxDef = options.hash.minMaxDefaults;
    if (longDef == null)
        longDef = 'def_long_defaults';
    if (minMaxDef == null)
        minMaxDef = 'def_minmax_defaults';
    return "\n#define ZAP_TYPE(type) ZCL_ ## type ## _ATTRIBUTE_TYPE\n#define ZAP_LONG_DEFAULTS_INDEX(index) {(uint8_t*)(&".concat(longDef, "[index])}\n#define ZAP_MIN_MAX_DEFAULTS_INDEX(index) {(uint8_t*)(&").concat(minMaxDef, "[index])}\n#define ZAP_EMPTY_DEFAULT() {(uint8_t*) 0}\n#define ZAP_SIMPLE_DEFAULT(x) {(uint8_t *) x}\n");
}
/**
 * Creates array of endpointId fields on endpoints
 *
 * @param {*} options
 * @returns C array including the { } brackets
 */
function endpoint_fixed_endpoint_array(options) {
    var epIds = [];
    this.endpoints.forEach(function (ep) {
        epIds.push('0x' + bin.int16ToHex(ep.endpointId));
    });
    return '{ ' + epIds.join(', ') + ' }';
}
/**
 * Creates array of profileId fields on endpoints
 *
 * @param {*} options
 * @returns C array including the { } brackets
 */
function endpoint_fixed_profile_id_array(options) {
    var profileIds = [];
    this.endpoints.forEach(function (ep) {
        profileIds.push('0x' + bin.int16ToHex(parseInt(ep.profileId)));
    });
    return '{ ' + profileIds.join(', ') + ' }';
}
/**
 * Creates array of networkId fields on endpoints
 *
 * @param {*} options
 * @returns C array including the { } brackets
 */
function endpoint_fixed_network_array(options) {
    return '{ ' + this.endpoints.map(function (ep) { return ep.networkId; }).join(', ') + ' }';
}
/**
 * Each element of an array contains an index into the
 * endpoint type array, for the appropriate endpoint.
 *
 * @param {*} options
 * @returns C array of indexes, one for each endpoint.
 */
function endpoint_fixed_endpoint_type_array(options) {
    var e_1, _a;
    var indexes = [];
    try {
        for (var _b = __values(this.endpoints), _c = _b.next(); !_c.done; _c = _b.next()) {
            var ep = _c.value;
            var epType = ep.endpointTypeRef;
            var index = -1;
            for (var j = 0; j < this.endpointTypes.length; j++) {
                if (epType == this.endpointTypes[j].id) {
                    index = j;
                }
            }
            indexes.push(index);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return '{ ' + indexes.join(', ') + ' }';
}
function createMfgCodes(codeIndexPairs) {
    var ret = '{ \\\n';
    if (codeIndexPairs.length == 0) {
        ret = ret.concat('  { 0x00, 0x00 } \\\n');
    }
    else {
        codeIndexPairs.forEach(function (c) {
            ret = ret.concat("  { ".concat(c.index, ", ").concat(c.mfgCode, " },\\\n"));
        });
    }
    return ret.concat('}\n');
}
/**
 * Generates array of { index , mfgCode } pairs, matching
 * the indexes in attribute table.
 *
 * @param {*} options
 * @returns manufacturer code array
 */
function endpoint_attribute_manufacturer_codes(options) {
    return createMfgCodes(this.attributeMfgCodes);
}
function endpoint_attribute_manufacturer_code_count(options) {
    return this.attributeMfgCodes.length;
}
function endpoint_command_manufacturer_codes(options) {
    return createMfgCodes(this.commandMfgCodes);
}
function endpoint_command_manufacturer_code_count(options) {
    return this.commandMfgCodes.length;
}
function endpoint_cluster_manufacturer_codes(options) {
    return createMfgCodes(this.clusterMfgCodes);
}
function endpoint_cluster_manufacturer_code_count(options) {
    return this.clusterMfgCodes.length;
}
function endpoint_largest_attribute_size(options) {
    return this.largestAttribute + 1;
}
function endpoint_singletons_size(options) {
    return this.singletonsSize;
}
function endpoint_total_storage_size(options) {
    return this.totalAttributeSize;
}
function endpoint_command_count(options) {
    return this.commandList.length;
}
function endpoint_types_list(options) {
    var ret = '{ \\\n';
    this.endpointList.forEach(function (ep) {
        ret = ret.concat("  { ZAP_CLUSTER_INDEX(".concat(ep.clusterIndex, "), ").concat(ep.clusterCount, ", ").concat(ep.attributeSize, " }, \\\n"));
    });
    return ret.concat('}\n');
}
function endpoint_cluster_count(options) {
    return this.clusterList.length;
}
function endpoint_cluster_list(options) {
    var ret = '{ \\\n';
    this.clusterList.forEach(function (c) {
        var mask = '';
        if (c.mask.length == 0) {
            mask = '0';
        }
        else {
            mask = c.mask
                .map(function (m) { return "ZAP_CLUSTER_MASK(".concat(m.toUpperCase(), ")"); })
                .join(' | ');
        }
        ret = ret.concat("  { ".concat(c.clusterId, ", ZAP_ATTRIBUTE_INDEX(").concat(c.attributeIndex, "), ").concat(c.attributeCount, ", ").concat(c.attributeSize, ", ").concat(mask, ", ").concat(c.functions, " }, /* ").concat(c.comment, " */ \\\n"));
    });
    return ret.concat('}\n');
}
function endpoint_command_list(options) {
    var comment = null;
    var ret = '{ \\\n';
    this.commandList.forEach(function (cmd) {
        if (cmd.comment != comment) {
            ret += "\\\n  /* ".concat(cmd.comment, " */ \\\n");
            comment = cmd.comment;
        }
        var mask = '';
        if (cmd.mask.length == 0) {
            mask = '0';
        }
        else {
            mask = cmd.mask
                .map(function (m) { return "ZAP_COMMAND_MASK(".concat(m.toUpperCase(), ")"); })
                .join(' | ');
        }
        ret += "  { ".concat(cmd.clusterId, ", ").concat(cmd.commandId, ", ").concat(mask, " }, /* ").concat(cmd.name, " */ \\\n");
    });
    ret += '}\n';
    return ret;
}
function endpoint_attribute_count(options) {
    return this.attributeList.length;
}
function endpoint_attribute_list(options) {
    var comment = null;
    var littleEndian = true;
    var pointerSize = 4;
    if (options.hash.endian == 'big') {
        littleEndian = false;
        if (typeof options.hash.pointer != 'undefined') {
            pointerSize = options.hash.pointer;
        }
    }
    var ret = '{ \\\n';
    this.attributeList.forEach(function (at) {
        if (at.comment != comment) {
            ret += "\\\n  /* ".concat(at.comment, " */ \\\n");
            comment = at.comment;
        }
        var mask = '';
        if (at.mask.length == 0) {
            mask = '0';
        }
        else {
            mask = at.mask
                .map(function (m) { return "ZAP_ATTRIBUTE_MASK(".concat(m.toUpperCase(), ")"); })
                .join(' | ');
        }
        // If no default value is found, default to 0
        var finalDefaultValue;
        if (!at.defaultValue) {
            finalDefaultValue = "ZAP_EMPTY_DEFAULT()";
        }
        else if (at.isMacro) {
            finalDefaultValue = at.defaultValue;
        }
        else {
            var defaultValue = at.defaultValue;
            if (!littleEndian) {
                defaultValue = Number(defaultValue)
                    .toString(16)
                    .padStart(6, '0x0000')
                    .padEnd(2 + 2 * pointerSize, '0');
            }
            finalDefaultValue = "ZAP_SIMPLE_DEFAULT(".concat(defaultValue, ")");
        }
        ret += "  { ".concat(at.id, ", ").concat(at.type, ", ").concat(at.size, ", ").concat(mask, ", ").concat(finalDefaultValue, " }, /* ").concat(at.name, " */  \\\n");
    });
    ret += '}\n';
    return ret;
}
function endpoint_fixed_device_id_array(options) {
    return ('{ ' + this.deviceList.map(function (device) { return device.deviceId; }).join(', ') + ' }');
}
function endpoint_fixed_device_version_array(options) {
    return ('{ ' +
        this.deviceList.map(function (device) { return device.deviceVersion; }).join(', ') +
        ' }');
}
function endpoint_attribute_min_max_count(options) {
    return this.minMaxList.length;
}
function endpoint_attribute_min_max_list(options) {
    var _this = this;
    var comment = null;
    var ret = '{ \\\n';
    this.minMaxList.forEach(function (mm, index) {
        if (mm.typeSize > 2) {
            throw new Error("Can't have min/max for attributes larger than 2 bytes like '".concat(mm.name, "'"));
        }
        if (mm.comment != comment) {
            ret += "\\\n  /* ".concat(mm.comment, " */ \\\n");
            comment = mm.comment;
        }
        var def = parseInt(mm.default);
        var min = parseInt(mm.min);
        var max = parseInt(mm.max);
        if (isNaN(def))
            def = 0;
        if (isNaN(min))
            min = 0;
        if (isNaN(max))
            max = 0xffff;
        var defS = (def >= 0 ? '' : '-') + '0x' + Math.abs(def).toString(16).toUpperCase();
        var minS = (min >= 0 ? '' : '-') + '0x' + Math.abs(min).toString(16).toUpperCase();
        var maxS = (max >= 0 ? '' : '-') + '0x' + Math.abs(max).toString(16).toUpperCase();
        ret += "  { (uint16_t)".concat(defS, ", (uint16_t)").concat(minS, ", (uint16_t)").concat(maxS, " }").concat(index == _this.minMaxList.length - 1 ? '' : ',', " /* ").concat(mm.name, " */ \\\n");
    });
    ret += '}\n';
    return ret;
}
function endpoint_reporting_config_defaults(options) {
    var comment = null;
    var ret = '{ \\\n';
    this.reportList.forEach(function (r) {
        if (r.comment != comment) {
            ret += "\\\n  /* ".concat(r.comment, " */ \\\n");
            comment = r.comment;
        }
        var mask = '';
        if (r.mask.length == 0) {
            mask = '0';
        }
        else {
            mask = r.mask
                .map(function (m) { return "ZAP_CLUSTER_MASK(".concat(m.toUpperCase(), ")"); })
                .join(' | ');
        }
        ret += "  { ZAP_REPORT_DIRECTION(".concat(r.direction, "), ").concat(r.endpoint, ", ").concat(r.clusterId, ", ").concat(r.attributeId, ", ").concat(mask, ", ").concat(r.mfgCode, ", {{ ").concat(r.minOrSource, ", ").concat(r.maxOrEndpoint, ", ").concat(r.reportableChangeOrTimeout, " }} }, /* ").concat(r.name, " */ \\\n");
    });
    ret += '}\n';
    return ret;
}
function endpoint_reporting_config_default_count(options) {
    return this.reportList.length;
}
function endpoint_attribute_long_defaults_count(options) {
    return this.longDefaultsList.length;
}
function endpoint_attribute_long_defaults(options) {
    var comment = null;
    var littleEndian = true;
    if (options.hash.endian == 'big') {
        littleEndian = false;
    }
    var ret = '{ \\\n';
    this.longDefaultsList.forEach(function (ld) {
        var value = ld.value;
        if (littleEndian && !types.isString(ld.type)) {
            // ld.value is in big-endian order.  For types for which endianness
            // matters, we need to reverse it.
            var valArr = value.split(/\s*,\s*/).filter(function (s) { return s.length != 0; });
            valArr.reverse();
            value = valArr.join(", ") + ", ";
        }
        if (ld.comment != comment) {
            ret += "\\\n  /* ".concat(ld.comment, ", ").concat(littleEndian ? 'little-endian' : 'big-endian', " */\\\n\\\n");
            comment = ld.comment;
        }
        ret += "  /* ".concat(ld.index, " - ").concat(ld.name, ", */\\\n  ").concat(value, "\\\n\\\n");
    });
    ret += '}\n';
    return ret;
}
function asMEI(manufacturerCode, code) {
    return "0x" + bin.int32ToHex((manufacturerCode << 16) + code);
}
/**
 * Attribute collection works like this:
 *    1.) Go over all the clusters that exist.
 *    2.) If client is included on at least one endpoint add client atts.
 *    3.) If server is included on at least one endpoint add server atts.
 */
function collectAttributes(endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var commandMfgCodes, clusterMfgCodes, attributeMfgCodes, attributeList, commandList, endpointList, clusterList, longDefaults, longDefaultsIndex, minMaxIndex, largestAttribute, singletonsSize, totalAttributeSize, clusterAttributeSize, endpointAttributeSize, clusterIndex, deviceList, minMaxList, reportList, longDefaultsList, attributeIndex;
        return __generator(this, function (_a) {
            commandMfgCodes = [] // Array of { index, mfgCode } objects
            ;
            clusterMfgCodes = [] // Array of { index, mfgCode } objects
            ;
            attributeMfgCodes = [] // Array of { index, mfgCode } objects
            ;
            attributeList = [];
            commandList = [];
            endpointList = [] // Array of { clusterIndex, clusterCount, attributeSize }
            ;
            clusterList = [] // Array of { clusterId, attributeIndex, attributeCount, attributeSize, mask, functions, comment }
            ;
            longDefaults = [] // Array of strings representing bytes
            ;
            longDefaultsIndex = 0;
            minMaxIndex = 0;
            largestAttribute = 0;
            singletonsSize = 0;
            totalAttributeSize = 0;
            clusterAttributeSize = 0;
            endpointAttributeSize = 0;
            clusterIndex = 0;
            deviceList = [] // Array of { deviceId, deviceVersion }
            ;
            minMaxList = [] // Array of { default, min, max }
            ;
            reportList = [] // Array of { direction, endpoint, clusterId, attributeId, mask, mfgCode, minOrSource, maxOrEndpoint, reportableChangeOrTimeout }
            ;
            longDefaultsList = [] // Array of { value, size. comment }
            ;
            attributeIndex = 0;
            endpointTypes.forEach(function (ept) {
                var endpoint = {
                    clusterIndex: clusterIndex,
                    clusterCount: ept.clusters.length,
                    attributeSize: 0,
                };
                var device = {
                    deviceId: ept.deviceIdentifier,
                    deviceVersion: ept.endpointVersion,
                };
                endpointAttributeSize = 0;
                deviceList.push(device);
                // Go over all the clusters in the endpoint and add them to the list.
                ept.clusters.sort(zclUtil.clusterComparator);
                ept.clusters.forEach(function (c) {
                    var cluster = {
                        clusterId: asMEI(c.manufacturerCode, c.code),
                        clusterName: c.name,
                        clusterSide: c.side,
                        attributeIndex: attributeIndex,
                        attributeCount: c.attributes.length,
                        attributeSize: 0,
                        mask: [],
                        functions: 'NULL',
                        comment: "Endpoint: ".concat(ept.endpointId, ", Cluster: ").concat(c.name, " (").concat(c.side, ")"),
                    };
                    clusterAttributeSize = 0;
                    cluster.mask.push(c.side);
                    clusterIndex++;
                    attributeIndex += c.attributes.length;
                    c.attributes.sort(zclUtil.attributeComparator);
                    // Go over all the attributes in the endpoint and add them to the list.
                    c.attributes.forEach(function (a) {
                        // typeSize is the size of the attribute in the read/write attribute
                        // store.
                        var typeSize = a.typeSize;
                        // defaultSize is the size of the attribute in the readonly defaults
                        // store.
                        var defaultSize = typeSize;
                        var attributeDefaultValue = a.defaultValue;
                        // Various types store the length of the actual content in bytes.
                        // For those, we can size the default storage to be just big enough for
                        // the actual default value.
                        if (types.isOneBytePrefixedString(a.type)) {
                            typeSize += 1;
                            defaultSize = attributeDefaultValue.length + 1;
                        }
                        else if (types.isTwoBytePrefixedString(a.type)) {
                            typeSize += 2;
                            defaultSize = attributeDefaultValue.length + 2;
                        }
                        // External attributes should be treated as having a typeSize of 0 for
                        // most purposes (e.g. allocating space for them), but should still
                        // affect the "largest attribute size" value, because buffers used to
                        // read attributes, including external ones, may be sized based on that.
                        var contributionToLargestAttribute = typeSize;
                        if (a.storage == dbEnum.storageOption.external) {
                            typeSize = 0;
                            defaultSize = 0;
                        }
                        var defaultValueIsMacro = false;
                        // Zero-length strings can just use ZAP_EMPTY_DEFAULT() as the default
                        // and don't need long defaults.  Apart from that, there is one string
                        // case that _could_ fit into our 2-byte default value: a 1-char-long
                        // short string.  But figuring out how to produce a uint8_t* for it as a
                        // literal value is a pain, so just force all strings with nonzero
                        // length to use long defaults.
                        if (defaultSize > 2 || (types.isString(a.type) && a.defaultValue.length > 0)) {
                            // We will need to generate the GENERATED_DEFAULTS
                            longDefaults.push(a);
                            var def = types.longTypeDefaultValue(defaultSize, a.type, a.defaultValue);
                            var longDef = {
                                value: def,
                                size: defaultSize,
                                index: longDefaultsIndex,
                                name: a.name,
                                comment: cluster.comment,
                                type: a.type,
                            };
                            attributeDefaultValue = "ZAP_LONG_DEFAULTS_INDEX(".concat(longDefaultsIndex, ")");
                            defaultValueIsMacro = true;
                            longDefaultsList.push(longDef);
                            longDefaultsIndex += defaultSize;
                        }
                        var mask = [];
                        if ((a.min != null || a.max != null) && a.isWritable) {
                            mask.push("min_max");
                            var minMax = {
                                default: a.defaultValue,
                                min: a.min,
                                max: a.max,
                                name: a.name,
                                comment: cluster.comment,
                                typeSize: typeSize,
                            };
                            attributeDefaultValue = "ZAP_MIN_MAX_DEFAULTS_INDEX(".concat(minMaxIndex, ")");
                            defaultValueIsMacro = true;
                            minMaxList.push(minMax);
                            minMaxIndex++;
                        }
                        var rptMask = [c.side];
                        if (a.includedReportable) {
                            var rpt = {
                                direction: 'REPORTED',
                                endpoint: '0x' + bin.int16ToHex(ept.endpointId),
                                clusterId: asMEI(c.manufacturerCode, c.code),
                                attributeId: asMEI(a.manufacturerCode, a.code),
                                mask: rptMask,
                                mfgCode: a.manufacturerCode == null
                                    ? '0x0000'
                                    : '0x' + bin.int16ToHex(a.manufacturerCode),
                                minOrSource: a.minInterval,
                                maxOrEndpoint: a.maxInterval,
                                reportableChangeOrTimeout: a.reportableChange,
                                name: a.name,
                                comment: cluster.comment,
                            };
                            reportList.push(rpt);
                        }
                        if (contributionToLargestAttribute > largestAttribute) {
                            largestAttribute = contributionToLargestAttribute;
                        }
                        if (a.isSingleton) {
                            singletonsSize += typeSize;
                        }
                        clusterAttributeSize += typeSize;
                        totalAttributeSize += typeSize;
                        if (a.side == dbEnum.side.client) {
                            mask.push('client');
                        }
                        if (a.storage == dbEnum.storageOption.nvm) {
                            mask.push('TOKENIZE');
                        }
                        if (a.storage == dbEnum.storageOption.external) {
                            mask.push('EXTERNAL_STORAGE');
                        }
                        if (a.isSingleton)
                            mask.push('singleton');
                        if (a.isWritable)
                            mask.push('writable');
                        if (a.isNullable)
                            mask.push('nullable');
                        if (a.mustUseTimedWrite)
                            mask.push('must_use_timed_write');
                        var zap_type = "UNKNOWN ATTRIBUTE TYPE";
                        if (a.typeInfo.atomicType) {
                            zap_type = a.typeInfo.atomicType;
                        }
                        else if (a.typeInfo.type == dbEnum.zclType.struct) {
                            zap_type = "STRUCT";
                        }
                        var attr = {
                            id: asMEI(a.manufacturerCode, a.code),
                            type: "ZAP_TYPE(".concat(cHelper.asDelimitedMacro(zap_type), ")"),
                            size: typeSize,
                            mask: mask,
                            defaultValue: attributeDefaultValue,
                            isMacro: defaultValueIsMacro,
                            name: a.name,
                            comment: cluster.comment,
                        };
                        attributeList.push(attr);
                        if (a.manufacturerCode) {
                            var att = {
                                index: attributeList.indexOf(attr),
                                mfgCode: a.manufacturerCode,
                            };
                            attributeMfgCodes.push(att);
                        }
                    });
                    // Go over the commands
                    c.commands.sort(zclUtil.commandComparator);
                    c.commands.forEach(function (cmd) {
                        var mask = [];
                        if (cmd.isOptional) {
                            if (cmd.isIncoming) {
                                if (c.side == dbEnum.side.server)
                                    mask.push('incoming_server');
                                else
                                    mask.push('incoming_client');
                            }
                            if (cmd.isOutgoing) {
                                if (c.side == dbEnum.side.server)
                                    mask.push('outgoing_server');
                                else
                                    mask.push('outgoing_client');
                            }
                        }
                        else {
                            if (cmd.source == dbEnum.source.client) {
                                mask.push('incoming_server');
                            }
                            else {
                                mask.push('incoming_client');
                            }
                        }
                        var command = {
                            clusterId: asMEI(c.manufacturerCode, c.code),
                            commandId: asMEI(cmd.manufacturerCode, cmd.code),
                            mask: mask,
                            name: cmd.name,
                            comment: cluster.comment,
                        };
                        commandList.push(command);
                        if (cmd.manufacturerCode) {
                            var mfgCmd = {
                                index: commandList.length - 1,
                                mfgCode: cmd.manufacturerCode,
                            };
                            commandMfgCodes.push(mfgCmd);
                        }
                    });
                    endpointAttributeSize += clusterAttributeSize;
                    cluster.attributeSize = clusterAttributeSize;
                    clusterList.push(cluster);
                    if (c.manufacturerCode) {
                        var clt = {
                            index: clusterList.length - 1,
                            mfgCode: c.manufacturerCode,
                        };
                        clusterMfgCodes.push(clt);
                    }
                });
                endpoint.attributeSize = endpointAttributeSize;
                endpointList.push(endpoint);
            });
            return [2 /*return*/, {
                    endpointList: endpointList,
                    clusterList: clusterList,
                    attributeList: attributeList,
                    commandList: commandList,
                    longDefaults: longDefaults,
                    clusterMfgCodes: clusterMfgCodes,
                    commandMfgCodes: commandMfgCodes,
                    attributeMfgCodes: attributeMfgCodes,
                    largestAttribute: largestAttribute,
                    singletonsSize: singletonsSize,
                    totalAttributeSize: totalAttributeSize,
                    deviceList: deviceList,
                    minMaxList: minMaxList,
                    reportList: reportList,
                    longDefaultsList: longDefaultsList,
                }];
        });
    });
}
/**
 * This function goes over all the attributes and populates sizes.
 *
 * @param {*} endpointTypes
 * @returns promise that resolves with the passed endpointTypes, after populating the attribute type sizes.
 *
 */
function collectAttributeSizes(db, zclPackageId, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var ps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ps = [];
                    endpointTypes.forEach(function (ept) {
                        ept.clusters.forEach(function (cl) {
                            cl.attributes.forEach(function (at) {
                                ps.push(types
                                    .typeSizeAttribute(db, zclPackageId, at, "ERROR: ".concat(at.name, ", invalid size, ").concat(at.type))
                                    .then(function (size) {
                                    at.typeSize = size;
                                }));
                            });
                        });
                    });
                    return [4 /*yield*/, Promise.all(ps)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, endpointTypes];
            }
        });
    });
}
/**
 * This function goes over all attributes and populates atomic types.
 * @param {*} endpointTypes
 * @returns promise that resolves with the passed endpointTypes, after populating the attribute atomic types.
 *
 */
function collectAttributeTypeInfo(db, zclPackageId, endpointTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var ps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ps = [];
                    endpointTypes.forEach(function (ept) {
                        ept.clusters.forEach(function (cl) {
                            cl.attributes.forEach(function (at) {
                                ps.push(zclUtil
                                    .determineType(db, at.type, zclPackageId)
                                    .then(function (typeInfo) {
                                    at.typeInfo = typeInfo;
                                }));
                            });
                        });
                    });
                    return [4 /*yield*/, Promise.all(ps)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, endpointTypes];
            }
        });
    });
}
/**
 * Starts the endpoint configuration block.,
 * longDefaults: longDefaults
 *
 * @param {*} options
 * @returns a promise of a rendered block
 */
function endpoint_config(options) {
    var _this = this;
    var newContext = {
        global: this.global,
        parent: this,
    };
    var db = this.global.db;
    var sessionId = this.global.sessionId;
    var promise = templateUtil
        .ensureZclPackageId(newContext)
        .then(function () { return queryEndpoint.selectAllEndpoints(db, sessionId); })
        .then(function (endpoints) {
        newContext.endpoints = endpoints;
        var endpointTypeIds = [];
        endpoints.forEach(function (ep) {
            endpointTypeIds.push({
                deviceIdentifier: ep.deviceIdentifier,
                endpointVersion: ep.endpointVersion,
                endpointTypeId: ep.endpointTypeRef,
                endpointIdentifier: ep.endpointId,
            });
        });
        return endpointTypeIds;
    })
        .then(function (endpointTypeIds) {
        var endpointTypePromises = [];
        endpointTypeIds.forEach(function (eptId) {
            endpointTypePromises.push(queryEndpointType
                .selectEndpointType(db, eptId.endpointTypeId)
                .then(function (ept) {
                ept.endpointId = eptId.endpointIdentifier;
                ept.endpointVersion = eptId.endpointVersion;
                ept.deviceIdentifier = eptId.deviceIdentifier;
                return ept;
            }));
        });
        return Promise.all(endpointTypePromises);
    })
        .then(function (endpointTypes) {
        var promises = [];
        newContext.endpointTypes = endpointTypes;
        endpointTypes.forEach(function (ept) {
            promises.push(queryEndpoint.selectEndpointClusters(db, ept.id).then(function (clusters) {
                ept.clusters = clusters; // Put 'clusters' into endpoint
                var ps = [];
                clusters.forEach(function (cl) {
                    ps.push(queryEndpoint
                        .selectEndpointClusterAttributes(db, cl.clusterId, cl.side, ept.id)
                        .then(function (attributes) {
                        // Keep only the enabled attributes
                        cl.attributes = attributes.filter(function (a) { return a.isIncluded === 1; });
                    }));
                    ps.push(queryEndpoint
                        .selectEndpointClusterCommands(db, cl.clusterId, ept.id)
                        .then(function (commands) {
                        cl.commands = commands;
                    }));
                });
                return Promise.all(ps);
            }));
        });
        return Promise.all(promises).then(function () { return endpointTypes; });
    })
        .then(function (endpointTypes) {
        return collectAttributeTypeInfo(db, _this.global.zclPackageId, endpointTypes);
    })
        .then(function (endpointTypes) {
        return collectAttributeSizes(db, _this.global.zclPackageId, endpointTypes);
    })
        .then(function (endpointTypes) { return collectAttributes(endpointTypes); })
        .then(function (collection) {
        Object.assign(newContext, collection);
    })
        .then(function () { return options.fn(newContext); });
    return templateUtil.templatePromise(this.global, promise);
}
// WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
//
// Note: these exports are public API. Templates that might have been created in the past and are
// available in the wild might depend on these names.
// If you rename the functions, you need to still maintain old exports list.
exports.endpoint_attribute_long_defaults_count = endpoint_attribute_long_defaults_count;
exports.endpoint_attribute_long_defaults = endpoint_attribute_long_defaults;
exports.endpoint_config = endpoint_config;
exports.endpoint_attribute_min_max_list = endpoint_attribute_min_max_list;
exports.endpoint_attribute_min_max_count = endpoint_attribute_min_max_count;
exports.endpoint_attribute_list = endpoint_attribute_list;
exports.endpoint_attribute_count = endpoint_attribute_count;
exports.endpoint_cluster_list = endpoint_cluster_list;
exports.endpoint_cluster_count = endpoint_cluster_count;
exports.endpoint_types_list = endpoint_types_list;
exports.endpoint_type_count = endpoint_type_count;
exports.endpoint_cluster_manufacturer_codes = endpoint_cluster_manufacturer_codes;
exports.endpoint_cluster_manufacturer_code_count = endpoint_cluster_manufacturer_code_count;
exports.endpoint_command_manufacturer_codes = endpoint_command_manufacturer_codes;
exports.endpoint_command_manufacturer_code_count = endpoint_command_manufacturer_code_count;
exports.endpoint_attribute_manufacturer_codes = endpoint_attribute_manufacturer_codes;
exports.endpoint_attribute_manufacturer_code_count = endpoint_attribute_manufacturer_code_count;
exports.endpoint_largest_attribute_size = endpoint_largest_attribute_size;
exports.endpoint_total_storage_size = endpoint_total_storage_size;
exports.endpoint_singletons_size = endpoint_singletons_size;
exports.endpoint_fixed_endpoint_array = endpoint_fixed_endpoint_array;
exports.endpoint_fixed_endpoint_type_array = endpoint_fixed_endpoint_type_array;
exports.endpoint_fixed_device_id_array = endpoint_fixed_device_id_array;
exports.endpoint_fixed_device_version_array = endpoint_fixed_device_version_array;
exports.endpoint_fixed_profile_id_array = endpoint_fixed_profile_id_array;
exports.endpoint_fixed_network_array = endpoint_fixed_network_array;
exports.endpoint_command_list = endpoint_command_list;
exports.endpoint_command_count = endpoint_command_count;
exports.endpoint_reporting_config_defaults = endpoint_reporting_config_defaults;
exports.endpoint_reporting_config_default_count = endpoint_reporting_config_default_count;
exports.endpoint_count = endpoint_count;
exports.endpoint_config_macros = endpoint_config_macros;
//# sourceMappingURL=helper-endpointconfig.js.map