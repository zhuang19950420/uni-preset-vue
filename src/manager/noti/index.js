/**
 * 通知管理
 */

import { NOTI_TEMPLATE } from './_config.js'
import { sendNotifitionEvent } from './_service.js'
import { getCurrentPage } from '../../utils/util.js'

export const sentSubscribeMessage = (type = '', cb) => {
	const tmplIds = NOTI_TEMPLATE[type]

	if (!wx.canIUse('requestSubscribeMessage')) {
		cb && cb()
		return
	}

	wx.requestSubscribeMessage({
		tmplIds,
		success: res => {
			const acceptIds = []
			const rejectIds = []
			for (const key in res) {
				res[key] === 'accept' && acceptIds.push(key)
				res[key] === 'reject' && rejectIds.push(key)
			}

			sendNotifitionEvent({
				templateIdMap: {
					true: acceptIds,
					false: rejectIds
				},
				pagePath: getCurrentPage().route
			})

			cb && cb(acceptIds)
		},
		fail: ({ errMsg }) => {
			uni.$showToast({
				title: `${errMsg}`
			})
		}
	})
}
