const gulp = require('gulp');
const type = require('minimist')(process.argv.slice(2)).type;
const tasks = require('require-dir')('./tasks', {
	recurse: true,
	filter(fullPath) {
		// 如果是非开发环境则过滤掉watch的task
		return type === 'dev' || !/watch\.js$/.test(fullPath);
	}
});

let taskNames = [];

(function install(taskObj, parent = '') {

	for (let taskName in taskObj) {
		let taskItem = taskObj[taskName];
		let taskFullName = parent + taskName;

		if (typeof taskItem === 'function') {
			taskNames.push(taskFullName);
			gulp.task(taskFullName, taskItem);
		} else {
			install(taskItem, `${ taskFullName }/`);
		}
	}

})(tasks);

gulp.task('default', taskNames);