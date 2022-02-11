// @ts-nocheck

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

const { app } = require('electron')

// enable stack trace to be mapped back to the correct line number in TypeScript source files.
require('source-map-support').install()

import * as args from '../util/args'
const env = require('../util/env')
const windowJs = require('../ui/window')
const startup = require('./startup.js')

env.versionsCheck()

if (process.env.DEV) {
  env.setDevelopmentEnv()
} else {
  env.setProductionEnv()
}

function hookSecondInstanceEvents(argv: args.Arguments) {
  app.allowRendererProcessReuse = false
  app
    .whenReady()
    .then(() => startup.startUpSecondaryInstance(argv))
}

/**
 * Hook up all the events for the electron app object.
 */
function hookMainInstanceEvents(argv: args.Arguments) {
  app.allowRendererProcessReuse = false
  app
    .whenReady()
    .then(() => startup.startUpMainInstance(true, argv))

  if (!argv._.includes('server')) {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    app.on('activate', () => {
      env.logInfo('Activate...')
      windowJs.windowCreateIfNotThere(argv.httpPort)
    })
  }

  app.on('will-quit', () => {
    startup.shutdown()
  })

  app.on('second-instance', (event: Event, commandLine: string[], workingDirectory: string) => {
    env.logInfo(`Zap instance started with command line: ${commandLine}`)
  })
}

// Main lifecycle of the application
if (app != null) {
  let argv = args.processCommandLineArguments(process.argv)
  let reuseZapInstance = argv.reuseZapInstance
  let canProceedWithThisInstance
  let gotLock = app.requestSingleInstanceLock()

  if (reuseZapInstance) {
    canProceedWithThisInstance = gotLock
  } else {
    canProceedWithThisInstance = true
  }
  if (canProceedWithThisInstance) {
    hookMainInstanceEvents(argv)
  } else {
    // The 'second-instance' event on app was triggered, we need
    // to quit.
    hookSecondInstanceEvents(argv)
  }
} else {
  // If the code is executed via 'node' and not via 'electron', then this
  // is where we end up.
  startup.startUpMainInstance(
    false,
    args.processCommandLineArguments(process.argv)
  )
}

exports.loaded = true
