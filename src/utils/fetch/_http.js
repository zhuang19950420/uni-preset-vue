/**
 * 网络请求
 **/
import Queue from './_queue'
import config from './_config'
import um from '../../manager/userManager'
import apiConfig from '../../config/apiConfig'

import loger from './_loger'
import RetryHandler from './_handler/retry.handler'
import { getToken } from './_handler/token.handler'
import { authHeader } from './_handler/auth.handler'
import { responseHandler } from './_handler/response.handler'
import { showLoading, hideLoading } from './_handler/toast.handler'
import { createServerErrorStruct, createResponseErrorStruct } from './_handler/error.handler'

// 是否正在请求token
let isFetchToken = false

// 网络请求队列
const requestQueue = new Queue()
// 重试网络请求集合 && 队列
const retryRequestSet = {}
const retryRequestQueue = new Queue()

class Http {
	constructor() {
		this.baseUrl = apiConfig.BASEURL
	}

	// 重置地址
	setBaseUrl(value) {
		if (!value) return
		this.baseUrl = value
	}

	// 发起请求
	request(url, method, objc = {}) {
		const token = um.getToken()

		requestQueue.push({ url, method, objc })
		if (!token) {
			if (isFetchToken) return

			isFetchToken = true
			getToken(() => {
				isFetchToken = false
				const tasks = requestQueue.get()
				for (const task of tasks) {
					this.resend(task.url, task.method, task.objc)
				}
			})
		}

		if (token) {
			this.send(url, method, objc)
		}
	}

	// 发送网络请求
	send(url, method, objc = {}) {
		const resUrl = `${this.baseUrl}${url}`

		objc.loading && showLoading()
		const startTime = new Date().getTime()
		uni.request({
			url: resUrl,
			data: objc.data,
			method: method || 'GET',
			timeout: config.TIMEOUT,
			header: authHeader(objc.header),
			enableCache: !!objc.enableCache,
			dataType: objc.dataType || 'json',
			responseType: objc.responseType || 'text',
			fail: error => {
				const errorStruct = createServerErrorStruct(error)
				uni.$showToast({
					title: `${errorStruct.errMsg}`
				})
				objc.fail && objc.fail(errorStruct)
			},
			complete: () => {
				objc.loading && hideLoading()
			},
			success: res => {
				loger({
					url: url,
					response: res,
					params: objc.data,
					type: method || 'GET',
					interval: new Date().getTime() - startTime
				})
				const token = this.getTokenByHeader(res.header)
				const expires = this.getExpiresByHeader(res.header)
				!!token && um.setToken(token, expires)
				const handler = new responseHandler(res)
				handler
					.isReTry(() => {
						// 重试队列中不存在该请求
						if (!retryRequestQueue.has({ url, method, objc })) {
							const retryInstance = new RetryHandler()

							retryRequestQueue.push({ url, method, objc })
							retryRequestSet[`${url}${method}`] = retryInstance

							retryInstance.action(() => {
								console.log(`----------- ${url} ${method} -----------`)
								console.log(`重试${retryInstance.times}次`)
								console.log(`----------- ${url} ${method} -----------`)

								retryInstance.add()
								this.resend(url, method, objc)
							})
						}
						// 重试队列中存在该请求
						else {
							const retryInstance = retryRequestSet[`${url}${method}`]
							retryInstance.action(() => {
								console.log(`----------- ${url} ${method} -----------`)
								console.log(`重试${retryInstance.times}次`)
								console.log(`----------- ${url} ${method} -----------`)

								retryInstance.add()
								this.resend(url, method, objc)
							})
						}
					})
					.isRefetch(() => {
						getToken(() => {
							this.resend(url, method, objc)
						})
					})
					.isSuccess(result => {
						requestQueue.remove({ url, method, objc })
						retryRequestQueue.remove({ url, method, objc })

						objc.success && objc.success(result)
					})
					.isFailture(result => {
						const errorStruct = createResponseErrorStruct(result)
						if (errorStruct.errMsg) {
							uni.$showToast({
								title: `${errorStruct.errMsg}`
							})
						}
						objc.fail && objc.fail(errorStruct)
					})
			}
		})
	}
	getTokenByHeader(header) {
    for (const key in header) {
      if (key.toLowerCase() === 'authorization') return header[key]
    }
  }
	// 获取 TOKEN 过期时间（做兼容处理）
  getExpiresByHeader(header) {
    for (const key in header) {
      if (key.toLowerCase() === 'expires-in') return header[key] * 1000 - config.TOKEN_SAFE_TIME_DIFF
    }
  }
	// 重新发送请求
	resend(url, method, objc = {}) {
		this.send(url, method, objc, true)
	}
}

export default Http
