/**
 * 会员模块
*/

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 获取会员报表信息
export const getReport = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/report`, objc)
}

// 获取会员信息
export const memberInfo = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer`, objc)
}
// 历史订单列表
export const memberHistoryOrder = (memberNo, objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer/${memberNo}/order`, objc)
}

// 优惠券列表
export const memberCoupon = (memberNo, objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer/${memberNo}/coupon`, objc)
}

// 添加常联系人
export const addMember= (objc) => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/customer/often-contact`, objc)
}

// 绑定会员
export const binDingMember = (objc) => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer/social-binding`, objc)
}

// 获取未分配客户列表
export const unassignedCustomer = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/customer/unassigned-customer`, objc)
}

// 获取门店员工列表
export const storeEmployee = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee`, objc)
}

// 分配
export const customerAssign = (objc) => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/customer/assign-customer`, objc)
}


export default {
  getReport,
  memberInfo,
  addMember,
  memberCoupon,
  memberHistoryOrder,
  binDingMember,
  unassignedCustomer,
  storeEmployee,
  customerAssign
}