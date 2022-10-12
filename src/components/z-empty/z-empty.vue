<template>
  <view v-if="mapType" :class="['empty-container', animation ? 'an' : '']">
    <block v-if="mappedItem">
      <image class="icon" :src="mappedItem.icon" />
      <view class="label" v-if="mappedItem.label">{{ mappedItem.label }}</view>
      <view class="desc">{{ mappedItem.hint }}</view>
      <z-btn
        class="btn"
        :auth="mappedItem.cta.auth"
        :background="mappedItem.cta.background"
        :title="mappedItem.cta.title"
        @btntap="onBtnClik(mappedItem.cta)"
      ></z-btn>
    </block>
  </view>
  <!-- 普通类型 -->
  <view v-else class="normal-empty-container">
    <!-- 空数据提示 -->
    <text v-if="empty" class="an">{{ emptyTitle }}</text>
    <!-- 暂无更多提示 -->
    <text v-else class="an">{{ totalTitle }}</text>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import { emptyTypeConfig } from "./config";

export default {
  components: {},
  props: {
    // 匹配类型
    mapType: {
      type: [String, Boolean],
      default: false,
    },
    // 是否为空
    empty: {
      type: Boolean,
      default: true,
    },
    // 空数据提示
    emptyTitle: {
      type: String,
      default: "",
    },
    // 暂无更多提示
    totalTitle: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    const animation = computed(() => {
      const anType = ["CART_AUTH"];
      if (anType.includes(props.mapType)) {
        return false;
      }
      return true;
    });
    const mappedItem = computed(() => {
      if (emptyTypeConfig[props.mapType]) {
        return emptyTypeConfig[props.mapType];
      }
      return null;
    });

    const onBtnClik = function (e) {
      const { path } = e;
      if (path) {
        uni.$router.navigateTo({
          url: path,
        });
      }
    };

    return {
      animation,
      mappedItem,
      onBtnClik,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
