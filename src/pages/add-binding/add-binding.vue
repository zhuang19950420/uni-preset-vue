<template>
  <!-- <z-loading id="z-loading" @retry=""></z-loading> -->
  <z-navi-bar :title="titleInfo.title"></z-navi-bar>
  <view class="add-binding">
    <view class="bg-image">
      <image class="image" src="/static/icon/customer_icon.png"></image>
    </view>
    <!-- <block v-if=""></block> -->
    <view class="section_1">
      <view class="logo">
        <image src="/static/icon/default_photo.png" class="image"></image>
      </view>
      <view class="text">{{ titleInfo.content }}</view>
      <view class="phone">
        <input type="number" v-model="mobile" @blur="getMobileFunc" maxlength="11" />
      </view>
      <view class="confirm" @tap="onConfirmFunc">
        <z-btn title="确认" :size="28" color="#D7C3A0" background="#332F27"></z-btn>
      </view>
    </view>
    <view class="bg-image-footer">
      <image class="image" src="/static/icon/customer_icon.png"></image>
    </view>
  </view>
</template>
<script>
import { reactive, ref } from "vue";
import { isPhone } from "../../utils/util";
import { memberInfo } from "./service";
import ignoreError from "../../constant/error";
export default {
  setup() {
    const fromType = ref("");
    const openIdUniId = reactive({
      openId: null,
      unionId: null,
    });
    // 顶部名称
    const titleInfo = reactive({
      title: "绑定会员",
      content: "请输入绑定手机号",
    });
    const mobile = ref(null);
    // 获取手机号
    const getMobileFunc = function (e) {
      const { value } = e.detail;
      mobile.value = value;
    };
    // 点击确认
    const onConfirmFunc = function () {
      uni.vibrateShort();
      if (!mobile.value) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
      } else if (isPhone(mobile.value)) {
        // uni.$showLoading()
        const params = {
          mobile: mobile.value,
        };
        memberInfo(params)
          .then((res) => {
            const { data, code } = res;
            uni.$hideLoading();
            if (code !== "0") return;
            console.log("------->", fromType.value);
            getApp().globalData.isBoundObj = data;
            uni.$router.navigateTo({
              url: `pages/register/register?type=${fromType.value}&unionId=${openIdUniId.unionId}&openId=${openIdUniId.openId}`,
            });
          })
          .catch((err) => {
            const errorConfig = ignoreError["Employee_1"];
            if (err.code == errorConfig["code"]) {
              return uni.showToast({
                title: errorConfig["desc"],
                icon: "none",
              });
            }
          });
      } else {
        uni.showToast({
          title: "搜索失败！该手机号不存在",
          icon: "none",
        });
      }
    };
    return {
      mobile,
      fromType,
      titleInfo,
      openIdUniId,
      getMobileFunc,
      onConfirmFunc,
    };
  },
  onLoad(options) {
    this.fromType = options.type;
    this.openIdUniId.unionId = options.unionId;
    this.openIdUniId.openId = options.openId;
    this.titleInfo.title = options.type == "add" ? "添加会员" : "绑定会员";
    this.titleInfo.content =
      options.type == "add" ? "请输入搜索手机号" : "请输入绑定手机号";
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
