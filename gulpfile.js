const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Path
const paths = {
  js: {
    src: 'src/js/pages/**/*.js',
    dest: 'wwwroot/js/pages/'
  }
};

// Task: Minify JS (tanpa sourcemaps)
function minifyJs() {
  return gulp.src(paths.js.src)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js.dest));
}

// Task: Watch JS files
function watchFiles() {
  gulp.watch(paths.js.src, minifyJs);
}

// Export tasks
exports.default = gulp.series(minifyJs, watchFiles);
exports.minifyJs = minifyJs;
exports.watch = watchFiles;
