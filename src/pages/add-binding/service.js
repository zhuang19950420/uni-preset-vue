import api from '../../api/service/index'

// 获取会员信息
export const memberInfo = (params) => {
  return api.memberInfo({
    data: params,
  })
}