const $ = require('./dom.js');

class Group {
	constructor(selector) {
		this.$el = $(selector);
		this.children = [];
	}

	initItem($item, isNew) {
		if (isNew !== false) {
			$item.setName('分组' + (this.length() + 1));
		}

		$item.on('click', () => {
			this.chooseActive($item);
		});
	}

	checkActive() {
		if (!this.children.some(($temp) => {
			return $temp.isActive();
		})) {
			this.children[0].setActive();
		};
	}

	chooseActive($item) {
		$item.setActive();
		this.children.forEach(($temp) => {
			if ($temp !== $item) {
				$temp.removeActive();
			}
		});
	}

	append($item) {
		this.initItem($item);
		this.$el.append($item.getElement());
		this.children.push($item);
		this.checkActive();
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