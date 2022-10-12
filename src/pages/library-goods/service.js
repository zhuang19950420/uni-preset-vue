import api from '../../api/service/index'

// 查询商品库列表
export const getGoodsList = params => {
  return api.getGoodsList({
    data: params
  })
}

export const getBrand = params => {
  return api.getBrand({
    data: params
  })
}
