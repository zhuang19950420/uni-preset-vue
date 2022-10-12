/**
 * 公共工具方法
 **/
export const naviBarHeight = () => {
  const ipxBarHeight = 88
  const nomalBarHeight = 64
  // 状态栏高度
  const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
  // 获取胶囊位置
  const { height, top } = uni.getMenuButtonBoundingClientRect()
  // 胶囊距状态栏间隙
  const space = top - statusBarHeight
  // 状态栏高度
  // 系统api可用
  if (statusBarHeight && top) {
    console.log(`状态栏高度(系统api可用): ${height + top + space}`)
    return height + top + space
  }
  if (isIpx()) {
    console.log(`状态栏高度(系统api不可用): ${ipxBarHeight}`)
    return ipxBarHeight
  }
  console.log(`状态栏高度(系统api不可用): ${nomalBarHeight}`)
  return nomalBarHeight
}

// 防止跳转
let _timer
export const debounce = (fun, delay = 300, immediate = true) => {
  let args, context, timestamp, result
  let later = function () {
    let last = new Date().getTime() - timestamp
    if (last < delay && last >= 0) {
      _timer = setTimeout(later, delay - last)
    } else {
      _timer = null
      if (!immediate) {
        result = fun.apply(context, args)
        if (!_timer) context = args = null
      }
    }
  }
  return function () {
    context = this
    args = arguments
    timestamp = new Date().getTime()
    let callNow = immediate && !_timer
    if (!_timer) _timer = setTimeout(later, delay)
    if (callNow) {
      result = fun.apply(context, args)
      context = args = null
    }
    return result
  }
}

// 函数节流
export const throttle = (fn, delay) => {
  var enterTime = 0
  var gapTime = delay || 200 //间隔时间
  return function () {
    var context = this
    var backTime = new Date()
    if (backTime - enterTime > gapTime) {
      fn.apply(context, arguments)
      enterTime = backTime
    }
  }
}

// 判断是否是Ipx系列
export const isIpx = () => {
  const screenHeight = wx.getSystemInfoSync().screenHeight
  const bottom = wx.getSystemInfoSync().safeArea.bottom
  return screenHeight !== bottom
}

// 判断是否是手机号
export const isPhone = value => {
  return /^1[0-9]{10,10}$/.test(value)
}

// 判断是否是邮箱
export const isEmail = value => {
  return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
    value
  )
}

// 手机号加密
export const encryptMobile = tel => {
  return tel.substring(0, 3) + '****' + tel.substr(tel.length - 4)
}

// 转化千位符格式化
export const toThousands = number => {
  return (number || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

// 有效的时间格式
export const availableTimeFormat = value => {
  return value.replace(/\-/g, '/')
}

// 当前页面对象
export const getCurrentPage = () => {
  let pageStack = getCurrentPages()
  let curRoute = pageStack[pageStack.length - 1]
  return curRoute
}

// 上一个页面对象
export const getPrePage = () => {
  let pageStack = getCurrentPages()
  let preRoute = pageStack[pageStack.length - 2]
  return preRoute || {}
}

// 加法运算
export const add = (num1, num2) => {
  let exp_1, exp_2, nums
  try {
    exp_1 = num1.toString().split('.')[1].length
  } catch {
    exp_1 = 0
  }
  try {
    exp_2 = num2.toString().split('.')[1].length
  } catch {
    exp_2 = 0
  }
  nums = Math.max(exp_1, exp_2)
  return (num1 * Math.pow(10, nums) + num2 * Math.pow(10, nums)) / Math.pow(10, nums)
}

// 乘法运算
export const mul = (num1, num2) => {
  let exp_1, exp_2, nums
  try {
    exp_1 = num1.toString().split('.')[1].length
  } catch {
    exp_1 = 0
  }
  try {
    exp_2 = num2.toString().split('.')[1].length
  } catch {
    exp_2 = 0
  }
  return (num1 * Math.pow(10, exp_1) * (num2 * Math.pow(10, exp_2))) / Math.pow(10, exp_1 + exp_2)
}

// 获取当前时间
export const getCurrentTime = (options = {}) => {
  let d = null
  // 将当前时间戳转换成时间
  if (options.timeStamp) {
    d = new Date(options.timeStamp)
  } else {
    d = new Date()
  }

  let year = d.getFullYear()
  let month = change(d.getMonth() + 1)
  let day = change(d.getDate())
  let hour = change(d.getHours())
  let minute = change(d.getMinutes())
  let second = change(d.getSeconds())

  function change(t) {
    if (t < 10) {
      return '0' + t
    } else {
      return t
    }
  }
  switch (options.type) {
    case 'YYYY年MM月DD日':
      return `${year}年${month}月${day}日`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'YYYY.MM.DD': {
      return `${year}.${month}.${day}`
    }
    case 'YYYY.MM.DD HH:MM': {
      if (hour == '00' && minute == '00') {
        return `${year}.${month}.${day}`
      } else {
        return `${year}.${month}.${day} ${hour}:${minute}`
      }
    }
    case 'YYYY.MM.DD HH:MM:SS': {
      return `${year}.${month}.${day} ${hour}:${minute}:${second}`
    }
    case 'YYYY-MM':
      return `${year}-${month}`
    default:
      break
  }
}

// 将数字转成千位符号
export const formatNum = value => {
  value = value.toString()
  let newStr = ''
  let count = 0
  if (value.indexOf('.') == -1) {
    for (let i = value.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = value.charAt(i) + ',' + newStr
      } else {
        newStr = value.charAt(i) + newStr
      }
      count++
    }
    value = newStr
    return value
  } else {
    for (let i = value.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = value.charAt(i) + ',' + newStr
      } else {
        newStr = value.charAt(i) + newStr
      }
      count++
    }
    value = newStr + value.substr(value.indexOf('.'), value.length)
    return value
  }
}

// 将小数转成百分比
export const percentage = value => {
  var percent = Number(value * 100).toFixed(2)
  percent += '%'
  return percent
}

// 根据标志符号将@@包含内容截取出来
export const splitString = (str = '') => {
  const newArr = str.split('@')
  if (newArr.length > 1) {
    var array = []
    newArr.forEach(item => {
      if (item.indexOf('http') > -1 || item.indexOf('www') > -1) {
        array.push({
          type: 'copy',
          value: item
        })
        array.push({
          type: 'string',
          value: ' (点此复制)'
        })
      } else if (item.indexOf('#private') > -1) {
        array.push({
          type: 'private',
          value: '隐私政策'
        })
      } else if (item.indexOf('#protocol') > -1) {
        array.push({
          type: 'protocol',
          value: '《用户协议》'
        })
      } else {
        array.push({
          type: 'string',
          value: item
        })
      }
    })
    return array
  }
  return [
    {
      type: 'string',
      value: str
    }
  ]
}
