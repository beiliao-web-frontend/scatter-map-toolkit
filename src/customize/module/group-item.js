const $ = require('./dom.js');

class GroupItem {
	constructor(name) {
		this.$el = $(`<li class="item">
			<span class="js-status status">
				<i class="icon icon-show" title="隐藏"></i>
			</span>
			<p class="js-name single-line" title="${ name }">${ name }</p>
			<span class="ctrl">
				<i class="js-edit icon icon-edit" title="重命名"></i>
				<i class="js-delete icon icon-delete" title="删除"></i>
			</span>
		</li>`);
	}

}

module.exports = GroupItem;