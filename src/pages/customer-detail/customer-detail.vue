<template>
  <z-loading id="z-loading" @retry=""></z-loading>
  <!-- <z-navi-bar></z-navi-bar> -->
  <view class="customer-detail" v-if="!loading">
    <view class="user-card">
      <view class="user-info-top">
        <view :class="[customerInfo.avatar ? 'user-photo' : 'default-photo']">
          <image
            :src="customerInfo.avatar || '/static/icon/default_photo.png'"
            class="image"
          ></image>
        </view>
        <view class="user-name-position-id">
          <view class="user-name-position">
            <view class="user-name">{{ customerInfo.memberName }}</view>
            <view class="user-position">{{ customerInfo.memberTypeName }}</view>
          </view>
          <view class="user-id">ID：{{ customerInfo.memberNo }}</view>
        </view>
      </view>
      <view class="user-info-content">
        <view class="user-infomation">
          <view class="sex module"
            >性别：{{ customerInfo.gender === "M" ? "男" : "女" }}</view
          >
          <view class="birth module">生日： {{ customerInfo.birthday }}</view>
          <view class="integral module">积分：{{ customerInfo.point }}</view>
          <view class="mobile module">
            <view class="mobile-number">
              手机号：{{ passwordType ? customerInfo.mobile : customerInfo.mobilePass }}
            </view>
            <view class="copy">
              <image
                v-if="!passwordType"
                src="/static/icon/mobile_close.png"
                class="image"
                @tap="clickShowMobile"
              ></image>
              <image
                v-else
                src="/static/icon/mobile_copy.png"
                class="image"
                :data-mobile="customerInfo.mobile"
                @tap="clickCopyMobile"
              ></image>
            </view>
          </view>
        </view>
        <view class="line"></view>
      </view>
      <view class="user-info-label">
        <view class="item">
          <view class="title">系统标签</view>
          <view class="label-list" v-if="customerInfo.systemTags.length > 0">
            <view
              class="label-item"
              v-for="(item, index) in customerInfo.systemTags"
              :key="index"
            >
              {{ item }}
            </view>
          </view>
        </view>
        <view class="item">
          <view class="title">
            <view class="text">顾客标签</view>
            <view class="label-admin" @tap="onToCustomerTag">
              <view class="text">标签管理</view>
              <image src="/static/icon/arrow/white.png" class="image"></image>
            </view>
          </view>
          <view class="label-list" v-if="customerInfo.subjectiveTags.length > 0">
            <view
              class="label-item"
              v-for="(item, index) in customerInfo.subjectiveTags"
              :key="index"
            >
              {{ item }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 订单和礼券 -->
    <view class="user-order-coupon">
      <z-menu
        :menus="menus"
        from
        :current="currentTab"
        :height="112"
        @change="onMenuChangeCallBack"
      ></z-menu>
      <view class="order-tab" v-if="currentTab == 0">
        <scroll-view
          scroll-y="true"
          class="scroll"
          :show-scrollbar="false"
          refresher-enabled
          :refresher-triggered="triggered"
          @scrolltolower="scrollCouponFunc"
          @refresherrefresh="configData"
          @refresherrestore="stopeConfigData"
        >
          <view class="order-list">
            <view class="order-item" v-for="(item, index) in historyOrder" :key="index">
              <view class="order-top">
                <view class="order-type">{{ item.orderTypeName }}</view>
                <view class="order-time">{{ item.orderTime }}</view>
                <view class="order-price">
                  {{ item.totalFee }}
                </view>
              </view>
              <view
                class="product-list"
                v-if="item.orderItems && item.orderItems.length > 0"
              >
                <view
                  class="product-item"
                  v-for="(orderItem, orderIndex) in item.orderItems"
                  :key="orderIndex"
                >
                  <view class="product-img">
                    <image src="/static/image/default_product.png" class="image"></image>
                  </view>
                  <view class="product-info">
                    <view class="product-name">{{ orderItem.productName }}</view>
                    <view class="product-order-number"
                      >货号：{{ orderItem.productCode }}</view
                    >
                    <view class="product-qty">件数：{{ orderItem.quantity }}</view>
                  </view>
                </view>
              </view>
              <view class="line"></view>
              <view class="store-info">
                <view class="position-image">
                  <image class="image" src="/static/icon/address.png"></image>
                </view>
                <view class="text">门店：</view>
                <view class="store-name"
                  >{{ item.storeCode }} &nbsp;{{ item.storeName }}</view
                >
              </view>
            </view>
            <z-empty
              v-if="historyOrder.length == 0 && emptyShow"
              class="empty-wrapper"
              :empty="historyOrder.length == 0"
              empty-title="没有更多了"
              total-title="正在加载中"
            ></z-empty>
          </view>
        </scroll-view>
        <!-- <view v-else class="no-order-list">
            暂无数据
          </view> -->
      </view>
      <view class="coupon-tab" v-if="currentTab == 1">
        <scroll-view
          scroll-y="true"
          class="scroll"
          refresher-enabled
          :refresher-triggered="triggered"
          @scrolltolower="scrollCouponFunc"
          @refresherrefresh="configData"
        >
          <view class="coupon-list">
            <view class="coupon-item" v-for="(item, index) in couponArr" :key="index">
              <view class="coupon-top">
                <view class="coupon-type">{{ item.statusName }}</view>
                <view class="coupon-time">{{
                  item.statusName === "已使用" ? item.useTime : item.expireTime
                }}</view>
              </view>
              <view class="coupon-list">
                <view class="coupon-item-info">
                  <view class="coupon-img">
                    <image src="/static/image/default_coupon.png" class="image"></image>
                  </view>
                  <view class="coupon-info">
                    <view class="coupon-name">{{ item.projectName }}</view>
                    <view class="coupon-order-number">货号：{{ item.couponNo }}</view>
                    <view class="coupon-validity"
                      >{{ item.grantTime }} - {{ item.expireTime }}</view
                    >
                  </view>
                </view>
              </view>
            </view>
            <z-empty
              v-if="couponArr.length == 0 && emptyShow"
              class="empty-wrapper"
              :empty="couponArr.length == 0"
              empty-title="没有更多了"
              total-title="正在加载中"
            ></z-empty>
          </view>
        </scroll-view>
      </view>
    </view>
    <view
      class="bottom"
      v-if="
        (currentTab == 0 && historyOrder.length > 0) ||
        (currentTab == 1 && couponArr.length > 0)
      "
    >
      <view class="shadow"></view>
      <view class="center-image">
        <image src="/static/icon/icon_bottom.png" class="image"></image>
      </view>
      <view class="shadow"></view>
    </view>
  </view>
</template>

<script>
import { reactive, ref } from "vue";
import { customer } from "./_config";
import { memberHistoryOrder, memberCoupon, memberInfo } from "./service";
import zEmpty from "../../components/z-empty/z-empty.vue";
import Pagination from "../../manager/pagination";
export default {
  components: { zEmpty },
  props: {
    menus: {
      type: Array,
      default: customer,
    },
    pagination: {
      type: Object,
      default: new Pagination({
        page: 1,
        size: 10,
      }),
    },
  },
  setup(props) {
    const loading = ref(true);
    const triggered = ref(false);
    const emptyShow = ref(true);
    // customer-参数
    const customerParams = reactive({
      memberNo: "",
      mobile: "",
    });
    // 手机号是否完整显示
    const passwordType = ref(false);
    const paramsPage = ref(1);
    const paramsSize = ref(10);
    // 当前menu
    const currentTab = ref(0);
    const customerInfo = ref(null);
    // 历史订单列表
    const historyOrder = ref([]);
    // coupon列表
    const couponArr = ref([]);
    // menu切换
    const onMenuChangeCallBack = function (e) {
      currentTab.value = e;
      paramsPage.value = 1;
      props.pagination.reset();
      if (currentTab.value == 0) getOrderList();
      else getCouponList();
    };

    // 获取会员信息
    const getMemberInfoMessage = function () {
      const params = {
        memberNo: customerParams.memberNo,
        mobile: customerParams.mobile,
      };
      memberInfo(params)
        .then((res) => {
          loading.value = false;
          uni.$hideLoading();
          const { code, data } = res;
          if (code !== "0") return;
          data.mobilePass = getTel(data.mobile);
          customerInfo.value = data;
        })
        .catch((err) => {
          loading.value = false;
          uni.$hideLoading();
          uni.showToast({
            title: "接口请求失败",
            icon: "none",
          });
        });
    };

    const getTel = function (tel) {
      return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4);
    };

    // 获取历史订单
    const getOrderList = function (type = null) {
      console.log("type====>", type);
      if (historyOrder.value && historyOrder.value.length > 0 && !type) {
        return;
      }
      if (type && type.type == "pulldown") {
        props.pagination.reset();
        stopeConfigData();
      }
      const params = {
        page: props.pagination.page,
        size: 10,
      };
      memberHistoryOrder(customerParams.memberNo, params).then((res) => {
        const { result = [], total } = res.data;
        props.pagination.setTotal(total);
        if (props.pagination.page == 1) {
          historyOrder.value = result;
        } else {
          historyOrder.value.push(...result);
        }
        result.length && props.pagination.next();
      });
    };

    // 获取优惠券列表
    const getCouponList = function (type = null) {
      if (couponArr.value && couponArr.value.length > 0 && !type) {
        return;
      }
      if (type && type.type == "pulldown") {
        props.pagination.reset();
        stopeConfigData();
      }
      const params = {
        page: props.pagination.page,
        size: 10,
      };
      memberCoupon(customerParams.memberNo, params).then((res) => {
        const { result = [], total = 0 } = res.data;
        props.pagination.setTotal(total);
        if (props.pagination.page == 1) {
          couponArr.value = result;
        } else {
          couponArr.value.push(...result);
        }
        result.length && props.pagination.next();
      });
    };
    // 触底 -- 分页
    const scrollCouponFunc = function () {
      console.log("触底时间触发");
      if (currentTab.value == 0) {
        if (
          props.pagination.page !== 1 &&
          historyOrder.value.length == props.pagination.total
        ) {
          return;
        }
        getOrderList({ type: "pullup" });
      } else {
        if (
          props.pagination.page !== 1 &&
          couponArr.value.length == props.pagination.total
        ) {
          return;
        }
        getCouponList();
      }
    };

    const clickShowMobile = function () {
      passwordType.value = true;
    };

    // 复制手机号
    const clickCopyMobile = function (e) {
      const { mobile } = e.currentTarget.dataset;
      uni.setClipboardData({
        data: `${mobile}`,
        success: function () {
          uni.getClipboardData({
            success(res) {
              console.log("res", res);
            },
          });
        },
      });
    };

    // 去往标签页
    const onToCustomerTag = function () {
      uni.$router.navigateTo({
        url: `pages/customer-tag/customer-tag?memberNo=${customerParams.memberNo}`,
      });
    };

    // 下拉刷新
    const configData = function () {
      console.log("下拉刷新触发");
      emptyShow.value = false;
      props.pagination.reset();
      if (currentTab.value == 0) getOrderList({ type: "pulldown" });
      else getCouponList({ type: "pulldown" });
    };
    // 复位
    const stopeConfigData = function () {
      if (!triggered.value) {
        triggered.value = "null";
        setTimeout(() => {
          triggered.value = false;
          emptyShow.value = true;
        }, 1000);
      } else {
        triggered.value = false;
        emptyShow.value = true;
      }
    };

    const getDetailInfo = () => {
      console.log(currentTab.value, "=====>");
      if (currentTab.value == 0) getOrderList();
      else if (currentTab.value == 1) getCouponList();
    };

    return {
      loading,
      emptyShow,
      configData,
      triggered,
      passwordType,
      currentTab,
      historyOrder,
      couponArr,
      customerInfo,
      getDetailInfo,
      getOrderList,
      getCouponList,
      customerParams,
      getMemberInfoMessage,
      onMenuChangeCallBack,
      scrollCouponFunc,
      clickShowMobile,
      clickCopyMobile,
      onToCustomerTag,
      stopeConfigData,
    };
  },
  onLoad(options) {
    const { memberNo = "", mobile = "", tab = 0 } = options;
    this.customerParams.memberNo = memberNo;
    this.customerParams.mobile = mobile;
    this.currentTab = tab;
    this.getDetailInfo();
  },
  onShow() {
    this.getMemberInfoMessage();
  },
  onReady() {
    uni.$showLoading();
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
