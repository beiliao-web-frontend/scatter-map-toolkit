const gulp = require('gulp');
const pump = require('pump');                       // 处理错误
const uglify = require('gulp-uglify');              // js压缩
const babel = require('gulp-babel');                // ES6转换
const sourcemaps = require('gulp-sourcemaps');      // sourcemaps，以便调试
const rename = require('gulp-rename');

const srcPath = './../src';
const destPath = './../dist';

module.exports = () => {

	return pump([
		gulp.src(`${ srcPath }/scatter-map.js`),
		gulp.dest(destPath),
		sourcemaps.init({
			loadMaps: true
		}),
		babel({
			presets: [
				['env', { modules: false }],
				'stage-2'
			]
		}),
		uglify({ ie8: true }),
		sourcemaps.write('.'),
		rename({ extname: '.min.js' }),
		gulp.dest(destPath)
	]);
};