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
 *
 *
 * @jest-environment node
 */

const dbApi = require('../src-electron/db/db-api.js')
const { selectCountFrom } = require('../src-electron/db/query-generic.js')

import axios from 'axios'
import fs from 'fs-extra'
import { version } from '../package.json'
import { zclPropertiesFile } from '../src-electron/main-process/args'
import {
  logError,
  logInfo,
  schemaFile,
  setDevelopmentEnv,
  sqliteTestFile,
  setMainDatabase,
} from '../src-electron/util/env'
import {
  initHttpServer,
  shutdownHttpServer,
} from '../src-electron/server/http-server'
import { loadZcl } from '../src-electron/zcl/zcl-loader'
import {
  setHandlebarTemplateDirForCli,
  generateCodeViaCli,
} from '../src-electron/main-process/menu'

var db
const port = 9074
const baseUrl = `http://localhost:${port}`
var packageId
var sessionId
var file = sqliteTestFile(3)

beforeAll(() => {
  setDevelopmentEnv()
  file = sqliteTestFile(3)
  return dbApi
    .initDatabase(file)
    .then((d) => dbApi.loadSchema(d, schemaFile(), version))
    .then((d) => {
      db = d
      logInfo(`Test database initialized: ${file}.`)
    })
    .catch((err) => logError(`Error: ${err}`))
})

afterAll(() => {
  return shutdownHttpServer()
    .then(() => dbApi.closeDatabase(db))
    .then(() => {
      var file = sqliteTestFile(3)
      logInfo(`Removing test database: ${file}`)
      if (fs.existsSync(file)) fs.unlinkSync(file)
    })
})

