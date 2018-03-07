const $ = require('./dom.js');

class Area {
	constructor() {
		this.$el = $('<div class="area"></div>');
	}

	update(data) {
		for (let name in data) {
			this[name] = data[name];
			this.$el.css(name, data[name]);
		}
		return this;
	}

	bind($groupItem) {
		this.$groupItem = $groupItem;
		return this;
	}

}

module.exports = Area;