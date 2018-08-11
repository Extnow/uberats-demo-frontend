const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin'); // оптимизация изображений
const autoprefixer = require('gulp-autoprefixer'); // добавление автопрефиксов
const minifyCss = require('gulp-clean-css'); // минифицирование css
const clean = require('gulp-clean'); // очистка папок
const plumber = require('gulp-plumber'); // отлавливает ошибки
const changed = require('gulp-changed'); // проверяет изменялись ли файлы
const browserSync = require('browser-sync').create(); // автоматическая перезагрузка страницы
const run = require('run-sequence'); // для последовательного запуска задач
const size = require('gulp-size'); // для определения размера файла
const rename = require('gulp-rename'); // переименование файлов

gulp.task('scss', () =>
  gulp
    .src('src/scss/main.scss')
    .pipe(changed('build/css'))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(minifyCss())
    .pipe(size())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream()));

gulp.task('img', () =>
  gulp
    .src('src/img/**/*')
    .pipe(changed('build/img/'))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
    ]))
    .pipe(gulp.dest('build/img/'))
    .pipe(browserSync.stream()));

gulp.task('clean', () => gulp.src('build', { read: false }).pipe(clean()));

gulp.task('build', (fn) => {
  run('clean', 'scss', 'img', fn);
});

gulp.task('serve', () => {
  browserSync.init({
    server: '.',
  });

  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/img/**/*', ['img']);
  browserSync.watch('*.html').on('change', browserSync.reload);
});

gulp.task('default', (fn) => {
  gulp.start('build', 'serve', fn);
});
