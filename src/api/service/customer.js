/**
 * 顾客模块
*/

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 顾客列表
export const customerSearch = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/customer`, objc)
}

// 过滤列表
export const filterSearch = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/customer/criteria-values`, objc)
}

// 检查微信顾客是否为会员
export const checkCustomerMember = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/customer/social-binding`, objc)
}

export default {
  customerSearch,
  filterSearch,
  checkCustomerMember
}