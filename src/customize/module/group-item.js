const $ = require('./dom.js');
const toast = require('./toast.js');
const popup = require('./popup.js');

class GroupItem {
	constructor() {
		this.$el = $(`<li class="item mark">
			<span class="js-status status">
				<i class="js-show icon icon-show" title="隐藏"></i>
				<i class="js-hide icon icon-hide hidden" title="显示"></i>
			</span>
			
			<p class="js-name single-line" title="分组名">分组名</p>
			<input class="js-input edit-text hidden" autocomplete="off"/>

			<span class="ctrl">
				<i class="js-edit icon icon-edit" title="重命名"></i>
				<i class="js-submit icon icon-submit hidden" title="确定"></i>
				<i class="js-delete icon icon-delete" title="删除"></i>
			</span>
		</li>`);

		this.areas = [];

		// 选中
		this.$el.on('click', () => {
			this.$group.choose(this);
		});

		// 显示和隐藏
		let $status = this.$el.find('.js-status');
		let $showStatus = this.$el.find('.js-show');
		let $hideStatus = this.$el.find('.js-hide');

		$status.on('click', (e) => {

			e.stopPropagation();

			if ($showStatus.hasClass('hidden')) {
				$showStatus.show();
				$hideStatus.hide();
				this.areas.forEach(($area) => {
					$area.getElement().show();
				});
			} else {
				$showStatus.hide();
				$hideStatus.show();
				this.areas.forEach(($area) => {
					$area.getElement().hide();
				});
			}

		});

		// 标题编辑和保存
		let $nameText = this.$el.find('.js-name');
		let $nameInput = this.$el.find('.js-input');
		let $edit = this.$el.find('.js-edit');
		let $submit = this.$el.find('.js-submit');

		$edit.on('click', (e) => {

			e.stopPropagation();

			$edit.hide();
			$submit.show();
			$nameText.hide();
			$nameInput
				.show()
				.value($nameText.text());
		});

		$submit.on('click', (e) => {

			e.stopPropagation();

			let name = $nameInput.value();

			let $item = this.$group.find(name);

			if ($item && $item !== this) {
				toast('名称已存在', 'error');
				name = $nameText.text();
			}

			$edit.show();
			$submit.hide();
			$nameInput.hide();
			$nameText
				.show()
				.text(name)
				.attr('title', name);

			this.name = name;

		});

		$nameInput.on('blur', () => $submit.click());

		// 删除
		let $delete = this.$el.find('.js-delete');

		$delete.on('click', (e) => {
			e.stopPropagation();
			popup({
				content: '是否确认删除分组，<br />删除后将不可恢复。',
				confirm: () => {
					this.$group.remove(this);
					this.areas.forEach(($area) => {
						$area.remove();
					});
				}
			});
		});

	}

	bind($group) {
		this.$group = $group;
		return this;
	}

	getElement() {
		return this.$el;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;

		this.$el
			.find('.js-name')
			.attr('title', name)
			.text(name);

		return this;
	}

	setActive() {
		this.$el.addClass('active');
		return this;
	}

	removeActive() {
		this.$el.removeClass('active');
		return this;
	}

	append($area) {
		this.areas.push($area.bind(this));
		return this;
	}

	remove($area) {
		this.areas.splice(this.areas.indexOf($area), 1);
		$area.remove();
	}

}

module.exports = GroupItem;