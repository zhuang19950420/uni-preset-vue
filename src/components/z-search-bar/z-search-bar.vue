<template>
  <!-- 填充视图 -->
  <!-- <view class="temp-view"> </view> -->
  <view
    :class="['container', fixed ? 'pos' : fixedAdd ? 'posAdd' : '']"
    :style="`z-index: ${zIndex}`"
  >
    <block v-if="search">
      <view class="search">
        <view class="content">
          <image src="/static/icon/search.png" class="search-img"></image>
          <input
            :disabled="enable"
            type="text"
            :value="val || valueNumber"
            class="search-input"
            :placeholder="placeTitle"
            @confirm="onSearchClick"
          />
          <view class="close" v-if="val || valueNumber" @tap="clearBtn">
            <uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
          </view>
          <view class="close" v-else></view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
// import { getKeyword } from './service'

export default {
  components: {},
  props: {
    val: {
      type: String,
      value: "",
    },
    search: {
      type: Boolean,
      value: false,
    },
    enable: {
      type: Boolean,
      value: false,
    },
    placeTitle: {
      type: String,
      default: "通过手机号搜索会员",
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    fixedAdd: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 100,
    },
  },
  setup(props, ctx) {
    // 默认关键字
    const defaultKey = ref(null);
    const valueNumber = ref(null);
    const onSearchClick = function (e) {
      const { value } = e.detail;
      valueNumber.value = value;
      const valueSearch = !!value
        ? value
        : defaultKey.value !== "请输入搜索商品名"
        ? defaultKey.value
        : null;
      ctx.emit("tapSearch", valueSearch);
    };
    const clearBtn = function () {
      valueNumber.value = null;
      console.log(valueNumber.value);
      ctx.emit("tapSearch", valueNumber.value);
    };

    // 初始化
    const init = () => {
      valueNumber.value = null;
    };
    return {
      init,
      defaultKey,
      valueNumber,
      onSearchClick,
      clearBtn,
    };
  },
  onShow(e) {
    // this.getKeywordDef()
  },
  onReady() {},
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
