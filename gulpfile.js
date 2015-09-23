var gulp     = require('gulp');
var zip      = require('gulp-zip');
var chrome   = require('./vendor/chrome/manifest');

gulp.task('chrome-dist', function () {
  gulp.src('./build/chrome/**/*')
    .pipe(zip('chrome-extension-' + chrome.version + '.zip'))
    .pipe(gulp.dest('./dist/chrome'));
});
