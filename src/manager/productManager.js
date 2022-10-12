import { formatNum } from '../utils/util.js'
import um from './userManager'

class ProductManager {
  constructor(product = {}) {
    this.product = product
  }

  async rebuild() {
    const product = this.product
    const userInfo = await um.getUserInfo()
    if (!product.customerLevel) {
      product.customerLevel = []
    }
    // 活动有效期判断
    let startTime = ''
    let endTime = ''
    if (product.startTime) {
      startTime = new Date(product.startTime.replace(/\-/g, '/')).getTime()
    }
    if (product.endTime) {
      endTime = new Date(product.endTime.replace(/\-/g, '/')).getTime()
    }
    const currentTime = new Date().getTime()
    console.log(`startTime-endTime-currentTime:${startTime}-${endTime}-${currentTime}`)
    // 是否是至尊vip专属
    if (
      product.customerLevel &&
      product.customerLevel.length === 1 &&
      product.customerLevel[0] === 'L'
    ) {
      product['_vip'] = true
    }
    product['_point'] = formatNum(Number(product.point))
    if (product.exceedLimit) {
      product['_btnWord'] = '超过领取限额'
      product['_btnEnable'] = false
    } else if (!product.stockEnough) {
      product['_btnWord'] = '已兑完'
      product['_btnEnable'] = false
    } else if (product.customerLevel.length && product.customerLevel.indexOf(userInfo.level) < 0) {
      product['_btnWord'] = '等级不符'
      product['_btnEnable'] = false
    } else if (startTime && currentTime < startTime) {
      product['_btnWord'] = '即将上线'
      product['_btnEnable'] = false
    } else if (endTime && currentTime > endTime) {
      product['_btnWord'] = '已结束'
      product['_btnEnable'] = false
    } else if (userInfo.point < product.point) {
      product['_btnWord'] = '积分不足'
      product['_btnEnable'] = false
    } else {
      product['_btnWord'] = '兑换'
      product['_btnDetailWord'] = `使用${product._point}积分兑换`
      product['_btnEnable'] = true
    }
    return product
  }
  // 产品规格重组
  specRebuild() {
    const product = this.product

    product['_spec'] = {}
    Object.keys(product.spec).forEach((specKey, specIndex) => {
      product['_spec'][specKey] = product.spec[specKey].map(specItem => {
        // 若specMapSku直接匹配到则为单规格商品
        if (product.specMapSku[specItem]) {
          return {
            specKey: `${specKey}`,
            name: `specValue${specIndex + 1}`,
            value: specItem,
            status: this.getStock(specItem) ? 'normal' : 'disable'
          }
        } else {
          // 对spec重构
          return {
            specKey: `${specKey}`,
            name: `specValue${specIndex + 1}`,
            value: specItem,
            status: 'normal'
          }
        }
      })
    })
  }
  // 获得对应的产品库存
  getStock(key) {
    console.log(key)
    // 记录用户选择的sku
    this.selectedSkuKey = key
    return this.product.specMapSku[key].balanceStock ? this.product.specMapSku[key].balanceStock : 0
  }
  // 获得对应的sku缩略图
  getSkuImg(key) {
    console.log(key)
    return this.product.specMapSku[key].imageUrl || this.product.imageUrl
  }
}

export default ProductManager
