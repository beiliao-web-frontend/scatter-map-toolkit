const $ = require('./dom.js');
const toast = require('./toast.js');

class Group {
	constructor(selector) {
		this.$el = $(selector);
		this.children = [];
		this.index = 0;
	}

	setCanvas($canvas) {
		this.$canvas = $canvas;
	}

	initItem($item) {
		if (!$item.getName()) {
			$item.setName('分组' + (++this.index));
		}

		$item.on('click', () => {
			this.choose($item);
		});

		$item.on('delete', () => {
			this.remove($item);
		});
	}

	check() {
		if (this.children.indexOf(this.$acitve) === -1) {
			this.$acitve = this.children[0].setActive();
			this.emit('activeChange', this.$acitve);
		};
	}

	choose($item) {
		this.$acitve = $item.setActive();
		this.emit('activeChange', this.$acitve);
		this.children.forEach(($child) => {
			if ($child !== this.$acitve) {
				$child.removeActive();
			}
		});
	}

	append($item) {
		this.initItem($item);
		this.$el.append($item.getElement());
		this.children.push($item);
		this.check();
	}

	remove($item) {
		if (this.children.length > 1) {
			$item.getElement().remove();
			this.children.splice(this.children.indexOf($item), 1);
			this.check();
		} else {
			toast('删除失败，至少保留一个分组', 'error');
		}
	}

	getChildren() {
		return this.children;
	}

	length() {
		return this.children.length;
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

module.exports = Group;