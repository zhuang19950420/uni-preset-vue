<template>
  <!-- <z-navi-bar title="分配管理"></z-navi-bar> -->
  <z-loading id="z-loading" @retry=""></z-loading>
  <view :class="['management-container']">
    <view class="customer-card" :style="`z-index: ${show ? 100 : 1}`">
      <view class="store">
        <view class="store-position">{{ storeInfo.storeName }}</view>
        <view
          v-if="storeList && storeList.length"
          class="select-store"
          @tap="changeStore"
        >
          <view class="text">切换门店</view>
          <view class="arrow">
            <image src="/static/icon/arrow.png" class="image"></image>
          </view>
        </view>
      </view>
      <view class="customer-number-check-menu" v-if="customerList">
        <view class="customer-number">共{{ customerList.length }}位会员</view>
        <view class="check-menu">
          <view class="filter-menu menu" @tap="onFilterFunc">
            <image src="/static/icon/customer_filter_white.png" class="image"></image>
            <view class="text">筛选</view>
          </view>
          <!-- <view class="line"></view>
            <view class="add-menu menu">
              <image src="/static/icon/customer_add.png" class="image"></image>
              <view class="text">添加</view>
            </view> -->
        </view>
      </view>
    </view>
    <view class="customer" :style="`margin-top: ${105}px; margin-bottom: ${162}rpx`">
      <view class="customer-image">
        <image src="/static/icon/customer_icon.png" class="image"></image>
      </view>
      <view class="management-list">
        <scroll-view scroll-y="true">
          <view class="management" v-if="customerList && customerList.length > 0">
            <view
              class="item"
              v-for="(item, index) in customerList"
              :key="index"
              :data-union-id="item.unionId"
              :data-index="index"
              @tap="onChangeManage"
            >
              <z-checkbox border :checked="item.isChecked"></z-checkbox>
              <view :class="item.avatar ? 'photo' : 'default-photo'">
                <image
                  :src="item.avatar || '/static/icon/default_photo.png'"
                  class="image"
                ></image>
              </view>
              <view>
                <view class="name-identity">
                  <view class="name">{{ item.nickname }}</view>
                  <view class="identity" v-if="item.memberTypeName">{{
                    item.memberTypeName
                  }}</view>
                </view>
                <view class="wx-time" v-if="!item.memberNo">{{ item.addTime }}</view>
              </view>
            </view>
          </view>
          <view v-else class="no-customer"> 暂无可分配顾客 </view>
        </scroll-view>
      </view>
    </view>
    <view class="bottom">
      <view class="select-all" @tap="onSelect">
        <z-checkbox border :checked="allSelect"></z-checkbox>
        <view class="text">全选</view>
      </view>
      <view class="btn" @tap="onManagement">
        <z-btn title="分配" :size="24" color="#fff" background="#B18C4F"></z-btn>
      </view>
    </view>
  </view>
  <z-filter-coupon
    ref="filterCoupon"
    :filterList="filterData"
    :filterTop="90"
    @onfilter="filterListCallBack"
  ></z-filter-coupon>
  <z-management-popup
    ref="modalPopup"
    :title="isStore ? '切换门店' : '选择店员'"
    @btnClick="onBtnClick"
    :isStore="isStore"
    :list="isStore ? storeList : storeNameList"
  >
  </z-management-popup>
</template>

<script>
import { reactive, ref } from "vue";
import { naviBarHeight } from "../../utils/util.js";
import {
  unassignedCustomer,
  filterSearch,
  storeEmployee,
  customerAssign,
} from "./service";
import um from "../../manager/userManager";

