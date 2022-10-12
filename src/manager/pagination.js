class Pagination {
	constructor(objc = {}) {
		// 分页属性
		this.page = objc.page || 1
		this.size = objc.size || 10
		this.total = objc.total || 0

		// 分页方法
		this.next = this._next
		this.prev = this._prev
		this.reset = this._reset

		this.setPage = this._setPage
		this.setSize = this._setSize
		this.setTotal = this._setTotal
		this.calculateItemBelongToPage = this._calculateItemBelongToPage
	}

	_setPage(page) {
		this.page = page
		return this
	}

	_setSize(size) {
		this.size = size
		return this
	}

	_setTotal(total) {
		this.total = total
		return this
	}

	_next() {
		this.page += 1
		return this
	}

	_prev() {
		this.page -= 1
		return this
	}

	_reset() {
		this.page = 1
		return this
	}

	_calculateItemBelongToPage(idx) {
		if (idx == 0) return 1
		return Math.ceil(idx / this.size)
	}
}

export default Pagination
