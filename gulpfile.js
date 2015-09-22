var gulp     = require('gulp');
var zip      = require('gulp-zip');
var clean    = require('gulp-clean');
var rseq     = require('run-sequence');
var es       = require('event-stream');

var chrome   = require('./vendor/chrome/manifest');

function pipe(src, transforms, dest) {
  if (typeof transforms === 'string') {
    dest = transforms;
    transforms = null;
  }

  var stream = gulp.src(src);
  transforms && transforms.forEach(function(transform) {
    stream = stream.pipe(transform);
  });

  if (dest) {
    stream = stream.pipe(gulp.dest(dest));
  }

  return stream;
}

gulp.task('clean', function() {
  return pipe('./build', [clean()]);
});

gulp.task('chrome', function() {
  return es.merge(
    pipe('./*.html', './build/chrome/'),
    pipe('./images/**/*', './build/chrome/images'),
    pipe('./js/**/*', './build/chrome/js'),
    pipe('./css/**/*', './build/chrome/css'),
    pipe('./node_modules/chrome-bootstrap/chrome-bootstrap.css', './build/chrome/css'),
    pipe('./_locales/**/*', './build/chrome/_locales'),
    pipe('./vendor/chrome/extension.js', './build/chrome/js'),
    pipe('./vendor/chrome/popin.js', './build/chrome/js'),
    pipe('./vendor/chrome/manifest.json', './build/chrome/')
  );
});

gulp.task('chrome-dist', function () {
  gulp.src('./build/chrome/**/*')
    .pipe(zip('chrome-extension-' + chrome.version + '.zip'))
    .pipe(gulp.dest('./dist/chrome'));
});

gulp.task('default', function(cb) {
    return rseq('clean', ['chrome'], cb);
});

gulp.task('watch', function() {
  gulp.watch(['./js/**/*', './css/**/*', './vendor/**/*', './images/**/*'], ['default']);
});
