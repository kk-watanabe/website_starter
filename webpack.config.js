/**
 * Webpack関連まとめ
 */
const config = require("./config");
const setting = config.setting;
const webpack = require("webpack");

module.exports = {
  mode: setting.webpack.mode,
  entry: setting.webpack.entry,
  output: setting.webpack.output,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
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
  resolve: {
    extensions: [
      ".ts", ".js",
    ],
  },
  plugins: [
    setting.webpack.jqueryNecessary
      ? new webpack.ProvidePlugin(setting.webpack.providePlugin(setting.webpack.jqueryNecessary))
      : "",
  ],
};
