const gulp = require("gulp"),
  sass = require("gulp-sass"),
  imagemin = require("gulp-imagemin"),
  autoprefixer = require("gulp-autoprefixer"),
  minifyCss = require("gulp-clean-css"),
  clean = require("gulp-clean"),
  plumber = require("gulp-plumber"),
  changed = require("gulp-changed"),
  browserSync = require("browser-sync").create(),
  run = require("run-sequence");

gulp.task("scss", function () {
  return gulp.src("src/scss/main.scss")
    .pipe(changed("build/css"))
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"]
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

gulp.task("img", function () {
  return gulp.src("src/img/**/*")
    .pipe(changed("build/img"))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("build/img/"));
});

gulp.task("clean", function () {
  return gulp.src("build", { read: false })
    .pipe(clean());
});

gulp.task("build", function (fn) {
  run("clean", "scss", "img", fn);
});

gulp.task("serve", function () {
  browserSync.init({
    server: ""
  });

  gulp.watch("src/scss/**/*.scss", ["scss"]);
  gulp.watch("src/img/**/*", ["img"]);
  browserSync.watch("*.html").on("change", browserSync.reload);
});

gulp.task("default", function (fn) {
  gulp.start("build", "serve", fn);
});

