const $ = require('./module/dom.js');
const Uploader = require('./module/uploader.js');
const Canvas = require('./module/canvas.js');
const GroupList = require('./module/group-list.js');
const GroupItem = require('./module/group-item.js');

(function() {

	const $uploader = new Uploader('#upload-file');
	const $groupList = new GroupList('#group');
	const $canvas = new Canvas('#canvas');

	// const $main = $('#main');

	/* 索引页 */
	const $index = $('#index');
	const $uploadImg = $('#upload-img');
	// const $uploadOption = $('#upload-option');

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

	/* 画布操作 */
	const $zoomIn = $('#zoom-in');
	const $zoomOut = $('#zoom-out');
	const $replaceImg = $('#replace-img');

	$canvas.bind($groupList);

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

	/* 分组操作 */
	const $addGroup = $('#add-group');
	const $search = $('#search');
	const $current = $('#current');

	$groupList.bind($canvas);

	$groupList.on('activeChange', ($item) => {
		$current.text($item.getName());
	});

	$addGroup.on('click', () => {
		$groupList.append(new GroupItem());
	}).click();

	$search.on('input', () => {
		$groupList.children.forEach(($child) => {
			if ($child.getName().indexOf($search.value()) === -1) {
				$child.getElement().show();
			} else {
				$child.getElement().hide();
			}
		});
	});

})();