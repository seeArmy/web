/* jshint esversion:6 */

const ApiConst = require('../../api/ApiConst');
const axios = require('axios');

export function downloadExcel(api, params) {
  let ret = '',
    i = 0
  for (const key of Object.keys(params)) {
    if (encodeURIComponent(params[key]) !== 'undefined' && params[key] !== null && params[key] !== '' ) {
      ret += (i === 0) ? '' : '&';
      ret += `${key}=${encodeURIComponent(params[key])}`;
      i++;
    }
  }
  const downloadUrl = `${ApiConst.BaseDomain}/${url}?${ret}`
  console.log('download-api',downloadUrl)
  window.open(downloadUrl)
}

export function downloadCsv(url, params, callback) {
  let paramsStr = '?'
  Object.keys(params).forEach((key) => {
    paramsStr += `${key}=${params[key]}&`
  })
  const downloadUrl = `${ApiConst.BaseDomain}/${url}${paramsStr}`
  axios.get(downloadUrl).then((res) => {
    const { data } = res
    if (callback && res.status === 200) {
      // const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=gb2312;'}),
      let blob = new Blob([`\ufeff${data}`], { type: 'text/plain;charset=gb2312;' }),
        downloadElement = document.createElement('a'),
        href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = `${new Date().getTime()}.csv`;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);

      callback('success', null);
    } else {
      callback(null, `error code: ${response.code}`);
      return false;
    }
  }).catch((err) => {
    callback(null, err);
  });
}
