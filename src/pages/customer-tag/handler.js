// 处理数据
export const handlerTags = value => {
  let newtagList = []
  value.forEach(item => {
    let newstag = []
    item.tags.forEach(tagItem => {
      if (tagItem.selected == 1 || tagItem.clickNum == 1) {
        const { selected, spTagId, tagName } = tagItem
        newstag.push({ selected, spTagId, tagName })
      }
    })
    if (!!newstag.length) {
      newtagList.push({
        name: item.name,
        tags: newstag
      })
    }
  })
  return newtagList
}
