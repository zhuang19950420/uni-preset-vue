/**
 * 商品库模块
 */

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 查询商品库
export const getGoodsList = objc => {
  return fetch.post(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/spu/search`, objc)
}

// 获取品牌
export const getBrand = objc => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/spu/product/brand`, objc)
}

export default {
  getGoodsList,
  getBrand
}
