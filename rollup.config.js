import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.dist.js',
    name: 'TreeObjectUtils',
    format: 'umd',
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime'
    }),
    process.env.NODE_ENV === 'production' ? terser() : undefined
  ],
}
