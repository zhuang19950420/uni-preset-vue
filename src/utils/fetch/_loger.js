/**
 * 网络日志打印
 */
import config from './_config'
import ENV from '../../config/env'

const loger = (objc = {}) => {
  const { url, type, interval, params, response } = objc
  // debug 模式关闭
  if (!config.debug) return

  // 分割
  console.log('')

  console.log(`********* ${ENV} ${type} ${url} *********`)

  console.log(`请求时长: ${interval}ms`)
  console.log('参数: ', params || '无')
  console.log('返回值: ', response)

  console.log(`********* ${ENV} ${type} ${url} *********`)

  // 分割
  console.log('')
}

export default loger
