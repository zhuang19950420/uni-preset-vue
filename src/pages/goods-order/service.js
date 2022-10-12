import api from '../../api/service/index'

// 订单列表
export const getOrder = (orderMonth, params) => {
  return api.orderList(orderMonth, {
    data: params
  })
}

// 订单状态下拉框
export const orderStatus = params => {
  return api.orderStatus({
    data: params
  })
}
