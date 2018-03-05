class DOM {

	constructor(selector, el = document) {
		if (/^<\w+[\s\w\=\-\"\;]*>[\w\W]*<\/\w+>$/.test(selector)) {
			this.el = document.createElement('div');
			this.html(selector);
			this.el = this.el.firstChild;
			this.els = [this.el];
		} else if (typeof selector === 'object') {

			if (selector instanceof DOM) {
				this.el = selector.getElement();
				this.els = selector.getElements();

			} else {
				this.el = selector;
				this.els = [selector];	
			}
			
		} else {
			this.els = el.querySelectorAll(selector);
			this.el = this.els[0];
		}
	}

	each(handler) {
		this.els.forEach((el) => {
			handler(el);
		});
	}

	find(selector) {
		return new DOM(selector, this.el);
	}

	on(event, handler, isSingle) {
		if (isSingle) {
			this.el['on' + event] = handler;
		} else {
			this.el.addEventListener(event, handler);
		}
		return this;
	}

	off(event, handler) {
		this.el.removeEventListener(event, handler);
		return this;
	}

	attr(key, value) {
		if (value !== undefined) {
			this.el.setAttribute(key, value);
			return this;
		} else {
			return this.el.getAttribute(key, value);
		}
	}

	removeAttr(key) {
		this.el.removeAttribute(key);
		return this;
	}

	addClass(...names) {
		this.el.classList.add(...names);
		return this;
	}

	removeClass(...names) {
		this.el.classList.remove(...names);
		return this;
	}

	hasClass(name) {
		return this.el.classList.contains(name);
	}

	width(val) {
		return this.css('width', val);
	}

	height(val) {
		return this.css('height', val);
	}

	css(name, val) {
		if (val !== undefined) {
			this.el.style[name] = val;
			return this;
		} else {
			return window.getComputedStyle(this.el)[name];
		}
	}

	clearStyle() {
		this.el.style.cssText = '';
		return this;
	}

	getElement() {
		return this.el;
	}

	getElements() {
		return this.els;
	}

	append(el) {
		if (el instanceof DOM) {
			el = el.getElement();
		}
		this.el.appendChild(el);
		return this;
	}

	remove() {
		this.el.remove();
		return this;
	}

	replace(el) {
		if (el instanceof DOM) {
			el = el.getElement();
		}
		this
		.el
		.parentNode
		.replaceChild(el, this.el);
		return this;
	}

	html(html) {
		if (html !== undefined) {
			this.el.innerHTML = html;
			return this;
		} else {
			return this.el.innerHTML;
		}
	}

	text(str) {
		if (str !== undefined) {
			this.el.innerText = str;
			return this;
		} else {
			return this.el.innerText;
		}
	}

	value(val) {
		if (val !== undefined) {
			this.el.value = val;
			return this;
		} else {
			return this.el.value;
		}
	}

	parent() {
		return new DOM(this.el.parentNode);
	}

	child() {
		return [...this.el.children].map((el) => {
			return new DOM(el);
		});
	}

	show() {
		this.removeClass('hidden');
		return this;
	}

	hide() {
		this.addClass('hidden');
		return this;
	}

	click() {
		this.el.click();
		return this;
	}
}

module.exports = (selector) => new DOM(selector);