const $ = require('./dom.js');

class Area extends $.class {
	constructor() {
		super(`<div class="area">
			<i class="icon icon-error"></i>
		</div>`);

		this
			.find('.icon')
			.on('click', () => {
				this.$groupItem.remove(this);
			});
	}

	bind($groupItem) {
		this.$groupItem = $groupItem;
		return this;
	}

	data(data) {
		for (let name in data) {
			this[name] = data[name];
		}
		return this;
	}

}

module.exports = Area;