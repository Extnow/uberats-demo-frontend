const gulp = require("gulp"),
  sass = require("gulp-sass"),
  imagemin = require("gulp-imagemin"),
  autoprefixer = require("gulp-autoprefixer");

gulp.task("scss", function () {
  return gulp.src("src/scss/main.scss")
    .pipe(sass({ includePaths: ["src/scss"] }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"]
    }))
    .pipe(gulp.dest("build/css"));
});

gulp.task("img", function () {
  return gulp.src("src/img/**/*")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("build/img/"));
});

gulp.task("scss:watch", function () {
  gulp.watch("src/scss/**/*.scss", ["scss"]);
});

gulp.task("default", ["scss", "img", "scss:watch"]);