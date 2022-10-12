import api from '../../api/service/index'

// 获取客户列表
export const customerSearch = (params) => {
  return api.customerSearch({
    data: params
  })
}

// 获取过滤列表
export const filterSearch = (params) => {
  return api.filterSearch({
    data: params
  })
}

// 检查微信顾客是否为会员
export const checkCustomerMember = (params) => {
  return api.checkCustomerMember({
    data: params,
  })
}