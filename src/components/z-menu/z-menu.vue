<template>
  <view class="container" :style="`height: ${height}rpx`">
    <view
      :class="from ? 'coupon-wrapper' : 'wrapper'"
      v-for="(menu, index) in menus"
      :key="index"
      @tap="onMenuClick(index)"
    >
      <view id="menu" :class="['menu', selectedIndex == index ? 'active' : 'normal']">
        <text>{{ menu.label }}</text>
      </view>
    </view>
    <view class="line" :style="lineStyle"></view>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";

export default {
  components: {},
  props: {
    // 当前选中index
    current: {
      type: [Number, String],
      default: 0,
    },
    // 菜单数据源
    menus: {
      type: Array,
      default: [],
    },
    from: {
      type: Boolean,
      default: false,
    },
    // 菜单栏高度
    height: {
      type: Number,
      default: 104,
    },
  },
  setup(props, ctx) {
    const selectedIndex = ref(0); // 当前菜单index
    const menuRectInfo = ref(null); // 菜单位置信息
    // 底部指示线样式
    const lineStyle = computed(() => {
      if (!menuRectInfo.value) {
        return "";
      }
      const currentMenuRectInfo = menuRectInfo.value[selectedIndex.value];
      const { left, width } = currentMenuRectInfo;
      return `left:${left}px;width:${width}px;`;
    });
    // 监听父传子值改变
    watch(
      () => props.current,
      (newIndex) => {
        if (newIndex != selectedIndex.value) {
          selectedIndex.value = newIndex;
        }
      },
      {
        immediate: true,
      }
    );
    // 菜单点击
    const onMenuClick = function (index) {
      uni.vibrateShort();
      if (selectedIndex.value != index) {
        selectedIndex.value = index;
        ctx.emit("change", index);
      }
    };
    return {
      selectedIndex,
      menuRectInfo,
      lineStyle,
      onMenuClick,
    };
  },
  onShow(e) {},
  onReady() {
    // 拿到菜单位置信息
    this.createSelectorQuery()
      .in(this)
      .selectAll("#menu")
      .boundingClientRect((res) => {
        this.menuRectInfo = res.map((rect) => {
          const { left, width } = rect;
          return { left, width };
        });
      })
      .exec();
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
