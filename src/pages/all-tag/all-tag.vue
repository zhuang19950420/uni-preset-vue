<template>
  <view class="tag">
    <view class="tag-head">
      <view class="head">
        <view class="head-title">全部标签</view>
      </view>
    </view>
    <!-- tag列表 -->
    <view class="tag-content" id="tag-content">
      <view class="cell" v-for="(item,index) in tagsList" :key="index">
        <view class="cell-title">{{ item.name }}</view>
        <view class="cell-child" v-if="!!item.tags">
          <view class="item" v-for="(child,i) in item.tags" :key="i" @click="onSelectTag(child)">{{ child.tagName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { allCustomerTags } from './service'
export default {
  setup() {
    const tagsList = ref([])
    return {
      tagsList
    }
  },
  onLoad(options) {
    const { memberNo } = options
    allCustomerTags(memberNo).then(res=>{
      const { category = [] } = res.data
      this.tagsList =  category || []
    })
  }
}
</script>
<style lang="scss">
  @import "./index.scss";
</style>