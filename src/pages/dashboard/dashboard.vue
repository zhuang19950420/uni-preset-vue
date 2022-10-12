<template>
  <z-navi-bar title="BOULEVARD  LUXE" showLeft></z-navi-bar>
  <z-loading id="z-loading" @retry="refresh"></z-loading>
  <view class="container">
    <block v-if="!loading">
      <!-- 信息卡 -->
      <view class="card-container">
        <!-- 背景图 -->
        <view class="card-bg">
          <image src="/static/image/customer_card_bg.png" class="bg-image"></image>
        </view>
        <view class="card-info">
          <view class="card-info-left">
            <view class="cart-photo">
              <image :src="memberInfomation.avatarUrl" class="image"></image>
            </view>
            <view class="cart-introduce">
              <!-- <view class="cart-name-position"> -->
              <view class="position">{{ isRoles[memberInfomation.role] }}</view>
              <view class="name">{{ memberInfomation.fullName }}</view>
              <!-- </view> -->
              <view
                class="store-potion"
                @tap="onStoreChange"
                :data-store-number="storeInfo.storeNumber"
                >{{ storeInfo.storeName }}</view
              >
            </view>
          </view>
          <view class="card-info-right">
            <view
              class="distribution module"
              :data-index="0"
              :data-store-number="storeInfo.storeNumber"
              :data-store-name="storeInfo.storeName"
              @tap="onModule"
              v-if="memberInfomation.role == 'SM'"
            >
              <image src="/static/icon/dashboard_card1.png" class="module-image"></image>
              <view class="text">分配管理</view>
            </view>
            <view
              class="qrcode module"
              :data-index="1"
              @tap="onModule"
              v-if="memberInfomation.role == 'SM' || memberInfomation.role == 'SA'"
            >
              <image src="/static/icon/dashboard_card2.png" class="module-image"></image>
              <view class="text">二维码</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 报表卡 -->
      <block v-if="reportArrList.length > 0">
        <z-report-card
          v-for="(item, index) in reportArrList"
          :key="index"
          :showStore="storeList.length > 1"
          :isRole="memberInfomation.role"
          :list="item"
          :index="index"
          :showBig="memberInfomation.role == 'CM' || memberInfomation.role == 'OM'"
          @onReport="onReportPerson"
          @ontoMore="onGotoMoreCallback"
        ></z-report-card>
      </block>
      <block v-else-if="reportArrList.length == 0 && memberInfomation.role == 'SM'">
        <view class="report-card">
          <view class="report-title" @tap="onSelectStore">
            <view class="store">切换门店</view>
            <image src="/static/icon/arrow.png" class="image"></image>
          </view>
        </view>
      </block>
      <view v-if="reportArrList.length < 1" class="no-data"> 暂无数据 </view>
    </block>
  </view>

  <z-management-popup
    ref="modalPopup"
    title="切换门店"
    :list="storeList"
    @btnClick="onBtnClick"
    isStore
  >
  </z-management-popup>
</template>

