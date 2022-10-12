import QRCode from '../libs/weapp.qrcode.esm.js'
import BARCode from '../libs/barcode.js'

const convertLength = function(length, ratio = 750) {
	return Math.round((uni.getSystemInfoSync().windowWidth * length) / ratio)
}

// 二维码创建
export const createQrCode = (id, code, width, height, component, cb) => {
	QRCode({
		width: convertLength(width),
		height: convertLength(height),
		canvasId: id,
		text: code,
		_this: component,
		callback: () => {
			// 安卓机上不准确，生成的二维码无法扫描，加延时解决
			setTimeout(() => {
				uni.canvasToTempFilePath({
					canvasId: id,
					success: res => {
						cb && cb(res.tempFilePath)
					}
				}, component)
			}, 500)
		}
	})
}

// 条形码创建
export const createBarCode = (id, code, width, height, callback) => {
	BARCode(uni.createCanvasContext(id), code, convertLength(width), convertLength(height), () => {
		// 安卓机上不准确，生成的二维码无法扫描，加延时解决
		setTimeout(() => {
			uni.canvasToTempFilePath({
				canvasId: id,
				success: res => {
					callback && callback(res.tempFilePath)
				}
			})
		}, 500)
	})
}
