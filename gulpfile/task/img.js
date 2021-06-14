/**
 * 画像の更新
 */
const gulp = require("gulp");
const config = require("../config");
const paths  = config.paths;
const setting = config.setting;
const $ = require("gulp-load-plugins")(config.loadPlugins);
const imageminOptions = [
  $.imagemin.jpegtran(setting.imagemin.jpg),
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
