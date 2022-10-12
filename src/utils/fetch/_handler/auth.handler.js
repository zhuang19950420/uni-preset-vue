/**
 * 认证header统一处理
 */

import config from '../_config'
import um from '../../../manager/userManager'

export const authHeader = header => {
  header = header || {}
  return Object.assign(
    {
      ...config.DEFAULT_HEADER,
      Authorization: um.getToken(),
			appCode: config.APP_CODE
    },
    header
  )
}
