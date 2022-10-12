/**
 * 用户信息处理
 */

 import { ref, reactive, watch, computed } from 'vue'
 import { onLoad, onShow } from '@dcloudio/uni-app'
 import um from '../manager/userManager'
 
 export const userHandler = loading => {
   const userInfo = ref({}) // 用户信息
 
   // 刷新用户信息
   const refreshUserInfo = function() {
     um.refresh().then(res => {
       userInfo.value = res
       if (loading) {
         loading.value = false
         uni.hideLoading()
       }
     })
   }
 
   onLoad(() => {
     um.getUserInfo().then(res => {
       userInfo.value = res
     })
   })
 
   onShow(() => {
     refreshUserInfo()
   })
 
   return {
     userHandlerResult: {
       userInfo,
       refreshUserInfo
     }
   }
 }
 