const path = require('path');
const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../lib'),
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true,
  },
  devtool: 'source-map',
  performance: false,
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  resolve: {
    aliasFields: ['browser'],
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      vm: require.resolve('vm-browserify'),
      buffer: require.resolve('buffer'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
      fs: false,
    },
    alias: {
      components: path.resolve(__dirname, '..', 'src', 'components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\\?]?.*)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '{}',
      'process.platform': JSON.stringify('unix'),
      'process.browser': true,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process/browser.js'],
    }),
    new MonacoWebpackPlugin({
      languages: ['json', 'yaml'],
    }),
  ],
};
