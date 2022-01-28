// import merge from 'deepmerge'
import { createBasicConfig } from '@open-wc/building-rollup'
import pluginTypescript from '@rollup/plugin-typescript'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'
import { babel } from '@rollup/plugin-babel'

import path from 'path'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'

const customResolver = resolve({
  extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss'],
})
const projectRootDir = path.resolve(__dirname)

const moduleName = pkg.name.replace(/^@.*\//, '')
const input = 'src/index.ts'
const banner = `
  /**
   * @license
   * author: ${pkg.author}
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`

const baseConfig = createBasicConfig()

export default {
  input,
  output: {
    dir: 'dist',
    name: moduleName,
    banner,
  },
  plugins: [
    alias({
      entries: [
        {
          find: '@/',
          RemotePlayback: projectRootDir + '/',
        },
        {
          find: '@src',
          replacement: path.resolve(projectRootDir, './src'),
          // OR place `customResolver` here. See explanation below.
        },
      ],
      customResolver,
    }),
    resolve(
      {extensions: [ '.mjs', '.js', '.jsx', '.json','.ts' ],}
    ),
    pluginTypescript({
      sourceMap:false
    }),
    pluginCommonjs({
      extensions: ['.js', '.ts'],
    }),
    babel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, '.babelrc.js'),
    }),
  ],
}

// const baseConfig = createBasicConfig();

// export default merge(baseConfig, {
//   input: './dist/index.js',
//   output: {
//       dir: 'dist',
//   }
// });
