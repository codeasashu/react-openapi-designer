const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

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
	},
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("demo", "index.html"),
      title: 'Development',
      inject: 'body'
    }),
  ],
  optimization: {
    minimize: false,
  }
})
