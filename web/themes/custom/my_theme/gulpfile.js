const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const path = require('path');

// Paths
const smacssPaths = 'scss/*.scss';
const sdcPaths = 'components/**/*.scss';

// Compile SCSS files from 'scss/' → 'css/'
function compileSmacss() {
  return gulp.src(smacssPaths)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(function (file) {
      // Output to 'css/' folder, preserving relative path
      const relPath = path.relative(file.cwd + '/scss', file.base);
      return path.join('css', relPath);
    }));
}

// Compile SCSS from components → same folder
function compileSdc() {
  return gulp.src(sdcPaths, { base: '.' }) // Preserve folder
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('.')); // Output in same folder
}

// Combined compile task
gulp.task('sass', gulp.parallel(compileSmacss, compileSdc));

// Watchers
gulp.task('watch-scss', function () {
  return gulp.watch(smacssPaths, compileSmacss);
});
gulp.task('watch-components', function () {
  return gulp.watch(sdcPaths, compileSdc);
});
gulp.task('watch', gulp.parallel('watch-scss', 'watch-components'));

// Default task
gulp.task('default', gulp.series('sass'));
