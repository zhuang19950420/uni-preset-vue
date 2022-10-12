/**
 * 网络接口
 */
import api from '../../api/service/index'

export const sendNotifitionEvent = params => {
  api.sendNotifitionEvent({
    data: params
  })
}
