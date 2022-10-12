import userInfo from './userInfo'
import customer from './customer'
import member from './member'
import tag from './tag'
import goods from './goods'
import order from './order'
import coupon from './coupon'
export default {
  ...userInfo,
  ...customer,
  ...member,
  ...tag,
  ...goods,
  ...order,
  ...coupon
}
