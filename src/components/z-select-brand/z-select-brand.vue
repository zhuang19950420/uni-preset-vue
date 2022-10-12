<template>
  <uni-popup ref="popup" type="top" :mask-click="false">
    <view
      class="filter-detail"
      :style="`margin-top: ${naviHeight}px; min-height: calc(100vh - ${naviHeight}px);`"
    >
      <z-search-bar
        ref="searchBar"
        fixed
        placeTitle="搜索品牌"
        search
        @tapSearch="onSearch"
      ></z-search-bar>
      <view class="brand-title">
        <view class="title">品牌</view>
        <view class="close" @tap="close">
          <uni-icons type="closeempty" size="18" color="#000"></uni-icons>
        </view>
      </view>
      <scroll-view
        scroll-y
        class="scroll-filter"
        :scroll-into-view="current.intoIndex"
        scroll-with-animation
        :style="`height: calc(100vh - ${naviHeight + 54 + 60}px)`"
        @scroll="onScroll"
      >
        <view class="filter">
          <view class="indexer">
            <view
              class="indexer-item"
              v-for="(item, index) in brand"
              :key="index"
              :id="`text${index}`"
            >
              <view class="title">{{ item.name }}</view>
              <view
                class="sub-item"
                v-for="(subItem, subIndex) in item.list"
                :key="subIndex"
                :data-code="subItem.brandCode"
                :data-name="subItem.brandName"
                @tap="onSelectSubItem"
              >
                <view
                  class="text"
                  :class="selectBrand.code === subItem.brandCode ? 'active' : ''"
                  >{{ subItem.brandName }}</view
                >
                <!-- <z-checkbox border></z-checkbox> -->
                <image
                  v-if="selectBrand.code === subItem.brandCode"
                  class="select"
                  src="../../static/icon/product/select.png"
                  mode="widthFix"
                />
              </view>
            </view>
          </view>
        </view>
        <!-- 填充块 -->
        <view class="fill"></view>
      </scroll-view>
      <view class="position-title">
        <view
          v-for="(item, index) in brand"
          :key="index"
          class="title"
          :data-index="index"
          :data-name="item.name"
          @tap="onSelect"
        >
          <text>{{ item.name }}</text>
        </view>
      </view>
      <!-- 底部按钮 -->
      <view class="footer">
        <view class="reset btn" @tap="clear">
          <z-btn title="重置" :size="24" color="#B18C4F" background="#fff"></z-btn>
        </view>
        <view class="complete btn" @tap="onComplete">
          <z-btn title="完成" :size="24" color="#fff" background="#B18C4F"></z-btn>
        </view>
      </view>
      <view class="tooltip" v-if="isShow">
        {{ current.currName }}
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { pinyin } from "pinyin-pro";
import { reactive, ref } from "vue";
import { words } from "./_config";
import { naviBarHeight } from "../../utils/util.js";
export default {
  props: {
    naviHeight: {
      type: Number,
      default: naviBarHeight(),
    },
    brand: {
      type: Array,
      default: [],
    },
  },
  setup(props, ctx) {
    // 弹窗控制
    const popup = ref(null);
    const searchBar = ref(true);
    // 当前选择的字母
    const current = reactive({
      intoIndex: null,
      currName: null,
    });
    // 选中的品牌
    const selectBrand = reactive({
      code: "",
      name: "",
    });
    // 是否显示
    const isShow = ref(false);

    // 开启
    const open = function () {
      current.intoIndex = null;
      current.currName = null;
      popup.value.open();
    };

    // 关闭
    const close = function () {
      popup.value.close();
      ctx.emit("onComplete", "");
      searchBar.value.init();
    };

    // 清空 - 重置
    const clear = function () {
      selectBrand.code = "";
      selectBrand.name = "";
      ctx.emit("onComplete", selectBrand);
      searchBar.value.init();
    };

    // 完成
    const onComplete = function () {
      if (!selectBrand.code) return;
      ctx.emit("onComplete", selectBrand);
      searchBar.value.init();
    };

    // 右侧字母选择
    const onSelect = function (e) {
      const { index, name } = e.currentTarget.dataset;
      current.intoIndex = "text" + index;
      current.currName = name;
      isShow.value = true;
      setTimeout(() => {
        isShow.value = false;
      }, 300);
    };

    // 搜索框搜索内容
    const onSearch = function (e) {
      if (e) {
        let firstName = pinyin(e, { pattern: "first" }).substring(0, 1).toUpperCase();
        let index = words.indexOf(firstName);
        current.intoIndex = "text" + index;
        current.currName = words[index];
      } else {
        current.intoIndex = "text" + 0;
        current.currName = words[0];
      }
    };

    // 选择品牌
    const onSelectSubItem = function (e) {
      const { code, name } = e.currentTarget.dataset;
      console.log("选择的品牌是====》", code);
      selectBrand.code = code;
      selectBrand.name = name;
    };

    // 滚动条滚动
    const onScroll = (e) => {
      if (!!current.intoIndex) {
        current.intoIndex = null;
        current.currName = null;
      }
    };

    return {
      popup,
      open,
      close,
      clear,
      isShow,
      current,
      onSelect,
      onSearch,
      onScroll,
      searchBar,
      onComplete,
      selectBrand,
      onSelectSubItem,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
