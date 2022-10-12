<template>
	<uni-popup ref="modalPopup" :mask-click="false">
		<view class="modal-container" v-if="modal">
			<view class="modal">
				<image src="/static/icon/modal/bg.png" class="img"></image>
				<!-- 标题 -->
				<text class="title">{{modal.title || '温馨提示'}}</text>
				<!-- 描述 -->
				<text class="desc" v-if="modal.content">{{modal.content}}</text>
				<slot></slot>
				<!-- 按钮容器 -->
				<view class="btn-container">
					<view v-if="modal.certain" class="btn" hover-class="btn-hover-opacity" @tap="onCertainClick">{{modal.certain}}</view>
				</view>
			</view>
			<view class="close-btn" hover-class="btn-hover-opacity" @tap="onCloseClick">
				<image src="/static/icon/modal/close.png" class="img"></image>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import { ref, reactive, watch, computed } from 'vue'
	import './index.scss'

	export default {
		components: {

		},
		props: {

		},
		setup(props, ctx) {
			const modalPopup = ref(null)
			// 模态框内容
			const modal = ref(null)
			const onCloseClick = function() {
				modalPopup.value.close()
			}
			
			const showModal = function(e) {
				modal.value = e
				modalPopup.value.open()
			}
			
			const onCertainClick = function() {
				onCloseClick()
				modal.value.success && modal.value.success({
					confirm: 'confirm!'
				})
			}
			return {
				modalPopup,
				modal,
				onCloseClick,
				showModal,
				onCertainClick
			}
		},
		onShow(e) {

		},
		onReady() {

		},
	}
</script>
