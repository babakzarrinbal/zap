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
var uri = {
    zclEntity: '/zcl/:entity/:id',
    saveSessionKeyValue: '/save',
    getAllSessionKeyValues: '/allKeyValues',
    unifyClustersAcrossEndpoints: '/unifyClustersAcrossEndpoints',
    unifyAttributesAcrossEndpoints: '/unifyAttributesAcrossEndpoints',
    generate: '/generate',
    endpoint: '/endpoint',
    endpointType: '/endpointType',
    initialState: '/initialState',
    option: '/option',
    commandUpdate: '/command/update',
    eventUpdate: '/event/update',
    cluster: '/cluster',
    attributeUpdate: '/attribute/update',
    preview: '/preview/',
    previewName: '/preview/:name',
    previewNameIndex: '/preview/:name/:index',
    sql: '/sql',
    version: '/version',
    packages: "/packages",
    addNewPackage: "/packages/add",
    sessionPackage: "/sessionPackage",
    zclExtension: "/zclExtension/:entity/:extensionId",
    zclCluster: '/zcl/cluster/',
    zclDeviceType: '/zcl/deviceType/',
    zclDomain: '/zcl/domain/',
    zclBitmap: '/zcl/bitmap/',
    zclEnum: '/zcl/enum/',
    zclStruct: '/zcl/struct/',
    zclAtomics: '/zcl/atomics/',
    endpointTypeClusters: '/zcl/endpointTypeClusters/',
    endpointTypeAttributes: '/zcl/endpointTypeAttributes/',
    endpointTypeCommands: '/zcl/endpointTypeCommands/',
    deviceTypeClusters: '/zcl/deviceTypeClusters/',
    deviceTypeAttributes: '/zcl/deviceTypeAttributes/',
    deviceTypeCommands: '/zcl/deviceTypeCommands/',
};
var uiMode = {
    ZIGBEE: "zigbee",
};
var uc = {
    // command id
    componentTree: '/uc/component/tree',
    componentAdd: '/uc/component/add',
    componentRemove: '/uc/component/remove',
};
var ide = {
    // request
    open: '/file/open',
    close: '/file/close',
    save: '/file/save',
    saveAs: '/file/saveAs',
    rename: '/file/rename',
    move: '/file/move',
    isDirty: '/file/isDirty',
    // response
    openResponse: 'openResponse',
};
var updateKey = {
    deviceTypeRef: 'deviceTypeRef',
    endpointId: 'endpointId',
    endpointType: 'endpointType',
    endpointVersion: 'endpointVersion',
    networkId: 'networkId',
    profileId: 'profileId',
    deviceId: 'deviceId',
    name: 'name',
    attributeSelected: 'selectedAttributes',
    attributeSingleton: 'selectedSingleton',
    attributeBounded: 'selectedBounded',
    attributeDefault: 'defaultValue',
    attributeReporting: 'selectedReporting',
    attributeReportMin: 'reportingMin',
    attributeReportMax: 'reportingMax',
    attributeReportChange: 'reportableChange',
    attributeStorage: 'storageOption',
    init: 'init',
};
exports.param = {
    sessionId: 'sessionId',
    path: 'path',
};
exports.uri = uri;
exports.uiMode = uiMode;
exports.uc = uc;
exports.ide = ide;
exports.updateKey = updateKey;
exports.noFilter = 'No Filter';
//# sourceMappingURL=rest-api.js.map