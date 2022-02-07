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
const zclLoader = require('../src-electron/zcl/zcl-loader.js')
const env = require('../src-electron/util/env.ts')
const testUtil = require('./test-util.js')
const querySession = require('../src-electron/db/query-session.js')
const util = require('../src-electron/util/util.js')
let db
let sid

beforeAll(async () => {
  env.setDevelopmentEnv()
  let file = env.sqliteTestFile('custom-validation')
  db = await dbApi.initDatabaseAndLoadSchema(
    file,
    env.schemaFile(),
    env.zapVersion()
  )
  await zclLoader.loadZcl(db, env.builtinSilabsZclMetafile())
  let userSession = await querySession.ensureZapUserAndSession(
    db,
    'USER',
    'SESSION'
  )
  sid = userSession.sessionId
  return util.initializeSessionPackage(db, sid, {
    zcl: env.builtinSilabsZclMetafile(),
    template: env.builtinTemplateMetafile(),
  })
}, testUtil.timeout.medium())

afterAll(() => dbApi.closeDatabase(db), testUtil.timeout.short())

test(
  'Test custom xml',
  async () => {
    let testClusterCode = 43981
    x = await dbApi.dbAll(
      db,
      'SELECT * FROM CLUSTER WHERE MANUFACTURER_CODE = ?',
      [testClusterCode]
    )
    expect(x.length).toEqual(0)

    x = await dbApi.dbAll(
      db,
      'SELECT * FROM ATTRIBUTE WHERE MANUFACTURER_CODE = ?',
      [testClusterCode]
    )
    expect(x.length).toEqual(0)

    x = await dbApi.dbAll(
      db,
      'SELECT * FROM COMMAND WHERE MANUFACTURER_CODE = ?',
      [testClusterCode]
    )
    expect(x.length).toEqual(0)
    let result = await zclLoader.loadIndividualFile(
      db,
      testUtil.testCustomXml,
      sid
    )
    if (!result.succeeded) {
      console.log(`Test failure: ${result.err}`)
    }
    expect(result.succeeded).toBeTruthy()

    x = await dbApi.dbAll(
      db,
      'SELECT * FROM CLUSTER WHERE MANUFACTURER_CODE = ?',
      [testClusterCode]
    )
    expect(x.length).toEqual(1)

    x = await dbApi.dbAll(
      db,
      'SELECT * FROM ATTRIBUTE WHERE MANUFACTURER_CODE = ?',
      [testClusterCode]
    )
    expect(x.length).toEqual(4)

    x = await dbApi.dbAll(
      db,
      'SELECT * FROM COMMAND WHERE MANUFACTURER_CODE = ?',
      [testClusterCode]
    )
    expect(x.length).toEqual(3)
  },
  testUtil.timeout.medium()
)
