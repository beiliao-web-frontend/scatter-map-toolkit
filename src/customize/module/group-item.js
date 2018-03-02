const $ = require('./dom.js');

class GroupItem {
	constructor(name) {
		this.$el = $(`<li class="item">
			<span class="status">
				<i class="js-show icon icon-show" title="隐藏"></i>
				<i class="js-hide icon icon-hide hidden" title="显示"></i>
			</span>
			<p class="js-name single-line" title="${ name }">${ name }</p>
			<input class="js-input edit-text hidden" autocomplete="off"/>
			<span class="ctrl">
				<i class="js-edit icon icon-edit" title="重命名"></i>
				<i class="js-submit icon icon-submit hidden" title="确定"></i>
				<i class="js-delete icon icon-delete" title="删除"></i>
			</span>
		</li>`);
		this.name = name;
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
			.html(name);

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

	show() {
		this.$el
			.find('.js-show')
			.removeClass('hidden');

		this.$el
			.find('.js-hide')
			.addClass('hidden');

		return this;
	}

	hide() {
		this.$el
			.find('.js-show')
			.addClass('hidden');

		this.$el
			.find('.js-hide')
			.removeClass('hidden');

		return this;
	}





}

module.exports = GroupItem;