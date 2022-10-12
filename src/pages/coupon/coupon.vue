<template>
  <z-navi-bar title="BOULEVARD  LUXE" showLeft></z-navi-bar>
  <z-loading id="z-loading" @retry=""></z-loading>
  <block v-if="!loading">
    <block v-if="noShow">
      <view :class="['no-show', noShow ? 'show' : 'hide']">暂无权限查看</view>
    </block>
    <view class="container" v-if="!noShow && !loading">
      <view class="header">礼券列表</view>

      <!-- 优惠券列表 -->
      <scroll-view
        scroll-y
        class="coupon-list"
        refresher-enabled
        :refresher-triggered="triggered"
        @refresherrefresh="onRefresh"
      >
        <view
          class="coupon-item"
          v-for="(item, index) in coupon"
          :key="index"
          @tap="onSelect(item)"
        >
          <view class="coupon-info">
            <image class="coupon-icon" src="../../static/icon/default-coupon.png" />
            <view class="coupon-name">{{ item.name }}</view>
          </view>
          <view class="arrow">
            <image
              class="arrow-icon"
              src="../../static/icon/arrow_black.png"
              mode="widthFix"
            />
          </view>
        </view>
      </scroll-view>
    </view>
  </block>

  <coupon-popup ref="couponPopup"></coupon-popup>
</template>

<script>
import { ref, nextTick } from "vue";
import { getCoupon } from "./service";
import um from "../../manager/userManager";
import { IdentityLimit } from "../../handler/storeHanlder";
import couponPopup from "../../components/coupon-components/coupon-popup/coupon-popup";
export default {
  components: {
    couponPopup,
  },
  setup() {
    const coupon = ref([]);
    const noShow = ref(false);
    const loading = ref(true);
    const triggered = ref(false);
    const couponPopup = ref(null);
    // 点击-礼券icon
    const onSelect = (value) => {
      uni.vibrateShort();
      couponPopup.value.clearHandler();
      couponPopup.value.open(value);
    };

    // 礼券弹窗关闭
    const closePopup = () => {
      couponPopup.value.close();
    };

    // 下拉刷新
    const onRefresh = () => {
      console.log("下拉刷新触发");
      getCouponList({ type: "pulldown" });
    };
    // 复位
    const stopeConfig = () => {
      if (!triggered.value) {
        triggered.value = null;
        setTimeout(() => {
          triggered.value = false;
        }, 800);
      } else {
        triggered.value = false;
      }
    };

    /**
     * 接口
     */
    // 获取券列表
    const getCouponList = (type = null) => {
      if (type && type.type == "pulldown") {
        stopeConfig();
      }
      getCoupon().then((res) => {
        uni.$hideLoading();
        loading.value = false;
        coupon.value = res.data;
      });
    };

    return {
      coupon,
      noShow,
      loading,
      triggered,
      couponPopup,

      onSelect,
      onRefresh,
      closePopup,
      getCouponList,
    };
  },
  onShow() {
    um.getUserInfo().then((user) => {
      this.noShow = !IdentityLimit(user);
    });
    nextTick(() => {
      this.closePopup();
    });
  },
  onLoad() {
    uni.$showLoading();
    this.loading = true;
    this.getCouponList();
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
