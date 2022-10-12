<template>
  <!-- 填充视图 -->
  <view v-if="!gradient" :style="barHeightStyle"> </view>
  <!-- 导航栏固定背景容器(透明度设置) -->
  <view class="navi-bar-bg" :style="barHeightStyle + 'opacity:' + opacity"></view>
  <!-- 导航栏容器(标题，返回按钮等设置) -->
  <view :class="['navi-bar', showLeft ? 'showLeft' : '']" :style="barHeightStyle">
    <view class="navi-bar-container" :style="barContentStyle">
      <block v-if="!showLeft">
        <!-- 导航栏标题 -->
        <text v-if="title" class="title">{{ title }}</text>
        <!-- 左侧交互区域 -->
        <view
          class="action"
          v-if="leftMenuButtonStatus"
          :style="actionContainerStyle"
          hover-class="btn-hover-opacity"
          @tap="onLeftBtnClick"
        >
          <image
            v-if="leftMenuButtonStatus == 'back'"
            class="icon"
            style="padding: 0 22rpx"
            src="/static/icon/navi/back_white.png"
          ></image>
          <image
            v-else-if="leftMenuButtonStatus == 'home'"
            class="icon"
            src="/static/icon/navi/back_white.png"
          >
          </image>
        </view>
      </block>
      <block v-else>
        <view class="action-show-left">
          <image src="/static/icon/title.png" class="title"></image>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import "./index.scss";
import naviBehaviour from "../../mixin/naviBehaviour.js";
import { tabbarRoute } from "./_config.js";

export default {
  mixins: [naviBehaviour],
  components: {},
  props: {
    // 是否渐变
    gradient: {
      type: Boolean,
      default: false,
    },
    // 导航栏标题
    title: {
      type: String,
      default: "",
    },
    showLeft: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const opacity = ref(1);

    watch(
      () => props.gradient,
      (newValue) => {
        if (newValue) {
          opacity.value = 0;
        } else {
          opacity.value = 1;
        }
      },
      {
        immediate: true,
      }
    );

    const barHeightStyle = computed(() => {
      return `height:${props.naviHeight}px;`;
    });
    const barContentStyle = computed(() => {
      const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      return `top:${statusBarHeight}px;height:${props.naviHeight - statusBarHeight}px;`;
    });
    const actionContainerStyle = computed(() => {
      const { windowWidth } = uni.getSystemInfoSync();
      const { right, height } = uni.getMenuButtonBoundingClientRect();
      return `left:${windowWidth - right}px;width:${height}px;`;
    });

    const leftMenuButtonStatus = computed(() => {
      const pageStack = getCurrentPages();
      const currentPage = pageStack[pageStack.length - 1];
      const isTabbarRoute = tabbarRoute.includes(currentPage.route);

      if (!isTabbarRoute) {
        if (pageStack.length === 1) {
          return "home"; // 回到首页
        } else {
          return "back"; // 返回
        }
      }
    });

    // 左侧按钮点击事件
    const onLeftBtnClick = function () {
      switch (leftMenuButtonStatus.value) {
        case "home":
          {
            uni.$router.reLaunch({
              url: "pages/login/login",
            });
          }
          break;
        default:
          {
            uni.$router.navigateBack();
          }
          break;
      }
    };

    // 监听页面滚动
    const handlePageScroll = function (e) {
      const { scrollTop } = e;
      if (!props.gradient) {
        return;
      }
      let tempOpacity = scrollTop / props.naviHeight;
      if (tempOpacity <= 0) {
        opacity.value = 0;
      } else if (tempOpacity >= 1) {
        opacity.value = 1;
      } else {
        opacity.value = tempOpacity;
      }
    };

    return {
      opacity,
      barHeightStyle,
      barContentStyle,
      actionContainerStyle,
      leftMenuButtonStatus,
      onLeftBtnClick,
      handlePageScroll,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
