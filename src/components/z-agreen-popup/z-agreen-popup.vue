<template>
  <uni-popup ref="popup" type="center" :is-mask-click="false">
    <view class="tips">
      <view class="title">发券之前请确保拿到相应审批</view>

      <view class="tips-button">
        <view class="cancel btn">
          <z-btn
            title="取消"
            color="#B18C4F"
            background="#fff"
            @btntap="onClickBtn('cancel')"
          ></z-btn>
        </view>
        <view class="line"></view>
        <view class="confirm btn">
          <z-btn
            title="确认"
            color="#B18C4F"
            background="#fff"
            @btntap="onClickBtn('confirm')"
          ></z-btn>
        </view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
import { ref } from "vue";
export default {
  setup(props, { emit }) {
    const popup = ref(null);
    const open = () => {
      popup.value.open();
    };
    const close = () => {
      popup.value.close();
    };

    const onClickBtn = (type) => {
      emit("onClick", { type: type });
    };
    return {
      open,
      close,
      popup,
      onClickBtn,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
