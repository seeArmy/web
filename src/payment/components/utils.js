/* jshint esversion:6 */
const KEY = 'paycart',
  localStorge = window.localStorage

export function paycart(lst) {
  localStorage.removeItem(KEY)
  localStorage.setItem(KEY, JSON.stringify(lst))
}

export function getPaycart() {
  return JSON.parse(localStorage.getItem(KEY))
}

