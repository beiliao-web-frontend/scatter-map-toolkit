const gulp = require('gulp');
const pump = require('pump');                       // 处理错误
const cleanCss = require('gulp-clean-css');         // css压缩
const sass = require('gulp-sass');                  // sass编译
const autoprefixer = require('gulp-autoprefixer');  // 自动补充前缀
const changed = require('gulp-changed');            // 文件是否改变

const srcPath = './../src/example';
const destPath = './../example';

module.exports = () => {
	return pump([
		gulp.src(`${ srcPath }/**/*.scss`),
		changed(`${ destPath }/**/*.css`),
		sass().on('error', sass.logError),
		autoprefixer({
			browsers: ['last 2 versions']
		}),
		cleanCss({
			conpatibility: 'ie8'
		}),
		gulp.dest(destPath)
	]);
};