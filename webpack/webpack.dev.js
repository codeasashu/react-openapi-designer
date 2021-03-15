const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common');

delete common.externals;

module.exports = merge(common, {
  context: __dirname,
  entry: '../demo/index',
  output: {
		publicPath: '/'
	},
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
		historyApiFallback: true,
    port: 8080,
    hot: true,
	},
  resolve: {
    alias: {
      react: path.resolve('node_modules','react'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("demo", "index.html"),
      title: 'Development',
      inject: 'body'
    }),
  ]
})
