const { src, dest, watch, parallel } = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// Javascripts
const terser = require("gulp-terser-js");

const direcciones = [
  "src/scss/**/*.scss",
  "src/img/**/*.{png,jpg,jpeg}",
  "src/js/**/*.js",
];

function css(done) {
  src(direcciones[0]) // identificar el archivo sass
    .pipe(sourcemaps.init())
    .pipe(plumber()) // En caso de errores no detiene el archivo sass
    .pipe(sass()) // compilarlo
    .pipe(postcss([autoprefixer(), cssnano()])) //
    .pipe(sourcemaps.write(".")) //
    .pipe(dest("build/css")); // guardarlo en disco duro

  done(); // Callback que avisa a gulp cuando llegamos al final
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3,
  };
  src(direcciones[1])
    .pipe(cache(imagemin(opciones)))
    .pipe(dest("build/img"));
  done(); // Callback que avisa a gulp cuando
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src(direcciones[1]).pipe(webp(opciones)).pipe(dest("build/img"));
  done(); // Callback
}

function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src(direcciones[1]).pipe(avif(opciones)).pipe(dest("build/img"));
  done(); // Callback
}

function javascript(done) {
  src(direcciones[2])
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/js"));
  done(); // Callback
}

function dev(done) {
  watch(direcciones[0], css);
  watch(direcciones[2], javascript);
  done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
