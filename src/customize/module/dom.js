class DOM {

	constructor(selector, el = document) {
		if (/^<(\w+)\s*[\w\=\-\"]*>([\w\W]*)<\/\w+>$/.test(selector)) {
			this.el = document.createElement('div');
			this.html(selector);
			this.el = this.child()[0].getElement();
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

	append($el) {
		this.el.appendChild($el.getElement());
		return this;
	}

	remove() {
		this.el.remove();
	}

	replace(el) {
		console.log(el.getElement(), this.el)
		this.parent().getElement().replaceChild(el.getElement(), this.el);
		return this;
	}

	html(html) {
		this.el.innerHTML = html;
		return this;
	}

	parent() {
		return new DOM(this.el.parentNode);
	}

	child() {
		return [...this.el.children].map((el) => {
			return new DOM(el);
		});
	}

	click() {
		this.el.click();
	}
}

module.exports = (selector) => new DOM(selector);