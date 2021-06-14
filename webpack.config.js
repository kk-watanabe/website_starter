/**
 * Webpack関連まとめ
 */
const config = require("./config");
const setting = config.setting;
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: setting.webpack.mode,
  entry: setting.webpack.entry,
  output: setting.webpack.output,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader",
            options: {
              configFile : "./.eslintrc.json",
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin(setting.webpack.providePlugin(setting.webpack.jqueryNecessary)),
    new UglifyJsPlugin(setting.webpack.uglifyJsPlugin)
  ],
  optimization : {
    minimizer:
      setting.webpack.mode === "production"
        ?[
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {drop_console: true},
              output  : {comments: /^\**!|@preserve|@license|@cc_on/i}
            },
          })
        ]
        : [],
  }
};
