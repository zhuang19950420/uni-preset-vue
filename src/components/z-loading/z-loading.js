function getContext() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

class Loading {
  constructor() {}
  getInstance() {
    const loaing = getContext().selectComponent('#z-loading')
    if (!loaing) {
      console.warn('未找到 z-loading 节点')
      return Promise.reject()
    }
    return Promise.resolve(loaing)
  }
  showError(cb) {
    this.getInstance().then(
      el => {
        el.$vm.showError()
      },
      () => {
        cb && cb.fail()
      }
    )
  }
  show() {
    this.getInstance().then(el => {
      el.$vm.show()
    })
  }
  hide() {
    this.getInstance().then(el => {
      el.$vm.hide()
    })
  }
}

export default new Loading()
