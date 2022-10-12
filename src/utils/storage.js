/**
 * 本地存储类
 */

class Storage {
  constructor() {}

  set(key, value, expire) {
    let data = {
      value,
      expire,
      createAt: new Date().getTime()
    }
    uni.setStorageSync(key, data)
  }

  get(key) {
    const data = uni.getStorageSync(key)
    if (data) {
      if (data.expire && data.createAt + data.expire <= new Date().getTime()) {
        this.remove(key)
      } else {
        return data.value
      }
    }
    return null
  }

  clear() {
    uni.clearStorageSync()
  }

  remove(key) {
    uni.removeStorageSync(key)
  }
}

export default new Storage()
