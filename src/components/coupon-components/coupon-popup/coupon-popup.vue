<template>
  <uni-popup ref="popup" type="bottom" :safeArea="false" :mask-click="false">
    <view class="popup-detail">
      <!-- 头部 -->
      <view class="popup-header">
        <view class="popup-name">{{ coupon.name }}</view>
        <view class="popup-close" @tap="close">
          <image
            class="popup-close-icon"
            src="../../static/icon/close.png"
            mode="widthFix"
          />
        </view>
      </view>
      <!-- 搜索模块 -->
      <view class="popup-search">
        <search-module ref="searchRef" @onSearch="onSearch"></search-module>
      </view>
      <!-- 详情模块 -->
      <view class="detail" v-if="!load && !!userInfo && userInfo.mobile">
        <view class="detail-header">
          <view class="detail-header-message">
            <view :class="userInfo.avatar ? 'user-photo' : 'photo'">
              <image
                class="photo-img"
                :src="userInfo.avatar || '/static/icon/default_photo.png'"
              />
            </view>
            <view class="name-id">
              <view class="name">{{ userInfo.memberName }}</view>
              <view class="id">ID：{{ userInfo.memberNo }}</view>
            </view>
          </view>
          <view
            v-if="readySend"
            class="detail-right"
            @tap="onToDetail(userInfo.memberNo, userInfo.mobile)"
          >
            <view class="text">顾客详情</view>
            <image
              class="arrow"
              src="../../static/icon/arrow_black.png"
              mode="widthFix"
            />
          </view>
        </view>
        <block v-if="!readySend">
          <view class="detail-info-list">
            <view
              class="section"
              v-for="(item, index) in infoList"
              :key="index"
              :class="index !== infoList.length - 1 ? 'border' : ''"
            >
              <view class="label"> {{ item.label }}</view>
              <block v-if="item.key === 'gender'">
                <view class="content">{{
                  userInfo[item.key] === "M" ? "男" : "女"
                }}</view>
              </block>
              <block v-else>
                <view class="content">{{ userInfo[item.key] }}</view>
              </block>
            </view>
          </view>
          <!-- 按钮模块 -->
          <view class="button" hover-class="btn-hover-opacity" @tap="onSendCoupon">
            发送礼券
          </view>
        </block>
      </view>
      <view class="loading" v-if="load">
        <z-load></z-load>
      </view>
    </view>
    <z-agreen-popup ref="agreePopup" @onClick="onClick" />
  </uni-popup>
</template>

<script>
import { ref, reactive } from "vue";
import { infoList, errTips } from "./config";
import { isPhone } from "../../../utils/util";
import { customerDetail, sendCoupon } from "./service";
import searchModule from "../search-module/search-module";
export default {
  components: {
    searchModule,
  },
  props: {
    infoList: {
      type: Array,
      default: infoList,
    },
  },
  setup() {
    const disable = ref(false);
    const popup = ref(null);
    const load = ref(null);
    const agreePopup = ref(false);
    const coupon = reactive({
      name: "",
      couponNo: "",
    });
    const readySend = ref(false);
    const searchRef = ref(false);
    const userInfo = ref(null);

    // 开启弹窗
    const open = (value) => {
      coupon.name = value.name;
      coupon.couponNo = value.couponNo;
      popup.value.open();
    };

    // 关闭弹窗
    const close = () => {
      popup.value.close();
    };

    // 清空
    const clearHandler = () => {
      userInfo.value = null;
      load.value = false;
      searchRef.value.clearBtn();
    };

    // 点击-跳转详情
    const onToDetail = (memberNumber, mobile) => {
      uni.vibrateShort();
      uni.$router.navigateTo({
        url: `pages/customer-detail/customer-detail?memberNo=${memberNumber}&mobile=${mobile}&tab=1`,
      });
    };

    // 搜索
    const onSearch = (e) => {
      const { type, value } = e;
      load.value = true;
      userInfo.value = null;
      if (type === "clear" || !value) {
        load.value = false;
        return;
      }
      if (!isPhone(value)) {
        load.value = false;
        uni.$showToast({ title: "无结果，请核对顾客手机号" });
        return;
      }
      getcouponDetail(value);
    };

    /**
     *  接口
     */
    // 获取用户详情
    const getcouponDetail = (value) => {
      const params = {
        mobile: value,
      };
      customerDetail(params)
        .then((res) => {
          readySend.value = false;
          userInfo.value = res.data;
          load.value = false;
        })
        .catch((err) => {
          load.value = false;
          readySend.value = false;
          userInfo.value = {};
          uni.$showToast({ title: "无结果, 请核对顾客手机号" });
        });
    };

    // 发送礼券
    const onSendCoupon = () => {
      uni.vibrateShort();
      agreePopup.value.open();
    };

    const onClick = (value) => {
      const { type } = value;
      agreePopup.value.close();
      if (type === "cancel") return;
      disable.value = true;
      const params = {
        memberNo: userInfo.value.memberNo,
        couponNo: coupon.couponNo,
        couponName: coupon.name,
      };
      sendCoupon(params)
        .then((res) => {
          if (!res.data.grantResult) {
            return uni.$showToast({
              title: errTips[res.data.failMessage] || "发放失败，请稍后重试",
            });
          }
          uni.$showToast({ title: "发送成功!" });
          setTimeout(() => {
            readySend.value = true;
            disable.value = false;
          }, 600);
        })
        .catch((err) => {
          readySend.value = false;
          disable.value = false;
        });
    };

    return {
      load,
      popup,
      coupon,
      userInfo,
      searchRef,
      readySend,
      agreePopup,

      open,
      close,
      onClick,
      onSearch,
      onToDetail,
      clearHandler,
      onSendCoupon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
