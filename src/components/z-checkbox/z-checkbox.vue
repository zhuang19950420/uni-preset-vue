<template>
  <view class="wrapper" hover-class="btn-hover-opacity">
    <view :class="['container', isChecked ? 'checked' : 'normal']" :style="{border: border ? '1px solid #ccc' : '1px solid #f1f2f3'}">
      <image wx:if="isChecked" class="icon" src="/static/icon/select.png" />
    </view>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";

export default {
  components: {},
  props: {
    // 当前是否选中
    checked: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 1000
    }
  },
  setup(props, ctx) {
    const isChecked = ref(false); // 当前是否选中
    watch(
      () => props.checked,
      (newValue) => {
        isChecked.value = newValue;
      },
      {
        immediate: true,
      }
    );

    const onCheckChange = function () {
      uni.vibrateShort();
      isChecked.value = !isChecked.value;
      ctx.emit("change", {
        value: isChecked.value,
        source: "tap",
        index: props.index
      });
    };
    return {
      isChecked,
      onCheckChange,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
