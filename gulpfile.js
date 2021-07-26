'use strict'

import gulp from 'gulp';
import browsersync from 'browser-sync';
import del from 'del';
import autoprefixer from 'gulp-autoprefixer';
import beautify from 'gulp-beautify-code';
import cleanCSS from 'gulp-clean-css';
import fileinclude from 'gulp-file-include';
import media from 'gulp-group-css-media-queries';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import rsync from 'gulp-rsync';
import scss from 'gulp-sass';
import svgSprite from 'gulp-svg-sprite';
import minSVG from 'gulp-svgmin';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
import cleanJS from 'gulp-uglify-es';
import webp from 'gulp-webp';
import webphtml from 'gulp-webp-html';
import webpcss from 'gulp-webpcss';

// Path

const source_folder  = "src";
const project_folder = "build";
const path = {
	src: {
		html: [
			source_folder + "/*.html",
			"!" + source_folder + "/_*.html"
		],
		css: source_folder + "/scss/style.scss",
		js:  source_folder + "/js/main.js",
		img: [
			source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
			"!" + source_folder + "/img/icons/_svgsprite/*.svg",
			"!" + source_folder + "/img/favicon/**/*"
		],
		favicon: source_folder + "/img/favicon/**/*",
		fonts: source_folder + "/fonts/**/*.ttf"
	},
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		favicon: project_folder + "/img/favicon/",
		fonts: project_folder + "/fonts/"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
	},
	clean: "./" + project_folder + "/"
};

// HTML

export const html = () => {
	return gulp.src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(beautify({
			indent_size: 1,
			indent_char: '	',
			end_with_newline: true
		}))
		.pipe(gulp.dest(path.build.html))
		.pipe(browsersync.stream());
};

// CSS

export const css = () => {
	return gulp.src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(media())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 5 version'],
				cascade: true
			})
		)
		.pipe(webpcss({
			webpClass: ".webp",
			noWebpClass: ".no-webp"
		}))
		.pipe(beautify({
			indent_size: 1,
			indent_char: '	',
			end_with_newline: true
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(gulp.dest(path.build.css))
		.pipe(browsersync.stream());
};

// JS

export const js = () => {
	return gulp.src(path.src.js)
		.pipe(fileinclude())
		.pipe(beautify({
			indent_size: 1,
			indent_char: '	',
			end_with_newline: true
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(cleanJS.default())
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(gulp.dest(path.build.js))
		.pipe(browsersync.stream());
};

// Images

export const images = () => {
	return gulp.src(path.src.img)
	.pipe(
		webp({
			quality: 90
		})
	)
	.pipe(gulp.dest(path.build.img))
	.pipe(gulp.src(path.src.img))
	.pipe(
		imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.mozjpeg({quality: 85, progressive: true}),
			imagemin.svgo({
				plugins: [
					{cleanupIDs: false},
					{removeViewBox: false}
				]
			})
		])
	)
	.pipe(gulp.dest(path.build.img))
	.pipe(browsersync.stream());
};

// Favicon

export const favicon = (cb) => {
	gulp.src(path.src.favicon)
	.pipe(
		imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: false}
				]
			})
		])
	)
		.pipe(gulp.dest(path.build.favicon));
	cb();
};

// Fonts

export const fonts = () => {
	gulp.src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(gulp.dest(path.build.fonts));
	return gulp.src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(gulp.dest(path.build.fonts));
};

// Browser sync

export const browserSync = () => {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
};

// Watch

export const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
};

// Delete build

export const clean = () => {
	return del(path.clean);
};

// SVG sprite (manual start)

export const svgsprite = () => {
	return gulp.src([source_folder + '/img/icons/_svgsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../_svgsprite.html"
				}
			},
		}))
		.pipe(
			imagemin([
				imagemin.svgo({
					plugins: [
						{cleanupIDs: false},
						{removeViewBox: false},
						{removeStyleElement: true},
						{removeAttrs: {attrs: ['stroke', 'data-name', 'fill-rule', 'fill']}}
					]
				})
			])
			)
		.pipe(minSVG({
			plugins: [{
				cleanupIDs: false,
				removeViewBox: false
			}],
			js2svg: {
				pretty: true
			}
		}))
		.pipe(beautify({
			indent_size: 1,
			indent_char: '	',
			end_with_newline: true
		}))
		.pipe(gulp.dest([source_folder + '/']));
};

// Deploy

export const deploy = () => {
	return gulp.src('build/**')
		.pipe(rsync({
		root: 'build/',
		hostname: 'hosting',
		destination: 'public_html/projects.gosxrgxx.com/test-solar-digital/',
		incremental: true,
		exclude: ['**/Thumbs.db', '**/*.DS_Store', '*.css', '*.js'],
		include: ['*.min.css', '*.min.js'],
		recursive: true,
		clean: true,
		}));
};

// Build

export const build = gulp.series(
	clean,
	gulp.parallel(
		html,
		css,
		js,
		images,
		favicon,
		fonts
	)
);

// Default

export default gulp.parallel(
	build,
	watchFiles,
	browserSync
);
