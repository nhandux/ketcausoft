const gulp = require('gulp');
const useref = require('gulp-useref');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const htmlhint = require("gulp-htmlhint");
const image = require('gulp-image');
const eslint = require('gulp-eslint');

const browserSync = require('browser-sync').create();
gulp.sources = {
    src: './src',
    dist: './dist'
};

// Start server dev
gulp.task('connect:dev', () => {
    connect.server({
        root: [gulp.sources.dist, './'],
        livereload: true,
        port: 9000,
        host: '0.0.0.0',
        fallback: gulp.sources.dist + '/index.html'
    });
});

// Sync with browser
gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: '127.0.0.1:9000'
    });
});

// File include 
gulp.task('file_include', () => {
    return gulp.src([gulp.sources.src + '/views/*.*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(gulp.sources.dist))
        .pipe(connect.reload());
});

// Watch
gulp.task('stream', () => {
    gulp.watch(gulp.sources.src + '/views/**/*.html', gulp.series('file_include'));
    gulp.watch(gulp.sources.src + '/components/**/*.html', gulp.series('file_include'));
    gulp.watch(gulp.sources.src + '/assets/images/**/*.*', gulp.series('build_images'));
    gulp.watch(gulp.sources.src + '/assets/styles/**/*.scss', gulp.series('sass'));
    gulp.watch(gulp.sources.src + '/assets/js/**/*.js', gulp.series('scripts'));
});

// Minify CSS, JS
gulp.task('minify', () => {
    return gulp.src(gulp.sources.src + '/*.*')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({
            keepSpecialComments: 0,
            compatibility: 'ie8'
        })))
        .pipe(gulp.dest(gulp.sources.dist));
});

// Copy fonts
gulp.task('build_fonts', () => {
    return gulp.src(gulp.sources.src + '/assets/fonts/**/*')
        .pipe(gulp.dest(gulp.sources.dist + '/assets/fonts'));
});

// Copy images
gulp.task('build_images', function () {
    gulp.src(gulp.sources.src + 'assets/images/**/*')
        .pipe(image())
        .pipe(gulp.dest(gulp.sources.dist + '/assets/images'));
});

// HTML beautify
gulp.task('prettify', gulp.parallel('build_fonts', function () {
    return gulp.src([gulp.sources.dist + '/*.html'])
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 4
        }))
        .pipe(gulp.dest(gulp.sources.dist));
}));

//Scripts
gulp.task('scripts', function () {
    return gulp.src(
        [
            'node_modules/babel-polyfill/dist/polyfill.js',
            gulp.sources.src + '/assets/js/*.js'
        ])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(gulp.sources.dist + '/assets/js'))
});

// Sass
gulp.task('sass', gulp.series(function () {
    return gulp.src(gulp.sources.src + '/assets/styles/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(gulp.sources.dist + '/assets/styles'))
        .pipe(connect.reload());
}));

// Include HTML
gulp.task('htmlhint', gulp.series('file_include', function () {
    return gulp.src(gulp.sources.src + '/*.html')
        .pipe(htmlhint())
        .pipe(htmlhint.failReporter())
        .pipe(connect.reload());
}));

// Default format eslint
gulp.task('default', () => {
    return src([gulp.sources.src + 'assets/js/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Start development server
gulp.task('run:dev', gulp.parallel([
    'connect:dev',
    'minify',
    'stream',
    'sass',
    'htmlhint',
    'scripts',
    'file_include',
    'build_fonts',
    'build_images'
],
    'browser-sync', () => {
        console.log('Development version is running...');
    })
);
