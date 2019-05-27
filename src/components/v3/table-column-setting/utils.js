/*jshint esversion:6 */
const localStorge = window.localStorage,
  currentUser = JSON.parse(localStorage.getItem('userInfo')),
  currentKey = window.location.pathname

export function getCustomColumn() {
  if(!currentUser.loginAccount) {
    return false
  }
  return JSON.parse(localStorge.getItem(`${currentUser.loginAccount}__${currentKey}`)) || []
}

export function updateCustomColumn(data) {
  const ret = JSON.stringify(data)
  if(!currentUser.loginAccount) {
    return false
  }
  localStorage.setItem(`${currentUser.loginAccount}__${currentKey}`, ret)
}

export function clearCustonColumn() {
  if(!currentUser.loginAccount) {
    return false
  }
  localStorage.removeItem(`${currentUser.loginAccount}__${currentKey}`)
}
