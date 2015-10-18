var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'app/'),
    filename: 'app.js'
  },
  // Add loader for .ts files. 
  module: {
    loaders: [
      {
        test: /\.scss|\.css$/,
        loader: ExtractTextPlugin.extract("raw-loader!sass-loader") 
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('app.css', { allChunks: true } )
  ],
  node: {
    fs: "empty"
  }
};