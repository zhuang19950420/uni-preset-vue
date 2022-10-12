import api from '../../api/service/index'

// 获取会员历史订单
export const memberHistoryOrder = (type, params) => {
  return api.memberHistoryOrder(type, {
    data: params
  })
}

// 获取优惠券列表
export const memberCoupon = (type, params) => {
  return api.memberCoupon(type, {
    data: params
  })
}

// 获取会员信息
export const memberInfo = (params) => {
  return api.memberInfo({
    data: params
  })
}
