<template>
  <text :style="{ textDecoration: scribe ? 'line-through' : 'none' }">{{
    formattedValue
  }}</text>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import { toThousands, percentage, formatNum } from "../../utils/util";

export default {
  components: {},
  props: {
    // 数值
    value: {
      type: Number,
      default: 0,
    },
    // 是否是价格类型
    price: {
      type: Boolean,
      default: false,
    },
    // 是否为划线价格
    scribe: {
      type: Boolean,
      default: false,
    },
    // 是否为百分比
    percent: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    // 格式化
    const formattedValue = computed(() => {
      const { value, price, percent } = props;
      // 金额显示
      if (price) {
        return `¥${value}`;
      }
      if (percent) {
        return percentage(value);
      }
      // 积分转千分位显示
      return formatNum(Math.round(value));
    });
    return {
      formattedValue,
    };
  },
  onShow(e) {},
  onReady() {},
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
