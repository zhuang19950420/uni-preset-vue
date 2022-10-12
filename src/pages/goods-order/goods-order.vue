<template>
  <z-loading id="z-loading"></z-loading>
  <z-navi-bar title="BOULEVARD  LUXE" showLeft></z-navi-bar>
  <block v-if="!loading">
    <view class="container" :style="`height: calc(100vh - ${naviHeight}px)`">
      <block v-if="noShow">
        <view :class="['no-show', noShow ? 'show' : 'hide']">暂无权限查看</view>
      </block>
      <block v-else>
        <view class="picker-module">
          <view class="month-picker picker">
            <picker
              class="month-picker-select"
              mode="date"
              fields="month"
              start="2022-09-01"
              :end="`${currentData.param}-01`"
              :value="`${currentData.param}-01`"
              @change="onDateChange"
            >
              <view class="date-text">
                <view class="text">{{ currentData.show }}</view>
                <image
                  class="arrow-icon"
                  src="../../static/icon/product/sort_bottom_select.png"
                  mode="widthFix"
                />
              </view>
            </picker>
          </view>
          <view class="select-picker picker">
            <picker
              class="month-picker-select"
              mode="selector"
              :range="channel"
              range-key="name"
              :value="index"
              @change="onTypeChange"
            >
              <view class="date-text">
                <view class="text">{{ channel[index].name }}</view>
                <image
                  class="arrow-icon"
                  src="../../static/icon/product/sort_bottom_select.png"
                  mode="widthFix"
                />
              </view>
            </picker>
          </view>
        </view>
        <scroll-view
          scroll-y
          class="order"
          :style="`height: calc(100vh - ${naviHeight + 48}px)`"
          @scrolltolower="onBtnScrollChange"
          refresher-enabled
          :refresher-triggered="triggered"
          @refresherrefresh="configData"
          @refresherrestore="stopeConfigData"
          :scroll-top="contentTop"
          scroll-with-animation
          @scroll="onScroll"
        >
          <block v-if="orderList.length">
            <block>
              <view class="order-item" v-for="(item, index) in orderList" :key="index">
                <view class="order-section">
                  <view class="order-title">
                    <view class="photo-name" v-if="item.member">
                      <!-- <view class="photo">
                      <image class="avatar" :src="item.member.avatarUrl" />
                    </view> -->
                      <view class="name" v-if="item.member.memberName">{{
                        item.member.memberName
                      }}</view>
                      <view class="mobile" v-if="item.member.memberMobile"
                        >[{{ item.member.mobilePass }}]</view
                      >
                    </view>
                    <!-- <view class="arrow">
                  <image
                    class="arrow-img"
                    src="../../static/icon/arrow/white.png"
                    mode="widthFix"
                  />
                </view> -->
                  </view>
                  <view class="order-info">
                    <view class="order-info-date">
                      <view class="time">{{ item.paymentTime }}</view>
                      <view
                        class="text"
                        :data-order-number="item.orderNumber"
                        @tap="onClickLogistic"
                        >查看物流</view
                      >
                    </view>
                    <view class="order-list">
                      <view class="order-number-type">
                        <view class="order-number">
                          <view class="order-number-title">订单号：</view>
                          <view class="order-con">{{ item.orderNumber }}</view>
                        </view>
                        <view class="type">{{ item.orderStatusInfo }}</view>
                      </view>
                      <view class="list">
                        <view
                          class="product-info"
                          v-for="(orderItem, orderIndex) in item.orderItems"
                          :key="orderIndex"
                        >
                          <view
                            :class="[orderItem.imageUrl ? 'product-img' : 'default-img']"
                          >
                            <image
                              class="img"
                              mode="aspectFill"
                              :src="
                                orderItem.imageUrl || '/static/icon/default_photo.png'
                              "
                            />
                          </view>
                          <view class="info">
                            <view class="info-name-code">
                              <view class="name-tips">
                                <view class="name">{{ orderItem.productName }}</view>
                                <!-- <view class="tips" v-if="orderItem.isRefundOrderItem"
                                >退单</view
                              > -->
                              </view>

                              <view class="order-code">{{ orderItem.productCode }}</view>
                            </view>
                            <view class="info-price-num">
                              <view class="price">
                                {{ orderItem.paymentAmountStr }}
                              </view>
                              <view class="num">x {{ orderItem.quantity || 0 }}</view>
                            </view>
                          </view>
                        </view>
                      </view>
                      <view class="order-total">
                        <view class="order-total-text">总计:</view>
                        <view class="total">{{ item.paymentAmountStr }} </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </block>

            <view class="bg-image-footer">
              <image class="image" src="/static/icon/product/page_bottom.png"></image>
            </view>
          </block>
          <view v-else class="no-data">
            <view v-if="!loading && !load">暂无数据</view>
            <z-load v-else></z-load>
          </view>
        </scroll-view>
      </block>
    </view>
  </block>

  <z-scroll-indicator
    v-if="!noShow"
    :contentTop="currentTop"
    @onGoTop="onGotoTop"
    @onRefresh="onRefresh"
  />
