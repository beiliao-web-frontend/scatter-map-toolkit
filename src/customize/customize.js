const $ = require('./module/dom.js');
const Uploader = require('./module/uploader.js');
const Canvas = require('./module/canvas.js');
const Group = require('./module/group.js');
const GroupItem = require('./module/group-item.js');
const Area = require('./module/area.js');

;(function(win, doc) {
	
	const uploader = new Uploader('#upload-file');
	const canvas = new Canvas('#canvas');

	const $main = $('#main');
	const $index = $('#index');
	const $uploadImg = $('#upload-img');
	const $uploadOption = $('#upload-option');
	const $zoomIn = $('#zoom-in');
	const $zoomOut = $('#zoom-out');
	const $replaceImg = $('#replace-img');

	$index.on('animationend', function() {
		$index.remove();
	});

	$uploadImg.on('click', function() {
		uploader.open({
			name: '图片',
			accept: 'image/*'
		}).success((data) => {
			canvas.setImage(data);
			$index.addClass('hide');
		});
	});

	$zoomIn.on('click', function() {
		canvas.zoomIn();
	});

	$zoomOut.on('click', function() {
		canvas.zoomOut();
	});

	$replaceImg.on('click', function() {
		uploader.open({
			name: '图片',
			accept: 'image/*'
		}).success((data) => {
			canvas.setImage(data);
		});
	});

	console.log(new GroupItem('测试'));

})(window, document);