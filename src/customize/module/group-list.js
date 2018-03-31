const $ = require('./dom.js');
const util = require('./util.js');
const toast = require('./toast.js');
const GroupItem = require('./group-item.js');

class GroupList extends $.class {
	constructor(selector) {
		super(selector);

		this.$groups = new GroupItem([]);

	}

	check() {
		if (!this.$groups.hasClass('active') && this.$groups.size() > 0) {
			let $group = this.$groups.eq(0);
			this.$currentGroup = $group;
			this.emit('current', $group.addClass('active'));
		}
		return this;
	}

	findByName(name) {
		let $result = null;

		this.$groups.forEach(($group) => {
			if ($group.name === name) {
				$result = $group;
			}
		});
		return $result;
	}

	append($group) {
		if (!util.isGroupItem($group)) {
			return this;
		}

		for (let i = 1; !$group.name; i++) {
			let name = '分组' + i;

			if (!this.findByName(name)) {
				$group.name = name;
			}
		}

		$group.on('choose', () => {
			this.$currentGroup = $group;
			this.emit('current', $group);
		}, true, false);

		$group.on('delete', () => {
			if (this.$groups.size() > 1) {
				let index = this.$groups.index($group);
				if (index !== -1) {
					this.$groups.splice(index);
				}
				this.check();
			} else {
				toast('删除失败，至少保留一个分组', 'error');
				return false;
			}

		}, true, false);

		$group.on('rename', (name) => {
			let $result = this.findByName(name);
			if ($result && !$result.equals($group)) {
				toast('名称已存在', 'error');
				return false;
			}

			$group.name = name;

			this.emit('current', this.$currentGroup);
		}, true, false);

		super.append($group);
		this.$groups.push($group);
		this.check();
		return this;
	}

}

module.exports = GroupList;