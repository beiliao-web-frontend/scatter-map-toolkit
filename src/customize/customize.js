const $ = require('./module/dom.js');
const Uploader = require('./module/uploader.js');
const Canvas = require('./module/canvas.js');
const Group = require('./module/group.js');
const GroupItem = require('./module/group-item.js');
const Area = require('./module/area.js');

;(function(win, doc) {
	
	const $uploader = new Uploader('#upload-file');
	const $canvas = new Canvas('#canvas');
	const $group = new Group('#group')

	const $main = $('#main');
	const $index = $('#index');
	const $uploadImg = $('#upload-img');
	const $uploadOption = $('#upload-option');
	const $zoomIn = $('#zoom-in');
	const $zoomOut = $('#zoom-out');
	const $replaceImg = $('#replace-img');
	const $addGroup = $('#add-group');
	const $search = $('#search');
	const $current = $('#current');

	$canvas.setGroup($group);
	$group.setCanvas($canvas);

	$group.on('activeChange', ($groupItem) => {
		$current.text($groupItem.getName());
	});

	$index.on('animationend', () => $index.remove());

	$uploadImg.on('click', () => {
		$uploader.open({
			name: '图片',
			accept: 'image/*'
		}).on('success', (data) => {
			$canvas.setImage(data);
			$index.addClass('hide');
		});
	});

	$zoomIn.on('click', () => $canvas.zoomIn());

	$zoomOut.on('click', () => $canvas.zoomOut());

	$replaceImg.on('click', () => {
		$uploader.open({
			name: '图片',
			accept: 'image/*'
		}).on('success', (data) => {
			$canvas.setImage(data);
		});
	});

	$addGroup.on('click', () => {
		$group.append(new GroupItem());
	}).click();

	$search.on('input', (e) => {
		$group.getChildren().forEach(($child) => {
			if ($child.getName().indexOf($search.value()) === -1) {
				$child.getElement().addClass('hidden');
			} else {
				$child.getElement().removeClass('hidden');
			}
		});
	});

})(window, document);