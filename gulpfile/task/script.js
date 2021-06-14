/**
 * jsの更新
 */
const gulp = require("gulp");
const config = require("../config");
const paths = config.paths;
const $ = require("gulp-load-plugins")(config.loadPlugins);
const webpack = require("webpack");
const webpackConfig = require("../webpack.config");

// JavaScript
gulp.task("js", () => {
  return gulp.src(paths.js.src + "**/*.js")
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe($.webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.browserSync.reload({stream: true}));
});
