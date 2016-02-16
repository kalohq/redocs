/* eslint-disable */
var webpack = require('webpack');
var config = require('./examples/the-full-works/playground.webpack.config');

var compiler = webpack(config);
compiler.run(function() {});
