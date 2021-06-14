const gulp = require("gulp");
const config = require("./config");
const paths = config.paths;
const setting = config.setting;
const meta = setting.meta;
const $ = require("gulp-load-plugins")(config.loadPlugins);
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const path = require("path");

const ERRORR_MESSAGE = "Error: <%= error.message %>";
const errorPlumber = () => {
  return $.plumber({
    errorHandler: $.notify.onError(ERRORR_MESSAGE)
  });
};

// HTML
gulp.task("html", () => {
  return gulp.src(paths.html.src)
    .pipe(errorPlumber())
    .pipe($.data(file => {
      //フォルダのパスを取得し整形
      return setting.getSiteData(file);
    }))
    .pipe($.ejs({ meta }, { rmWhitespace: true }))
    .pipe($.rename({ extname: ".html" }))
    .pipe($.changed(paths.html.dest))
    .pipe(gulp.dest(paths.html.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// HTML
gulp.task("htmlhint", () => {
  return gulp.src(paths.html.dest + "/**/*.html")
    .pipe($.htmlhint("./.htmlhintrc"))
    .pipe(errorPlumber())
    .pipe($.htmlhint.failOnError())
    .pipe($.changed(paths.html.dest));
});

// JSON
gulp.task("json", () =>{
  return gulp.src(paths.json.src)
    .pipe(errorPlumber())
    .pipe($.changed(paths.script.dest))
    .pipe(gulp.dest(paths.script.dest))
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
    .pipe(errorPlumber())
    .pipe($.changed(paths.image.dest))
    .pipe($.imagemin(imageminOptions))
    .pipe(gulp.dest(paths.image.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// JavaScript (TypeScript)
gulp.task("script", () => {
  return gulp.src(paths.script.src + "**/*.ts")
    .pipe(errorPlumber())
    .pipe($.webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.script.dest))
    .pipe($.browserSync.reload({ stream: true }));
});

// SASS
gulp.task("scss",() => {
  return gulp.src(paths.sass.src)
    .pipe($.sourcemaps.init())
    .pipe($.sassLint({
      configFile: "./.sass-lint.yml"
    }))
    .pipe(errorPlumber())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
    .pipe($.sass({ outputStyle: "compressed" }))
    .pipe($.postcss([
      require("autoprefixer"),
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
    .pipe(errorPlumber())
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
    gulp.parallel("html", "script", "scss", "json"),
    gulp.parallel("svg", "imagemin", "htmlhint")
  )
);

// Watch
gulp.task("watch", () => {
  $.browserSync.init({ server: { baseDir : paths.base.dest } });

  gulp.watch(paths.sass.src, gulp.task("scss"));
  gulp.watch(paths.script.src + "**/*.ts", gulp.task("script"));
  gulp.watch(paths.html.src, gulp.series("html", "htmlhint"));
  gulp.watch(paths.include.src, gulp.task("html"));
  gulp.watch(paths.json.src, gulp.task("json"));
  gulp.watch(paths.image.src, gulp.task("imagemin"));
});

gulp.task("default", gulp.task("watch"));
