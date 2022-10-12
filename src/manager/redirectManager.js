/**
 * 兼容旧版本 页面重定向
 */
const CONFIG_PAGE = {
  '/luckyDrawPackage/pages/home/home': `luckyDrawPackage/pages/home/home`,
  'privacyPolicy/privacyPolicy': `pages/itemPrivacy/itemPrivacy`, // 隐私政策
  'coupon/coupon': `pages/couponCenter/couponCenter`
}

class RedirectManager {
  constructor() {}

  config(options) {
    this.options = options

    return this
  }

  action(cb) {
    const { pageUrl = null } = this.options
    if (pageUrl) {
      const url = decodeURIComponent(pageUrl).split('?')[0]
      const params = decodeURIComponent(pageUrl).split('?')[1]
      const newUrl = CONFIG_PAGE[url]
      uni.$router
        .reLaunch({
          url: `${newUrl}?${params}`
        })
        .then(
          success => {
            cb && cb.success()
          },
          reject => {
            cb && cb.fail()
          }
        )
    } else {
      cb && cb.fail()
    }
  }
}

export default new RedirectManager()
