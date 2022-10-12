<template>
  <!-- <z-navi-bar title="标签管理"></z-navi-bar> -->
  <view class="label-management">
    <view class="label-section">
      <view class="label-title">
        <view class="text">顾客标签</view>
        <view class="all-label">
          <view class="text">该顾客全部标签</view>
          <view class="arrow">
            <image src="/static/icon/arrow/black.png" class="image"></image>
          </view>
        </view>
      </view>
      <view class="label-list">
        <view :class="['label-item', selct ? 'select' : '']" @tap="selectLabel">
          时尚女性
        </view>
        <view class="label-item">
          时尚女性
        </view>
        <view class="label-item">
          时尚女性
        </view>
        <view class="label-item">
          时尚女性
        </view>
        <view class="label-item">
          时尚女性
        </view>
        <view class="label-item">
          线上消费者
        </view>
        <view class="label-item">
          线上消费者
        </view>
        <view class="label-item">
          时尚女性
        </view>
        <view class="label-item">
          时尚女性
        </view>
        <view class="label-item">
          时尚女性
        </view>
      </view>
    </view>

    <view class="btn">
      <z-btn title="确认" color="#fff" background="#B18C4F" :size="24"></z-btn>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const selct = ref(true)
    const selectLabel = function () {
      selct.value = !selct.value
    }

    return {
      selct,
      selectLabel
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "./index.scss";
</style>