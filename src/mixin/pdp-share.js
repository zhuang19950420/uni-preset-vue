/**
 * 商品详情页面分享
 */

export default {
  onShareAppMessage(options) {
    const { bannerImages, name } = this.productData

    return {
      title: name,
      imageUrl: bannerImages[0]
    }
  }
}
