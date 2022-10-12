<template>
  <z-loading id="z-loading" @retry="refresh"></z-loading>
  <view class="personal-report" v-if="!loading">
    <block v-if="reportArrList && reportArrList.length > 0">
      <view class="report-card" v-for="(item, index) in reportArrList" :key="index">
        <view class="report-title">
          <view class="title">{{ item.employeeName }}</view>
          <view class="more">
            <view class="text">店内月排名：{{ item.salesReport.salesRank }}</view>
          </view>
        </view>

        <!-- 报表数据 -->
        <view :class="['report-list']">
          <view class="report-section">
            <view class="section">
              <view class="section-title">
                <view class="title">本月销售概览</view>
                <view class="under-line"></view>
              </view>
              <view class="section-detail">
                <!-- 总销售额 -->
                <view class="section-item">
                  <view class="number">
                    <z-currency :value="item.salesReport.totalSalesAmount"></z-currency>
                  </view>
                  <view class="text">总销售额</view>
                </view>
                <!-- 本品牌销售额 -->
                <view class="section-item">
                  <view class="number">
                    <z-currency :value="item.salesReport.salesAmount"></z-currency>
                  </view>
                  <view class="text">本品牌销售额</view>
                </view>
                <!-- 跨品牌销售额 -->
                <view class="section-item right">
                  <view class="number">
                    <z-currency :value="item.salesReport.acrossSalesAmount"></z-currency>
                  </view>
                  <view class="text">跨品牌销售额</view>
                </view>
              </view>
            </view>
            <view class="line"></view>
          </view>

          <view class="report-section">
            <view class="section">
              <view class="section-title">
                <view class="title">本月添加情况</view>
                <view class="under-line"></view>
              </view>
              <view class="section-detail">
                <!-- 专属会员数 -->
                <view class="section-item">
                  <view class="number">
                    <z-currency :value="item.memberReport.exclusiveMembers"></z-currency>
                  </view>
                  <view class="text">专属会员数</view>
                </view>
                <!-- 专属会员销售额 -->
                <view class="section-item">
                  <view class="number">
                    <z-currency
                      :value="item.memberReport.exclusiveMemberSales"
                    ></z-currency>
                  </view>
                  <view class="text">专属会员销售额</view>
                </view>
                <view class="section-item right"></view>
                <!-- 专属顾客数 -->
                <view class="section-item">
                  <view class="number">
                    <z-currency
                      :value="item.memberReport.exclusiveCustomers"
                    ></z-currency>
                  </view>
                  <view class="text">专属顾客数</view>
                </view>
                <!-- 专属新会员数 -->
                <view class="section-item">
                  <view class="number">
                    <z-currency
                      :value="item.memberReport.exclusiveNewMemberNum"
                    ></z-currency>
                  </view>
                  <view class="text">专属新会员数</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <block v-else>
      <view class="no-data">暂无数据</view>
    </block>
  </view>
</template>
<script>
import { ref } from "vue";
import { getReport } from "./service";
import { getCurrentTime } from "../../utils/util";
export default {
  setup() {
    const loading = ref(true);
    // 身份
    const isRole = ref("");
    // 员工id -- 用于请求报表数据
    const departmentIds = ref("");
    const reportArrList = ref([]);

    // 请求报表数据
    const getReportList = function () {
      const getTime = getCurrentTime({
        type: "YYYY-MM",
      });
      const params = {
        queryMonth: getTime,
        departmentIds: departmentIds.value,
        scope: "SA",
      };
      getReport(params)
        .then((report) => {
          loading.value = false;
          uni.$hideLoading();
          const { code, data } = report;
          if (code !== "0") return;
          reportArrList.value = data;
        })
        .catch((err) => {
          loading.value = false;
          uni.$hideLoading();
        });
    };

    // 请求失败-重试
    const refresh = function () {
      uni.$showLoading();
      getReportList();
    };

    return {
      isRole,
      refresh,
      loading,
      reportArrList,
      departmentIds,
      getReportList,
    };
  },
  onLoad(options) {
    uni.$showLoading();
    this.departmentIds = options.departmentIds || "";
    this.isRole = options.isRole;
    this.getReportList();
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
