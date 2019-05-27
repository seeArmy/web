
export function aroundTrim(str) {
  var string = str.replace(/\s/g,'')
  return string.replace(/，/g,',')
}
