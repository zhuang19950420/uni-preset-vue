/**
 * scroll-view
 */
import { ref } from 'vue'

export const scrollViewHandler = () => {
  const currentTop = ref(0)
  const contentTop = ref(10)
  // 页面滚动
  const onScroll = function (e) {
    const { scrollTop } = e.detail
    currentTop.value = scrollTop
  }

  // 滚动回顶部
  const onGotoTop = function () {
    contentTop.value = 0
    setTimeout(() => {
      contentTop.value = 10
    }, 1000)
  }

  return {
    handlerResult: {
      currentTop,
      contentTop,
      onScroll,
      onGotoTop
    }
  }
}
