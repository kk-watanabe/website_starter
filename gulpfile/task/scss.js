/**
 * CSSの更新
 */
const gulp = require("gulp");
const config = require("../config");
const paths = config.paths;
const setting = config.setting;
const $ = require("gulp-load-plugins")(config.loadPlugins);

// SASS
gulp.task("scss",() => {
  return gulp.src(paths.sass.src)
    .pipe($.sourcemaps.init())
    .pipe($.sassLint({
      configFile: "../../.sass-lint.yml"
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
