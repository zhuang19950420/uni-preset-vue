/**
 * 获取token
 */

import config from '../_config'
import um from '../../../manager/userManager'
import apiConfig from '../../../config/apiConfig'
import { hideLoading } from './toast.handler'

// 记录刷新次数
let tokenRefreshTimes = 0
export const getToken = cb => {
  _UTILS.addRefreshTimes()

  uni.login({
    success: res => {
      uni.request({
        header: {
          ...config.APP_CODE.DEFAULT_HEADER,
					'appCode': config.APP_CODE
        },
        url: `${apiConfig.BASEURL}${config.TOKEN_API}`,
        method: 'POST',
        data: {
          'jscode': res.code
        },
        success: res => {
          console.log(res, '----->')
          if (_UTILS.checkSuccess(res)) {
            _UTILS.resetRefreshTimes()

            // 存储用户信息
            um.setUserInfo(res.data.data)

            // 存储登录 TOKEN
            const token = _UTILS.getTokenByHeader(res.header)
            const expires = _UTILS.getExpiresByHeader(res.header)
            um.setToken(token, expires)

            cb && cb(res.data.data || {})
          } else {
            if (_UTILS.checkRefresh()) {
              getToken(cb)
            } else {
              hideLoading()
							uni.$showToast({
								title: `token获取失败!`
							})
							uni.$showLoading({
								showError: true
							})
              console.warn('token刷新次数超过上限, 请检查您的当前网络状况!')
            }
          }
        },
        fail: error => {
          hideLoading()
          console.log(error)
        }
      })
    }
  })
}

const _UTILS = {
  // 接口返回正确
  checkSuccess(res) {
    return res.statusCode === 200 && config.SUCCESS_CODE.includes(res.data.code)
  },
  // 比较刷新限制
  checkRefresh() {
    return tokenRefreshTimes < config.TOKEN_REFRESH_TOTAL_TIMES
  },
  // 次数加1
  addRefreshTimes() {
    tokenRefreshTimes++
  },
  // 重置次数
  resetRefreshTimes() {
    tokenRefreshTimes = 0
  },
  // 获取 TOKEN（做兼容处理）
  getTokenByHeader(header) {
    for (const key in header) {
      if (key.toLowerCase() === 'authorization') return header[key]
    }
  },
  // 获取 TOKEN 过期时间（做兼容处理）
  getExpiresByHeader(header) {
    for (const key in header) {
      if (key.toLowerCase() === 'expires-in') return header[key] * 1000 - config.TOKEN_SAFE_TIME_DIFF
    }
  }
}
