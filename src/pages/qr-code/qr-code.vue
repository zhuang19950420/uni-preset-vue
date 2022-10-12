<template>
  <!-- <z-navi-bar></z-navi-bar> -->
  <view class="qr-code">
    <view class="qr-code-card">
      <view class="photo">
        <image class="image" :src="userInfo.avatarUrl"></image>
      </view>
      <view class="qr-info">
        <view class="name-position">
          <view class="name">{{userInfo.fullName}}</view>
          <view class="position">{{userInfo.role == 'SA' ? '店员' : userInfo.role == 'SM' ? '店长' : userInfo.role == 'OM' ? '区域经理' : userInfo.role == 'AM'  ? '机场经理' : ''}}</view>
        </view>
        <view class="store-text">{{userInfo.storeName}}</view>
        <view class="qr">
          <image :src="userInfo.qrCodeUrl" class="image"></image>
        </view>
        <view class="text">扫一扫二维码，关注官方公众号</view>
      </view>
    </view>
  </view>
</template>

<script>
import { reactive, ref } from 'vue'
import um from '../../manager/userManager'
export default {
  setup() {
    const userInfo = reactive({
      avatarUrl: '',
      qrCodeUrl: '',  // 二维码
      role: '',  // 职位
      fullName: '',  // 员工信息
      storeName: null,  // 店名
    })

    return {
      userInfo,
    }
  },
  onShow() {
    um.getUserInfo().then(res => {
      this.userInfo.avatarUrl = res.avatarUrl || ''
      this.userInfo.qrCodeUrl = res.qrCodeUrl || ''
      this.userInfo.role = res.role || ''
      this.userInfo.fullName = res.fullName || ''
      this.userInfo.storeName = (res.stores.length > 0 && res.stores[0]) ? res.stores[0].storeName : ''
    })
  },
  // 分享
  onShareAppMessage(res) {
    console.log(res)
  }
}
</script>
<style lang="scss" scoped>
  @import "./index.scss";
</style>