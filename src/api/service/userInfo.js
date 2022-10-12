/**
 * 用户模块
*/

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 解析手机号
export const decryptUserMobile = objc => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/auth/mobile`, objc)
}

// 保存用户信息
export const saveCustomerProfile = objc => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/employee/auth`, objc)
}

export default {
  decryptUserMobile,
  saveCustomerProfile
}