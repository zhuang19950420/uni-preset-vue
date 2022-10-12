<template>
  <uni-popup ref="popup" type="top" :mask-click="false">
    <view class="filter-detail" :style="`margin-top: ${filterTop ? filterTop : naviHeight}px;`">
      <scroll-view class="scroll-filter" scroll-y="true">
        <view class="list">
          <!-- <block v-for="(item, index) in filterList" :key="index"> -->
            <z-filter-item :section="filterList" @select="selectCallback" :clear="clearSelectInfo"></z-filter-item>
          <!-- </block> -->
        </view>
      </scroll-view>
      <view class="footer">
        <view class="reset btn" @tap="resetBtnFunc">
          <z-btn title="重置" :size="24" color="#B18C4F" background="#fff"></z-btn>
        </view>
        <view class="complete btn" @tap="completeFunc">
          <z-btn title="完成" :size="24" color="#fff" background="#B18C4F"></z-btn>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { ref } from 'vue'
import { filterHanlder } from './_config'
import { naviBarHeight } from "../../utils/util.js";
export default {
  props: {
    // 导航栏高度
    naviHeight: {
      type: Number,
      default: naviBarHeight(),
    }, 
    filterTop: {
      type: Number,
      default: 0
    },
    filterList: {
      type: Array,
      default: []
    }
  },
  setup(props, ctx) {
    console.log('filterList', props.filterList)
    // 弹窗控制字段
    const popup = ref(null);
    const clearSelectInfo = ref(false)
    const filterNumber = ref(null)
    // 开启弹窗
    const open = function () {
      popup.value.open();
    }
    // 关闭弹窗
    const close = function () {
      popup.value.close()
    }

    // 选择条件callback
    const selectCallback = function (e) {
      console.log('selectCallback', e)
      filterNumber.value = e.code
      clearSelectInfo.value = false
    }

    // 点击重置
    const resetBtnFunc = function () {
      uni.vibrateShort()
      filterNumber.value = null
      clearSelectInfo.value = true
    }
    // 点击完成
    const completeFunc = function () {
      uni.vibrateShort()
      close()
      ctx.emit('onfilter', filterNumber.value)
    }
    return {
      popup,
      open,
      close,
      resetBtnFunc,
      selectCallback,
      clearSelectInfo,
      completeFunc
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>