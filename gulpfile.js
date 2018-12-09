var gulp = require('gulp');
var webp = require('gulp-webp');
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');

var gulpSequence = require('gulp-sequence');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var minifyInline = require('gulp-minify-inline');

var gzipStatic = require('connect-gzip-static');
var workboxBuild = require('workbox-build');
var browserSync = require('browser-sync').create();




// ===================== Default Task =====================
gulp.task('default', ['prod:serve']);

// ===================== Build & Serve Production Build =====================
gulp.task('prod:serve', gulpSequence('build'));

// ===================== Production Build =====================
gulp.task('build', gulpSequence('clean', 'scripts:prod', 'html:prod', 'styles:prod','copy:prod','webp:prod','pwa-service-worker'));

// Copy app contents to dist directory
gulp.task('copy:prod', function () {
    return gulp.src(['!node_modules/**', '**/*.{png,jpeg}', 'sw.js', 'manifest.json', '!gulpfile.js'])
        .pipe(gulp.dest('./dist'));
});

// ===================== Clean Build =====================
gulp.task('clean', function () {
    return gulp.src('./dist', {
            read: false
        })
        .pipe(clean());
});



/*
 * Progressive Web Apps
 * - pwa-service-worker
 * - pwa-manifest-copy2build
 */

// Create a service worker in build.
gulp.task('pwa-service-worker', () => {
    return workboxBuild.injectManifest({
      swSrc: 'src/js/sw.js',
      swDest: 'dist/sw.js',
      globDirectory: 'dist',
      globPatterns: [
        '**\/*.{html,css,js}',
         'manifest.json'
      ],
      globIgnores: [
        'workbox-config.js',
        'node_modules/**/*'
      ]
    }).then(({count, size, warnings}) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(
        `[INFO] ${count} files will be precached, totaling ${size} bytes.`);
    }).catch(err => {
      console.log('[ERROR] ' + err);
    });
  });
  

// ===================== Minify HTML =====================
gulp.task('html:prod', function () {
    return gulp.src(['!node_modules/**', '**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(minifyInline())
        .pipe(gulp.dest('./dist'));
});

// ===================== WebP Image Conversion =====================
gulp.task('webp:prod', function () {
    gulp.src('img/*.jpg')
        .pipe(webp({
            method: 6
        }))
        .pipe(gulp.dest('./dist/img/webp'));
});

// ===================== Styles =====================
gulp.task('styles:prod', function () {
    gulp.src('css/styles.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

// ===================== Scripts =====================


gulp.task('scripts:prod', function () {
    gulp.src('js/**.js')
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js'));
    });

    


  
    







