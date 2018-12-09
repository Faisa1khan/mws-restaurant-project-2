var gulp = require('gulp');
var webp = require('gulp-webp');
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
/*var uglify = require('gulp-uglify-es').default;*/
var rename = require('gulp-rename');

var gulpSequence = require('gulp-sequence');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var minifyInline = require('gulp-minify-inline');
var gzip = require('gulp-gzip');
var gzipStatic = require('connect-gzip-static');
var workboxBuild = require('workbox-build');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var jsSrcMainList = ['js/idb.js', 'js/register.js', 'js/dbhelper.js', 'js/main.js' ];
var jsSrcRestaurantList = ['js/dbhelper.js', 'js/restaurant_info.js'];

// ===================== Default Task =====================
gulp.task('default', ['prod:serve']);

// ===================== Build & Serve Production Build =====================
gulp.task('prod:serve', gulpSequence('build', 'serve', 'pwa-service-worker'));

// ===================== Production Build =====================
gulp.task('build', gulpSequence('clean', 'js-babel','js-minify-idb','js-minify-main','js-minify-restro', 'html:prod', 'styles:prod','gzip:prod', 'copy:prod'));

// Copy app contents to dist directory
gulp.task('copy:prod', function () {
    return gulp.src(['!node_modules/**', '**/*.{png,jpg}', 'sw.js', 'manifest.json', '!gulpfile.js'])
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
      swSrc: 'js/sw.js',
      swDest: 'dist/sw.js',
      globDirectory: 'dist',
      globPatterns: [
        "**/*.{html,gz,css,png,jpg,js,json}"
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

/*
gulp.task('scripts:prod', function () {
    gulp.src('js/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js'));
    });
*/

    // http://babeljs.io/docs/setup/#installation
// https://babeljs.io/docs/usage/babelrc/
// https://github.com/babel/gulp-babel
gulp.task('js-babel', function () {
    // return gulp.src('app/js/**/*.js')
    return gulp.src([
      'js/dbhelper.js', 'js/app.js', 'js/restaurant_info.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(babel())
      // .pipe(concat('app.min.js'))
      // .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/js'));
  });
  
  gulp.task('js-minify-idb', function () {
    return gulp.src([
      'js/idb-promised.js', 'js/idb.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('idb-bundle.min.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/js'));
  });
  
  gulp.task('js-minify-main', function () {
    return gulp.src([
      'js/dbhelper.js', 'js/main.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('main-bundle.min.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/js'));
  });
  
  gulp.task('js-minify-resto', function () {
    return gulp.src([
      'js/dbhelper.js', 'js/restaurant_info.js'
      ])
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('resto-bundle.min.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/js'));
  });
  


// ===================== Gzip Build =====================
gulp.task('gzip:prod', gulpSequence('gzip-html', 'gzip-css', 'gzip-js'));

gulp.task('gzip-html', function () {
    gulp.src('./dist/**/*.html')
        .pipe(gzip())
        .pipe(gulp.dest('./dist'));
});

gulp.task('gzip-css', function () {
    gulp.src('./dist/css/**/*.min.css')
        .pipe(gzip())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('gzip-js', function () {
    gulp.src('./dist/js/**/*.js')
        .pipe(gzip())
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('serve', function () {
    connect.server({
        root: "dist/index.html",
        port: 9007,
        middleware: function () {
            return [
                gzipStatic(__dirname, {
                    maxAge: 31536000000
                })
            ]
        }
    });
});







