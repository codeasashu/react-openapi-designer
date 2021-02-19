const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {index: './index.js'},
  target: 'web',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    library: 'insomniaComponents',
    libraryTarget: 'commonjs2',
    chunkFilename: '[id].[hash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  externals: ['react', 'styled-components'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map[query]'
    }),
    new HtmlWebpackPlugin({template: 'dist/index.html', inject: 'body'}),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  }
};
