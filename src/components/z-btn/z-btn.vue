<template>
  <block v-if="!registerView">
    <view class="container">
      <view
        :style="`background-color:${background};color:${color};font-size:${size}rpx;${
          border ? 'border:1px solid ' + color + ';' : ''
        }`"
        :class="['wrapper', enable ? 'normal' : 'disable']"
        :hover-class="[enable ? 'btn-hover-opacity' : 'none']"
        @tap="onBtnClick"
      >
        <text>{{ title }}</text>
      </view>
    </view>
  </block>
  <!-- 授权容器 -->
  <block v-else>
    <view class="auth" :hover-class="[enable ? 'btn-hover-opacity' : 'none']">
      <slot></slot>
      <button
        v-if="authType === 'getPhoneNumber'"
        class="auth-btn"
        open-type="getPhoneNumber"
        @getphonenumber="onGetphonenumber"
      ></button>
      <view v-if="authType === 'getUserProfile'" class="auth-btn" @click="getUserProfile">
      </view>
    </view>
  </block>
</template>

<script>
import um from "../../manager/userManager";
import { decryptUserMobile, saveCustomerProfile } from "./service.js";
import ignoreError from "../../constant/error";
export default {
  props: {
    // 按钮文字
    title: {
      type: String,
      default: "",
    },
    // 背景颜色
    background: {
      type: String,
      default: "#151415",
    },
    // 文字颜色
    color: {
      type: String,
      default: "#fff",
    },
    // 文字大小
    size: {
      type: Number,
      default: 28,
    },
    // 按钮是否有效
    enable: {
      type: Boolean,
      default: true,
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: false,
    },
    // 是否是作为授权view容器
    registerView: {
      type: Boolean,
      default: false,
    },
    // 授权组件类型
    authType: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    // 手机号解密
    const onGetphonenumber = function (e) {
      const { code } = e.detail;
      if (!!code) {
        decryptUserMobile(code)
          .then((res) => {
            um.updateUserInfo(res.data);
            ctx.emit("updateUser", res.data);
            uni.showToast({
              title: "手机号授权成功！",
              icon: "none",
            });
          })
          .catch((err) => {
            const errorConfig = ignoreError["Employee_4"];
            if (err.code == errorConfig["code"]) {
              return uni.showToast({
                title: errorConfig["desc"],
                icon: "none",
              });
            }
          });
      } else {
        uni.showToast({
          title: "手机号授权失败！",
          icon: "none",
        });
      }
    };
    // 用户基本信息获取
    const getUserProfile = function (e) {
      uni.getUserProfile({
        desc: "用于完善会员资料",
        success(res) {
          const { encryptedData, iv } = res;
          uni.login({
            success: (login) => {
              saveCustomerProfile({
                encryptData: encryptedData,
                iv,
                jscode: login.code,
              }).then((data) => {
                if (data.code == 0) {
                  um.updateUserInfo(data.data);
                  ctx.emit("updateUser", data.data);
                  uni.showToast({
                    title: "头像信息授权成功！",
                    icon: "none",
                  });
                }
              });
            },
          });
        },
        fail(res) {
          console.log(`getUserProfile`, res);
        },
      });
    };
    const onBtnClick = function () {
      if (props.enable) {
        ctx.emit("btntap");
      } else {
        console.log("按钮无效");
      }
    };
    return {
      onBtnClick,
      onGetphonenumber,
      getUserProfile,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