export default {
  props: {
    // 导航栏高度
    naviHeight: {
      type: Number,
      default: naviBarHeight(),
    },
  },
  setup() {
    // 过滤按钮
    const storeBtn = ref(false);
    const filterBtn = ref(false);
    const filterCoupon = ref();
    const modalPopup = ref();
    const show = ref(false);
    const noScroll = ref(false);
    const filterNumber = ref(null);
    const storeInfo = reactive({
      storeNumber: "",
      storeName: "",
    });
    // 员工列表
    const storeNameList = ref(null);
    // 全选
    const allSelect = ref(false);
    // 分配给店员的userId
    const memberUserId = ref(false);
    // 选中的客户列表
    const selectList = ref([]);
    // 门店列表
    const storeList = ref(null);
    // 过滤的条件列表
    const filterData = ref(null);
    // 未分配的客户列表
    const customerList = ref(null);
    // 判断弹窗显示内容类型为分配店员/切换门店
    const isStore = ref(false);
    // 筛选
    const onFilterFunc = function () {
      if (filterBtn.value) return;
      show.value = true;
      storeBtn.value = true;
      filterCoupon.value.open();
    };

    // 分配
    const onManagement = function () {
      uni.vibrateShort();
      show.value = false;
      noScroll.value = true;
      isStore.value = false;
      const filterList = customerList.value.filter((item) => item.isChecked);
      console.log("filterList", filterList);
      if (filterList.length < 1) {
        return uni.$showToast({
          title: "请先选择分配客户",
          icon: "none",
        });
      }
      selectList.value = filterList;

      modalPopup.value.open();
    };

    // 切换门店
    const changeStore = function () {
      uni.vibrateShort();
      if (storeBtn.value) return;

      filterBtn.value = true;
      show.value = true;
      noScroll.value = true;
      isStore.value = true;
      modalPopup.value.open(storeInfo.storeNumber);
    };

    // 弹框选择返回值
    const onBtnClick = function (e) {
      const { type, userId, storeNumber } = e;
      filterBtn.value = false;
      noScroll.value = false;
      // 取消
      if (type === "cancel") console.log("点击取消");
      else {
        if (userId) {
          memberUserId.value = userId;
          // 点击分配-确定操作
          onCustomerAssign(userId);
        } else if (storeNumber) {
          // 门店筛选
          onHandlerStoreList(storeNumber);
        }
        console.log(e);
      }
    };
    // 确定分配-把客户信息传递给后端
    const onCustomerAssign = function (userId) {
      const params = {
        toBeAssignedList: selectList.value,
        userId: userId,
      };
      customerAssign(params).then((res) => {
        if (res.code == "0") {
          uni.showToast({
            title: "分配成功",
            icon: "none",
          });
          customerUnassignedList();
        }
      });
    };

    // 门店选择
    const onHandlerStoreList = function (storeNumber) {
      storeList.value.forEach((item) => {
        if (item.storeNumber == storeNumber) {
          item.isChecked = true;
          storeInfo.storeNumber = item.storeNumber;
          storeInfo.storeName = item.storeName;
        } else {
          item.isChecked = false;
        }
      });
      allSelect.value = false;
      selectList.value = [];
      customerUnassignedList();
      storeEmployeeList();
    };

    // 获取未分配客户列表
    const customerUnassignedList = function () {
      uni.$showLoading();
      const params = {
        memberType: filterNumber.value || "",
        belongedStore: storeInfo.storeNumber,
      };
      unassignedCustomer(params)
        .then((res) => {
          uni.$hideLoading();
          if (res.code !== "0") return;
          res.data.forEach((item) => {
            item.isChecked = false;
          });
          customerList.value = res.data;
        })
        .catch((err) => {
          uni.$hideLoading();
        });
    };

    // 获取员工列表
    const storeEmployeeList = function () {
      const params = {
        by: "store",
        storeNumber: storeInfo.storeNumber,
      };
      storeEmployee(params).then((res) => {
        console.log(res, "----->storeInfo");
        const { data, code } = res;
        if (code !== "0") return;
        data.forEach((item) => {
          item.isChecked = false;
        });
        storeNameList.value = data;
      });
    };

    // 获取筛选列表
    const filterList = function () {
      const params = {
        type: 1,
      };
      filterSearch(params).then((res) => {
        const { data, code } = res;
        if (code !== "0") return;
        filterData.value = data;
      });
    };

    // 筛选列表选择
    const filterListCallBack = function (e) {
      filterNumber.value = e;
      storeBtn.value = false;
      allSelect.value = false;
      customerUnassignedList();
    };

    // 处理选中与不选
    const handlerSelectData = function (index, unionId) {
      // 判断是否全部选中
      customerList.value[index].isChecked = !customerList.value[index].isChecked;
      allSelect.value = customerList.value.every((item) => {
        return item.isChecked;
      });
    };

    // 选中
    const onChangeManage = function (e) {
      const { index, unionId } = e.currentTarget.dataset;
      handlerSelectData(index, unionId);
    };

    // 全选
    const onSelect = function () {
      allSelect.value = !allSelect.value;
      // const list =
      if (allSelect.value) {
        customerList.value.forEach((item) => {
          item.isChecked = true;
        });
      } else {
        customerList.value.forEach((item) => {
          item.isChecked = false;
        });
      }
    };

    return {
      show,
      noScroll,
      isStore,
      storeInfo,
      filterCoupon,
      modalPopup,
      onFilterFunc,
      onManagement,
      onBtnClick,
      changeStore,
      filterData,
      filterList,
      storeEmployeeList,
      storeList,
      customerList,
      storeNameList,
      onChangeManage,
      filterListCallBack,
      customerUnassignedList,
      onSelect,
      allSelect,
    };
  },
  onShow() {
    // 获取未分配客户列表
    this.customerUnassignedList();
    // 获取筛选列表
    this.filterList();
    um.getUserInfo().then((user) => {
      user.stores = user.stores.filter((item) => {
        return item;
      });
      if (user.stores.length == 0 || !user.stores[0]) {
        return uni.showToast({
          title: "获取用户信息失败",
          icon: "none",
        });
      }
      console.log(user.stores, "=====>");
      user.stores.forEach((item) => {
        if (item.storeNumber == this.storeInfo.storeNumber) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      });
      console.log(user.stores, "-----user.stores");
      this.storeList = user.stores;
      this.storeEmployeeList();
    });
  },
  onLoad(options) {
    console.log(getApp().globalData.storeInfo, "-----getApp().globalData.storeInfo.");
    this.storeInfo.storeNumber = getApp().globalData.storeInfo.storeNumber;
    this.storeInfo.storeName = getApp().globalData.storeInfo.storeName;
    getApp().globalData.storeInfo.storeNumber = "";
    getApp().globalData.storeInfo.storeName = "";
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
