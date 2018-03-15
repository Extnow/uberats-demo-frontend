const gulp = require("gulp"),
  sass = require("gulp-sass");

gulp.task("css", function () {
  return gulp.src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("build/css"));
});

gulp.task("sass:watch", function () {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
});

gulp.task("default", ["css", "sass:watch"]);