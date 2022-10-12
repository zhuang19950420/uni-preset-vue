/**
 * 标签模块
*/

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 当前用户全部标签
export const allCustomerTags = (memberNo,objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/tag/member/${memberNo}`, objc)
}

// 修改用户标签
export const updateCustomerTags = (objc) => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/tag`, objc)
}

// 当前用户可以打的标签池
export const tagPool = (objc) => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/tag/pool`, objc)
}

export default {
  tagPool,
  allCustomerTags,
  updateCustomerTags
}