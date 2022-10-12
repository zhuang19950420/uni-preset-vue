/**
 * 加载, 提示统一处理
 */

// 显示加载
export const showLoading = () => {
  uni.showLoading({
    mask: true,
    title: '加载中...'
  })
}

// 隐藏加载
export const hideLoading = () => {
  setTimeout(() => {
    uni.hideLoading()
  }, 0)
}