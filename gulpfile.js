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

        var assets = gulp.src(['*.html', 'images/**/*', 'css/**/*', '_locales/**/*'], {base:"."})
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
        gulp.src('./build/' + browser + '/**/*')
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

gulp.task('assets', ['assets-firefox', 'assets-chrome', 'assets-opera']);
gulp.task('assets-firefox', assets('firefox'));
gulp.task('assets-chrome', assets('chrome'));
gulp.task('assets-opera', assets('opera'));

gulp.task('manifest-firefox', manifest('firefox'));
gulp.task('manifest-chrome', manifest('chrome'));
gulp.task('manifest-opera', manifest('opera'));

gulp.task('build', ['build-firefox', 'build-chrome', 'build-opera']);
gulp.task('build-firefox', ['lint', 'assets-firefox', 'manifest-firefox'], build('firefox', false));
gulp.task('build-chrome', ['lint', 'assets-chrome', 'manifest-chrome'], build('chrome', false));
gulp.task('build-opera', ['lint', 'assets-opera', 'manifest-opera'], build('opera', false));

gulp.task('watch', ['watch-firefox', 'watch-chrome', 'watch-opera']);
gulp.task('watch-firefox', ['assets-firefox', 'manifest-firefox'], build('firefox', true));
gulp.task('watch-chrome', ['assets-chrome', 'manifest-chrome'], build('chrome', true));
gulp.task('watch-opera', ['assets-opera', 'manifest-opera'], build('opera', true));

gulp.task('dist', ['dist-firefox', 'dist-chrome', 'dist-opera']);
gulp.task('dist-firefox', ['build-firefox'], dist('firefox'));
gulp.task('dist-chrome', ['build-chrome'], dist('chrome'));
gulp.task('dist-opera', ['build-opera'], dist('opera'));
