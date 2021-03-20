/*
 * @Author: Song Mingxu
 * @Date: 2021-03-19 11:34:08
 * @LastEditors: Song Mingxu
 * @LastEditTime: 2021-03-19 12:22:00
 * @Description: Utils
 */

/**
 * Get a value
 * @param {*} value
 * @returns {string} 'object' | 'array' | 'string' | 'null' | 'undefined' | 'number'
 */
function getRealType(value) {
  const type = typeof value
  if (value instanceof Array) return 'array'
  if (value === null) return 'null'
  return type
}

/**
 * Return the first object in the array where object[key]===findeValue, and undefined otherwise
 * 
 * @param {Array} array
 * @param {string} key
 * @param {*} findValue
 * @returns {any} object in array
 */
function findByKey(array, key, findValue) {
  return array.find((f) => f[key] === findValue)
}

/**
 * Return the first object in the array where object[key]===findeValue, and -1 otherwise
 * 
 * @param {Array} array
 * @param {string} key
 * @param {*} findValue
 * @returns {number} index of object
 */
function findIndexByKey(array, key, findValue) {
  return array.findIndex((f) => f[key] === findValue)
}

export {
  getRealType,
  findByKey,
  findIndexByKey
}