import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/tree-like-object-utils.cjs.min.js',
        name: 'TreeObjectUtils',
        format: 'cjs',
      },
      {
        file: 'dist/tree-like-object-utils.umd.min.js',
        name: 'TreeObjectUtils',
        format: 'umd',
      }
    ],
    plugins: [
      commonjs(),
      resolve(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime'
      }),
      terser()
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/tree-like-object-utils.cjs.js',
        name: 'TreeObjectUtils',
        format: 'cjs',
      },
      {
        file: 'dist/tree-like-object-utils.umd.js',
        name: 'TreeObjectUtils',
        format: 'umd',
      }
    ],
    plugins: [
      commonjs(),
      resolve(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime'
      })
    ],
  }
]
