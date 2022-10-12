/**
 * 数据配置
 */

import ENV from '../../config/env'

const TEMPLATE = {
  development: {
    // 注册
    REGISTER: [
      'a2a2Nn6RNUDbrLwVNQ0zzxlp-m5bxs7pMis0HWNehxo',
      'wi8KW0MsI1mA2ZbtSJBC_2-K90eTp4Ts8naxAGGMSJ4',
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM'
    ],
    // 会员权益
    BENEFITS: [
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM',
      'yc7GuvjOugZ4V-O7g7n3Jq6Ly39ktfflMfgA_N4rVto'
    ],
    // 探索积分规则
    SCORE_EXPLORE: [
      '4ID2tP1e39Jk7jxne-5Zl5IoGHieTvRncx_CRF71HzA',
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM'
    ],
    // 探索积分礼遇
    BENEFIT_EXPLORE: [
      '4ID2tP1e39Jk7jxne-5Zl5IoGHieTvRncx_CRF71HzA',
      'wi8KW0MsI1mA2ZbtSJBC_2-K90eTp4Ts8naxAGGMSJ4'
    ],
    // 查看积分兑换
    SCORE_DISCOVER: [
      '4ID2tP1e39Jk7jxne-5Zl5IoGHieTvRncx_CRF71HzA',
      'wi8KW0MsI1mA2ZbtSJBC_2-K90eTp4Ts8naxAGGMSJ4'
    ],
    // 领券
    COUPON: [
      'a2a2Nn6RNUDbrLwVNQ0zzxlp-m5bxs7pMis0HWNehxo',
      'wi8KW0MsI1mA2ZbtSJBC_2-K90eTp4Ts8naxAGGMSJ4',
      '4ID2tP1e39Jk7jxne-5Zl5IoGHieTvRncx_CRF71HzA'
    ],
    // 查看购买订单
    ORDER_DISCOVER: [
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM',
      'yc7GuvjOugZ4V-O7g7n3Jq6Ly39ktfflMfgA_N4rVto'
    ],
    // 积分礼遇兑换
    EXCHANGE: [
      'Ue3xLbZw5inrbhh1wjU2we2md2vWAKo561WWnqvOivg',
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM'
    ],
    // 积分抽奖
    LUCKY_DRAW: [
      'FOVgl0m5b7DCC8ORQutJDsxYu4IBxhWAAMiUKIfzuc4',
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM',
      'Ue3xLbZw5inrbhh1wjU2we2md2vWAKo561WWnqvOivg'
    ],
    // 会员权益(查看入会礼，生日礼遇)
    MEMBER_0: [
      'a2a2Nn6RNUDbrLwVNQ0zzxlp-m5bxs7pMis0HWNehxo',
      'wi8KW0MsI1mA2ZbtSJBC_2-K90eTp4Ts8naxAGGMSJ4'
    ],
    // 会员权益(查看本季新品
    MEMBER_1: [
      '_BrdK5PBD0lUGwKyCa-1uEWS-zjgZZ0Qjl6kpF2pRMM',
      'yc7GuvjOugZ4V-O7g7n3Jq6Ly39ktfflMfgA_N4rVto'
    ],
    // 申请绑定
    APPLY: ['1GMbgMVx12j_NlhqZiEZZIMMa0kVay-e4FjqTxHUDKU']
  },

  production: {
    // 注册
    REGISTER: [
      'TlIBvXSS7qlhDs4izqtkTT0jxRIkIIMlmu9W50qQfqE',
      'TleTL_TML9g1dlNT8KCpK2xXKMyUZuYxtGw9oUf_lyY',
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY'
    ],
    // 会员权益
    BENEFITS: [
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY',
      'dcykioMEAx-sKuSy0-G49FNUPfPT5f7u8c4OGvsT-t0'
    ],
    // 探索积分规则
    SCORE_EXPLORE: [
      '6qDuMEm3e8pyRt7hDEldmks1o_Syb1qjq12ScVBjXYo',
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY'
    ],
    // 探索积分礼遇
    BENEFIT_EXPLORE: [
      '6qDuMEm3e8pyRt7hDEldmks1o_Syb1qjq12ScVBjXYo',
      'TleTL_TML9g1dlNT8KCpK2xXKMyUZuYxtGw9oUf_lyY'
    ],
    // 查看积分兑换
    SCORE_DISCOVER: [
      '6qDuMEm3e8pyRt7hDEldmks1o_Syb1qjq12ScVBjXYo',
      'TleTL_TML9g1dlNT8KCpK2xXKMyUZuYxtGw9oUf_lyY'
    ],
    // 领券
    COUPON: [
      'TlIBvXSS7qlhDs4izqtkTT0jxRIkIIMlmu9W50qQfqE',
      'TleTL_TML9g1dlNT8KCpK2xXKMyUZuYxtGw9oUf_lyY',
      '6qDuMEm3e8pyRt7hDEldmks1o_Syb1qjq12ScVBjXYo'
    ],
    // 查看购买订单
    ORDER_DISCOVER: [
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY',
      'dcykioMEAx-sKuSy0-G49FNUPfPT5f7u8c4OGvsT-t0'
    ],
    // 积分礼遇兑换
    EXCHANGE: [
      '4ZpSHQEzI8PVkDRGMgLR0y1l8xN_IVo5I1wCrqMa0Qs',
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY'
    ],
    // 积分抽奖
    LUCKY_DRAW: [
      'vx0f8x6MCCA7NV6I2heQeWswVsNB-KmeBZaY-p0EAzI',
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY',
      '4ZpSHQEzI8PVkDRGMgLR0y1l8xN_IVo5I1wCrqMa0Qs'
    ],
    // 会员权益(查看入会礼，生日礼遇)
    MEMBER_0: [
      'TlIBvXSS7qlhDs4izqtkTT0jxRIkIIMlmu9W50qQfqE',
      'TleTL_TML9g1dlNT8KCpK2xXKMyUZuYxtGw9oUf_lyY'
    ],
    // 会员权益(查看本季新品
    MEMBER_1: [
      'ePdZjtDBYnLeO0glVJ_MijQ1lTeZ31Ya7uxFGsiNvtY',
      'dcykioMEAx-sKuSy0-G49FNUPfPT5f7u8c4OGvsT-t0'
    ],
    APPLY: ['04HCsHCgkSoL-q-JHLliflqg1Eur9zJjn4bItl-RsrQ']
  }
}

export const NOTI_TEMPLATE = TEMPLATE[ENV]
