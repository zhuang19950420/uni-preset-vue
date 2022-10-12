import api from '../../api/service/index'

// 获取会员信息
export const memberInfo = (params) => {
  return api.memberInfo({
    data: params,
    loading: true
  })
}

// 添加常联系会员
export const addMember = (params) => {
  return api.addMember({
    data: params,
  })
}

// 绑定会员
export const binDingMember = (params) => {
  return api.binDingMember({
    data: params,
  })
}