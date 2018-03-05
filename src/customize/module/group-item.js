const $ = require('./dom.js');
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

		let $status = this.$el.find('.js-status');
		let $showStatus = this.$el.find('.js-show');
		let $hideStatus = this.$el.find('.js-hide');

		let $nameText = this.$el.find('.js-name');
		let $nameInput = this.$el.find('.js-input');
		let $edit = this.$el.find('.js-edit');
		let $submit = this.$el.find('.js-submit');

		let $delete = this.$el.find('.js-delete');

		this.$el.on('click', () => this.emit('click'));

		$status.on('click', (e) => {

			e.stopPropagation();

			if ($showStatus.hasClass('hidden')) {
				let flag = this.emit('status', true);

				if (flag !== false) {
					$showStatus.show();
					$hideStatus.hide();
				}
				
			} else {
				let flag = this.emit('status', false);

				if (flag !== false) {
					$showStatus.hide();
					$hideStatus.show();
				}
			}

		});

		$edit.on('click', (e) => {

			e.stopPropagation();

			$edit.hide();
			$submit.show();
			$nameText.hide();
			$nameInput
				.show()
				.value($nameText.text());
		})

		$submit.on('click', (e) => {

			e.stopPropagation();

			let name = $nameInput.value();

			let flag = this.emit('rename', name);

			if (flag !== false) {
				$edit.show();
				$submit.hide();
				$nameInput.hide();
				$nameText
					.show()
					.text(name)
					.attr('title', name);

				this.name = name;
			}
			
		});

		$nameInput.on('blur', () => $submit.click());

		$delete.on('click', (e) => {

			e.stopPropagation();
			
			popup({
				content: '是否确认删除分组，<br />删除后将不可恢复。',
				confirm: () => {
					this.emit('delete');
				}
			});
		});

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

	isActive() {
		return this.$el.hasClass('active');
	}

	removeActive() {
		this.$el.removeClass('active');
		return this;
	}

	emit(event, ...params) {
		if (typeof this[event + 'Handler'] === 'function') {
			return this[event + 'Handler'](...params);
		}
	}

	on(event, handler) {
		this[event + 'Handler'] = handler;
		return this;
	}

}

module.exports = GroupItem;