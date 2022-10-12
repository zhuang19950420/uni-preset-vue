/**
 * 网络请求
 **/
import Http from './_http'

/**
 * @param url 网络请求地址
 *
 * @param objc 网络请求配置, 具体参数设置参考微信小程序文档
 * {
 *  loading: boolean                              是否启用加载动画
 *  data: string/object/ArrayBuffer               请求的参数
 *  header: object                                设置请求的 header
 *  dataType: string                              返回的数据格式
 *  responseType: string                          响应的数据类型
 *  catch: boolean                                数据缓存
 * }
 */

export class Fetch {
  constructor() {
    this.http = new Http()
  }

  // 设置地址
  setBaseUrl(value) {
    if (!value) return
    this.http.setBaseUrl(value)
  }

  // GET
  get(url, objc = {}) {
    return this._convertPromise(url, 'GET', objc)
  }
  // POST
  post(url, objc = {}) {
    return this._convertPromise(url, 'POST', objc)
  }
  // PUT
  put(url, objc = {}) {
    return this._convertPromise(url, 'PUT', objc)
  }
  // DELETE
  delete(url, objc = {}) {
    return this._convertPromise(url, 'DELETE', objc)
  }
  // OPTIONS
  options(url, objc = {}) {
    return this._convertPromise(url, 'OPTIONS', objc)
  }
  // HEAD
  head(url, objc = {}) {
    return this._convertPromise(url, 'HEAD', objc)
  }
  // TRACE
  trace(url, objc = {}) {
    return this._convertPromise(url, 'TRACE', objc)
  }
  // CONNECT
  connect(url, objc = {}) {
    return this._convertPromise(url, 'CONNECT', objc)
  }

  // 转换为Promise
  _convertPromise(url, method, objc) {
    return new Promise((resolve, reject) => {
      this.http.request(url, method, {
        fail: reject,
        success: resolve,
        ...objc
      })
    })
  }
}

export default new Fetch()