<script>
import { ref, reactive } from "vue";
import { isRoles } from "./config";
import { getReport } from "./service";
import { getCurrentTime } from "../../utils/util";
import um from "../../manager/userManager";
export default {
  components: {},
  setup() {
    const loading = ref(true);
    // 门店弹窗
    const modalPopup = ref(false);
    const storeList = ref([]);
    // 员工id -- 用于请求报表数据
    const reportIds = ref("");
    const reportArrList = ref([]);
    // 当前store 信息
    const storeInfo = reactive({
      storeNumber: "",
      storeName: "",
    });
    const memberInfomation = reactive({
      role: "",
      roleName: "",
      storeName: "",
      storeNumber: "",
      fullName: "",
      avatarUrl: "",
    });
    const onModule = function (e) {
      uni.vibrateShort();
      const { index, storeNumber, storeName } = e.currentTarget.dataset;
      if (index == 0) {
        console.log(storeNumber, storeName);
        getApp().globalData.storeInfo.storeName = storeName;
        getApp().globalData.storeInfo.storeNumber = storeNumber;
        uni.$router.navigateTo({
          url: `pages/management-list/management-list`,
        });
      } else {
        uni.$router.navigateTo({
          url: `pages/qr-code/qr-code`,
        });
      }
    };

    // 报表卡点击更多返回
    const onGotoMoreCallback = function (e) {
      const { type } = e;
      if (type === "store") handlerChangeStore();
      else {
        if (memberInfomation.role == "CM") {
          uni.$router.navigateTo({
            url: `pages/director-report-detail/director-report-detail?isRole=${memberInfomation.role}`,
          });
        } else {
          uni.$router.navigateTo({
            url: `pages/report-list/report-list?isRole=${memberInfomation.role}`,
          });
        }
      }
    };

    // 点击查看报表
    const onReportPerson = function (e) {
      const { isRole } = e;
      uni.$router.navigateTo({
        url: `pages/personal-report/personal-report?isRole=${isRole}&departmentIds=${reportIds.value}`,
      });
    };

    const handlerChangeStore = function () {
      modalPopup.value.open(storeInfo.storeNumber);
    };

    // 切换门店
    const onStoreChange = function (e) {
      // modalPopup.value.open()
    };

    // 重新获取token-用户信息
    const onClick = function () {
      um.refreshToken().then((res) => {
        this.memberInfomation.role = res.role || "";
        memberInfomation.fullName = res.fullName || "";
        memberInfomation.roleName = res.roleName || "";
        memberInfomation.avatarUrl = res.avatarUrl || "";
        if (res.role == "SA" || res.role == "SM") {
          storeInfo.storeName = res.stores[0].storeName || "";
          storeInfo.storeNumber = res.stores[0].storeNumber || "";
          this.storeList = res.stores.length > 0 && res.stores[0] ? res.stores : [];
        }
        reportIds.value =
          res.role == "SM"
            ? res.departments[0].departmentId
            : res.departments.map((item) => item.departmentId).join(",");
        getReportList();
      });
    };

    //
    const onBtnClick = function (e) {
      const { type, storeNumber } = e;
      // 取消
      if (type === "cancel") console.log("点击取消");
      else {
        storeList.value.forEach((item) => {
          if (item.storeNumber == storeNumber) {
            item.isChecked = true;
            storeInfo.storeNumber = item.storeNumber;
            storeInfo.storeName = item.storeName;
            reportIds.value = item.departmentId;
          } else {
            item.isChecked = false;
          }
        });
        getReportList();
      }
    };

    const onSelectStore = function () {
      modalPopup.value.open(storeInfo.storeNumber);
    };

    // 获取报表信息
    const getReportList = function () {
      const getTime = getCurrentTime({
        type: "YYYY-MM",
      });
      const params = {
        queryMonth: getTime,
        departmentIds: reportIds.value,
      };
      getReport(params).then((report) => {
        loading.value = false;
        uni.$hideLoading();
        const { code, data } = report;
        if (code !== "0") return;
        reportArrList.value = data;
      });
    };

    // 请求失败-重试
    const refresh = function () {
      getReportList();
    };

    return {
      isRoles,
      onClick,
      refresh,
      loading,
      storeList,
      onModule,
      reportIds,
      modalPopup,
      onBtnClick,
      storeInfo,
      getReportList,
      reportArrList,
      onReportPerson,
      onGotoMoreCallback,
      onStoreChange,
      onSelectStore,
      memberInfomation,
    };
  },
  onShow() {
    um.getUserInfo()
      .then((res) => {
        if (res.role == "SA" || res.role == "SM") {
          if (res.stores.length == 0) {
            return uni.showToast({
              title: "获取用户信息失败",
              icon: "none",
            });
          }
          res.stores = res.stores.filter((item) => {
            return item;
          });
          res.stores.forEach((item) => {
            item.isChecked = false;
          });
          res.stores[0].isChecked = true;
          this.storeInfo.storeNumber = res.stores[0].storeNumber;
          this.storeInfo.storeName = res.stores[0].storeName;
          this.storeList = res.stores.length > 0 && res.stores[0] ? res.stores : [];
        }

        this.memberInfomation.role = res.role || "";
        this.memberInfomation.fullName = res.fullName || "";
        this.memberInfomation.roleName = res.roleName || "";
        this.memberInfomation.avatarUrl = res.avatarUrl || "";

        this.reportIds =
          res.role == "SM"
            ? res.departments[0].departmentId
            : res.departments.map((item) => item.departmentId).join(",");
        this.getReportList();
      })
      .catch((err) => {
        console.log("getUserInfo==>", err);
      });
  },
  onReady() {
    uni.$showLoading();
  },
  onPullDownRefresh() {
    this.onClick();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
