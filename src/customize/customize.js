const $ = require('./module/dom.js');
const Uploader = require('./module/uploader.js');
const Canvas = require('./module/canvas.js');
const GroupList = require('./module/group-list.js');
const GroupItem = require('./module/group-item.js');

(function() {

	const $uploader = new Uploader('#upload-file');
	const $groupList = new GroupList('#group');
	const $canvas = new Canvas('#canvas', '#container');


	/* 索引页 */
	const $index = $('#index');
	const $uploadImg = $('#upload-img');
	// const $uploadOption = $('#upload-option');

	$index.on('animationend', () => $index.remove());

	$uploadImg.on('click', () => {
		$uploader.open({
			name: '图片',
			accept: 'image/*'
		}).success((data) => {
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
		}).success((data) => {
			$canvas.setImage(data);
		});
	});


	/* 分组操作 */
	const $addGroup = $('#add-group');
	const $search = $('#search');
	const $current = $('#current');

	$groupList.on('current', ($group) => {
		$current.text($group.name);
	}, true, false);

	$addGroup.on('click', () => {
		$groupList.append(new GroupItem());
	}).click();

	$search.on('input', () => {
		$groupList.$groups.forEach(($group) => {
			if ($group.name.indexOf($search.value()) !== -1) {
				$group.show();
			} else {
				$group.hide();
			}
		});
	});


	/* 标签页切换 */
	const $tabs = $('#tabs');

	$tabs.find('.tab-item').on('click', function() {
		$('#' + this.attr('data-type'))
			.show()
			.siblings()
			.hide();

		this
			.addClass('active')
			.siblings()
			.removeClass('active');
	});


	/* 尺寸 */
	const $size = $('#size');
	const $sizeWidth = $('#sizeWidth');
	const $sizeHeight = $('#sizeHeight');
	const $sizeInput = $sizeWidth.concat($sizeHeight);

	$size.on('change', () => {
		if ($size.data('checked', undefined, true)) {
			$sizeInput.removeAttr('disabled');
		} else {
			$canvas.init();
			$sizeInput.attr('disabled', 'disabled');
		}
	});

	$sizeWidth.on('blur', () => {
		let value = $sizeWidth.value();
		if (/^\d+$/.test(value)) {
			$sizeWidth.data('value', value);
			$canvas.imgWidth = parseFloat(value);
			$canvas.update();
		} else {
			$sizeWidth.value($sizeWidth.data('value'));
		}
	});

	$sizeHeight.on('blur', () => {
		let value = $sizeHeight.value();
		if (/^\d+$/.test(value)) {
			$sizeHeight.data('value', value);
			$canvas.imgHeight = parseFloat(value);
			$canvas.update();
		} else {
			$sizeHeight.value($sizeHeight.data('value'));
		}
	});

	$canvas.ready(() => {
		$sizeWidth.value($canvas.imgWidth).data('value', $canvas.imgWidth);
		$sizeHeight.value($canvas.imgHeight).data('value', $canvas.imgHeight);
	});

})();