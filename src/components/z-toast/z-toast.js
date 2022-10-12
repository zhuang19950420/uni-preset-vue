function getContext() {
	const pages = getCurrentPages();
	return pages[pages.length - 1];
}

export default function Toast(options = {}) {
	const context = options.context || getContext();
	const notify = context.selectComponent(options.selector || '#z-toast');
	delete options.context;
	delete options.selector;
	if (notify) {
		notify.$vm.show(options);
		return
	}
	uni.showToast({
		icon: "none",
		mask: true,
		title: options.title
	})
	console.warn('未找到 z-toast 节点，请确认 selector 及 context 是否正确');
}