</template>

<script>
import { reactive, ref } from "vue";
import { getOrder, orderStatus } from "./service";
import { statusList } from "./_config";
import um from "../../manager/userManager";
import Pagination from "../../manager/pagination";
import { scrollViewHandler } from "../../handler/scrollHandler";
import { IdentityLimit } from "../../handler/storeHanlder";
import { naviBarHeight, getCurrentTime, encryptMobile } from "../../utils/util.js";
export default {
  props: {
    // 导航栏高度
    naviHeight: {
      type: Number,
      default: naviBarHeight(),
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
    const isAReady = ref(true);
    const load = ref(false);
    const loading = ref(true);
    const noShow = ref(false);
    const triggered = ref(false);
    const channel = ref();
    const index = ref(0);
    const qid = reactive({
      code: "",
      title: "",
    });
    // 当前日期
    const currentData = reactive({
      show: "", // 用于显示
      param: "", // 用于请求参数 格式不一样
    });
    // 订单列表
    const orderList = ref([]);

    // scroll
    const { handlerResult } = scrollViewHandler();

    // 切换时间
    const onDateChange = function (e) {
      load.value = true;
      const { value } = e.detail;
      currentData.show = handlerDate(value);
      currentData.param = value;
      props.pagination.reset();
      orderList.value = [];
      getOrderList();
    };

    // 处理时间日期格式
    const handlerDate = function (date) {
      const newDate = date.split("-");
      return `${newDate[0]}年${newDate[1]}月`;
    };

    // 切换渠道
    const onTypeChange = function (e) {
      const { value } = e.detail;
      qid.code = channel.value[value].code;
      qid.title = channel.value[value].name;
      index.value = value;
      load.value = true;
      orderList.value = [];
      props.pagination.reset();
      getOrderList();
    };

    // 跳转物流详情页
    const onClickLogistic = function (e) {
      const { orderNumber } = e.currentTarget.dataset;
      uni.vibrateShort();
      uni.$router.navigateTo({
        url: `pages/logistics/logistics?orderNumber=${orderNumber}`,
      });
    };

    // 下拉刷新
    const configData = function () {
      getOrderList({ type: "pulldown" });
    };
    // 复位
    const stopeConfigData = function () {
      if (!triggered.value) {
        triggered.value = "null";
        setTimeout(() => {
          triggered.value = false;
        }, 2000);
      } else {
        triggered.value = false;
      }
    };

    const onRefresh = function () {
      load.value = true;
      orderList.value = [];
      props.pagination.reset();
      getOrderList();
    };

    // 分页
    const onBtnScrollChange = function () {
      if (props.pagination.page != 1 && orderList.value.length == props.pagination.total)
        return;
      getOrderList();
    };

    /**
     * 接口请求
     * 请求页面数据
     */
    const getOrderList = function (type = null) {
      if (!isAReady.value) return;
      isAReady.value = false;
      if (type && type.type == "pulldown") {
        props.pagination.reset();
        stopeConfigData();
      }
      const params = {
        status: qid.code,
        page: props.pagination.page,
        size: 10,
      };
      getOrder(currentData.param, params)
        .then((res) => {
          isAReady.value = true;
          load.value = false;
          loading.value = false;
          uni.$hideLoading();
          const { total, result = [] } = res.data;

          if (!result.length) return;
          props.pagination.setTotal(total);
          result.forEach((item) => {
            item.orderStatusInfo = statusList[item.orderStatus];
            item.member.mobilePass = item.member.memberMobile
              ? encryptMobile(item.member.memberMobile)
              : null;
          });
          if (props.pagination.page == 1) {
            orderList.value = result;
          } else {
            orderList.value.push(...result);
          }
          orderList.value.length !== props.pagination.total && props.pagination.next();
        })
        .catch((err) => {
          isAReady.value = true;
          load.value = false;
          loading.value = false;
          uni.$hideLoading();
          console.log("接口报错啦----->", err);
        });
    };

    /**
     * 请求订单状态
     */
    const getStatus = function () {
      orderStatus().then((res) => {
        channel.value = [{ code: "", name: "全部" }, ...res.data];
      });
    };

    return {
      load,
      noShow,
      channel,
      index,
      qid,
      loading,
      orderList,
      currentData,
      onDateChange,
      onClickLogistic,

      configData,
      onTypeChange,

      getStatus,
      handlerDate,
      onRefresh,
      onBtnScrollChange,
      triggered,
      getOrderList,
      ...handlerResult,
    };
  },
  onLoad() {
    uni.$showLoading();
    this.loading = true;
    const nowDate = getCurrentTime({ type: "YYYY-MM" });
    this.currentData.param = nowDate;
    this.currentData.show = this.handlerDate(nowDate);
    this.getOrderList();
    this.getStatus();
  },
  onShow() {
    um.getUserInfo().then((user) => {
      this.noShow = !IdentityLimit(user);
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
