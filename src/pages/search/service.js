import api from '../../api/service/index'
// 获取客户列表
export const customerSearch = (params) => {
  return api.customerSearch({
    data: params,
    loading: true
  })
}