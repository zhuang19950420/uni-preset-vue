<template>
  <view class="search">
    <view class="search-container">
      <image
        class="search-icon"
        src="../../static/icon/search.png"
        mode="widthFix"
        @tap="onSearch"
      />
      <input
        :placeholder="placeTitle"
        :value="searchContent"
        type="number"
        class="search-input"
        @input="onInput"
        @confirm="onSearch"
        @blur="onSearch"
      />
      <view class="close" @tap="clearBtn" v-if="clear">
        <uni-icons type="close" size="18" color="#a48f6b"></uni-icons>
      </view>
      <view class="search-title" @tap="onSearch">搜索</view>
    </view>
  </view>
</template>

<script>
import { ref } from "vue";
import { isPhone } from "../../../utils/util";
export default {
  props: {
    placeTitle: {
      type: String,
      default: "通过手机号搜索并添加收券会员",
    },
  },
  setup(props, { emit }) {
    const clear = ref(false);
    const searchContent = ref("");
    // input框
    const onInput = (e) => {
      searchContent.value = e.detail.value;
      clear.value = !!searchContent.value;
    };

    // 点击搜索
    const onSearch = () => {
      uni.vibrateShort();
      emitHandler("search");
    };

    // 点击清除
    const clearBtn = () => {
      searchContent.value = "";
      clear.value = false;
      emitHandler("clear");
    };

    const emitHandler = (type) => {
      emit("onSearch", { type: type, value: searchContent.value });
    };
    return {
      clear,
      searchContent,

      onInput,
      onSearch,
      clearBtn,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
