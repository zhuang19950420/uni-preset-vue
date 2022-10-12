<template>
  <view class="avatar-conatainer" :style="avatarStyle">
    <image class="inner" :src="avatarUrl" mode="aspectFill"></image>
  </view>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue'
import './index.scss'
import um from '../../manager/userManager'

export default {
  components: {},
  props: {
    size: {
      type: Number,
      default: 136,
    },
  },
  setup(props, ctx) {
    const avatarStyle = ref('') // 头像样式
    const avatarUrl = ref('')
    watch(
      () => props.size,
      (size) => {
        avatarStyle.value = `width: ${size}rpx;height:${size}rpx;`
      },
      {
        immediate: true,
      }
    )

    return {
      avatarStyle,
      avatarUrl,
    }
  },
  onShow(e) {
    console.log(`z-avatar onShow`)
    if (!this.avatarUrl) {
      um.getUserInfo().then((userInfo) => {
        const { avatarUrl = '../../static/image/default_avatar.jpg' } = userInfo
        this.avatarUrl = avatarUrl
      })
    }
  },
  onReady() {
    console.log(`z-avatar onReady`)
    um.getUserInfo().then((userInfo) => {
      const { avatarUrl = '../../static/image/default_avatar.jpg' } = userInfo
      this.avatarUrl = avatarUrl
    })
  },
}
</script>
