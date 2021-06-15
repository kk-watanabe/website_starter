/**********************************
 環境変数
**********************************/
const fs = require("fs");
const path = require("path");


//各モジュールの設定
const setting = {
  //Webpackの設定
  webpack: {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: "development",

    //編集ファイル
    entry: `./${pathSetting.script.src}index.ts`,

    //出力ファイル
    output: {
      path: path.join(__dirname, pathSetting.script.dest),
      filename: "script.js"
    },

    //jQueryを使用しない場合はfalse
    jqueryNecessary: false,

    //jQueryを使用する場合に実行
    providePlugin : (judge) => {
      let plugin = {};

      if(judge) {
        plugin["jQuery"]= "jquery";
        plugin["$"]= "jquery";
      }

      return plugin;
    }
  },
};

/**
 * ロードモジュールの設定
 */
const loadPlugins = {
  pattern: [
    "gulp-*",
    "gulp.*",
    "browser-sync",
    "imagemin-*",
    "webpack-*",
    "del",
  ],
  rename: {
    "browser-sync": "browserSync",
    "del": "del",
    "imagemin-svgo": "imageminSvgo",
    "imagemin-jpegtran": "imageminJpeg",
    "imagemin-optipng": "imageminPng",
    "webpack-stream": "webpackStream",
    "gulp-connect-php": "connect"
  }
};

module.exports = {
  base: assets,
  paths: pathSetting,
  setting: setting,
  loadPlugins: loadPlugins,
};
