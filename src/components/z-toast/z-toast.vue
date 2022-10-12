<template>
  <uni-popup ref="toast" mask-background-color="rgba(0,0,0,0)" :animation="false">
    <view class="toast-container">
      <view class="toast">
        <image src="/static/icon/toast/logo_white.png" class="icon"></image>
        <text class="label">{{ title }}</text>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import "./index.scss";

export default {
  components: {},
  props: {},
  setup(props, ctx) {
    const toast = ref(null);
    const title = ref("");

    const show = function (e) {
      toast.value.open();
      title.value = e.title || "";
      setTimeout(() => {
        toast.value.close();
      }, e.duration || 1800);
    };

    const hide = function () {
      toast.value.close();
    };

    return {
      toast,
      title,
      show,
      hide,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
