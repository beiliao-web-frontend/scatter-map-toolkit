;(function(win, doc) {

	const $ = ((doc) => {

		class DOM {

			constructor(selector) {
				this.el = doc.querySelector(selector);
				this.els = doc.querySelectorAll(selector);
			}

			each(handler) {
				this.els.forEach((el) => {
					handler(el);
				});
			}

			on(event, handler) {
				this.el.addEventListener(event, handler);
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

			click() {
				this.el.click();
			}

		}

		return (selector) => new DOM(selector);

	})(doc);
	
	const $main = $('#main');
	const $uploadImg = $('#upload-img');
	const $uploadOption = $('#upload-option');
	const $uploadFile = $('#upload-file');

	$uploadFile.on('change', function() {
		let file = this.files[0];

		if (!file) {
			return false;
		}

		let reader = new FileReader();
			reader.onload = (e) => {
				let content = e.target.result;
				console.log(content);
			};

			reader.onerror = function() {
				alert('文件读取失败');
			};

			reader.readAsDataURL(file);
	});

	$uploadImg.on('click', function() {
		$uploadFile.attr('accept', 'image/*').click();
	});


})(window, document);