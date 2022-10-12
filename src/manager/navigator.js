/**
 * 页面导航管理器
 */
import { getCurrentPage } from '../utils/util'

// 底部导航栏页面
const TABBAR_PAGE = ['pages/center/center', 'pages/points/points', 'pages/mine/mine']

// 小程序内部页面
const INTERNAL_PAGE = {
  LIVE: 'pages/liveList/liveList',
  WEB_VIEW: 'pages/webView/webView',
  IMAGE_VIEW: 'pages/imageView/imageView',
  SUB_CMS_PAGE: 'pages/subCmsPage/subCmsPage',
  MAIN_CMS_PAGE: 'pages/mainCmsPage/mainCmsPage'
}

// 小程序跳转类型
const ACTION_TYPE = {
  LIVE: 'LIVE',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  MA_PAGE: 'MA_PAGE',
  WEB_LINK: 'WEB_LINK',
  CMS_PAGE: 'CMS_PAGE',
  CHECKOUT: 'CHECKOUT',
  EXT_MA_PAGE: 'EXT_MA_PAGE',
  REGISTRATION: 'REGISTRATION',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE'
}

class Navigator {
  constructor() {
    this.content = {}
  }

  setContent(value) {
    this.content = value
    return this
  }

  action() {
    const { actionType = null, actionUrl = null, appId = null } = this.content

    switch (actionType) {
      case ACTION_TYPE['IMAGE']:
        uni.$router.navigateTo({
          url: `${INTERNAL_PAGE['IMAGE_VIEW']}?url=${encodeURIComponent(actionUrl)}`
        })
        break

      case ACTION_TYPE['VIDEO']:
        break

      case ACTION_TYPE['MA_PAGE']:
        const actionPath = actionUrl.split('?')[0]
        console.log('actionPath', actionUrl)
        const routerType = TABBAR_PAGE.includes(actionPath) ? 'switchTab' : 'navigateTo'
        uni.$router[routerType]({ url: actionUrl })
        break

      case ACTION_TYPE['WEB_LINK']:
        uni.$router.navigateTo({
          url: `${INTERNAL_PAGE['WEB_VIEW']}?url=${encodeURIComponent(actionUrl)}`
        })
        break

      case ACTION_TYPE['CMS_PAGE']:
        const currentRoute = getCurrentPage()['route']
        const path =
          currentRoute === INTERNAL_PAGE['MAIN_CMS_PAGE']
            ? INTERNAL_PAGE['SUB_CMS_PAGE']
            : INTERNAL_PAGE['MAIN_CMS_PAGE']

        uni.$router.navigateTo({ url: `${path}?code=${actionUrl}` })
        break

      case ACTION_TYPE['CHECKOUT']:
        break

      case ACTION_TYPE['EXT_MA_PAGE']:
        wx.navigateToMiniProgram({
          appId: appId,
          path: actionUrl
        })
        break

      case ACTION_TYPE['REGISTRATION']:
        break

      case ACTION_TYPE['CUSTOMER_SERVICE']:
        break

      default:
        console.warn(`无效的跳转类型[actiontype => ${actionType}]`)
    }

    return {
      live: function(cb) {
        actionType === ACTION_TYPE['LIVE'] && cb && cb(this.content)
      },
      image: function(cb) {
        actionType === ACTION_TYPE['IMAGE'] && cb && cb(this.content)
      },
      video: function(cb) {
        actionType === ACTION_TYPE['VIDEO'] && cb && cb(this.content)
      },
      maPage: function(cb) {
        actionType === ACTION_TYPE['MA_PAGE'] && cb && cb(this.content)
      },
      webLink: function(cb) {
        actionType === ACTION_TYPE['WEB_LINK'] && cb && cb(this.content)
      },
      cmsPage: function(cb) {
        actionType === ACTION_TYPE['CMS_PAGE'] && cb && cb(this.content)
      },
      checkout: function(cb) {
        actionType === ACTION_TYPE['CHECKOUT'] && cb && cb(this.content)
      },
      extMaPage: function(cb) {
        actionType === ACTION_TYPE['EXT_MA_PAGE'] && cb && cb(this.content)
      },
      registration: function(cb) {
        actionType === ACTION_TYPE['REGISTRATION'] && cb && cb(this.content)
      },
      customerService: function(cb) {
        actionType === ACTION_TYPE['CUSTOMER_SERVICE'] && cb && cb(this.content)
      }
    }
  }
}

export default new Navigator()
