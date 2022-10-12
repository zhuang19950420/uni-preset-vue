<template>
    <uni-popup ref="popup" type="center" :is-mask-click="false">
        <view class="tips">
            <view class="tips-top">
                {{title}}
            </view>
            <view class="content">
                <scroll-view scroll-y="true" class="scroll">
                    <!-- 切换门店 -->
                    <view class="list" v-if="isStore">
                        <view class="store-item" v-for="(item, index) in list" :key="index" :data-index="index" :data-department-id="item.departmentId" :data-store-number="item.storeNumber" @tap="onSelectStore">
                            <z-checkbox border :checked="item.isChecked"></z-checkbox>
                            <view class="store-title">{{item.storeName}}</view>
                        </view>
                    </view>
                    <!-- 店员分配 -->
                    <view class="list" v-else>
                        <view class="item" v-for="(item, index) in list" :key="index" :data-index="index" :data-user-id="item.userId" @tap="onSelectStoreName">
                            <z-checkbox border :checked="item.isChecked"></z-checkbox>
                            <view :class="item.avatar ? 'photo' : 'default-photo'">
                                <image :src="item.avatar || '/static/icon/default_photo.png'" class="image"></image>
                            </view>
                            <view class="info">{{item.fullName}}</view>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view class="tips-button">
                <view class="cancel btn" @tap="clickCancel">
                    <z-btn title="取消" color="#B18C4F" background="#fff"></z-btn>
                </view>
                <view class="line"></view>
                <view class="confirm btn" @tap="clickConfirm">
                    <z-btn title="确认" color="#B18C4F" background="#fff"></z-btn>
                </view>
            </view>
        </view>
    </uni-popup>
</template>
<script>
import { ref } from 'vue'
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        // 切换门店
        isStore: {
            type: Boolean,
            default: false
        },
        // 门店列表
        list: {
            type: Array,
            default: []
        }
    },
    setup(props, ctx) {
        // 选中的门店number
        const selectStoreNumber = ref('')
        const selectDepartmentId = ref('')
        // 选中的员工userId
        const selectUserId = ref('')
        const popup = ref(null);
        const open = function (e) {
            if (props.isStore) {
                selectStoreNumber.value = e
            }
            popup.value.open()
        }
        const close = function () {
            popup.value.close()
        }

        // 删除地址 -- 点击取消 / 确认
        const clickCancel = function () {
            uni.vibrateShort()
            popup.value.close()
            clickCancel.value = ''
            ctx.emit('btnClick', {type: 'cancel'})
        }
        const clickConfirm = function () {
            uni.vibrateShort()
            popup.value.close()
            if (!props.isStore) ctx.emit('btnClick', {type: 'confirm', userId: selectUserId.value})
            else ctx.emit('btnClick', { type: 'confirm', storeNumber: selectStoreNumber.value, selectDepartmentId: selectDepartmentId.value})
            
        }

        // 门店切换选择
        const onSelectStore = function (e) {
            const { index, storeNumber, departmentId} = e.currentTarget.dataset
            console.log(index, storeNumber, departmentId)
            selectStoreNumber.value = storeNumber
            selectDepartmentId.value = departmentId || ''
            for (let i = 0; i < props.list.length; i++) {
                if (i === index) {
                    props.list[i].isChecked = true
                } else {
                    props.list[i].isChecked = false
                }
            }
        }

        // 店员-切换选择
        const onSelectStoreName = function (e) {
            const {index, userId } = e.currentTarget.dataset
            selectUserId.value = userId
            for (let i = 0; i < props.list.length; i++) {
                if (i === index) {
                    props.list[i].isChecked = true
                } else {
                    props.list[i].isChecked = false
                }
            }
        }
        
        return {
            popup,
            open,
            close,
            clickCancel,
            clickConfirm,
            onSelectStore,
            onSelectStoreName
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./index";
</style>