const $ = require('./dom.js');

class Area {
	constructor() {
		this.$el = $('<div class="area"></div>');
	}

	bind($groupItem) {
		this.$groupItem = $groupItem;
		return this;
	}

	getElement() {
		return this.$el;
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