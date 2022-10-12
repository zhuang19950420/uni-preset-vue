/**
 * 原生扩展
 */
import router from './router'
import zToast from '../components/z-toast/z-toast.js'
import zLoading from '../components/z-loading/z-loading.js'

// 路由挂载
uni.$router = router
// DOM节点查询
uni.$queryDomRect = (nodeName, target = null) => {
  let method = uni.createSelectorQuery()
  // 组件内
  if (target) {
    method = uni.createSelectorQuery().in(target)
  }
  return new Promise(resolve => {
    method
      .select(nodeName)
      .boundingClientRect(rect => {
        resolve(rect)
      })
      .exec()
  })
}
// Toast 提示
uni.$showToast = (objc = {}, delay = 0) => {
  setTimeout(() => {
    zToast({
      ...objc
    })
  }, delay)
}
// 显示Loading 提示框
uni.$showLoading = (objc = {}, delay = 0) => {
  setTimeout(() => {
    if (objc.showError) {
      zLoading.showError({
        fail: objc.fail
      })
    } else {
      zLoading.show()
    }
  }, delay)
}
// 隐藏Loading 提示框
uni.$hideLoading = (delay = 500) => {
  setTimeout(() => {
    zLoading.hide()
  }, delay)
}

uni.$chooseAddress = (Obj = {}) => {
  uni.chooseAddress({
    success: res => {
      Obj.success && Obj.success(res)
    },
    fail: res => {
      let { errMsg } = res
      if (errMsg === 'chooseAddress:fail auth deny') {
        openSetting({
          data: {
            title: '地址权限未授权',
            content: '请授权地址，以便获取微信收获地址信息',
            showCancel: false
          },
          success: res => {
            chooseAddress(Obj)
          }
        })
      }
    }
  })
}
