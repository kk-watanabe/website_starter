/**
 * HTMLの更新
 */
const gulp = require("gulp");
const config = require("../config");
const paths = config.paths;
const setting = config.setting;
const meta = setting.meta;
const $ = require("gulp-load-plugins")(config.loadPlugins);

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
