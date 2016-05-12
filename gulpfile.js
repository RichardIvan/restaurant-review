var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var proxyMiddleware = require('http-proxy-middleware');

var proxy = proxyMiddleware('/data', {target: 'http://localhost:9003'});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('./app/js/*js')
        .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('html', function () {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('./app/dist/'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['html', 'js'], function () {

    // Serve files from the root of thisgulp  project
    browserSync.init({
        server: {
            baseDir: "./app/dist/",
            middleware: [proxy]
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("./app/js/*.js", ['js-watch']).on('change', browserSync.reload);
});