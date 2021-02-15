import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import svelte from 'rollup-plugin-svelte';

const production = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/main.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/bundle.js',
    },
    plugins: [
      svelte({ compilerOptions: { dev: !production } }),
      nodeResolve({ browser: true, dedupe: ['svelte'] }),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      production && terser(),
    ],
  },
  ...['sw.tpl.js', 'home.script.tpl.js'].map((input) => ({
    input: `src/render/${input}`,
    output: {
      dir: 'functions/render',
      format: 'cjs',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      production && terser(),
    ],
  })),
];
