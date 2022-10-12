import api from '../../api/service/index'

// 券列表
export const getCoupon = params => {
  return api.couponList({
    data: params
  })
}
