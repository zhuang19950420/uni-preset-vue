<template>
  <z-loading id="z-loading"></z-loading>
  <z-navi-bar title="BOULEVARD  LUXE" showLeft></z-navi-bar>
  <block v-if="!loading">
    <view class="container" :style="`height: calc(100vh - ${naviHeight}px)`">
      <z-search-bar
        v-if="searchShow"
        fixed
        placeTitle="搜索商品名称、关键词"
        :val="searchKeyword"
        class="cust-bar"
        :style="`top: ${naviHeight}px;`"
        search
        @tapSearch="onSearch"
      ></z-search-bar>
      <!-- 选择品牌 -->
      <select-module
        :brand="selectBrand.name"
        @openBrand="openBrand"
        @clearBrand="clearBrand"
        @onSelectQid="onSelectQid"
        @onSelectSale="onSelectSale"
      ></select-module>
      <!-- 列表 -->
      <scroll-view
        scroll-y
        :class="['product-list', isIpx ? '' : 'no-ipx']"
        :style="`height: calc(100vh - ${naviHeight + 110}px)`"
        refresher-enabled
        :refresher-triggered="triggered"
        @refresherrefresh="configData"
        @refresherrestore="stopeConfigData"
        @scrolltolower="onBtnScrollChange"
        :scroll-top="contentTop"
        scroll-with-animation
        @scroll="onScroll"
      >
        <block v-if="productList.length">
          <view class="list" :style="`min-height: calc(100vh - ${naviHeight + 185}px)`">
            <block>
              <view class="section" v-for="(item, index) in productList" :key="index">
                <view class="product-item">
                  <view class="photo">
                    <image class="thum-img" mode="aspectFill" :src="item.thumbIcon" />
                    <view class="tips" v-if="!item.onSale || !item.hasStock">{{
                      !item.onSale ? "已下架" : !item.hasStock ? "已售罄" : ""
                    }}</view>
                  </view>

                  <view class="product-info">
                    <view class="info-top">
                      <view class="brand">{{ item.productBrandName }}</view>
                      <view class="product-name-btn">
                        <view class="name">{{ item.name }}</view>
                        <view
                          v-if="showBtn"
                          class="btn"
                          :data-spu="item.spu"
                          :data-on-sale="item.onSale"
                          :data-has-stock="item.hasStock"
                          :style="{
                            opacity: !item.onSale || !item.hasStock ? '0.35' : '1',
                          }"
                          @tap="onBtnClick"
                        >
                          <z-btn
                            title="前往查看"
                            :size="20"
                            background="#fff"
                            color="#968765"
                          ></z-btn>
                        </view>
                      </view>
                    </view>
                    <view class="price">
                      <block
                        v-if="
                          item.minPrice == item.maxPrice &&
                          item.specialPrice &&
                          item.specialPrice < item.minPrice
                        "
                      >
                        <z-currency
                          class="price-num"
                          :value="item.specialPrice"
                          price
                        ></z-currency>
                      </block>
                      <block v-else>
                        <z-currency
                          class="price-num"
                          :value="item.minPrice"
                          price
                        ></z-currency>
                        <block v-if="item.minPrice !== item.maxPrice">
                          <text>~</text>
                          <z-currency
                            class="price-num"
                            :value="item.maxPrice"
                            price
                          ></z-currency>
                        </block>
                      </block>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </view>
          <view class="bg-image-footer">
            <image class="image" src="/static/icon/product/page_bottom.png"></image>
          </view>
        </block>

        <view v-else class="no-data">
          <view v-if="!loading && !load">暂无数据</view>
          <z-load v-else></z-load>
        </view>
      </scroll-view>
    </view>
  </block>

  <z-select-brand
    ref="brandPopup"
    :brand="brandList"
    @onComplete="onComplete"
  ></z-select-brand>
  <z-scroll-indicator
    :contentTop="currentTop"
    @onGoTop="onGotoTop"
    @onRefresh="onRefresh"
  />
</template>

<script>
import { ref, reactive } from "vue";
import config from "./configure";
import { handlerBrand } from "./handler";
import um from "../../manager/userManager";
import Pagination from "../../manager/pagination";
import { getGoodsList, getBrand } from "./service";
import { naviBarHeight, isIpx } from "../../utils/util.js";
import { IdentityLimit } from "../../handler/storeHanlder";
import { scrollViewHandler } from "../../handler/scrollHandler";
import selectModule from "../../components/library-goods-components/select-module/select-module";

