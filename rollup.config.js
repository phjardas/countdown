import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const plugins = [
  nodeResolve(),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser());
}

export default ['sw.tpl.js', 'home.script.tpl.js'].map((input) => ({
  input: `src/render/${input}`,
  output: {
    dir: 'functions/render',
    format: 'cjs',
  },
  plugins,
}));
