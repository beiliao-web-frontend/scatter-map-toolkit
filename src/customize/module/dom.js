let $;

class DOM {

	constructor(selector, contexts = document) {

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
		} else if (selector) {
			this.nodes = [selector];
		} else {
			this.nodes = [];
		}

	}

	each(callback) {
		this.nodes.forEach(callback);
		return this;
	}

	filter(callback) {
		return $(this.nodes.filter(callback));
	}

	get(index) {
		return this.nodes[index];
	}

	eq(index) {
		return $(this.nodes[index])
	}

	find(selector) {
		return $(selector, this.nodes);
	}

	size() {
		return this.nodes.length;
	}

	equals(selector) {
		return this.nodes[0] === $(selector).nodes[0];
	}

	concat(selector) {
		return $([...$(selector).nodes, ...this.nodes]);
	}

	push(selector) {
		return this.nodes.push(...$(selector).nodes);
	}

	splice(index, count = 1, ...selector) {
		this.nodes.splice(index, count, ...$(selector).nodes);
		return this;
	}

	index(selector) {
		return this.nodes.indexOf($(selector).nodes[0]);
	}

	on(eventName, handler, isOnly = false, isOrigin = true) {
		let events = eventName.split(' ');
		if (isOnly) {
			this.each((node) => {
				events.forEach((event) => {
					if (isOrigin) {
						node['on' + event] = function() {
							return handler.call($(node), ...arguments)
						};
					} else {
						node['_on' + event] = function() {
							return handler.call($(node), ...arguments)
						};
					}
				});
			});
		} else {
			this.each((node) => {
				events.forEach((event) => {
					node.addEventListener(event, function() {
						handler.call($(node), ...arguments)
					});
				});
			});
		}
		return this;
	}

	off(eventName, handler) {
		this.each((node) => {
			node.removeEventListener(eventName, handler);
			node['on' + eventName] = null;
			node['_on' + eventName] = null;
		});
		return this;
	}

	emit(event, ...params) {
		let result = [];
		this.each((node) => {
			if (typeof this['on' + event] === 'function') {
				result.push(this['on' + event](...params));
			} else if (typeof node['on' + event] === 'function') {
				result.push(node['on' + event](...params));
			} else if (typeof node['_on' + event] === 'function') {
				result.push(node['_on' + event](...params));
			}
		});
		return result.length > 1 ? result : result[0];
	}

	attr(key, value) {
		if (typeof key === 'object') {
			this.each((node) => {
				for (let name in key) {
					node.setAttribute(name, key[name]);
				}
			});
		} else if (value !== undefined) {
			this.each((node) => {
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
		this.each((node) => {
			node.removeAttribute(key);
		});
		return this;
	}

	data(key, value, isOrigin = false) {
		if (typeof key === 'object') {
			this.each((node) => {
				for (let name in key) {
					if (isOrigin) {
						node[name] = key[name];
					} else {
						node['_' + name] = key[name];
					}
				}
			});
		} else if (value !== undefined) {
			this.each((node) => {
				if (isOrigin) {
					node[key] = value;
				} else {
					node['_' + key] = value;
				}
			});
		} else {
			if (isOrigin) {
				return this.get(0)[key];
			} else {
				return this.get(0)['_' + key];
			}
		}
		return this;
	}

	addClass(...names) {
		this.each((node) => {
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
		this.each((node) => {
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
			this.each((node) => {
				for (let name in key) {
					node.style[name] = key[name];
				}
			});
		} else if (val !== undefined) {
			this.each((node) => {
				node.style[key] = val;
			});
		} else if ('getComputedStyle' in window) {
			return window.getComputedStyle(this.get(0))[key];
		} else {
			return this.get(0).style[key];
		}
	}

	width(val) {
		return this.css('width', val);
	}

	height(val) {
		return this.css('height', val);
	}

	append(selector) {
		this.each((node) => {
			$(selector).each((n) => {
				node.appendChild(n);
			})
		});
		return this;
	}

	remove() {
		this.each((node) => {
			node.remove();
		});
		return this;
	}

	replace(selector) {
		this.each((node) => {
			node.parentNode.replaceChild($(selector).get(0), node);
		});
		return this;
	}

	html(html) {
		if (html !== undefined) {
			this.each((node) => {
				node.innerHTML = html;
			});
			return this;
		} else {
			return this.get(0).innerHTML;
		}
	}

	text(str) {
		if (str !== undefined) {
			this.each((node) => {
				node.innerText = str;
			});
			return this;
		} else {
			return this.get(0).innerText;
		}
	}

	value(val) {
		if (val !== undefined) {
			this.each((node) => {
				node.value = val;
			});
			return this;
		} else {
			return this.get(0).value;
		}
	}

	parent() {
		return $(this.nodes.map((node) => {
			return node.parentNode;
		}));
	}

	children() {
		let result = [];
		this.each((node) => {
			result.push(...node.children);
		});
		return $(result);
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
			left: this.get(0).offsetLeft,
			top: this.get(0).offsetTop
		};
	}

	scrollLeft() {
		return this.get(0).scrollLeft;
	}

	scrollTop() {
		return this.get(0).scrollTop;
	}

	click() {
		this.each((node) => {
			node.click();
		});
		return this;
	}

}

$ = (selector, contexts) => {
	if (selector instanceof DOM) {
		return selector;
	} else {
		return new DOM(selector, contexts);
	}
};

$.class = DOM;

module.exports = $;