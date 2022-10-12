/**
 * 数据处理
 */
export const handlerBrand = function (brand) {
  let newBrand = []
  let words = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  for (let word of words) {
    newBrand.push({
      name: word,
      key: word,
      list: []
    })
  }
  for (let item of brand) {
    let index = words.indexOf(item.brandInitials.toUpperCase())
    if (index > -1) {
      newBrand[index].list.push(item)
    } else {
      newBrand[newBrand.length - 1].list.push(item)
    }
  }
  return newBrand
}
