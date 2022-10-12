<template>
  <view class="report-card">
    <view class="report-title">
      <view class="title" v-if="list.department && list.department.name">{{
        list.department.name
      }}</view>
      <view class="more" v-if="isRole !== 'SA'" @tap="onReportMore">
        <view class="text">{{
          isRole == "SM" && showStore
            ? "切换门店"
            : list.departmentIds && list.departmentIds.length > 0
            ? "查看更多"
            : ""
        }}</view>
        <view
          class="arrow"
          v-if="isRole == 'SM' || (list.departmentIds && list.departmentIds.length > 0)"
        >
          <image src="/static/icon/arrow.png" class="image"></image>
        </view>
      </view>
    </view>
    <!-- 报表数据 -->
    <view :class="['report-list', isShowMore ? 'show-more-click' : '']">
      <!-- 销售数据 -->
      <view class="report-section">
        <view class="section">
          <view class="section-title">
            <view class="title">本月销售概览</view>
            <view class="under-line"></view>
          </view>
          <view
            class="section-detail"
            :class="[
              'section-detail',
              isShowMore ? 'show-more-click' : 'show-more-close',
            ]"
            v-if="list.salesReport"
          >
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.totalSalesAmount"></z-currency>
              </view>
              <view class="text">总销售额</view>
            </view>

            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.totalKpiTarget"></z-currency>
              </view>
              <view class="text">总销售目标</view>
            </view>

            <view class="section-item right">
              <view class="number">
                <z-currency
                  percent
                  :value="list.salesReport.totalCompletionRate"
                ></z-currency>
              </view>
              <view class="text">总达成率</view>
            </view>

            <view class="section-item">
              <view class="number">
                <z-currency :value="list.memberReport.memberSalesNum"></z-currency>
              </view>
              <view class="text">消费会员数</view>
            </view>

            <!-- 会员销售金额 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.memberReport.memberSalesAmount"></z-currency>
              </view>
              <view class="text">会员销售金额</view>
            </view>

            <view class="section-item right">
              <view class="number">
                <z-currency
                  percent
                  :value="list.memberReport.memberSalesRate"
                ></z-currency>
              </view>
              <view class="text">会员销售占比</view>
            </view>
          </view>
        </view>
        <view class="line"></view>
        <!-- <view class="show-more" v-if="index == dataList.length -1" @tap="onOpen">
          <view class="text">{{isShowMore ? '收起' : '展开'}}</view>
          <view :class="['arrow', isShowMore ? 'close' : '']">
            <image class="image" src="/static/icon/arrow_show.png"></image>
          </view>
        </view> -->
      </view>
      <view class="report-section">
        <view class="section">
          <view class="section-title">
            <view class="title">本月指标达成</view>
            <view class="under-line"></view>
          </view>
          <view
            class="section-detail"
            :class="[
              'section-detail',
              isShowMore ? 'show-more-click' : 'show-more-close',
            ]"
            v-if="list.memberReport"
          >
            <!-- 本品牌销售额 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.salesAmount"></z-currency>
              </view>
              <view class="text">本品牌销售额</view>
            </view>

            <!-- 本品牌销售目标 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.kpiTarget"></z-currency>
              </view>
              <view class="text">本品牌销售目标</view>
            </view>
            <!-- 本品牌达成率 -->
            <view class="section-item right">
              <view class="number">
                <z-currency percent :value="list.salesReport.completionRate"></z-currency>
              </view>
              <view class="text">本品牌达成率</view>
            </view>

            <!-- 跨品牌销售额 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.acrossSalesAmount"></z-currency>
              </view>
              <view class="text">跨品牌销售额</view>
            </view>

            <!-- 跨品牌销售目标 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.acrossKpiTarget"></z-currency>
              </view>
              <view class="text">跨品牌销售目标</view>
            </view>
            <!-- 跨品牌达成率 -->
            <view class="section-item right">
              <view class="number">
                <z-currency
                  percent
                  :value="list.salesReport.acrossCompletionRate"
                ></z-currency>
              </view>
              <view class="text">跨品牌达成率</view>
            </view>

            <!-- 跨月退单销售额 -->
            <view class="section-item">
              <view class="number">
                <z-currency
                  :value="list.salesReport.crossMonthRefundOrderAmount"
                ></z-currency>
              </view>
              <view class="text">跨月退单销售额</view>
            </view>

            <!-- 本品牌订单数 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.salesReport.orderNum"></z-currency>
              </view>
              <view class="text">本品牌订单数</view>
            </view>

            <!-- 跨品牌订单数 -->
            <view class="section-item right">
              <view class="number">
                <z-currency :value="list.salesReport.acrossOrderNum"></z-currency>
              </view>
              <view class="text">跨品牌订单数</view>
            </view>

            <block v-if="showBig">
              <!-- 大单团购销售额 -->
              <view class="section-item">
                <view class="number">
                  <z-currency :value="list.salesReport.bigDealsSales"></z-currency>
                </view>
                <view class="text">大单团购销售额</view>
              </view>
              <!-- 大单团购目标 -->
              <view class="section-item">
                <view class="number">
                  <z-currency :value="list.salesReport.bigDealsTarget"></z-currency>
                </view>
                <view class="text">大单团购目标</view>
              </view>
              <!-- 大单团购达成率 -->
              <view class="section-item right">
                <view class="number">
                  <z-currency
                    percent
                    :value="list.salesReport.bigDealsCompletionRate"
                  ></z-currency>
                </view>
                <view class="text">大单团购达成率</view>
              </view>
            </block>
          </view>
        </view>
        <view class="line"></view>
      </view>

      <view class="report-section">
        <view class="section-1">
          <view class="section-title">
            <view class="title">本月会员数据</view>
            <view class="under-line"></view>
          </view>
          <view
            class="section-detail"
            :class="[
              'section-detail',
              isShowMore ? 'show-more-click' : 'show-more-close',
            ]"
            v-if="list.memberReport"
          >
            <!-- 新会员招募数 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.memberReport.newMemberNum"></z-currency>
              </view>
              <view class="text">新会员招募数</view>
            </view>
            <!-- 新会员销售金额 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.memberReport.newMemberSalesAmount"></z-currency>
              </view>
              <view class="text">新会员销售金额</view>
            </view>
            <!--  -->
            <view class="section-item right"> </view>

            <!-- 专属会员销售额 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.memberReport.exclusiveMemberSales"></z-currency>
              </view>
              <view class="text">专属会员销售额</view>
            </view>
            <!-- 专属会员数 -->
            <view class="section-item">
              <view class="number">
                <z-currency :value="list.memberReport.exclusiveMembers"></z-currency>
              </view>
              <view class="text">专属会员数</view>
            </view>
            <!-- 专属顾客数 -->
            <view class="section-item right">
              <view class="number">
                <z-currency :value="list.memberReport.exclusiveCustomers"></z-currency>
              </view>
              <view class="text">专属顾客数</view>
            </view>
          </view>
        </view>
      </view>

      <view
        class="personal-report"
        v-if="isRole === 'SA' || isRole === 'SM' || personal"
        @tap="onPersonReport"
      >
        <z-btn title="查看个人报表" color="#fff" :size="28" background="#B18C4F"></z-btn>
      </view>

      <view class="show-more" @tap="onOpen">
        <view class="text">{{ isShowMore ? "收起" : "展开" }}</view>
        <view :class="['arrow', isShowMore ? 'close' : '']">
          <image class="image" src="/static/icon/arrow_show.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { ref } from "vue";
