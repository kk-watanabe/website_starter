/**********************************
 環境変数
**********************************/
const fs = require("fs");
const path = require("path");

//baseディレクトリの指定
const base = {
  src: "src",
  dest: "docs",
};

//assetsディレクトリの指定
const assets = {
  src: base.src + "/assets/",
  dest: base.dest + "/assets/",
};

//pashの指定
const pathSetting = {
  base: {
    src: base.src,
    dest: base.dest
  },
  sass: {
    src: assets.src + "sass/**/*.s+(a|c)ss",
    dest: assets.dest + "css/",
  },
  js: {
    src: assets.src + "js/",
    dest: assets.dest + "js/",
  },
  image: {
    src: assets.src + "img/**/*.+(jpg|jpeg|png|gif|svg)",
    dest: assets.dest + "img/",
  },
  include: {
    src: assets.src + "inc/**/**.ejs",
  },
  json: {
    src: assets.src + "json/*.json"
  },
  svg: {
    src: assets.src + "svg/*.svg"
  },
  html: {
    src: [
      base.src + "/ejs/**/*.ejs",
      "!" + assets.src + "inc/**/_*.ejs" ,
    ],
    dest: base.dest,
  },
  meta: "./meta.json"
};

//各モジュールの設定
const setting = {
  //metaデータ
  meta: JSON.parse(fs.readFileSync(pathSetting.meta)),
  //ブラウザバージョン管理
  autoprefixer: {
    browser: ["last 2 versions"]
  },
  //SVGの設定
  svg: {
    plugin: (pre) => {
      const option = [{
        cleanupIDs: {
          prefix: pre + "-",
          minify: true
        }
      }];

      return option;
    }
  },

  //画像の圧縮関連設定
  //必要であれば変更
  imagemin: {
    jpg: {
      progressive: true
    },
    png: {
      optimizationLevel: 5
    },
    svg: {
      plugins: [
        { removeViewBox: true },
        { cleanupIDs: false }
      ]
    },
  },

  //Webpackの設定
  webpack: {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: "development",

    //編集ファイル
    entry: `./${pathSetting.js.src}common.js`,

    //出力ファイル
    output: {
      path: path.join(__dirname, pathSetting.js.dest),
      filename: "bundle.js"
    },

    //jQueryを使用しない場合はfalse
    jqueryNecessary: false,

    //uglifyの設定
    uglifyJsPlugin: {
      sourceMap: true,
      uglifyOptions: {
        mangle: false,
        output: { comments: false },
        compress: { warnings: false }
      }
    },

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

  //ejsの設定
  ejs: {
    space: true,
    ext: ".html"
  },

  //フォルダのパスを取得し整形
  getSiteData: (file) => {
    const allPath = file.path.split("\\").join("/");
    const allPaths = allPath.split("/ejs/");
    const path = allPaths[1].replace(".ejs", "").split("/");
    const pathUrl= allPaths[1].replace(".ejs", ".html");

    return {
      fileUrl: `/${pathUrl}`,
      fileName: path,
      folderPath: setting.getFolderPass(path)
    };
  },

  // 「 ../ 」をdataの数で出力する
  getFolderPass: (data) => {
    const pathTxt = "../";

    let addPath = "";

    for (var i = 0; i < data.length; i++) {
      addPath = addPath + pathTxt;
    }

    return addPath;
  }
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
    "del"
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
