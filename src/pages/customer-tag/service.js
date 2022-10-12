import api from '../../api/service/index'
// 获取客户列表
export const tagPool = (params) => {
  return api.tagPool( {
    data: params,
    loading: true
  })
}


export const updateCustomerTags = (params) => {
  return api.updateCustomerTags( {
    data: params,
    loading: true
  })
}