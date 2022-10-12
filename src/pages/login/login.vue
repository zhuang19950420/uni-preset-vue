<template>
  <z-loading id="z-loading" @retry="onRefresh"></z-loading>
  <z-container :naviHeight="0" v-if="!loading">
    <view class="container">
      <view class="login-top-image">
        <image src="/static/icon/login/bg_top.png" class="bg-top"></image>
      </view>
      <view class="logo">
        <image src="/static/icon/login/logo.png" class="logo-image"></image>
      </view>
      <text class="login-text">
        {{ authType === "getPhoneNumber" ? "请先验证员工账号" : "" }}
        {{ authType === "getUserProfile" ? "请先授权员工头像信息" : "" }}
      </text>
      <z-btn registerView :authType="authType" @updateUser="updateUserInfo">
        <view class="login-btn" hover-class="btn-hover-opacity">
          <view class="btn">
            {{ authType === "getPhoneNumber" ? "使用手机号验证" : "" }}
            {{ authType === "getUserProfile" ? "授权员工信息" : "" }}
          </view>
        </view>
      </z-btn>
      <view class="login-bottom-image">
        <image src="/static/icon/login/bg_top.png" class="bg-bottom"></image>
      </view>
    </view>
  </z-container>
</template>

<script>
import { ref } from "vue";
import um from "../../manager/userManager";
export default {
  setup(props, ctx) {
    const loading = ref(true);
    const authType = ref("getPhoneNumber");
    const step = ref(0);
    const userInfo = ref({});
    const onLogin = function () {
      um.getUserInfo().then((user) => {
        userInfo.value = user;
        const { authorized, mobileAuthorized, avatarUrl } = user;
        uni.$hideLoading();

        if (!!authorized && !!mobileAuthorized && !!avatarUrl) {
          uni.$router.switchTab({
            url: `pages/dashboard/dashboard`,
          });
          return;
        }
        loading.value = false;
        if (!mobileAuthorized) return;
        if (!avatarUrl) authType.value = "getUserProfile";
      });
    };
    const updateUserInfo = function (e) {
      const { avatarUrl } = e;
      if (!avatarUrl && authType.value != "getUserProfile") {
        authType.value = "getUserProfile";
        return;
      }
      uni.$router.switchTab({
        url: `pages/dashboard/dashboard`,
      });
    };

    // 刷新
    const onRefresh = function () {
      onLogin();
    };
    return {
      step,
      onLogin,
      loading,
      userInfo,
      authType,
      onRefresh,
      updateUserInfo,
    };
  },
  onLoad() {
    this.onLogin();
  },
  onReady() {
    uni.$showLoading();
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
