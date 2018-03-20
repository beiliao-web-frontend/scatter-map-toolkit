const $ = require('./dom.js');
const util = require('./util.js');
const popup = require('./popup.js');

class GroupItem extends $.class {
	constructor(seletor) {

		if (seletor) {
			super(seletor);
			return;
		}

		super(`<li class="item mark">
			<span class="status">
				<i class="js-status icon icon-show" title="隐藏"></i>
			</span>
			
			<p class="js-name single-line" title="分组名">分组名</p>
			<input class="js-input edit-text" autocomplete="off" style="display: none;"/>

			<span class="ctrl">
				<i class="js-edit icon icon-edit" title="重命名"></i>
				<i class="js-submit icon icon-submit" title="确定" style="display: none;"></i>
				<i class="js-delete icon icon-delete" title="删除"></i>
			</span>
		</li>`);

		this.$areas = $();

		// 选中
		let $nameText = this.find('.js-name');

		$nameText.on('click', () => {
			this
				.addClass('active')
				.siblings()
				.removeClass('active');

			this.emit('choose');
		});

		// 显示和隐藏
		let $status = this.find('.js-status');

		$status.on('click', () => {

			this.isShow = !$status.hasClass('icon-show');

		});

		// 标题编辑和保存
		let $nameInput = this.find('.js-input');
		let $edit = this.find('.js-edit');
		let $submit = this.find('.js-submit');

		$edit.on('click', () => {

			$edit.hide();
			$submit.show();
			$nameText.hide();
			$nameInput
				.show()
				.value($nameText.text());
		});

		$submit.on('click', () => {

			let name = $nameInput.value();

			let flag = this.emit('rename', name);

			if (flag === false) {
				name = $nameText.text();
			}

			$edit.show();
			$submit.hide();
			$nameInput.hide();
			$nameText.show();

			this.name = name;

		});

		$nameInput.on('blur', () => $submit.click());

		// 删除
		let $delete = this.find('.js-delete');

		$delete.on('click', () => {
			popup({
				content: '是否确认删除分组，<br />删除后将不可恢复。',
				confirm: () => {
					let flag = this.emit('delete');
					if (flag !== false) {
						super.remove();
						this.$areas.remove();
					}
				}
			});
		});

	}

	set name(val) {
		this
			.data('name', val)
			.find('.js-name')
			.attr('title', val)
			.text(val);
	}

	get name() {
		if (this.size() > 1) {
			return '分组集';
		}
		return this.data('name');
	}

	set isShow(val) {
		let $status = this.find('.js-status');

		if (val) {
			this.$areas.show();
			$status
					.addClass('icon-show')
					.removeClass('icon-hide')
					.attr('title', '显示');
		} else {
			this.$areas.hide();
			$status
					.addClass('icon-hide')
					.removeClass('icon-show')
					.attr('title', '显示');
		}
		this.data('isShow', val);
	}

	get isShow() {
		let result = this.data('isShow');
		return result === undefined ? true : result;
	}

	set $areas(val) {
		this.data('$areas', val);
	}

	get $areas() {
		if (this.size() > 1) {
			let $result = $();
			this.forEach(($group) => {
				$result.push($group.$areas);
			});
			return $result;
		}
		return this.data('$areas');
	}


	forEach(callback) {
		super.each((node) => {
			callback(new GroupItem(node));
		});
	}

	eq(index) {
		return new GroupItem(super.eq(index));
	}

	remove() {
		this.$areas.remove();
		super.remove();
	}

	append($area) {
		if (!util.isArea($area)) {
			return this;
		}

		$area.on('delete', () => {
			this.$areas.splice(this.$areas.index($area));
		}, true, false);

		this.$areas.push($area);
		return this;
	}

}

module.exports = GroupItem;