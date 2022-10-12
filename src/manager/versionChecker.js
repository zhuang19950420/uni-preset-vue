/**
 * 版本更新
 */

class VersionChecker {
  constructor() {}

  canUse() {
    return uni.canIUse('getUpdateManager')
  }

  update() {
    if (!this.canUse()) return

    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log('onCheckForUpdate => ', res.hasUpdate)
    })

    updateManager.onUpdateReady(() => {
      uni.showModal({
        title: '更新提示',
        content: '版本已更新，请重启小程序以正常使用。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(() => {})
  }
}

export default new VersionChecker()
