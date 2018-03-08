const $ = require('./dom.js');
const toast = require('./toast.js');

class GroupList {
	constructor(selector) {
		this.$el = $(selector);
		this.children = [];
		this.index = 0;
	}

	bind($canvas) {
		this.$canvas = $canvas;
		return this;
	}

	check() {
		if (this.children.indexOf(this.$acitve) === -1) {
			let $item = this.children[0];
			this.$acitve = $item.setActive();
			this.emit('activeChange', $item);
		}
		return this;
	}

	choose($item) {
		this.$acitve = $item.setActive();
		this.emit('activeChange', $item);

		this.children.forEach(($child) => {
			if ($child !== this.$acitve) {
				$child.removeActive();
			}
		});
		return this;
	}

	find(name) {
		let $item = null;
		this.children.some(($child) => {
			if ($child.getName() === name) {
				$item = $child;
				return true;
			}
		});
		return $item;
	}

	append($item) {
		this.$el.append($item.getElement());
		this.children.push($item.setName(`分组${ ++this.index }`).bind(this));
		this.check();
		return this;
	}

	remove($item) {
		if (this.children.length > 1) {
			$item.getElement().remove();
			this.children.splice(this.children.indexOf($item), 1);
			this.check();
		} else {
			toast('删除失败，至少保留一个分组', 'error');
		}
		return this;
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

module.exports = GroupList;