/**
 * jsonの更新
 */
const gulp = require("gulp");
const config = require("../config");
const paths = config.paths;
const $ = require("gulp-load-plugins")(config.loadPlugins);

gulp.task("json", () =>{
  return gulp.src(paths.json.src)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.changed(paths.js.dest))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.browserSync.reload({stream: true}));
});
