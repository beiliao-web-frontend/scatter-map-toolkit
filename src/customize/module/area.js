const $ = require('./dom.js');

class Area {
	constructor() {
		this.$el = $(`<div class="area">
			<i class="icon icon-error"></i>
		</div>`);

		this.$el
			.find('.icon')
			.on('click', (e) => {
				this.$groupItem.remove(this);
			});
	}

	bind($groupItem) {
		this.$groupItem = $groupItem;
		return this;
	}

	getElement() {
		return this.$el;
	}

	remove() {
		this.$el.remove();
		return this;
	}

	data(data) {
		for (let name in data) {
			this[name] = data[name];
		}
		return this;
	}

	css(data) {
		for (let name in data) {
			this.$el.css(name, data[name]);
		}
		return this;
	}

}

module.exports = Area;