<template>
  <view>
    <scroll-view
      class="scroll-list scroll-hidden"
      scroll-y="true"
      @scrolltolower="scrollCouponFunc"
    >
      <view class="list">
        <view class="section" v-for="(item, index) in list" :key="index">
          <view class="info">
            <view :class="[item.avatar ? 'portrait1' : 'portrait']">
              <image
                :lazy-load="lazyLoad"
                :src="item.avatar || '/static/icon/default_photo.png'"
                class="image"
              ></image>
            </view>
            <view>
              <view class="name-identity">
                <view class="name">{{ item.nickname }}</view>
                <view class="identity" v-if="item.memberTypeName">{{
                  item.memberTypeName
                }}</view>
              </view>
              <view class="wx-time" v-if="!item.memberNo">{{ item.addTime }}</view>
            </view>
          </view>
          <view
            class="btn"
            :data-member-number="item.memberNo"
            :data-mobile="item.mobile"
            :data-is-bound="item.isBound"
            :data-open-id="item.openId"
            :data-union-id="item.unionId"
            @tap="onClickBtnFunc"
          >
            <z-btn
              :title="item.isBound == 1 ? '查看' : '绑定'"
              :size="24"
              color="#968765"
              background="#fff"
            ></z-btn>
          </view>
        </view>
        <!-- <z-empty
          class="empty-wrapper"
          :empty="!list.length"
          empty-title="没有更多了"
          :total-title="list.length != total ? '正在加载...' : '没有更多了'"></z-empty> -->
      </view>
      <view class="bottom" v-if="!noBottom"></view>
    </scroll-view>
  </view>
</template>

<script>
import { ref, watch } from "vue";
export default {
  props: {
    noBottom: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: [],
    },
    lazyLoad: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    // 按钮点击
    const onClickBtnFunc = function (e) {
      console.log(e);
      const {
        memberNumber = null,
        mobile = null,
        isBound = null,
        openId = null,
        unionId = null,
      } = e.currentTarget.dataset;
      ctx.emit("onchange", { memberNumber, mobile, isBound, openId, unionId });
    };

    // 滚动分页
    const scrollCouponFunc = function () {
      ctx.emit("onScrollChange");
    };

    return {
      onClickBtnFunc,
      scrollCouponFunc,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
