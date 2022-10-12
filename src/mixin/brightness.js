export default {
	onLoad() {
		// 获取当前屏幕的亮度
		uni.getScreenBrightness({
			success: res => {
				let lightValue = res.value
				this.lightValue = lightValue
			},
		})
	},
	onShow() {
		// 设置屏幕零度最大
		setTimeout(() => {
			uni.setScreenBrightness({ value: 0.99 })
		}, 200)
	},
	onHide() {
		// 恢复屏幕亮度为之前的状态
		uni.setScreenBrightness({ value: this.lightValue })
	},
	onUnload() {
		// 恢复屏幕亮度为之前的状态
		uni.setScreenBrightness({ value: this.lightValue })
	}
};
