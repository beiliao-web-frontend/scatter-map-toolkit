const $ = require('./module/dom.js');
const base64 = require('./lib/base64.js');
const toast = require('./module/toast.js');
const popup = require('./module/popup.js');
const ajax = require('./module/ajax.js');
const Uploader = require('./module/uploader.js');
const Canvas = require('./module/canvas.js');
const GroupList = require('./module/group-list.js');
const GroupItem = require('./module/group-item.js');
const Area = require('./module/area.js');

(function() {

	const $uploader = new Uploader('#upload-file');
	const $groupList = new GroupList('#group');
	const $canvas = new Canvas('#canvas', '#container');


	/* 尺寸 */
	const $size = $('#size');
	const $sizeWidth = $('#sizeWidth');
	const $sizeHeight = $('#sizeHeight');
	const $sizeInput = $sizeWidth.concat($sizeHeight);


	/* 索引页 */
	const $index = $('#index');
	const $uploadImg = $('#upload-img');
	const $uploadOption = $('#upload-option');

	function loadData(data) {
		for (let name in data) {
			let item = data[name];
			let $group = new GroupItem();

			item.areas.forEach((area) => {
				let $area = new Area();
				$area
					.data(area)
					.addClass('hover')
					.css({
						top: area.y1,
						left: area.x1,
						width: parseFloat(area.x2) - parseFloat(area.x1) + '%',
						height: parseFloat(area.y2) - parseFloat(area.y1) + '%'
					});
				$group.append($area);
				$canvas.append($area);
			});

			$group.name = name;
			$group.isShow = item.isShow;

			$groupList.append($group);
		}

		if ($groupList.$groups.size() === 0) {
			$groupList.append(new GroupItem());
		}

	}

	function loadSetting(setting) {
		if (setting.resize) {
			$size.data('checked', true, true);
			let flag = true;
			$canvas.ready(() => {
				if (flag) {
					$sizeWidth.value(setting.width).data('value', setting.width);
					$sizeHeight.value(setting.height).data('value', setting.height);
					$sizeInput.removeAttr('disabled');
					$canvas.imgHeight = setting.height;
					$canvas.imgWidth = setting.width;
					flag = false;
				} else {
					$sizeWidth.value($canvas.imgWidth).data('value', $canvas.imgWidth);
					$sizeHeight.value($canvas.imgHeight).data('value', $canvas.imgHeight);
				}
				$canvas.update();
			});
		}
	}

	function loadOption(isRequire = false, cb) {
		$uploader.open({
			name: '配置文件',
			accept: 'text/json'
		}).success((data) => {
			let options = base64.decode(data.replace('data:;base64,', ''));
			try {
				options = JSON.parse(options);
			} catch (e) {
				toast('配置文件解析出错', 'error');
				throw new Error('配置文件解析出错');
			}

			if (isRequire === true && !options.image) {
				popup({
					content: '当前配置文件缺少图片<br />是否上传图片',
					confirmText: '是',
					cancelText: '否',
					confirm() {
						$uploader.open({
							name: '图片',
							accept: 'image/*'
						}).success((data) => {

							if (typeof cb === 'function') {
								cb(data);
							}

							loadData(options.data);
							loadSetting(options.setting);

						});
					},
					cancel() {
						toast('加载数据失败，请先上传图片', 'error');
					}
				});
			} else {

				if (typeof cb === 'function') {
					cb(options.image);
				}

				loadData(options.data);
				loadSetting(options.setting);

			}
		});
	}

	function getOptions($groupList, type) {

		let params = {};

		if ($size.data('checked', undefined, true)) {
			params.resize = true;
			params.width = $canvas.imgWidth;
			params.height = $canvas.imgHeight;
		}

		let result = {};
		$groupList.$groups.forEach(($group) => {
			result[$group.name] = {
				isShow: $group.isShow,
				areas: $group.$areas.map((area) => {
					let $area = $(area);
					return {
						x1: $area.data('x1'),
						x2: $area.data('x2'),
						y1: $area.data('y1'),
						y2: $area.data('y2')
					};
				})
			};
		});

		let image = $canvas.getImage();

		if (!/^http(s)?:\/\//.test(image) && type === 'download') {
			image = '';
		}

		return {
			image,
			data: result,
			setting: params
		};
	}

	$index.on('animationend', () => $index.remove());

	$uploadImg.on('click', () => {
		$uploader.open({
			name: '图片',
			accept: 'image/*'
		}).success((data) => {
			$canvas.setImage(data, () => {
				$index.addClass('hide');
				$groupList.append(new GroupItem());
				toast('加载成功', 'success');
			});
		});
	});

	$uploadOption.on('click', () => loadOption(true, (img) => {
		$canvas.setImage(img, () => {
			$index.addClass('hide');
			toast('加载成功', 'success');
		});
	}));

	/* 画布操作 */
	const $zoomIn = $('#zoom-in');
	const $zoomOut = $('#zoom-out');
	const $replaceImg = $('#replace-img');
	const $preview = $('#preview');

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

	$preview.on('click', () => {
		ajax('/save?type=example', {
			method: 'POST',
			data: getOptions($groupList),
			success(res) {
				try {
					let resData = JSON.parse(res.responseText);
					if (resData.errcode === 200) {
						window.open('/example#online');
					} else {
						toast(resData.errmsg, 'error');
					}
				} catch (e) {
					toast('数据格式非JSON', 'error');
					throw new Error('数据格式非JSON');
				}
			}
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
	});

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


		/* 配置文件 */
	let $options = $('#options');
	let $optionsUpload = $options.find('.js-upload');
	let $optionsDownload = $options.find('.js-download');

	$optionsDownload.on('click', () => {

		ajax('/save?type=customize', {
			method: 'POST',
			data: getOptions($groupList, 'download'),
			success(res) {
				try {
					let resData = JSON.parse(res.responseText);
					if (resData.errcode === 200) {
						window.open(resData.data);
					} else {
						toast(resData.errmsg, 'error');
					}
				} catch (e) {
					toast('数据格式非JSON', 'error');
					throw new Error('数据格式非JSON');
				}
			}
		});

	});

	$optionsUpload.on('click', () => {
		popup({
			title: '警告',
			content: '加载成功后将清空当前数据<br />是否继续',
			confirmText: '是',
			cancelText: '否',
			confirm() {
				loadOption(false, () => {
					$groupList.$groups.remove();
					$groupList.$groups = new GroupItem([]);
				});
			},
			cancel() {
				toast('取消当前操作');
			}
		});
	});

})();