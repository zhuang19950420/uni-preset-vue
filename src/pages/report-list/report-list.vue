<template>
  <!-- <z-navi-bar></z-navi-bar> -->
  <z-loading id="z-loading" @retry="refresh"></z-loading>
  <view class="report-list" v-if="!loading">
    <block v-if="reportArrList && reportArrList.length">
      <z-report-card
        v-for="(item, index) in reportArrList"
        :key="index"
        :list="item"
        :inex="index"
        isRole="isRole"
        :personal="isRole == 'AM'"
        @onReport="onReportPerson"
        @ontoMore="onGotoMoreCallback"
      ></z-report-card>
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
    const isRole = ref("");
    const reportArrList = ref([]);
    // 点击更多跳转去详情页
    const onGotoMoreCallback = function (e) {
      uni.$router.navigateTo({
        url: `pages/report-detail/report-detail?isRole=${isRole.value}`,
      });
    };

    // 获取报表信息
    const getReportList = function () {
      const getTime = getCurrentTime({
        type: "YYYY-MM",
      });
      const params = {
        queryMonth: getTime,
        departmentIds: getApp().globalData.reportIds,
      };
      getReport(params)
        .then((report) => {
          loading.value = false;
          uni.$hideLoading();
          getApp().globalData.reportIds = null;
          console.log("report", report);
          const { code, data } = report;
          if (code !== "0") return;
          reportArrList.value = data;
        })
        .catch((err) => {
          loading.value = false;
          uni.$hideLoading();
          getApp().globalData.reportIds = null;
        });
    };

    // 机场经理-点击查看报表
    const onReportPerson = function (e) {
      const { isRole, id } = e;
      uni.$router.navigateTo({
        url: `pages/personal-report/personal-report?isRole=${isRole}&departmentIds=${id}`,
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
      getReportList,
      reportArrList,
      onReportPerson,
      onGotoMoreCallback,
    };
  },
  onLoad(options) {
    this.isRole = options.isRole;
    uni.$showLoading();
    this.getReportList();
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
