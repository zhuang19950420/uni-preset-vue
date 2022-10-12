import { getCurrentTime } from '../utils/util.js'
import { sentSubscribeMessage } from '../manager/noti/index'

const STATUS_ENUMS = {
	"EXCHANGED_COUPON": 'exchanged',
	"REDEEMED_COUPON": 'redeemed',
	"EXPIRED_COUPON": 'expired',
	"PENDING_COUPON": 'pending',
	"EXCHANGED_BENEFIT": 2,
	"REDEEMED_BENEFIT": 3,
	"EXPIRED_BENEFIT": 4,
	"PENDING_BENEFIT": 5,
}

const COUPON_TYPE_ENUMS = {
	"COUPON": 'coupon',
	"BENEFIT_COUPON": 'benefit'
}

// 券按钮文案配置
const btnWordConfig = {
	[STATUS_ENUMS.EXCHANGED_COUPON]: '去使用',
	[STATUS_ENUMS.REDEEMED_COUPON]: '已使用',
	[STATUS_ENUMS.EXPIRED_COUPON]: '已失效',
	[STATUS_ENUMS.PENDING_COUPON]: '领取',
	[STATUS_ENUMS.EXCHANGED_BENEFIT]: '去使用',
	[STATUS_ENUMS.REDEEMED_BENEFIT]: '已使用',
	[STATUS_ENUMS.EXPIRED_BENEFIT]: '已失效'
}

// 券按钮状态配置（有效状态）
const btnStatusConfig = [STATUS_ENUMS.EXCHANGED_COUPON, STATUS_ENUMS.EXCHANGED_BENEFIT, STATUS_ENUMS.PENDING_COUPON]

// 已使用
const redeemedStatus = [STATUS_ENUMS.REDEEMED_COUPON, STATUS_ENUMS.REDEEMED_BENEFIT]
// 已失效
const expiredStatus = [STATUS_ENUMS.EXPIRED_COUPON, STATUS_ENUMS.EXPIRED_BENEFIT]
// 领取
const pendingStatus = [STATUS_ENUMS.PENDING_COUPON]

class CouponMarket {
	constructor(coupon) {
		this.coupon = coupon
		this.coupon['_type'] = COUPON_TYPE_ENUMS[this.coupon.benefitType] // 按钮类型
		this.coupon['_btnWord'] = btnWordConfig[this.coupon.status] // 按钮文案
		this.coupon['_btnEnable'] = btnStatusConfig.includes(this.coupon.status) ? true : false // 按钮状态
	}

	listRebuild() {
		// 列表类的优惠券，体验券字段一直统一按照优惠券的处理
		return this.couponItemRebuild()
	}

	rebuild() {
		if (redeemedStatus.includes(this.coupon.status)) {
			this.coupon['_cover_img'] = '/static/icon/coupon_redeemed.png'
		} else if (expiredStatus.includes(this.coupon.status)) {
			this.coupon['_cover_img'] = '/static/icon/coupon_expired.png'
		}

		switch (this.coupon['_type']) {
			case 'coupon': {
				return this.couponItemRebuild()
			}
			break;
		case 'benefit': {
			return this.benefitItemRebuild()
		}
		break;
		default:
			break;
		}
	}

	// 优惠券
	couponItemRebuild() {
		const coupon = this.coupon
		coupon['_name'] = coupon.ruleName
		coupon['_rule'] = coupon.comment
		let startTime = ''
		let expireTime = ''
		if (coupon.createTime) {
			const timeStamp = new Date(coupon.createTime.replace(/\-/g, '/')).getTime()
			startTime = getCurrentTime({
				timeStamp,
				type: 'YYYY.MM.DD'
			})
		}

		if (coupon.expireTime) {
			const timeStamp = new Date(coupon.expireTime.replace(/\-/g, '/')).getTime()
			expireTime = getCurrentTime({
				timeStamp,
				type: 'YYYY.MM.DD'
			})
		}

		if (!startTime) {
			coupon['_availableTime'] = `${expireTime}`
		} else {
			coupon['_availableTime'] = `${startTime} - ${expireTime}`
		}
		return coupon
	}

	// 体验券
	benefitItemRebuild() {
		const coupon = this.coupon
		coupon['_name'] = coupon.name
		coupon['_rule'] = coupon.description
		let startTime = ''
		let expireTime = ''
		if (coupon.beginDate) {
			const timeStamp = new Date(coupon.beginDate.replace(/\-/g, '/')).getTime()
			startTime = getCurrentTime({
				timeStamp,
				type: 'YYYY.MM.DD'
			})
		}

		if (coupon.expiredDate) {
			const timeStamp = new Date(coupon.expiredDate.replace(/\-/g, '/')).getTime()
			expireTime = getCurrentTime({
				timeStamp,
				type: 'YYYY.MM.DD'
			})
		}

		if (!startTime) {
			coupon['_availableTime'] = `${expireTime}`
		} else {
			coupon['_availableTime'] = `${startTime} - ${expireTime}`
		}
		return coupon
	}

	// 券列表按钮点击事件
	onListCouponClick() {
		const chain = {
			// 点击领取
			isCollect: () => {
				return chain
			},
			// 点击跳转详情
			isDetail: () => {
				return chain
			}
		}
		const coupon = this.coupon
		// 领取类型
		if (pendingStatus.includes(coupon.status)) {
			if (!coupon.stock) {
				uni.$showToast({
					title: '库存不足'
				})
			} else if (coupon.exceedLimit) {
				uni.$showToast({
					title: '已超过领取次数 '
				})
			} else {
				chain.isCollect = (cb) => {
					sentSubscribeMessage('COUPON', (tmplIds) => {
						cb && cb(coupon['_type'])
					})
					return chain
				}
			}
			return chain
		}

		// 跳转至详情页
		let code = '' // 详情页code
		switch (coupon['_type']) {
			case 'coupon': {
				code = coupon.couponCode
			}
			break;
		case 'benefit': {
			code = coupon.id
		}
		break;
		default:
			break;
		}
		uni.$router.navigateTo({
			url: `pages/couponDetail/couponDetail?code=${code}&type=${coupon['_type']}`
		})

		chain.isDetail = (cb) => {
			cb && cb('')
			return chain
		}
		return chain
	}
}

export default CouponMarket
