<template>
  <view class="tag">
    <view class="tag-head">
      <view class="head">
        <view class="head-title">顾客标签</view>
        <view class="head-nav" @click="onToClick">
          该顾客全部标签
          <image class="head-nav-icon" src="/static/icon/arrow/black.png" />
        </view>
      </view>
    </view>
    <!-- tag列表 -->
    <view class="tag-content" id="tag-content">
      <view class="cell" v-for="(item, index) in tagsList" :key="index">
        <view class="cell-title">{{ item.name }}</view>
        <view class="cell-child" v-if="!!item.tags">
          <view
            :class="`item ${child.selected === 1 ? 'active' : ''}`"
            v-for="(child, i) in item.tags"
            :key="i"
            @click="onSelectTag(child)"
            >{{ child.tagName }}</view
          >
        </view>
      </view>
    </view>
    <view class="tag-footer">
      <view
        :class="`tag-button ${position}`"
        v-if="!!tagsList && !!tagsList.length && !!position"
      >
        <z-btn title="确认" background="#968765" :size="24" @btntap="saveTags"></z-btn>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from "vue";
import { handlerTags } from "./handler";
import { tagPool, updateCustomerTags } from "./service";
const { windowHeight } = uni.getSystemInfoSync();
export default {
  setup() {
    const tagsList = ref([]);
    const position = ref(null);
    const memberNo = ref(null);
    const onSelectTag = function (item) {
      item.selected = item.selected === 1 ? 0 : 1;
      item.clickNum = !item.clickNum || item.clickNum == 0 ? 1 : 0;
    };
    const onToClick = function () {
      uni.$router.navigateTo({
        url: `pages/all-tag/all-tag?memberNo=${memberNo.value}`,
      });
    };
    const saveTags = function () {
      const category = handlerTags(tagsList.value);
      if (!category.length) return;
      updateCustomerTags({ category: category, memberNo: memberNo.value }).then((res) => {
        if (res.code == "0") {
          uni.$showToast({
            title: "更新成功",
          });
        }
      });
    };
    const checkBtnposition = function () {
      uni.$queryDomRect(".tag-footer", this).then((rect) => {
        const { top } = rect;
        position.value = top < windowHeight - 32 ? "normal" : "bottom";
      });
    };
    return {
      tagsList,
      position,
      memberNo,

      saveTags,
      onToClick,
      onSelectTag,
      checkBtnposition,
    };
  },
  onLoad(options) {
    const { memberNo } = options;
    this.memberNo = memberNo;
    tagPool({ memberNo }).then((res) => {
      const { category = [] } = res.data;
      this.tagsList = category || [];
      setTimeout(() => {
        this.checkBtnposition();
      }, 0);
    });
  },
};
</script>
<style lang="scss">
@import "./index.scss";
</style>
