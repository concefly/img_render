var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./entries/index/index.js",
  },
  output: {
    path: "./dist",
    filename: '[name].bundle.js',
    chunkFilename: "[name].chunk.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      // html-loader can replace all image urls in .html file
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.tpl$/, loader: 'html-loader?minimize=true'},
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style", "css", "less")
      },
      { test: /\.(png|jpg)$/, loader: "url-loader?limit=1024" }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new HtmlWebpackPlugin({
      template: "./entries/index/index.html",
      filename: "index.html",
      chunks: ["index"]
    })
  ],
  devServer: {
    host: '0.0.0.0'
  }
}
