<template>
  <z-navi-bar title=""></z-navi-bar>
  <z-search-bar class="cust-bar" :style="`top: ${naviHeight}px;`" search @tapSearch="gotoSearchPageFunc"></z-search-bar>
  <view class="search">
    <view class="number">共2个结果</view>
    <view class="result-list">
      <z-list noBottom :list="searchList" @onchange="onBtnClickCallBack"></z-list>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { customerSearch } from './service'
export default {
  setup() {
    const searchList = ref(null)
    // search-搜索
    const gotoSearchPageFunc = function (e) {
      console.log(e)
      uni.vibrateShort()
      const params = {
        type: 2,
        mobile: e,
        page: 1,
        size: 30
      }
      customerSearch(params).then(res => {
        console.log('搜索结果', res)
        const { code, data } = res
        if (code !== '0') return
        searchList.value = data.result
      })
    }

    // 点击查看
    const onBtnClickCallBack = function (e) {
      uni.vibrateShort()
      uni.$router.navigateTo({
        url: `pages/customer-detail/customer-detail`
      })
    }
    return {
      searchList,
      gotoSearchPageFunc,
      onBtnClickCallBack
    }
  },
  onLoad() {
  }
}
</script>
<style lang="scss" scoped>
  @import "./index.scss";
</style>