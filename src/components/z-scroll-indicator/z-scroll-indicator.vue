<template>
  <view class="container">
    <!-- 刷新 -->
    <image
      class="icon"
      src="../../static/icon/refresh.png"
      hover-class="btn-hover-opacity"
      mode="widthFix"
      @tap="onRefresh"
    />
    <!-- 滚动回顶部 -->
    <image
      :class="['icon', visible ? 'visible' : '']"
      hover-class="btn-hover-opacity"
      @tap="onIndicatorClick"
      src="../../static/icon/toTop.png"
    />
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";

export default {
  components: {},
  props: {
    contentTop: {
      type: Number,
      value: 0,
    },
  },
  setup(props, ctx) {
    const visible = ref(false);
    watch(
      () => props.contentTop,
      (newVal) => {
        if (newVal >= 260) {
          !visible.value && (visible.value = true);
        } else {
          visible.value && (visible.value = false);
        }
      }
    );
    const onIndicatorClick = function () {
      uni.vibrateShort();
      ctx.emit("onGoTop");
    };
    const onRefresh = function () {
      uni.vibrateShort();
      ctx.emit("onRefresh");
    };
    return {
      visible,
      onRefresh,
      onIndicatorClick,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
