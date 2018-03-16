const gulp = require("gulp"),
  sass = require("gulp-sass");

gulp.task("css", function () {
  return gulp.src("src/scss/main.scss")
    .pipe(sass({ includePaths: ["src/scss"] }).on("error", sass.logError))
    .pipe(gulp.dest("build/css"));
});

gulp.task("css:watch", function () {
  gulp.watch("src/scss/**/*.scss", ["css"]);
});

gulp.task("default", ["css", "css:watch"]);