const $ = require('./dom.js');

class Group {
	constructor(selector) {
		this.$el = $(selector);
		this.children = [];
	}

	append($el) {
		this.$el.append($el);
		this.children.push($el);
	}

	remove($el) {
		if (this.children.length > 1) {
			$el.remove();
			this.children.splice(this.children.indexOf(this.$el), 1);	
		}
	}

	length() {
		return this.children.length;
	}
}

module.exports = Group;