import um from '../manager/userManager'
const storeNumberList = [
  'TAOVIP',
  'SHAVIP',
  'TFUVIP',
  'HGHVIP',
  'SZXVIP',
  'CKGVIP',
  'CANVIP',
  'KWEVIP',
  'WUHVIP',
  'PKXVIP',
  'CGOVIP',
  'KMGVIP',
  'PEKVIP',
  'SYXVIP',
  'PVGVIP',
  'XIYVIP',
  'PEKT2VIP'
]
const getInclude = value => {
  let temp = []
  for (const item of value) {
    storeNumberList.includes(item) ? temp.push(item) : ''
  }
  return temp.length ? true : false
}

// 处理返回是否存在需要的门店
export const storeNumberFilter = user => {
  if ((user.role == 'SA' || user.role == 'SM') && user.stores && user.stores.length > 0) {
    const storeIdList = user.stores.map(item => item.storeNumber)
    console.log(getInclude(storeIdList), '是否包含某个门店')
    return getInclude(storeIdList)
  } else {
    return false
  }
}

export const IdentityLimit = user => {
  return user.role == 'SA' || user.role == 'SM' ? true : false
}

export const roolHanlder = (cb, err) => {
  um.getUserInfo().then(user => {
    if (IdentityLimit(user)) {
      cb && cb()
      return
    } else {
      err && err()
    }
  })
}
