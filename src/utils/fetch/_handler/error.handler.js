/**
 * error统一处理
 */
import errorConfig from '../../../constant/error'

// 创建服务器错误结构体
export const createServerErrorStruct = error => {
	return {
		type: 'serveErr',
		code: error.statusCode || 'UNKNOWN',
		errMsg: error.errMsg || '网络异常, 请稍后再试！'
	}
}

// 创建接口请求错误结构体
export const createResponseErrorStruct = error => {
	const data = error.data || {}
	let errMsg = ''
	const errorItem = errorConfig[data.code]
	// 错误信息匹配
	if (errorItem) {
		if (errorItem.ignore) {
			errMsg = null
		} else {
			errMsg = errorItem.hint
		}
	} else {
		errMsg = '网络异常, 请稍后再试！'
	}

	return {
		type: 'ResponseErr',
		code: data.code || 'UNKNOWN',
		errMsg
	}
}