export default {
  components: {
    selectModule,
  },
  props: {
    // 导航栏高度
    naviHeight: {
      type: Number,
      default: naviBarHeight(),
    },
    isIpx: {
      type: Boolean,
      default: isIpx,
    },
    pagination: {
      type: Object,
      default: new Pagination(),
    },
  },
  setup(props) {
    // 初始化
    const isAReady = ref(true);
    const load = ref(false);
    const loading = ref(true);
    const showBtn = ref(false);
    const triggered = ref(false);
    const searchShow = ref(true);
    const brandPopup = ref(null);

    // 渠道选择第几个
    const qidCode = ref("SA_CONTAINS");
    // 选中品牌
    const selectBrand = reactive({
      name: "",
      code: "",
    });
    // 是否可售卖下拉框
    const saleCode = ref(null);
    // 搜索框
    const searchKeyword = ref(null);
    // 商品列表
    const productList = ref([]);
    // 品牌列表
    const brandList = ref([]);

    // scroll
    const { handlerResult } = scrollViewHandler();
    // 点击搜索
    const onSearch = function (e) {
      searchKeyword.value = e === "通过手机号搜索会员" ? null : e;
      init();
    };

    // 点击选择品牌
    const openBrand = function () {
      searchShow.value = false;
      brandPopup.value.open();
    };

    // 品牌选择-返回值
    const onComplete = function (e) {
      searchShow.value = true;
      if (!e) return;

      selectBrand.code = e.code;
      selectBrand.name = e.name;
      brandPopup.value.close();
      init();
    };

    // 点击删除选择品牌
    const clearBrand = function () {
      selectBrand.name = "";
      selectBrand.code = "";
      brandPopup.value.clear();
      init();
    };

    // 切换渠道
    const onSelectQid = function (e) {
      const { code } = e.qidInfo;
      if (qidCode.value == code) return;
      qidCode.value = code;
      init();
    };

    // 切换是否可售卖
    const onSelectSale = (e) => {
      const { code } = e.selectSale;
      if (saleCode.value == code) return;
      saleCode.value = code;
      init();
    };

    // 初始化
    const init = () => {
      load.value = true;
      productList.value = [];
      props.pagination.reset();
      getBrandList();
    };

    // 跳转到其他小程序
    const onBtnClick = function (e) {
      const { spu, onSale, hasStock } = e.currentTarget.dataset;
      if (!onSale || !hasStock) return;
      um.getUserInfo().then((user) => {
        const { userId, stores } = user;
        if (!stores[0] || !stores[0].storeNumber) {
          uni.$showToast({
            title: "先获取storeNumber",
          });
        }
        const params = {
          sid: stores[0].storeNumber,
          eno: userId,
        };
        uni.navigateToMiniProgram({
          appId: config.USE_APPID,
          path: `pages/product/detail/index?spu=${spu}&sid=${params.sid}&eno=${params.eno}`,
          envVersion: "trial",
          fail(err) {
            console.log("err", err);
          },
        });
      });
    };

    // 下拉刷新
    const configData = function () {
      getBrandList({ type: "pulldown" });
    };
    // 复位
    const stopeConfigData = function () {
      if (!triggered.value) {
        triggered.value = "null";
        setTimeout(() => {
          triggered.value = false;
        }, 1000);
      } else {
        triggered.value = false;
      }
    };

    // 刷新按钮-点击
    const onRefresh = function () {
      init();
    };

    /*
     * 接口请求
     */
    const getBrandList = function (type = null) {
      if (!isAReady.value) return;
      isAReady.value = false;
      if (type && type.type == "pulldown") {
        props.pagination.reset();
        stopeConfigData();
      }
      const saleObj =
        saleCode.value === "onSale"
          ? { checkOnSale: true }
          : saleCode.value === "disSale"
          ? { checkOnSale: false }
          : {};
      const params = {
        page: props.pagination.page,
        size: props.pagination.size,
        keyword: searchKeyword.value,
        productBrandCodes: selectBrand.code ? [selectBrand.code] : [],
        scope: qidCode.value,
        ...saleObj,
      };
      getGoodsList(params)
        .then((res) => {
          isAReady.value = true;
          load.value = false;
          loading.value = false;
          uni.$hideLoading();
          const { result = [], total } = res.data;
          if (!result.length) return;
          props.pagination.setTotal(total);
          result.forEach((item) => {
            if (!item.hasStock) {
              item.hasStock = false;
            }
          });
          if (props.pagination.page == 1) {
            productList.value = result;
          } else {
            productList.value.push(...result);
          }
          productList.value.length != props.pagination.total && props.pagination.next();
        })
        .catch((err) => {
          isAReady.value = true;
          load.value = false;
          loading.value = false;
          uni.$hideLoading();
          console.log("接口报错啦----->", err);
        });
    };

    // 获取品牌列表
    const getBrandData = function () {
      getBrand().then((res) => {
        brandList.value = handlerBrand(res.data);
      });
    };

    /**
     * 分页
     */
    const onBtnScrollChange = function () {
      if (
        productList.value.length == props.pagination.total ||
        productList.value.length == 0
      ) {
        return;
      }
      getBrandList();
    };

    return {
      load,
      showBtn,
      loading,
      searchShow,
      brandPopup,
      brandList,
      productList,
      triggered,
      configData,
      onRefresh,
      searchKeyword,

      onSearch,
      onBtnClick,
      onComplete,
      selectBrand,
      clearBrand,
      onSelectQid,
      onSelectSale,

      getBrandList,
      getBrandData,
      openBrand,
      onBtnScrollChange,
      ...handlerResult,
    };
  },
  onLoad() {
    uni.$showLoading();
    this.loading = true;
    this.getBrandList();
    this.getBrandData();
  },
  onShow() {
    um.getUserInfo().then((user) => {
      this.showBtn = IdentityLimit(user);
    });
  },
  onPullDownRefresh() {
    this.pagination.reset();
    this.getBrandList();

    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