import { handlerData } from "./_config";
export default {
  props: {
    noMore: {
      type: Boolean,
      default: false,
    },
    // 身份
    isRole: {
      type: String,
      default: "SA",
    },
    list: {
      type: Object,
      default: {},
    },
    // 店长身份是否显示切换门店
    showStore: {
      type: Boolean,
      default: false,
    },
    // 是否显示查看个人报表
    personal: {
      type: Boolean,
      default: false,
    },
    // 区域经理/公司主管显示大单数据
    showBig: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const dataList = ref(handlerData);
    const isShowMore = ref(false);
    // 点击更多或者切换门店
    const onReportMore = function (e) {
      const { title } = e.currentTarget.dataset;
      uni.vibrateShort();
      console.log("点击查看更多");
      if (props.isRole == "SM") {
        ctx.emit("ontoMore", { type: "store" });
      } else {
        getApp().globalData.reportIds = props.list.departmentIds.join(",");
        ctx.emit("ontoMore", { type: "more" });
      }

      // ctx.emit('ontoMore', title)
    };
    // 点击查看报表
    const onPersonReport = function () {
      ctx.emit("onReport", { isRole: props.isRole, id: props.list.department.id || "" });
    };

    // 点击展开/收起
    const onOpen = function () {
      uni.vibrateShort();
      isShowMore.value = !isShowMore.value;
    };
    return {
      dataList,
      onOpen,
      isShowMore,
      onReportMore,
      onPersonReport,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
