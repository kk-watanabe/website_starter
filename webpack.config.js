const webpack = require("webpack");
const path = require("path");
const jqueryNecessary = false;

const providePlugin = (judge) => {
  let plugin = [];

  if(judge) {
    plugin["jQuery"]= "jquery";
    plugin["$"]= "jquery";
  }

  return plugin;
}

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",
  entry: "./src/assets/script/index.ts",
  output: {
    path: path.join(__dirname, "dist/assets/script/"),
    filename: "bundle.min.js"
  },
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
  optimization: {
    minimize: true,
  },
  devtool: "inline-source-map",
  plugins: providePlugin(jqueryNecessary),
};
