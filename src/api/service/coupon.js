/**
 * 礼券中心
 */

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 券列表
export const couponList = objc => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer/coupon`, objc)
}

// 通过手机号搜索
export const customerDetail = objc => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer`, objc)
}

// 发送礼券
export const sendCoupon = objc => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer/grant-coupon`, objc)
}

export default {
  couponList,
  customerDetail,
  sendCoupon
}
