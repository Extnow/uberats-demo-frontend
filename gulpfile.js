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

gulp.task('scss', done => {
  gulp
    .src('src/scss/main.scss')
    .pipe(changed('build/css'))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions']
      })
    )
    .pipe(minifyCss())
    .pipe(size())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());

  done();
});

gulp.task('img', done => {
  gulp
    .src('src/img/**/*')
    .pipe(changed('build/img/'))
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ progressive: true })
      ])
    )
    .pipe(gulp.dest('build/img/'))
    .pipe(browserSync.stream());

  done();
});

gulp.task('clean', done => {
  gulp.src('build', { read: false }).pipe(clean());

  done();
});

gulp.task(
  'build',
  gulp.series('scss', 'img', done => {
    done();
  })
);

gulp.task('serve', done => {
  browserSync.init({
    server: '.'
  });

  gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
  gulp.watch('src/img/**/*', gulp.series('img'));

  browserSync.watch('*.html').on('change', () => {
    browserSync.reload();
    done();
  });

  done();
});

gulp.task('default', gulp.series('serve'));
