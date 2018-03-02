class DOM {

	constructor(selector, el = document) {
		if (/^<(\w+)\s*[\w\=\-\"]*>([\w\W]*)<\/\w+>$/.test(selector)) {
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
		if (value || value === 0) {
			this.el.setAttribute(key, value);
			return this;
		} else {
			return this.el.getAttribute(key, value);
		}
	}

	removeAttr(key, value) {
		this.el.removeAttribute(key, value);
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

	width(val) {
		if (val) {
			this.el.style.width = val + 'px';
		} else {
			return this.el.width;
		}
	}

	height(val) {
		if (val) {
			this.el.style.height = val + 'px';
		} else {
			return this.el.height;
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
		this.parent().getElement().replaceChild(el, this.el);
		return this;
	}

	html(html) {
		if (html) {
			this.el.innerHTML = html;
			return this;
		} else {
			return this.el.innerHTML;
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

	hidden() {
		this.addClass('hidden');
		return this;
	}

	click() {
		this.el.click();
		return this;
	}
}

module.exports = (selector) => new DOM(selector);