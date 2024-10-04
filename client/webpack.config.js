const path = require('path');
const publicPath = path.join(`${__dirname}/public/`);
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/nonogram.jsx',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  devServer: {
    hot: true,
    static: {
      directory: publicPath,
    },
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  // plugins: [new ReactRefreshWebpackPlugin()].filter(Boolean),
};