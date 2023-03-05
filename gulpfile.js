'use strict';

var gulp       = require('gulp');
var lint       = require('gulp-eslint');
var merge      = require('merge-stream');
var merge_json = require('gulp-merge-json');
var webpack    = require('webpack-stream');
var zip        = require('gulp-zip');

function assets(browser) {
    return function() {
        var bootstrap = gulp.src('node_modules/chrome-bootstrap/chrome-bootstrap.css')
            .pipe(gulp.dest('./build/' + browser + '/css'));

        var assets = gulp.src(['*.html', 'icons/**/*', 'css/**/*', '_locales/**/*'], {base:"."})
            .pipe(gulp.dest('./build/' + browser));

        return merge(assets, bootstrap);
    }
}

function manifest(browser) {
    return function() {
        return gulp.src(['./vendor/common/manifest.json', './vendor/' + browser + '/manifest.json'])
            .pipe(merge_json('manifest.json'))
            .pipe(gulp.dest('./build/' + browser));
    }
}

function build(browser, watch) {
    return function() {
        var streams = ['option', 'extension', 'popin'].map(function(file) {
            return gulp.src('js/' + file + '.js')
                   .pipe(webpack({
                       watch: watch,
                       output: { filename: file + '.js' }
                   }))
                   .on('error', function handleError() {
                       this.emit('end'); // Recover from errors
                   })
                   .pipe(gulp.dest('./build/' + browser + '/js'));
        });

        return merge(streams[0], streams[1], streams[2]);
    }
}

function dist(browser) {
    return function() {
        var m = require('./build/' + browser + '/manifest');
        var ext = browser == 'firefox' ? 'xpi' : 'zip';
        return gulp.src('./build/' + browser + '/**/*')
            .pipe(zip(browser + '-multipass-' + m.version + '.' + ext))
            .pipe(gulp.dest('./dist'));
    }
}

gulp.task('lint', function() {
    return gulp.src(['js/**.js', 'vendor/**.js'])
        .pipe(lint())
        .pipe(lint.format())
        .pipe(lint.failAfterError());
});

gulp.task('assets-firefox', gulp.series(assets('firefox')));
gulp.task('assets-chrome', gulp.series(assets('chrome')));
gulp.task('assets-opera', gulp.series(assets('opera')));

gulp.task('manifest-firefox', gulp.series(manifest('firefox')));
gulp.task('manifest-chrome', gulp.series(manifest('chrome')));
gulp.task('manifest-opera', gulp.series(manifest('opera')));

gulp.task('build-firefox', gulp.series('lint', 'assets-firefox', 'manifest-firefox', build('firefox', false)));
gulp.task('build-chrome', gulp.series('lint', 'assets-chrome', 'manifest-chrome', build('chrome', false)));
gulp.task('build-opera', gulp.series('lint', 'assets-opera', 'manifest-opera', build('opera', false)));
gulp.task('build', gulp.series('build-firefox', 'build-chrome', 'build-opera'));

gulp.task('watch-firefox', gulp.series('assets-firefox', 'manifest-firefox', build('firefox', true)));
gulp.task('watch-chrome', gulp.series('assets-chrome', 'manifest-chrome', build('chrome', true)));
gulp.task('watch-opera', gulp.series('assets-opera', 'manifest-opera', build('opera', true)));
gulp.task('watch', gulp.series('watch-firefox', 'watch-chrome', 'watch-opera'));

gulp.task('dist-firefox', gulp.series('build-firefox', dist('firefox')));
gulp.task('dist-chrome', gulp.series('build-chrome', dist('chrome')));
gulp.task('dist-opera', gulp.series('build-opera', dist('opera')));
gulp.task('dist', gulp.series('dist-firefox', 'dist-chrome', 'dist-opera'));
