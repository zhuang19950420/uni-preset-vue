/**
 * 用户信息管理
 */

import api from '../api/service/index'
import { getToken } from '../utils/fetch/_handler/token.handler'
import storage from '../utils/storage'

const LOCAL_USER_KEY = '_user_'
const LOCAL_TOKEN_KEY = '_token_'

class UserManager {
  constructor() {}

  /**
   * TOKEN
   */
  getToken() {
    return storage.get(LOCAL_TOKEN_KEY)
  }

  refreshToken() {
    return new Promise(reslove => {
      getToken(res => {
        reslove(this.setUserInfo(res))
      })
    })
  }

  setToken(value, expires) {
    storage.set(LOCAL_TOKEN_KEY, value, expires)
  }

  setUserInfo(value) {
    storage.set(LOCAL_USER_KEY, value)
    return storage.get(LOCAL_USER_KEY) || {}
  }

  getUserInfo() {
    return new Promise(reslove => {
      const userInfo = storage.get(LOCAL_USER_KEY)
      if (userInfo) {
        reslove(userInfo)
      } else {
        getToken(res => {
          reslove(this.setUserInfo(res))
        })
      }
    })
  }

  updateUserInfo(value = {}) {
    const userInfo = storage.get(LOCAL_USER_KEY) || {}
    storage.set(LOCAL_USER_KEY, Object.assign(userInfo, value))
  }
}

export default new UserManager()
