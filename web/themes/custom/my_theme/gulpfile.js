const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

// Source and destination paths
const paths = {
  scss: 'scss/*.scss',            // Adjust as needed
  cssDest: 'css/'                    // Output folder
};

// Compile, minify, and rename
function styles() {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))     // Compile SCSS
    .pipe(cleanCSS())                            // Minify CSS
    .pipe(rename({ suffix: '.min' }))            // Rename to .min.css
    .pipe(gulp.dest(paths.cssDest));             // Save to destination
}

// Watch for changes (optional)
function watchFiles() {
  gulp.watch(paths.scss, styles);
}

// Export tasks
exports.styles = styles;
exports.watch = gulp.series(styles, watchFiles);
exports.default = styles;
