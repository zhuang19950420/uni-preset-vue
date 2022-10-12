<template>
  <view class="trademark">
    <view class="trademark-select">
      <input
        type="text"
        disabled
        :value="brand"
        placeholder="品牌选择"
        placeholder-style="opacity: 0.3;"
        class="text"
        :style="`padding-right: ${brand ? 40 : 20}rpx`"
        @tap="onSelectBrand"
      />
      <view v-if="brand" class="close" @tap="deleteBrand">
        <uni-icons type="closeempty" size="18" color="#000"></uni-icons>
      </view>
      <image
        v-else
        class="arrow-icon"
        src="/static/icon/product/sort_bottom_select.png"
        mode="widthFix"
        @tap="onSelectBrand"
      />
    </view>
    <view class="trademark-select">
      <picker
        class="picker-select"
        mode="selector"
        :range="channel"
        range-key="name"
        :value="curIndex"
        @change="onQidChange"
      >
        <view class="select-text">
          <input class="text" type="text" disabled :value="channel[curIndex].name" />
          <image
            class="arrow-icon"
            src="/static/icon/product/sort_bottom_select.png"
            mode="widthFix"
          />
        </view>
      </picker>
    </view>
    <view class="trademark-select">
      <picker
        class="picker-select"
        mode="selector"
        :range="onSaleList"
        range-key="name"
        :value="saleIndex"
        @change="onChangeSale"
      >
        <view class="select-text">
          <input class="text" type="text" disabled :value="onSaleList[saleIndex].name" />
          <image
            class="arrow-icon"
            src="/static/icon/product/sort_bottom_select.png"
            mode="widthFix"
          />
        </view>
      </picker>
    </view>
  </view>
</template>

<script>
import { ref, reactive } from "vue";
import { channelList, onsale } from "./_config";

export default {
  props: {
    brand: {
      type: String,
      value: "",
    },
  },
  setup(props, { emit }) {
    // 渠道列表
    const channel = ref(channelList);
    // 选中的渠道信息
    const curIndex = ref(0);
    const qidInfo = reactive({
      code: "SA_CONTAINS",
      title: "全部带货商品",
    });

    // 是否可售卖下拉框
    const onSaleList = ref(onsale);
    const saleIndex = ref(0);
    const selectSale = reactive({
      title: "全部",
      code: null,
    });

    // 渠道切换
    const onQidChange = (e) => {
      const { value } = e.detail;
      qidInfo.title = channel.value[value].name;
      qidInfo.code = channel.value[value].code;
      curIndex.value = value;
      emit("onSelectQid", { qidInfo: qidInfo });
    };

    // 选择是否有库存
    const onChangeSale = (e) => {
      const { value } = e.detail;
      selectSale.title = onSaleList.value[value].name;
      selectSale.code = onSaleList.value[value].code;
      saleIndex.value = value;
      emit("onSelectSale", { selectSale: selectSale });
    };

    // 选择品牌-打开品牌弹窗
    const onSelectBrand = (e) => {
      emit("openBrand");
    };

    // 删除品牌
    const deleteBrand = () => {
      emit("clearBrand");
    };

    return {
      channel,
      curIndex,
      saleIndex,
      onSaleList,

      deleteBrand,
      onQidChange,
      onChangeSale,
      onSelectBrand,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
