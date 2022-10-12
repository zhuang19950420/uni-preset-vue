<template>
  <view class="z-container" :style="`padding-top:${naviHeight}px`">
    <slot></slot>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import naviBehaviour from "../../mixin/naviBehaviour";

export default {
  mixins: [naviBehaviour],
  components: {},
  props: {},
  setup(props, ctx) {
    return {};
  },
  onShow(e) {},
  onReady() {},
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
