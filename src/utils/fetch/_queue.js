/**
 * 网络请求请求队列
 * 非实用性队列封装, 针对该网路请求进行特殊封装
 */

class Queue {
  constructor() {
    this.queue = []
  }

  // 获取队列
  get() {
    return this.queue
  }

  // 存在于队列
  has(value) {
    if (!value) {
      console.warn('[has]请传入有效值: ', value)
      return false
    }

    return !!this.queue.find(item => JSON.stringify(item) == JSON.stringify(value))
  }

  // 取出数据
  pop() {
    return this.queue.pop()
  }

  // 添加数据
  push(item) {
    if (!item) {
      console.warn('[push]请传入有效值: ', item)
      return
    }

    this.queue.push(item)
  }

  // 清空数据
  clear() {
    this.queue = []
  }

  // 删除数据
  remove(value) {
    if (!value) {
      console.warn('[remove]请传入有效值: ', value)
      return
    }

    let index = null
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i]
      if (JSON.stringify(value) == JSON.stringify(item)) {
        index = i
        break
      }
    }
    if (index === null) {
      return
    }
    this.queue.splice(index, 1)
  }
}

export default Queue
