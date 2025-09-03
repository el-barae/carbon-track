const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.js', // Entry file (your main file)
  output: {
    filename: 'bundle.js', // Output file
    path: path.resolve(__dirname, 'dist'), // Output folder (dist)
  },
  target: 'node', // Set target to Node.js
  externals: [webpackNodeExternals()], // Exclude node_modules from bundling
  devtool: 'source-map', // Enable source maps for easier debugging
  resolve: {
    extensions: ['.js'], // Allow omitting extensions for .js files
  },
};
