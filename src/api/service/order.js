/**
 * 带货订单列表
 */

import fetch from '../../utils/fetch/index'
import apiConfig from '../../config/apiConfig'
import basisConfig from '../../config/basisConfig'

// 获取订单列表
export const orderList = (orderMonth, objc) => {
  return fetch.get(
    `${apiConfig.URI_PATH.v1}/${basisConfig.brand}/order?orderMonth=${orderMonth}`,
    objc
  )
}

// 获取订单物流信息
export const logistics = (orderNumber, objc) => {
  return fetch.get(
    `${apiConfig.URI_PATH.v1}/${basisConfig.brand}/order/${orderNumber}/logistics`,
    objc
  )
}

// 订单状态下拉框
export const orderStatus = objc => {
  return fetch.get(`${apiConfig.URI_PATH.v1}/${basisConfig.brand}/order/status`, objc)
}

export default {
  orderList,
  logistics,
  orderStatus
}
