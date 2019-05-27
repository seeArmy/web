/* jshint esversion:6 */

export function toThousandslsFilter(num, digits = 2) {
  if(!num) {
    return parseFloat(0).toFixed(digits)
  }
  return (parseFloat(num).toFixed(digits) || 0.00).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}


export function trimSpaceing(str) {
  return str.replace(/\s/g,'')
}

export function parseTimeToYMD(time) {
  if (arguments.length === 0) {
    return null
  }

  const format = '{y}-{m}-{d} {h}:{i}'
  let date = new Date(parseInt(time))
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })

  return time_str
}
