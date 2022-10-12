import api from '../../api/service/index'
// 获取客户列表
export const allCustomerTags = (memberNo) => {
  return api.allCustomerTags(memberNo,{
    loading: true
  })
}
