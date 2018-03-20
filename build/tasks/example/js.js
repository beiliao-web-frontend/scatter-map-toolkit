const gulp = require('gulp');
const pump = require('pump');                       // 处理错误
const uglify = require('gulp-uglify');              // js压缩
const babel = require('gulp-babel');                // ES6转换
const sourcemaps = require('gulp-sourcemaps');      // sourcemaps，以便调试
const browserify = require('browserify');           // 模块化打包
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const eslint = require('gulp-eslint');
const config = require('./../../../.eslintrc.js');

const srcPath = './../src/example';
const destPath = './../example';

module.exports = () => {

	const b = browserify({
		entries: `${ srcPath }/index.js`,
		debug: true
	});

	return pump([
		eslint(config),
		eslint.formatEach('compact', process.stderr),
		b.bundle((err) => {
			if (err) {
				throw err; // 抛出异常
			}
		}), // 创建文件流
		source('index.js'), // 生成出来的文件
		buffer(), // 由于gulp不支持stream，这里把流转成buffer
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
		gulp.dest(destPath)
	]);
};