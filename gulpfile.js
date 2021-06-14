const gulp = require("gulp");
const config = require("./config");
const paths = config.paths;
const setting = config.setting;
const meta = setting.meta;
const $ = require("gulp-load-plugins")(config.loadPlugins);
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const path = require("path");

// HTML
gulp.task("html", () => {
  return gulp.src(paths.html.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.data(file => {
      //フォルダのパスを取得し整形
      return setting.getSiteData(file);
    }))
    .pipe($.ejs({meta}, {rmWhitespace: setting.ejs.space}, {ext: setting.ejs.ext}))
    .pipe($.changed(paths.html.dest))
    .pipe(gulp.dest(paths.html.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// HTML
gulp.task("include", () => {
  return gulp.src(paths.html.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.data(file => {
      //フォルダのパスを取得し整形
      return setting.getSiteData(file);
    }))
    .pipe($.ejs(
      { meta },
      { rmWhitespace: setting.ejs.space },
      { ext: setting.ejs.ext }
    ))
    .pipe(gulp.dest(paths.html.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// HTML
gulp.task("htmlhint", () => {
  return gulp.src(paths.html.dest + "/**/*.html")
    .pipe($.htmlhint("./.htmlhintrc"))
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.htmlhint.failOnError())
    .pipe($.changed(paths.html.dest));
});

// JSON
gulp.task("json", () =>{
  return gulp.src(paths.json.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.changed(paths.js.dest))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.browserSync.reload({stream: true}));
});

const imageminOptions = [
  $.imagemin.mozjpeg(setting.imagemin.jpg),
  $.imagemin.optipng(setting.imagemin.png),
  $.imagemin.svgo(setting.imagemin.svg)
];

// 画像の圧縮
gulp.task("imagemin", () => {
  return gulp.src(paths.image.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.changed(paths.image.dest))
    .pipe($.imagemin(imageminOptions))
    .pipe(gulp.dest(paths.image.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// JavaScript
gulp.task("js", () => {
  return gulp.src(paths.js.src + "**/*.js")
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// SASS
gulp.task("scss",() => {
  return gulp.src(paths.sass.src)
    .pipe($.sourcemaps.init())
    .pipe($.sassLint({
      configFile: "./.sass-lint.yml"
    }))
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
    .pipe($.sass({ outputStyle: "compressed" }))
    .pipe($.postcss([
      require("autoprefixer")({ browsers: setting.autoprefixer.browser }),
      require("css-mqpacker")
    ]))
    .pipe($.csso())
    .pipe($.sourcemaps.write("./maps"))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// SVG
gulp.task("svg", () => {
  return gulp.src(paths.svg.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.svgmin((file) => {
      const prefix = path.basename(file.relative, path.extname(file.relative));

      return { plugins: setting.svg.plugin(prefix) };
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
    .pipe(gulp.dest(paths.image.dest));
});

// Clean
gulp.task("clean", $.del.bind(null, paths.base.dest));

// Build
gulp.task("build",
  gulp.series(
    "clean",
    gulp.parallel("html", "js", "scss", "json"),
    gulp.parallel("svg", "imagemin", "htmlhint")
  )
);

// Watch
gulp.task("watch", () => {
  $.browserSync.init({ server: { baseDir : paths.base.dest } });

  gulp.watch(paths.sass.src, gulp.task("scss"));
  gulp.watch(paths.js.src + "**/*.js", gulp.task("js"));
  gulp.watch(paths.html.src, gulp.series("html", "htmlhint"));
  gulp.watch(paths.include.src, gulp.task("include"));
  gulp.watch(paths.json.src, gulp.task("json"));
  gulp.watch(paths.image.src, gulp.task("imagemin"));
});

gulp.task("default", gulp.task("watch"));