describe('Session specific tests', () => {
  test('make sure there is no session at the beginning', () => {
    return selectCountFrom(db, 'SESSION').then((cnt) => {
      expect(cnt).toBe(0)
    })
  })

  test('Now actually load the static data.', () => {
    return loadZcl(db, zclPropertiesFile)
  }, 6000)

  test('http server initialization', () => {
    return initHttpServer(db, port)
  })

  test('Test command line generation using api used for command line generation', () => {
    return attachToDb(db)
      .then((db) => dbApi.loadSchema(db, schemaFile(), version))
      .then((db) => loadZcl(db, zclPropertiesFile))
      .then((db) => setHandlebarTemplateDirForCli('./test/gen-template/'))
      .then((handlebarTemplateDir) => generateCodeViaCli('./generation-test/'))
      .then((res) => {
        return new Promise((resolve, reject) => {
          let i = 0
          for (i = 0; i < res.length; i++) {
            expect(res[i]).toBeDefined()
          }
          let size = Object.keys(res).length
          resolve(size)
        })
      })
      .then((size) => {
        return new Promise((resolve, reject) => {
          expect(size).toBe(8)
          resolve(size)
        })
      })
      .then(() => fs.remove('./generation-test'))
      .catch((error) => console.log(error))
  }, 2000)

  function attachToDb(db) {
    return new Promise((resolve, reject) => {
      setMainDatabase(db)
      resolve(db)
    })
  }

  test('test that there is generation data in the enums.h preview file. Index 1', () => {
    return axios.get(`${baseUrl}/preview/enums/1`).then((response) => {
      expect(response.data['result']).toMatch(
        /EMBER_ZCL_11073_CONNECT_REQUEST_CONNECT_CONTROL_PREEMPTIBLE = 0x01/
      )
    })
  }, 3000)

  test('test that there is generation data in the enums.h preview file. Index 2', () => {
    return axios.get(`${baseUrl}/preview/enums/2`).then((response) => {
      expect(response.data['result']).toMatch(
        /\#define EMBER_AF_ALARM_MASK_GENERAL_HW_FAULT \(0x1\)/
      )
    })
  }, 3000)

  test('test that there is generation data in the cluster-id.h file', () => {
    return axios.get(`${baseUrl}/preview/cluster-id/1`).then((response) => {
      expect(response.data['result']).toMatch(
        /\#define ZCL_BASIC_CLUSTER_ID 0x0000/
      )
    })
  }, 2000)

  test('test that there is generation data in the print-cluster.h file', () => {
    return axios.get(`${baseUrl}/preview/print-cluster/1`).then((response) => {
      expect(response.data['result']).toMatch(
        /\#if defined(ZCL_USING_BASIC_CLUSTER_SERVER) || defined(ZCL_USING_BASIC_CLUSTER_CLIENT)/
      )
    })
  }, 2000)

  test('test that there is generation data in the af-structs.h file', () => {
    return axios.get(`${baseUrl}/preview/af-structs/1`).then((response) => {
      expect(response.data['result']).toMatch(
        /typedef struct _IasAceZoneStatusResult {/
      )
      expect(response.data['result']).toMatch(/            uint8_t zoneId;/)
    })
  }, 2000)

  test('test that there is generation data in the att-storage.h file', () => {
    return axios.get(`${baseUrl}/preview/att-storage/1`).then((response) => {
      expect(response.data['result']).toMatch(
        /\#define ATTRIBUTE_MASK_WRITABLE \(0x01\)/
      )
    })
  }, 2000)

  test('test that there is generation data in the debug-printing-zcl.h file', () => {
    return axios
      .get(`${baseUrl}/preview/debug-printing-zcl/1`)
      .then((response) => {
        expect(response.data['result']).toMatch(
          /\#if defined\(EMBER_AF_PRINT_ENABLE\) && defined\(EMBER_AF_PRINT_BASIC_CLUSTER\)/
        )
        expect(response.data['result']).toMatch(
          /    \#define emberAfBasicClusterPrint\(...\) emberAfPrint\(EMBER_AF_PRINT_BASIC_CLUSTER, __VA_ARGS__\)/
        )
      })
  }, 2000)

  test('test that there is generation data in the callback-zcl.h file', () => {
    return axios.get(`${baseUrl}/preview/callback-zcl/1`).then((response) => {
      expect(response.data['result']).toMatch(
        /void emberAfBasicClusterClientAttributeChangedCallback\(uint8_t endpoint,/
      )
      expect(response.data['result']).toMatch(
        /                                                       EmberAfAttributeId attributeId\);/
      )
      expect(response.data['result']).toMatch(
        /void emberAfIdentifyClusterIdentifyQueryResponseCallback\(/
      )
      expect(response.data['result']).toMatch(
        /                uint16_t timeout/
      )
    })
  }, 2000)

  test('test that there is generation data in the client-command-macro.h file, index 4', () => {
    return axios
      .get(`${baseUrl}/preview/client-command-macro/4`)
      .then((response) => {
        expect(response.data['result']).toMatch(
          /      \#define emberAfFillCommandIso7816ProtocolTunnelClusterServerToClientTransferApdu\(/
        )
        expect(response.data['result']).toMatch(/        apdu\) \\/)
        expect(response.data['result']).toMatch(
          /emberAfFillExternalBuffer\(\(ZCL_CLUSTER_SPECIFIC_COMMAND \\/
        )
        expect(response.data['result']).toMatch(
          /                    ZCL_ISO7816_PROTOCOL_TUNNEL_CLUSTER_ID, \\/
        )
        expect(response.data['result']).toMatch(
          /                    ZCL_TRANSFER_APDU_COMMAND_ID, \\/
        )
        expect(response.data['result']).toMatch(/                    "s", \\/)
        expect(response.data['result']).toMatch(
          /                                    apdu\);/
        )
      })
  }, 2000)

  test('No generation test, incorrect file name', () => {
    return axios.get(`${baseUrl}/preview/no-file`).then((response) => {
      expect(response.data).toMatch(/No Generation Result for this file/)
    })
  }, 2000)

  test('No generation test, incorrect file name and incorrect index', () => {
    return axios.get(`${baseUrl}/preview/no-file/1`).then((response) => {
      expect(response.data).toMatch(/No Generation Result for this file/)
    })
  }, 2000)

  test('No generation test, with wrong index correct file name', () => {
    return axios.get(`${baseUrl}/preview/cluster-id/2`).then((response) => {
      expect(response.data).toMatch(/No Generation Result for this file/)
    })
  }, 2000)
})
