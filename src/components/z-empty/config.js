export const emptyTypeConfig = {
  CART: {
    icon: `/static/cart/empty.png`,
    label: `购物车为空`,
    hint: `添加商品查看你的专属会员折扣`,
    cta: {
      title: `前往选购`,
      background: `#CF0A2C`,
      path: `pages/product/list/index`
    }
  },
  CART_AUTH: {
    icon: `/static/cart/fresh.png`,
    hint: `登录以查看你的购物车`,
    cta: {
      title: `会员登录`,
      auth: true
    }
  },
  ADDRESS: {
    icon: `/static/icon/address.png`,
    hint: `暂无收件地址`,
    cta: {
      title: `添加新地址`,
      path: `pages/setting/address/add/index`
    }
  },
  WISH_LIST: {
    icon: `/static/icon/wish.png`,
    hint: `暂无任何收藏`,
    cta: {
      title: `去添加`,
      path: `pages/product/list/index`
    }
  }
}
