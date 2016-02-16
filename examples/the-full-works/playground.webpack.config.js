/* eslint-disable */
var webpack = require('webpack');
var path = require('path');

var PATHS = {
  CONTEXT: __dirname,
  BUILD: path.join(__dirname, 'dist')
};

module.exports = {
  context: PATHS.CONTEXT,
  entry: './playground',
  output: {
    path: PATHS.BUILD,
    filename: 'bundle.js',
    chunkFilename: '[name].[chunkhash].js'
  },
  devtool: 'cheap-eval-source-map',
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
      {test: /\-fixture\.js$/, loader: 'babel!redocs/src/webpack/manifest-loader', exclude: /node_modules/},
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // would be nice to use minimatch or similar in future
      MATCH_COMPONENTS: process.env.MATCH ? '/' + process.env.MATCH + '/' : '/\\-fixture\\\.js$/'
    }),
    new webpack.optimize.DedupePlugin()
  ]
};

