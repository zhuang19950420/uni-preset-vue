/**
 * 异常状态
 *
 * 配置说明
 * code：状态码
 * hint：异常提示
 * desc： 异常描述
 * ignore：是否忽略（ture: 忽略异常，false：主动Toast提示异常）
 */

 export default {
  Employee_4: {
    code: 'Employee_4',
    hint: '员工手机号有误',
    desc: '员工手机号有误',
    ignore: true
  },
  Employee_1: {
    code: 'Employee_1',
    hint: '搜索失败,该手机号不存在',
    desc: '搜索失败,该手机号不存在',
    ignore: true
  },
  SocialBinding_1: {
    code: 'SocialBinding_1',
    hint: '',
    desc: '手机号已被其他微信绑定',
    ignore: true
  }
}
  