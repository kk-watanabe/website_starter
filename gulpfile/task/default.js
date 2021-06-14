/**
 * build & watch
 */
const gulp = require("gulp");
const config = require("../config");
const paths = config.paths;
const $ = require("gulp-load-plugins")(config.loadPlugins);

// Clean
gulp.task("clean", $.del.bind(null, paths.base.dest));

// Build
gulp.task("build", () => {
  return $.sequence(
      ["clean"],
      ["html", "js", "scss", "json"],
      ["svg", "imagemin", "htmlhint"]
    );
});

// Watch
gulp.task("watch", () => {
  $.browserSync.init({server : {baseDir : paths.base.dest}});

  gulp.watch([paths.sass.src], ["scss"]);
  gulp.watch([paths.js.src + "**/*.js"], ["js"]);
  gulp.watch([paths.html.src], ["html", "htmlhint"]);
  gulp.watch([paths.include.src], ["include"]);
  gulp.watch([paths.json.src], ["json"]);
  gulp.watch([paths.image.src], ["imagemin"]);
});

gulp.task("default", ["watch"]);
