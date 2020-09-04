// я расставила все в более понятном порядке, таск билда перенесла вниз, чтобы было читаемо
// 1. первый таск clean, в нем мы (если папка билд уже собрана, очищаем ее, чтобы следующая
// сборка была правильной, без наслаивания файлов друг на друга) - все верно у тебя
// 2. в copy я удалила строку с копированием файла html, так как нам не нужен старый файл html,
// мы добавили новый таск для html
// 3. таск server, baseDir: 'source' - заменила на build, так как проект открывается уже из папки build
// папка source - рабочая, в ней мы все меняем, следим за ее изменениями, команда npx gulp build выполняет все
// таски из этого файла, берет все файлы из source и компилит в build, а npx start - берет таск build, то есть выполняет
// все аналогичное + запускает сервер и вотчер, который следит за изменениями и сервер перезагружает
// 4. в вотчере строку gulp.watch("source/*.html").on("change", sync.reload); заменила. так как
// теперь есть отдельный таск для html, который как раз обновляет html после каждого его изменения
// 5. внутри build убрала кавычки + добавила последним таск html
// 6. exports.default = gulp.series(
//   build, server, watcher
// ) это как раз npm start - то есть мы запускаем build сервер и вотчер

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();
const del = require("del");

// Clean
const clean = () => {
  return del("build");
}

exports.clean = clean;

// Copy
const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/js/**",
    "source/*.ico",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

// HTML
const html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("./build"))
    .pipe(sync.stream());
}
exports.html = html;

// svg sprite
const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// webp
const webp2 = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.webp2 = webp2;

// images
const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
}
exports.images = images;


// Styles
const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
}

// build
const build = gulp.series(
  clean, copy, styles, webp2, sprite, images, html
);

exports.build = build;

exports.default = gulp.series(
  build, server, watcher
)
