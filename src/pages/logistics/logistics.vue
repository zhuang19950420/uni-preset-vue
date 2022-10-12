<template>
  <z-toast id="z-toast"></z-toast>
  <z-loading id="z-loading" @retry="refresh"></z-loading>
  <!-- <z-navi-bar title="物流详情"></z-navi-bar> -->
  <view class="container-all" v-if="!!logisticsArr.length">
    <scroll-view scroll-x class="scroll-menu">
      <view class="blex">
        <view class="menu">
          <view
            v-for="(item, index) in logisticsArr.length"
            :key="index"
            :class="['menu-item', index == currentIndex ? 'active' : '']"
            :data-index="index"
            @tap="onTab"
          >
            <text class="menu-name">包裹{{ index + 1 }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="swiper" @change="onChange">
      <block v-for="(item, index) in logisticsArr" :key="index">
        <view class="swiper-item" v-if="index === currentIndex">
          <block>
            <view class="header">
              <view class="section">
                <text class="label">包裹{{ index + 1 }}</text>
                <view class="section-container">
                  <text class="label-num">{{ item.orderShipmentTrack.logisticsNo }}</text>
                  <view
                    class="icon-view"
                    hover-class="btn-hover-opacity"
                    @tap="onCopyOrderNumber(item.orderShipmentTrack.logisticsNo)"
                  >
                    <image class="icon" src="/static/icon/copy.png" />
                  </view>
                </view>
              </view>
              <view class="section">
                <text class="label">发货地</text>
                <view class="section-container">
                  <text class="label-name">{{
                    item.orderShipmentTrack.deliveryBranchName
                  }}</text>
                </view>
              </view>
            </view>
            <scroll-view scroll-y class="container">
              <view class="label">物流详情</view>
              <block v-if="item.orderLogistics && item.orderLogistics.steps">
                <view
                  class="cell-item"
                  v-for="(locItem, locIndex) in item.orderLogistics.steps"
                  :key="locItem.stepNumber"
                >
                  <view class="left">
                    <view :class="['tip-view', locIndex == 0 ? 'active' : '']">
                      <view class="block" v-if="locIndex == 0"></view>
                    </view>
                    <view v-if="locIndex !== locItem.length - 1" class="line"></view>
                  </view>
                  <view class="right">
                    <text class="label-date">{{ locItem.acceptTime }}</text>
                    <text class="label-detail">{{ locItem.acceptStation }}</text>
                  </view>
                </view>
              </block>
              <view v-else class="no-data">暂无物流信息</view>
            </scroll-view>
          </block>
        </view>
      </block>
    </view>
    <!-- <view class="pages" v-if="logisticsArr.length > 1"
      >{{ currentInd }}/{{ logisticsArr.length }}</view
    > -->
    <view class="bottom" :style="`height: ${isIphone ? '30' : '15'}px;`"></view>
  </view>
  <view class="no-data"> 暂无数据 </view>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import { isIpx } from "../../utils/util.js";
import { logistics } from "./service";

export default {
  components: {},
  props: {
    isIphone: {
      type: Boolean,
      default: isIpx,
    },
    // 导航栏高度
    // naviHeight: {
    //   type: Number,
    //   default: naviBarHeight(),
    // },
  },
  setup(props, ctx) {
    const currentIndex = ref(0);
    const currentInd = ref(1);
    const orderNumber = ref(null);
    // 物流信息
    const logisticsArr = ref([]);
    // 复制订单编号
    const onCopyOrderNumber = function (orderNumber) {
      uni.setClipboardData({
        data: `${orderNumber}`,
      });
    };

    // 切换
    const onTab = function (e) {
      console.log(e, "eeeeee");
      const { index } = e.currentTarget.dataset;
      console.log(index, "====>index");
      currentIndex.value = index;
    };

    // 切换swiper
    const onChange = function (e) {
      console.log(e);
      const { current, source } = e.detail;
      if (source === "touch") {
        currentIndex.value = current;
      }
    };
    /**
     * 接口请求
     */
    const getLogistics = function () {
      logistics(orderNumber.value).then((res) => {
        console.log(res);
        uni.$hideLoading();
        logisticsArr.value = res.data;
      });
    };

    return {
      currentIndex,
      currentInd,
      orderNumber,
      logisticsArr,
      onTab,

      onChange,
      onCopyOrderNumber,
      getLogistics,
    };
  },
  onLoad(options) {
    uni.$showLoading();
    this.orderNumber = options.orderNumber;
    this.getLogistics();
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
