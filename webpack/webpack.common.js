const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  target: 'web',
  output: {
    filename: 'main.js',
    sourceMapFilename: 'main.js.map',
    path: path.join(__dirname, '../dist'),
    libraryTarget: 'umd',
    clean: true,
  },
  resolve: {
    aliasFields: ['browser'],
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "vm": require.resolve("vm-browserify"),
      "buffer": require.resolve("buffer"),
    }
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
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
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
         test: /\.(png|svg|jpg|jpeg|gif)$/i,
         type: 'asset/resource',
       },
       {
         test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
         type: 'asset/resource',
       }
    ],
  },
  externals: {
    react: 'react'
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": "{}",
      'process.platform': JSON.stringify('unix'),
      'process.browser': true,
      global: {}
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ]
};
