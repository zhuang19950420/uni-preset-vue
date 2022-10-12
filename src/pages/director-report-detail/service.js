import api from '../../api/service/index'

// 获取报表数据
export const getReport = (params) => {
  return api.getReport({
    data: params
  })
}