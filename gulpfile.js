const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const $ = require("gulp-load-plugins")({
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
  }
});

// Path
const srcPath = "src";
const distPath = "dist";
const assetsDirectory = "/assets/";
const assetsSrcPath = `${srcPath}${assetsDirectory}`;
const assetsDistPath = `${distPath}${assetsDirectory}`;
const paths = {
  sass: {
    src: `${assetsSrcPath}sass/**/*.s+(a|c)ss`,
    dist: `${assetsDistPath}css/`,
  },
  script: {
    src: `${assetsSrcPath}script/`,
    dist: `${assetsDistPath}script/`,
  },
  image: {
    src: `${assetsSrcPath}img/**/*.+(jpg|jpeg|png|gif|svg)`,
    dist: `${assetsDistPath}img/`,
  },
  include: {
    src: `${assetsSrcPath}include/**/**.ejs`,
  },
  json: {
    src: `${assetsSrcPath}json/*.json`
  },
  svg: {
    src: `${assetsSrcPath}svg/*.svg`
  },
  html: {
    src: [
      `${srcPath}/ejs/**/*.ejs`,
      `!${assetsSrcPath}include/**/_*.ejs` ,
    ],
    dist: distPath,
  },
  meta: `./meta.json`
};

// Error message
const ERRORR_MESSAGE = "Error: <%= error.message %>";
const errorPlumber = () => {
  return $.plumber({
    errorHandler: $.notify.onError(ERRORR_MESSAGE)
  });
};

// 「 ../ 」をdataの数で出力する
const getFolderPass = (data) => {
  const pathTxt = "../";

  let addPath = "";

  for (var i = 0; i < data.length; i++) {
    addPath = addPath + pathTxt;
  }

  return addPath;
}

//フォルダのパスを取得し整形
const getSiteData = (file) => {
  const allPath = file.path.split("\\").join("/");
  const allPaths = allPath.split("/ejs/");
  const path = allPaths[1].replace(".ejs", "").split("/");
  const pathUrl = allPaths[1].replace(".ejs", ".html");

  return {
    fileUrl: `/${pathUrl}`,
    fileName: path,
    folderPath: getFolderPass(path)
  };
};

// HTML
gulp.task("html", () => {
  return gulp.src(paths.html.src)
    .pipe(errorPlumber())
    .pipe($.data(file => {
      //フォルダのパスを取得し整形
      return getSiteData(file);
    }))
    .pipe($.ejs({ meta: JSON.parse(fs.readFileSync(paths.meta)) }, { rmWhitespace: true }))
    .pipe($.rename({ extname: ".html" }))
    .pipe($.changed(paths.html.dist))
    .pipe($.replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
    .pipe($.htmlmin({
      collapseWhitespace: false,
      removeComments : true
    }))
    .pipe(gulp.dest(paths.html.dist))
    .pipe($.browserSync.reload({ stream: true }));
});

// HTML
gulp.task("htmlhint", () => {
  return gulp.src(paths.html.dest + "/**/*.html")
    .pipe($.htmlhint(".htmlhintrc"))
    .pipe(errorPlumber())
    .pipe($.htmlhint.failOnError())
    .pipe($.changed(paths.html.dist));
});

// JSON
gulp.task("json", () =>{
  return gulp.src(paths.json.src)
    .pipe(errorPlumber())
    .pipe($.changed(paths.script.dist))
    .pipe(gulp.dest(paths.script.dist))
    .pipe($.browserSync.reload({stream: true}));
});

const imageminOptions = [
  $.imagemin.mozjpeg({
    progressive: true
  }),
  $.imagemin.optipng({
    optimizationLevel: 5
  }),
  $.imagemin.svgo(
    {
      plugins: [
        { removeViewBox: true },
        { cleanupIDs: false }
      ]
    }
  )
];

// 画像の圧縮
gulp.task("imagemin", () => {
  return gulp.src(paths.image.src)
    .pipe(errorPlumber())
    .pipe($.changed(paths.image.dist))
    .pipe($.imagemin(imageminOptions))
    .pipe(gulp.dest(paths.image.dist))
    .pipe($.browserSync.reload({ stream: true }));
});

// JavaScript (TypeScript)
gulp.task("script", () => {
  return gulp.src(paths.script.src + "**/*.ts")
    .pipe(errorPlumber())
    .pipe($.webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.script.dist))
    .pipe($.browserSync.reload({ stream: true }));
});

// SASS
gulp.task("scss",() => {
  return gulp.src(paths.sass.src)
    .pipe($.sourcemaps.init())
    .pipe(errorPlumber())
    .pipe($.sass({ outputStyle: "compressed" }))
    .pipe($.postcss([
      require("autoprefixer"),
      require("css-mqpacker")
    ]))
    .pipe($.csso())
    .pipe($.sourcemaps.write("./maps"))
    .pipe(gulp.dest(paths.sass.dist))
    .pipe($.browserSync.reload({ stream: true }));
});

// SVG
gulp.task("svg", () => {
  return gulp.src(paths.svg.src)
    .pipe(errorPlumber())
    .pipe($.svgmin((file) => {
      const prefix = path.basename(file.relative, path.extname(file.relative));
      const option = [{
        cleanupIDs: {
          prefix: prefix + "-",
          minify: true
        }
      }];

      return option;
    }))
    .pipe($.svgstore({ inlineSvg: true }))

    .pipe($.cheerio({
      run: ($) => {
        $("[fill]").removeAttr("fill");
        $("[stroke]").removeAttr("stroke");
        $("style").remove();
        $("title").remove();
        $("svg").attr("style","display: none");
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(paths.image.dist));
});

// Clean
gulp.task("clean", $.del.bind(null, distPath));

// Build
gulp.task("build",
  gulp.series(
    "clean",
    gulp.parallel("html", "script", "scss", "json"),
    gulp.parallel("svg", "imagemin", "htmlhint")
  )
);

// Watch
gulp.task("watch", () => {
  $.browserSync.init({ server: { baseDir: distPath } });

  gulp.watch(paths.sass.src, gulp.task("scss"));
  gulp.watch(paths.script.src + "**/*.ts", gulp.task("script"));
  gulp.watch(paths.html.src, gulp.series("html"));
  gulp.watch(paths.include.src, gulp.task("html"));
  gulp.watch(paths.json.src, gulp.task("json"));
  gulp.watch(paths.image.src, gulp.task("imagemin"));
});

gulp.task("default", gulp.task("watch"));
