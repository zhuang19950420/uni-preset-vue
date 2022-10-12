/**
 * 路由扩展
 */

class Router {
  constructor() {
  }

  // reLaunch 跳转
  reLaunch(opts) {
    return this._to('reLaunch',opts)
  }

  // switchTab 跳转
  switchTab(opts) {
    return this._to('switchTab',opts)
  }

  // navigateTo 跳转
  navigateTo(opts) {
    return this._to('navigateTo',opts)
  }

  // redirectTo 跳转
  redirectTo(opts) {
    return this._to('redirectTo',opts)
  }

  // navigateBack 跳转
  navigateBack(opts) {
    return this._to('navigateBack',opts)
  }
  // 路由跳转处理
  _to(type,opts = {}) {
    return new Promise((resolve,reject) => {
      if (!type) {
        reject()
        return
      }
      uni.vibrateShort()
      const path = opts.url ? { url: `/${opts.url}` } : {}
      uni[type]({
        ...path,
        success: () => {
          resolve()
          console.log(`------- ${type} to ${path.url} success -------`)
        },
        fail: err => {
          reject()
          console.log('err: ',err)
          console.log(`------- ${type} to ${path.url} fail -------`)
        }
      })
    })
  }
}

export default new Router()