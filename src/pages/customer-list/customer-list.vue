<template>
  <z-loading id="z-loading" @retry=""></z-loading>
  <z-navi-bar title="BOULEVARD  LUXE" showLeft></z-navi-bar>
  <block v-if="!loading">
    <block v-if="noShow">
      <view :class="['no-show', noShow ? 'show' : 'hide']">暂无权限查看</view>
    </block>
    <block v-else>
      <z-search-bar
        v-if="!noShow"
        ref="searchBar"
        class="cust-bar"
        :style="`top: ${naviHeight}px;`"
        search
        @tapSearch="gotoSearchPageFunc"
      ></z-search-bar>
      <z-menu :menus="menus" @change="onMenuChangeCallBack"></z-menu>
      <view class="customer-list">
        <view v-if="currentIndex == 1" class="customer-tab">
          <view class="customer-top">
            <view class="customer-number-check-menu">
              <view class="customer-number" v-if="memberList"
                >共 {{ memberList.length }} 位会员</view
              >
              <view class="check-menu">
                <view class="filter-menu menu" @tap="onFilterFunc">
                  <image src="/static/icon/customer_filter.png" class="image"></image>
                  <view class="text">筛选</view>
                </view>
                <!-- <view class="line"></view>
                <view class="add-menu menu">
                  <image src="/static/icon/customer_add.png" class="image"></image>
                  <view class="text">添加</view>
                </view> -->
              </view>
            </view>
            <view class="customer-image">
              <image src="/static/icon/customer_icon.png" class="image"></image>
            </view>
          </view>
          <view class="user-list">
            <z-list
              v-if="memberList.length"
              :list="memberList"
              :total="pagination.total"
              @onScrollChange="onBtnScrollChange"
              @onchange="onBtnClickCallBack"
            ></z-list>
            <view class="no-member" v-else>暂无数据</view>
          </view>
        </view>
        <view v-if="currentIndex == 2" class="customer-tab">
          <view class="customer-top">
            <view class="customer-number-check-menu">
              <view class="customer-number">共 {{ memberList.length }} 位会员</view>
              <view class="check-menu">
                <view class="filter-menu menu" @tap="onFilterFunc">
                  <image src="/static/icon/customer_filter.png" class="image"></image>
                  <view class="text">筛选</view>
                </view>
                <view class="line"></view>
                <view class="add-menu menu" @tap="onAddFunc">
                  <image src="/static/icon/customer_add.png" class="image"></image>
                  <view class="text">添加</view>
                </view>
              </view>
            </view>
            <view class="customer-image">
              <image src="/static/icon/customer_icon.png" class="image"></image>
            </view>
          </view>
          <view class="user-list">
            <z-list
              v-if="memberList.length"
              :list="memberList"
              :total="pagination.total"
              @onScrollChange="onBtnScrollChange"
              @onchange="onBtnClickCallBack"
            ></z-list>
            <view class="no-member" v-else>暂无数据</view>
          </view>
        </view>
      </view>
    </block>
  </block>

  <z-filter-coupon
    ref="filyerCoupon"
    :filterList="filterData"
    @onfilter="filterListCallBack"
  ></z-filter-coupon>
</template>
<script>
import { ref } from "vue";
import { customer } from "./_config";
import { naviBarHeight } from "../../utils/util.js";
import { IdentityLimit } from "../../handler/storeHanlder";
import { customerSearch, filterSearch, checkCustomerMember } from "./service";
import um from "../../manager/userManager";
import Pagination from "../../manager/pagination";

