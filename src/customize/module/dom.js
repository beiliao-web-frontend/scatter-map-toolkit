class DOM {

	constructor(selector, contexts = [document]) {

		if (!Array.isArray(contexts)) {
			this.contexts = [contexts];
		} else {
			this.contexts = contexts;
		}

		if (typeof selector === 'string') {
			if (/^<[\s\S]+>$/.test(selector)) {
				let $temp = document.createElement('div');
				$temp.innerHTML = selector;
				this.nodes = [$temp.firstChild];
			} else {
				this.nodes = [];

				this.contexts.forEach((context) => {
					this.nodes.push(...context.querySelectorAll(selector));
				});

			}
		} else if (selector instanceof DOM) {
			this.contexts = selector.contexts;
			this.nodes = selector.nodes;
		} else if (Array.isArray(selector)) {
			this.nodes = selector.filter((node) => {
				return !!node;
			});
		} else {
			this.nodes = [selector];
		}

	}

	each(callback) {
		this.nodes.forEach((node) => {
			callback.call(new DOM(node), node);
		});
		return this;
	}

	filter(callback) {
		return new DOM(this.nodes.filter(callback));
	}

	get(index) {
		return this.nodes[index];
	}

	find(selector) {
		return new DOM(selector, this.nodes);
	}

	size() {
		return this.nodes.length;
	}

	concat(selector) {
		return new DOM([...new DOM(selector).nodes, ...this.nodes]);
	}

	on(eventName, handler, isOnly) {
		let events = eventName.split(' ');
		if (isOnly) {
			this.nodes.forEach((node) => {
				events.forEach((event) => {
					node['on' + event] = (e) => {
						handler.call(new DOM(node), e);
					};
				});
			});
		} else {
			this.nodes.forEach((node) => {
				events.forEach((event) => {
					node.addEventListener(event, (e) => {
						handler.call(new DOM(node), e);
					});
				});
			});
		}
		return this;
	}

	off(eventName, handler) {
		this.nodes.forEach((node) => {
			node.removeEventListener(eventName, handler);
			node['on' + eventName] = null;
		});
		return this;
	}

	emit(event, ...params) {
		if (typeof this['on' + event] === 'function') {
			return this['on' + event](...params);
		} else {
			this.nodes.forEach((node) => {
				if (typeof node['on' + event] === 'function') {
					return node['on' + event](...params);
				}
			});
		}
	}

	attr(key, value) {
		if (typeof key === 'object') {
			this.nodes.forEach((node) => {
				for (let name in key) {
					node.setAttribute(name, key[name]);
				}
			});
		} else if (value !== undefined) {
			this.nodes.forEach((node) => {
				node.setAttribute(key, value);
			});
		} else {
			return this.nodes.map((node) => {
				return node.getAttribute(key);
			}).join('');
		}

		return this;
	}

	removeAttr(key) {
		this.nodes.forEach((node) => {
			node.removeAttribute(key);
		});
		return this;
	}

	data(key, value) {
		key = `data-${ key }`;
		if (value === undefined) {
			return this.attr(key);
		} else {
			this.attr(key, value);
			return this;
		}
	}

	addClass(...names) {
		this.nodes.forEach((node) => {
			let classNames = node.className.split(' ');

			names.forEach((name) => {
				if (classNames.indexOf(name) === -1) {
					classNames.push(name);
				}
			});

			node.className = classNames.join(' ');
		});
		return this;
	}

	removeClass(...names) {
		this.nodes.forEach((node) => {
			let classNames = node.className.split(' ');

			names.forEach((name) => {
				let index = classNames.indexOf(name);
				if (index !== -1) {
					classNames.splice(index, 1);
				}
			});

			node.className = classNames.join(' ');
		});
		return this;
	}

	hasClass(name) {
		return this.nodes.some((node) => {
			return node.className.indexOf(name) !== -1;
		});
	}

	css(key, val) {
		if (typeof key === 'object') {
			this.nodes.forEach((node) => {
				for (let name in key) {
					node.style[name] = key[name];
				}
			});
		} else if (val !== undefined) {
			this.nodes.forEach((node) => {
				node.style[key] = val;
			});
		} else if ('getComputedStyle' in window) {
			return window.getComputedStyle(this.nodes[0])[key];
		} else {
			return this,nodes[0].style[key];
		}
	}

	width(val) {
		return this.css('width', val);
	}

	height(val) {
		return this.css('height', val);
	}

	append(selector) {
		this.nodes.forEach((node) => {
			new DOM(selector).each((n) => {
				node.appendChild(n);
			})
		});
		return this;
	}

	remove() {
		this.nodes.forEach((node) => {
			node.remove();
		});
		return this;
	}

	replace(selector) {
		this.nodes.forEach((node) => {
			node.parentNode.replaceChild(new DOM(selector).get(0), node);
		});
		return this;
	}

	html(html) {
		if (html !== undefined) {
			this.nodes.forEach((node) => {
				node.innerHTML = html;
			});
			return this;
		} else {
			return this.nodes[0].innerHTML;
		}
	}

	text(str) {
		if (str !== undefined) {
			this.nodes.forEach((node) => {
				node.innerText = str;
			});
			return this;
		} else {
			return this.nodes[0].innerText;
		}
	}

	value(val) {
		if (val !== undefined) {
			this.nodes.forEach((node) => {
				node.value = val;
			});
			return this;
		} else {
			return this.nodes[0].value;
		}
	}

	parent() {
		return new DOM(this.nodes.map((node) => {
			return node.parentNode;
		}));
	}

	children() {
		let result = [];
		this.nodes.forEach((node) => {
			result.push(...node.children);
		});
		return new DOM(result);
	}

	siblings() {
		return this.parent().children().filter((node) => {
			return this.nodes.indexOf(node) === -1;
		});
	}

	show() {
		this.css('display', '');
		return this;
	}

	hide() {
		this.css('display', 'none');
		return this;
	}

	offset() {
		return {
			left: this.nodes[0].offsetLeft,
			top: this.nodes[0].offsetTop
		};
	}

	scrollLeft() {
		return this.nodes[0].scrollLeft;
	}

	scrollTop() {
		return this.nodes[0].scrollTop;
	}

	click() {
		this.nodes.forEach((node) => {
			node.click();
		});
		return this;
	}

}

let $ = (selector) => new DOM(selector);

$.class = DOM;

module.exports = $;