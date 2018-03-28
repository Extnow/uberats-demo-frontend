const gulp = require("gulp"),
  sass = require("gulp-sass"),
  imagemin = require("gulp-imagemin"), // оптимизация изображений
  autoprefixer = require("gulp-autoprefixer"), // добавление автопрефиксов
  minifyCss = require("gulp-clean-css"), // минифицирование css
  clean = require("gulp-clean"), // очистка папок
  plumber = require("gulp-plumber"), // отлавливает ошибки
  changed = require("gulp-changed"), // проверяет изменялись ли файлы
  browserSync = require("browser-sync").create(), // автоматическая перезагрузка страницы
  run = require("run-sequence"), // для последовательного запуска задач
  size = require("gulp-size"), // для определения размера файла
  rename = require("gulp-rename"); // переименование файлов
// svgmin = require("gulp-svgmin"), // минификация svg
// svgstore = require("gulp-svgstore"); // для создания спрайтов

gulp.task("scss", function () {
  return gulp.src("src/scss/main.scss")
    .pipe(changed("build/css"))
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"]
    }))
    .pipe(size())
    .pipe(gulp.dest("build/css"))
    .pipe(minifyCss())
    .pipe(size())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

gulp.task("img", function () {
  return gulp.src("src/img/**/*")
    .pipe(changed("build/img/"))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("build/img/"))
    .pipe(browserSync.stream());
});

// gulp.task("svgsprite", function () {
//   return gulp.src("src/img/*.svg")
//     .pipe(svgmin())
//     .pipe(svgstore({
//       inlineSvg: true
//     }))
//     .pipe(rename("sprite.svg"))
//     .pipe(gulp.dest("build/img"))
//     .pipe(browserSync.stream());
// });

gulp.task("clean", function () {
  return gulp.src("build", { read: false })
    .pipe(clean());
});

gulp.task("build", function (fn) {
  run("clean", "scss", "img", fn);
});

gulp.task("serve", function () {
  browserSync.init({
    server: "."
  });

  gulp.watch("src/scss/**/*.scss", ["scss"]);
  gulp.watch("src/img/**/*", ["img"]);
  browserSync.watch("*.html").on("change", browserSync.reload);
});

gulp.task("default", function (fn) {
  gulp.start("build", "serve", fn);
});

