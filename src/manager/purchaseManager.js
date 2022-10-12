import { getCurrentTime } from '../utils/util.js'
import { formatNum } from '../utils/util'

class PurchaseManager {
	constructor() {

	}

	setPurchase(item) {
		this.purchaseItem = item
		return this
	}

	stringToTime(value) {
		if (!value) return
		return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`
	}

	returnTwoDecimals(num) {
		return Number(num).toFixed(2)
		// num = Number(num)
		// if (num) return num.toFixed(2)
		// else return 0
	}

	rebuild() {
		const purchaseItem = this.purchaseItem
		// 购买日期
		purchaseItem['_date'] = this.stringToTime(purchaseItem.date)
		// 数量
		// purchaseItem['_number'] = `${purchaseItem.number} 件`
		// 商品原价
		purchaseItem['_originalPrice'] =
			`¥ ${formatNum(this.returnTwoDecimals(Number(purchaseItem.now_real) + Number(purchaseItem.discprice)))}`
		// 折扣金额
		purchaseItem['_discprice'] = `¥ ${formatNum(this.returnTwoDecimals(purchaseItem.discprice))}`
		// 实付金额
		purchaseItem['_now_real'] = `¥ ${formatNum(this.returnTwoDecimals(purchaseItem.now_real))}`
		purchaseItem.orderLines.forEach((order)=>{
			order['_price'] = `¥ ${formatNum(this.returnTwoDecimals(order.price))}`
		})
		return purchaseItem
	}

	getPurchase() {
		if (!this.purchaseItem) {
			return
		}
		return this.purchaseItem
	}
}

export default new PurchaseManager()
