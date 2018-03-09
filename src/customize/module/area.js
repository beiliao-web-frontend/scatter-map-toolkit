const $ = require('./dom.js');

class Area {
	constructor() {
		this.$el = $('<div class="area"></div>');
	}

	bind($groupItem) {
		this.$groupItem = $groupItem;
	}

	getElement() {
		return this.$el;
	}

	update(data) {
		for (let name in data) {
			this[name] = data[name];
			this.$el.css(name, data[name]);
		}
		return this;
	}

}

module.exports = Area;