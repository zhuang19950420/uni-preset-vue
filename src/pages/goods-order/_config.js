export const statusList = {
  PENDING: '已支付',
  SHIPPED: '已发货',
  SIGNED: '已签收',
  COMPLETE: '已完成',
  CLOSED: '已关闭'
}

export const channelList = [
  {
    name: '全部带货商品',
    code: 'SA_CONTAINS'
  },
  {
    name: '仅店员带货商品',
    code: 'ONLY_SA'
  },
  {
    name: '其他可带货商品',
    code: 'SA_AND_OTHERS'
  }
]
