import api from '@/api/service/index'


export const getPage = (obj) => {
  return api.getBlock({
      data: obj,
  })
}

// 获取手机号
export const decryptUserMobile = (code) => {
  return api.decryptUserMobile({
      data: {
          'code': code
      },
      loading: true
  })
}