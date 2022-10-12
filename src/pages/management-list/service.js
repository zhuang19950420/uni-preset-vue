import api from '../../api/service/index'

// 获取未分配客户列表
export const unassignedCustomer = (params) => {
  return api.unassignedCustomer({
    data: params,
    loading: true
  })
}

// 获取门店员工列表
export const storeEmployee = (params) => {
  return api.storeEmployee({
    data: params,
    loading: true
  })
}

// 分配-发送参数给接口
export const customerAssign = (params) => {
  return api.customerAssign({
    data: params,
  })
}

// 获取过滤列表
export const filterSearch = (params) => {
  return api.filterSearch({
    data: params,
    loading: true
  })
}