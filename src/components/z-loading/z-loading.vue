<!-- 加载视图 -->
<template>
  <uni-popup
    ref="loadingPopup"
    :mask-click="false"
    :animation="false"
    background-color="#fff"
  >
    <view class="loading-container">
      <view class="loadEffect" v-if="type === 'loading'">
        <view class="circle"></view>
        <view class="circle"></view>
        <view class="circle"></view>
        <view class="circle"></view>
        <view class="circle"></view>
      </view>
      <view class="error-container" v-else-if="type === 'error'">
        <image src="/static/icon/error.png" class="img"></image>
        <text class="label">页面加载失败,请检查您的\n网络设置后重试</text>
        <view class="retry-btn" @tap="onBtnClick" hover-class="btn-hover-opacity">
          <text>重试</text>
        </view>
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
    const type = ref("loading");
    const loadingPopup = ref(null);

    const showError = function () {
      type.value = "error";
      loadingPopup.value.open();
    };

    const show = function (e) {
      type.value = "loading";
      loadingPopup.value.open();
    };

    const hide = function () {
      loadingPopup.value.close();
    };

    const onBtnClick = function () {
      //重试
      show();
      ctx.emit("retry");
    };

    return {
      type,
      loadingPopup,
      showError,
      show,
      hide,
      onBtnClick,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
