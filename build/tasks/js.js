const gulp = require('gulp');
const pump = require('pump');                       // 处理错误
const changed = require('gulp-changed');            // 文件是否改变
const uglify = require('gulp-uglify');              // js压缩  
const babel = require('gulp-babel');                // ES6转换
const sourcemaps = require('gulp-sourcemaps');      // sourcemaps，以便调试
const filter = require('gulp-filter');              // 文件过滤

module.exports = (cb) => {
	// 压缩过的文件不做处理
	const minFilter = filter((f) => {
		return !/\.min\.js$/.test(f.path);
	}, {restore: true});

	const stream = [
		gulp.src('./../src/**/*.js'),
		minFilter,
		changed('./../dist/**/*.js'),
		sourcemaps.init(),
		babel({
			presets: [
				['env', { modules: false }],
				'stage-2'
			]
		}),
		uglify({ ie8: true }),
		sourcemaps.write('.'),
		minFilter.restore,
		gulp.dest('./../dist')
	];

	pump(stream, cb);
};