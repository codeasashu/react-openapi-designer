import react from '@vitejs/plugin-react';
// import fs from 'fs/promises';
import path from 'path';
import {defineConfig} from 'vite';
// import commonjsExternals from 'vite-plugin-commonjs-externals';

// The list of packages we want to keep as commonJS require().
// Must be resolvable import paths, cannot be globs
// These will be available via Node's require function from the node_modules folder or Node's builtin modules
export default defineConfig(({mode}) => {
  const __DEV__ = mode !== 'production';

  return {
    mode,
    root: path.join(__dirname, 'src'),
    base: __DEV__ ? '/' : './',
    define: {
      __DEV__: JSON.stringify(__DEV__),
      'process.env': {},
      'process.platform': JSON.stringify('unix'),
      'process.browser': true,
      'process.cwd': () => '/',
      'global.process': {
        cwd: () => '/',
      },
    },
    esbuild: {
      // jsxFactory: 'h',
      // jsxFragment: 'Fragment',
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    // optimizeDeps: {
    //   esbuildOptions: {
    //     plugins: [
    //       {
    //         name: 'load-js-files-as-jsx',
    //         setup(build) {
    //           build.onLoad({filter: /src\/.*\.js$/}, async (args) => ({
    //             loader: 'jsx',
    //             contents: await fs.readFile(args.path, 'utf8'),
    //           }));
    //         },
    //       },
    //     ],
    //   },
    // },
    server: {
      host: '0.0.0.0',
      port: '3000',
    },
    build: {
      sourcemap: true,
      outDir: path.join(__dirname, 'build'),
      assetsDir: './',
      brotliSize: false,
      emptyOutDir: false,
    },
    plugins: [
      react({
        fastRefresh: __DEV__,
        jsxRuntime: 'automatic',
        babel: {
          presets: ['@babel/preset-flow'],
          plugins: [
            ['@babel/plugin-proposal-decorators', {legacy: true}],
            ['@babel/plugin-proposal-class-properties', {loose: true}],
          ],
        },
      }),
    ],
  };

  // return {
  //   mode,
  //   root: path.join(__dirname, 'src'),
  //   // base: __DEV__ ? '/' : './',
  //   // define: {
  //   //   __DEV__: JSON.stringify(__DEV__),
  //   // },
  //   // esbuild: {
  //   //   jsxFactory: 'h',
  //   //   jsxFragment: 'Fragment',
  //   // },
  //   server: {
  //     host: '0.0.0.0',
  //     port: '3000',
  //   },
  //   // build: {
  //   //   sourcemap: true,
  //   //   outDir: path.join(__dirname, 'build'),
  //   //   assetsDir: './',
  //   //   brotliSize: false,
  //   //   emptyOutDir: false,
  //   // },
  //   plugins: [
  //     // commonjsExternals({externals: commonjsPackages}),
  //     react({
  //       // fastRefresh: __DEV__,
  //       // jsxRuntime: 'automatic',
  //       babel: {
  //         plugins: [
  //           // We need to have these plugins installed in our dependencies
  //           ['@babel/plugin-proposal-decorators', {legacy: true}],
  //           ['@babel/plugin-proposal-class-properties', {loose: true}],
  //         ],
  //       },
  //     }),
  //   ],
  // };
});
