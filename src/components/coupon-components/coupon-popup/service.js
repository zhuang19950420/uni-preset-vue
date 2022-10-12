import api from '../../../api/service/index'

// 通过手机号搜索
export const customerDetail = params => {
  return api.customerDetail({
    data: params
  })
}

// 发送礼券
export const sendCoupon = params => {
  return api.sendCoupon({
    data: params
  })
}
