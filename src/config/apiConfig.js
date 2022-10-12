/**
 * 网络配置
 */
import ENV from './env.js'

//  https://scrm-stg.lagardere-tr.cn/ma-portal-api-v1/BDL
//  scrm.lagardere-tr.cn

// 默认配置
const DEFAULT_CONFIG = {
  // 请求地址
  BASEURL: {
    development: 'https://scrm-stg.lagardere-tr.cn',
    production: 'https://scrm.lagardere-tr.cn'
  },

  // 请求路径
  URI_PATH: {
    development: {
      v1: '/ma-portal-api-v1'
    },
    production: {
      v1: '/ma-portal-api-v1'
    }
  },

  // APP_CODE
  APP_CODE: {
    development: 'BDL',
    production: 'BDL'
  }
}

// 导出相关配置
export default {
  BASEURL: DEFAULT_CONFIG['BASEURL'][ENV],
  URI_PATH: DEFAULT_CONFIG['URI_PATH'][ENV],
  APP_CODE: DEFAULT_CONFIG['APP_CODE'][ENV]
}
