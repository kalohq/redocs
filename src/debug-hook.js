const webpack = require('../examples/the-full-works/node_modules/webpack');
const config = require('../examples/the-full-works/playground.webpack.config');

const compiler = webpack(config);
compiler.run(() => null);
