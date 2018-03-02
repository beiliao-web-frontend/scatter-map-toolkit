const $ = require('./dom.js');

class Group {
	constructor(selector) {
		this.$el = $(selector);
		this.children = [];
	}

	append($item) {
		this.$el.append($item.getElement());
		this.children.push($item);
	}

	remove($item) {
		if (this.children.length > 1) {
			$item.getElement().remove();
			this.children.splice(this.children.indexOf(this.$el), 1);	
		}
	}

	length() {
		return this.children.length;
	}
}

module.exports = Group;