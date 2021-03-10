const path = require('path');
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {index: './src/index.js'},
  target: 'web',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    library: 'react-openapi-designer',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
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
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
         test: /\.svg$/,
         use: ['svg-loader']
       },
       {
         test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
         use: ['file-loader']
       }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": "{}",
      global: {}
    })
  ]
};
