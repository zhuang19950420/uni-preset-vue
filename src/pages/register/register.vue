<template>
  <z-loading id="z-loading" @retry=""></z-loading>
  <z-navi-bar :title="fromType === 'add' ? '添加常联系会员' : '绑定会员'"></z-navi-bar>
  <view class="register" :style="`min-height: calc(100vh - ${navHeight}px)`">
    <view v-if="successBd" class="arrow-btn" :style="barContentStyle" @tap="onClickBack">
      <!-- <image src="/static/icon/navi/back_white.png" class="image"></image> -->
    </view>
    <view class="bg-image">
      <image class="image" src="/static/icon/customer_icon.png"></image>
    </view>
    <view class="container" v-if="member">
      <view class="user-info">
        <view :class="member.avatar ? 'user-photo' : 'user-default'">
          <image class="image" :src="member.avatar || '/static/icon/default_photo.png'"></image>
        </view>
        <view class="user-name-id">
          <view class="name-position">
            <view class="user-name">{{member.memberName}}</view>
            <view class="user-position">{{member.bdlMemberTypeName}}</view>
          </view>
          <view class="user-id">ID：{{member.memberNo}}</view>
        </view>
      </view>
      <view class="user-input">
        <view class="mobile">
          <view class="section">
            <text class="label">手机号</text>
            <input type="mobile" :value="member.mobile" disabled />
          </view>
          <view class="line"></view>
        </view>
        <view class="sex">
          <view class="section">
            <text class="label">性别</text>
            <view>{{member.gender === 'M' ? '男' : '女'}}</view>
            <!-- <picker
              mode="selector"
              @change="bindPickerChange"
              style="flex-grow: 1"
              :range="sexList"
              :value="member.gender === 'M' ? '0' : '1'">
              
            </picker> -->
          </view>
          <view class="line"></view>
        </view>
        <view class="integral">
          <view class="section">
            <text class="label">积分</text>
            <view>{{member.point}}</view>
          </view>
          <view class="line"></view>
        </view>
        <view class="birth">
          <view class="section">
            <text class="label">生日</text>
            <view class="picker-container">
              <input
                disabled
                class="cus-input"
                placeholder-class="cus-place-holder"
                :value="member.birthday"
              />
              
            </view>
            <!-- <picker
              mode="date"
              style="flex-grow: 1"
              data-type="birth"
              @change="bindDateChange"
              @tap="onPickerClick"
              @cancel="onPickerClick"
              :value="member.birthday"
            >
             
            </picker> -->
          </view>
          <view class="line"></view>
        </view>
      </view>
      <view class="btn" @tap="addMemberBtn">
        <z-btn :title="(fromType === 'add' && member.isAdded) ? '查看会员' : (fromType === 'add')  ? '添加常联系会员' : '确认绑定'" :size="28" color="#D7C3A0" background="#332F27"></z-btn>
      </view>
    </view>
    <!-- 底部 -->
    <view class="bg-image-footer">
      <image class="image" src="/static/icon/customer_icon.png"></image>
    </view>
  </view>
</template>

<script>
  import { ref, computed } from 'vue'
  import ignoreError from '../../constant/error'
  import { naviBarHeight } from "../../utils/util.js"
  import { memberInfo, addMember, binDingMember } from './service'
  export default {
    props: {
      navHeight: {
        type: Number,
        default: naviBarHeight()
      }
    },
    setup() {
      // 区分是添加常联系人还是绑定会员
      const fromType = ref(null)
      // 当前绑定用户的openid和unionid
      const openId = ref(null)
      const unionId = ref(null)

      // 是否成功绑定
      const successBd = ref(false)

      // 点击添加按钮次数
      const mobile = ref(null)
      const member = ref(null)

      // 计算高度
      const barContentStyle = computed(() => {
        const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
        return `top: ${statusBarHeight}px;`
      })

      // 添加常联系人
      const addMemberBtn= function () {
        console.log(fromType.value)
        if (fromType.value === 'add' && !member.value.isAdded) {
          uni.showLoading()
          const params = {
            memberNo: member.value.memberNo
          }
          addMember(params)
          .then(res => {
            uni.$hideLoading()
            if (res.code !== '0') return 
            member.value.isAdded = true
            uni.showToast({
              title: '添加成功',
              icon: 'none',
            })
            successBd.value = true
          })
          .catch(err => {
            uni.$hideLoading()
          })
        } else if (fromType.value === 'add' && member.value.isAdded) {
          uni.$router.navigateTo({
            url: `pages/customer-detail/customer-detail?memberNo=${member.value.memberNo}`
          })
        } else {
          const params = {
            memberNo: member.value.memberNo,
            unionId: unionId.value,
            openId: openId.value
          }
          binDingMember(params)
          .then(res => {
            uni.$hideLoading()
            if (res.code == '0') {
              uni.showToast({
                title: '绑定成功',
                icon: 'none'
              })
              successBd.value = true
              setTimeout(function () {
                uni.$router.switchTab({
                  url: `pages/customer-list/customer-list`
                })
              }, 2000)
            } else {
              const errorConfig = ignoreError['SocialBinding_1']
              const errorConfig2 = ignoreError['System_6']

              console.log('SocialBinding_1', errorConfig)
              if (err.code == errorConfig['code'] || err.code == errorConfig2['code']) {
                return uni.showToast({
                  title: errorConfig['desc'],
                  icon: 'none',
                })
              } else {
                return uni.showToast({
                  title: '接口报错',
                  icon: 'none'
                })
              }
            }
          })
          .catch(err => {
            uni.$hideLoading()
            const errorConfig = ignoreError['SocialBinding_1']
            if (err.code == errorConfig['code'] ) {
              return uni.showToast({
                title: errorConfig['desc'],
                icon: 'none',
              })
            } else {
              console.log('接口报错----->', err)
            }
            
          })
        }
      }

      // 点击返回按钮
      const onClickBack = function () {
        const currentIndex = (fromType.value == 'add') ? 2 : 1
        // if (fromType.value == 'add') {
          uni.$router.switchTab({
            url: `pages/customer-list/customer-list?currentIndex=${currentIndex}`
          })
        // }
      }

      return {
        barContentStyle,
        mobile,
        openId,
        unionId,
        member,
        fromType,
        successBd,
        onClickBack,
        addMemberBtn,
      }
    },
    onLoad(options) {
      this.fromType = options.type
      this.openId = options.openId
      this.unionId = options.unionId
      const isBoundObj = getApp().globalData.isBoundObj
      this.member = isBoundObj
      if (this.fromType == 'add' && this.member.isAdded) {
        this.successBd = true
      }
      
    },
    onReady() {
      uni.$showLoading()
    },
    onUnload() {

    }
  }
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>