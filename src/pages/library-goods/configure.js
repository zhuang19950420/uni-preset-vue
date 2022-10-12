import ENV from '../../config/env'

// 默认跳转 APPID
const DEFAULT_CONFIG = {
  // appid
  APPID: {
    development: 'wxd07524e8973e79e3',
    production: 'wx9d66ecd06d1635a7'
  }
}

export default {
  USE_APPID: DEFAULT_CONFIG['APPID'][ENV]
}