export default {
  props: {
    menus: {
      type: Array,
      default: customer,
    },
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
    const loading = ref(true);
    const noShow = ref(false);
    // 当前菜单
    const currentIndex = ref(1);
    // 过滤弹窗
    const filyerCoupon = ref(null);
    const searchBar = ref(true);
    const filterData = ref([]);
    const filterNumber = ref(null);
    const memberList = ref(null);
    // 搜索手机号参数
    const searchMobile = ref(null);

    // 获取客户列表
    const customerList = function (cals) {
      let params = {};
      if (searchMobile.value) {
        params = {
          type: currentIndex.value,
          mobile: searchMobile.value,
          page: props.pagination.page,
          size: props.pagination.size,
        };
      } else {
        params = {
          memberType: filterNumber.value ? filterNumber.value : "",
          type: currentIndex.value,
          page: props.pagination.page,
          size: props.pagination.size,
        };
      }

      customerSearch(params).then((res) => {
        filterNumber.value = null;
        loading.value = false;
        uni.$hideLoading();
        const { result = [], total } = res.data;
        props.pagination.setTotal(total);
        if (props.pagination.page == 1) {
          memberList.value = result;
        } else {
          memberList.value.push(...result);
        }
        result.length && props.pagination.next();
      });
    };
    // 分页
    const onBtnScrollChange = function () {
      console.log(props.pagination.page);
      if (
        props.pagination.page != 1 &&
        memberList.value.length == props.pagination.total
      ) {
        return;
      }

      customerList();
    };
    // 获取筛选列表
    const filterList = function () {
      const params = {
        type: currentIndex.value,
      };
      filterSearch(params).then((res) => {
        const { data, code } = res;
        if (code !== "0") return;
        filterData.value = data;
      });
    };

    // 筛选列表选择
    const filterListCallBack = function (e) {
      console.log(e);
      props.pagination.reset();
      filterNumber.value = e;
      searchMobile.value = null;
      searchBar.value.init();
      customerList();
    };
    // 菜单切换
    const onMenuChangeCallBack = function (e) {
      currentIndex.value = e + 1;
      props.pagination.reset();
      filyerCoupon.value.resetBtnFunc();
      customerList();
      filterList();
    };

    // 点击筛选
    const onFilterFunc = function () {
      uni.vibrateShort();
      filyerCoupon.value.open();
    };
    // 点击添加
    const onAddFunc = function () {
      uni.vibrateShort();
      uni.$router.navigateTo({
        url: `pages/add-binding/add-binding?type=add`,
      });
    };

    // 点击查看/绑定返回
    const onBtnClickCallBack = function (e) {
      uni.vibrateShort();
      if (e.isBound !== 1) {
        hanlderGoto(e);
      } else {
        uni.$router.navigateTo({
          url: `pages/customer-detail/customer-detail?memberNo=${e.memberNumber}&mobile=${e.mobile}`,
        });
      }
    };

    const hanlderGoto = function (e) {
      const params = {
        openId: e.openId,
        unionId: e.unionId,
      };
      checkCustomerMember(params)
        .then((res) => {
          console.log("res", res);
          if (res.code !== "0") return;
          if (res.data) {
            uni.showToast({
              title: "已绑定会员",
              icon: "none",
            });
            setTimeout(function () {
              uni.$router.navigateTo({
                url: `pages/customer-detail/customer-detail?memberNo=${res.data}`,
              });
            }, 1000);
          } else {
            uni.$router.navigateTo({
              url: `pages/add-binding/add-binding?type=isBound&openId=${e.openId}&unionId=${e.unionId}`,
            });
          }
        })
        .catch((err) => {
          console.log("查询绑定接口报错---->");
        });
    };

    // 点击搜索
    const gotoSearchPageFunc = function (e) {
      console.log(e, "====>");
      uni.vibrateShort();
      filyerCoupon.value.resetBtnFunc();
      searchMobile.value = e;
      props.pagination.page = 1;
      customerList("mobile");
    };

    return {
      noShow,
      loading,
      onAddFunc,
      memberList,
      searchBar,
      currentIndex,
      onFilterFunc,
      filyerCoupon,
      filterData,
      customerList,
      filterList,
      onBtnClickCallBack,
      gotoSearchPageFunc,
      onMenuChangeCallBack,
      filterListCallBack,
      onBtnScrollChange,
    };
  },
  onShow() {
    um.getUserInfo().then((user) => {
      this.noShow = !IdentityLimit(user);
    });
  },
  onLoad(options) {
    uni.$showLoading();
    this.loading = true;
    if (options.currentIndex) {
      this.currentIndex = options.currentIndex;
    }
    // 顾客列表
    this.customerList();
    // 筛选列表
    this.filterList();
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
