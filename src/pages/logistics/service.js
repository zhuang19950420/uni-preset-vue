import api from '../../api/service/index'

// 获取物流查询
export const logistics = (orderNumber, params) => {
  return api.logistics(orderNumber, {
    data: params
  })
}
