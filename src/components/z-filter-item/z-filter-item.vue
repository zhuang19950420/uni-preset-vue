<template>
  <view class="filter-section" >
    <view class="title-close">
      <view class="title">会员等级</view>
      <view class="close">X </view>
    </view>
    <view class="filter-list">
      <block v-for="(filterItem, filterIndex) in section" :key="filterIndex">
        <view :class="['filter-item', filterIndex == currentFilterIndex ? 'select' : '']" :data-code="filterItem.code"  :data-filter-index="filterIndex" @tap="selectItemFunc">
          {{filterItem.name}}
        </view>
      </block>
    </view>
  </view>
</template>
<script>
import { ref, watch } from 'vue'
export default {
  props: {
    section: {
      type: Array,
      default: []
    },
    clear: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    watch(
      () => props.section,
      (section) => {
        console.log('section', section)
      }
    )
    watch(
      () => props.clear,
      (clear) => {
        if (clear) {
          currentFilterIndex.value = -1
        }
      }
    )
    // 当前第几个
    const currentFilterIndex = ref()
    const selectItemFunc = function (e) {
      const { code, filterIndex } = e.currentTarget.dataset
      currentFilterIndex.value = filterIndex
      ctx.emit('select', {code, filterIndex})
    }
    return {
      currentFilterIndex,
      selectItemFunc
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "./index.scss";
</style>