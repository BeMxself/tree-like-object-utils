/*
 * @Author: Song Mingxu
 * @Date: 2021-03-12 16:36:18
 * @LastEditors: Song Mingxu
 * @LastEditTime: 2021-03-19 21:30:03
 * @Description: Tree & Object Utils
 */
import { getRealType, findIndexByKey } from './utils'

/**
  ____       _            _          _____                 _   _                 
 |  _ \ _ __(_)_   ____ _| |_ ___   |  ___|   _ _ __   ___| |_(_) ___  _ __  ___ 
 | |_) | '__| \ \ / / _` | __/ _ \  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 |  __/| |  | |\ V / (_| | ||  __/  |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 |_|   |_|  |_| \_/ \__,_|\__\___|  |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                                                 
*/

function normalizeObjectPath(path) {
  if (path instanceof Array) return path
  return path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(p => p !== '')
}

function normalizeTreePath(path, pathSeparator, childrenName) {
  if (path instanceof Array) return path
  const fulllChildren = new RegExp(childrenName, 'gi')
  return path
    .replace(fulllChildren, '')
    .replace(/\[(\d+)\]/g, '.$1')
    .split(pathSeparator)
    .filter(p => p !== '')
}

/**
  ____        _     _ _         _____                 _   _                 
 |  _ \ _   _| |__ | (_) ___   |  ___|   _ _ __   ___| |_(_) ___  _ __  ___ 
 | |_) | | | | '_ \| | |/ __|  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 |  __/| |_| | |_) | | | (__   |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 |_|    \__,_|_.__/|_|_|\___|  |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                                            
*/

/**
 *
 * @typedef {object} TreePathOptions
 * @property {string} [pathSeparator='.']
 * @property {string} [childNameKey='name']
 * @property {string} [childrenName='children']
 */

/**
 * Find value of path from a Tree-like object
 * @param {object} treeRoot
 * @param {string|string[]} path
 * @param {TreePathOptions} [options]
 * @returns {*}
 *
 * @example
 *   path = ''                 return treeRoot
 *   path = 'child1'           return treeRoot.children[name === 'child1']
 *   path = 'children[1]'      return treeRoot.children[1]
 *   path = 'child1.child11'   return treeRoot.children[name === 'child1'].children[find name === 'child11']
 *   path = 'child1[0]'        return treeRoot.children[name === 'child1'].children[0]
 */
function getFromTree(treeRoot, path, options = {}) {
  const {
    pathSeparator = '.',
    childNameKey = 'name',
    childrenName = 'children',
  } = options || {}

  const pathNodes = normalizeTreePath(path, pathSeparator, childrenName)
  return pathNodes.reduce((branch, pathPart) => {
    if (!branch) return branch
    const children = branch[childrenName] || []
    const childIndex = isFinite(pathPart)
      ? pathPart
      : findIndexByKey(children, childNameKey, pathPart)
    return children[childIndex]
  }, treeRoot)
}

/**
 * Ensure tree nodes on the path, If nodes are not exist then create them. \
 * Finially return the last node
 *
 * @param {object} treeRoot
 * @param {string|string[]} path
 * @param {TreePathOptions} options
 * @returns Ensurer Function
 */
function ensureTreePath(treeRoot, path, options = {}) {
  const {
    pathSeparator = '.',
    childNameKey = 'name',
    childrenName = 'children',
  } = options || {}

  const pushEmptyChild = function (childrenArray, count) {
    for (let i = 0; i < count; i++) {
      childrenArray.push({ [childNameKey]: undefined, [childrenName]: [] })
    }
  }
  const pathNodes = normalizeTreePath(path, pathSeparator, childrenName)
  return pathNodes.reduce((branch, pathPart) => {
    if (pathPart === '') return branch
    const children = (branch[childrenName] = branch[childrenName] || [])
    const childIndex = isFinite(pathPart)
      ? pathPart
      : findIndexByKey(children, childNameKey, pathPart)

    if (childIndex === -1) {
      const child = { [childNameKey]: pathPart, [childrenName]: [] }
      children.push(child)
      return child
    }

    if (childIndex >= children.length) {
      pushEmptyChild(children, childIndex - children.length + 1)
    }
    return children[childIndex]
  }, treeRoot)
}

function getFromObject(obj, path) {
  const pathArray = normalizeObjectPath(path)
  return pathArray.reduce((node, pathPart) => {
    if (!node) return node
    return node[pathPart]
  }, obj)
}

function setToObject(obj, path, value) {
  const pathArray = normalizeObjectPath(path)
  pathArray.reduce((node, pathPart, index, arr) => {
    if (index + 1 === arr.length) {
      node[pathPart] = value
      return
    }
    if (node[pathPart]) return node[pathPart]
    return (node[pathPart] = isFinite(arr[index + 1]) ? [] : {})
  }, obj)
  return obj
}

/**
 * @typedef {object} WalkingNode
 * @property {string} key
 * @property {*} value
 * @property {string} type 'root' or 'branch' or 'leaf'
 */

/**
 * @callback TraverseCallback
 * @param {WalkingNode} node
 * @param {WalkingNode[]} pathArray
 */

/**
 * @callback WalkingNodeJudge
 * @param {WalkingNode} node
 * @param {WalkingNode[]} pathArray
 * @returns {boolean}
 */

/**
 * Traverse an Object
 * @param {*} object
 * @param {TraverseCallback} fn
 * @param {object} options Default Options: { skipLeaf: true }
 * @param {WalkingNodeJudge} [options.judgeIsLeaf]
 * @param {boolean} [options.skipLeaf=true]
 */
function walkObject(object, fn, options = {}) {
  const { judgeIsLeaf = null, skipLeaf = true } = options
  const nodesToLoop = [
    { node: { key: '', type: 'root', value: object }, pathArray: [] },
  ]

  for (var i = 0; i < nodesToLoop.length; i++) {
    const { node, pathArray } = nodesToLoop[i]
    const isLeaf =
      typeof node.value !== 'object' ||
      (judgeIsLeaf instanceof Function && judgeIsLeaf(node, node.pathArray))

    node.type = node.type || (isLeaf ? 'leaf' : 'branch')

    if (isLeaf && skipLeaf) continue

    fn(node, pathArray)

    if (isLeaf) continue

    Object.keys(node.value).forEach((key) => {
      nodesToLoop.push({
        node: { key, value: node.value[key], type: '' },
        pathArray: [...pathArray, node],
      })
    })
  }
}

/**
 * Traverse a tree-like Object
 * @param {*} treeRoot
 * @param {TraverseCallback} fn
 * @param {object} options Default Options: \
 *                 { childrenName: 'children', childNameKey: 'name', branchProps: ['props] }
 * @param {string} [options.childrenName='children']
 * @param {string} [options.childNameKey='name']
 * @param {string[]} [options.branchProps=['props']]
 */
function walkTree(treeRoot, fn, options = {}) {
  const {
    childrenName = 'children',
    childNameKey = 'name',
    branchProps = ['props'],
  } = options || {}
  const skipKeys = [childrenName, ...branchProps]
  const walkFn = function (node, pathArray) {
    if (skipKeys.includes(node.key)) return
    node.key = /^\d+$/.test(node.key)
      ? node.value[childNameKey] || node.key
      : node.key
    fn(
      node,
      pathArray.filter((p) => p.key !== '' && p.key !== childrenName)
    )
  }
  walkObject(treeRoot, walkFn, { skipLeaf: true })
}

/**
 * Path-Value Pair
 * @typedef {object} PathValuePair
 * @property {string} path
 * @property {*} value
 */

/**
 * Get an array of Path-Value Pairs from valueObject
 * @param {*} valueObject
 * @param {object} [options]
 * @param {string} [options.separator]
 * @param {WalkingNodeJudge} [options.judgeIsValue]
 * @returns {PathValuePair[]}
 */
function getPathValueMapArray(valueObject, options = {}) {
  const { separator = '.', judgeIsValue } = options || {}
  const traverseOptions = { judgeIsValue: judgeIsValue, skipLeaf: false }

  const walkFn = function (node, pathArray) {
    if (node.type !== 'leaf') return

    const path = [...pathArray, node]
      .map((n) => n.key)
      .filter((f) => f)
      .join(separator)

    pathValue.push({ path, value: node.value })
  }

  var pathValue = []

  walkObject(valueObject, walkFn, traverseOptions)
  return pathValue
}

/**
 * Tree-like Object Description
 * @typedef {object} TreeStructDescription
 * @property {string} [childNameKey='name']
 * @property {string} [childrenName='children']
 * @property {string[]} [branchProps=['props']]
 */

/**
 * Get a tree struct from an object
 * @param {*} obj
 * @param {TreeStructDescription} options
 * @returns {object} tree object
 */
function createTreeByObject(obj, options = {}) {
  const {
    childNameKey = 'name',
    childrenName = 'children',
    branchProps = ['props'],
  } = options || {}
  const tree = {}

  const fillTreeNode = function (treeNode, objNode) {
    treeNode.name = objNode.key
    branchProps.forEach((p) => (treeNode[p] = objNode.value[p]))
  }
  const judgeIsLeaf = function (node) {
    return branchProps.includes(node.key)
  }
  const walkFn = function (node, pathArray) {
    const treeNode = ensureTreePath(
      tree,
      [...pathArray, node].map((p) => p.key),
      { childNameKey, childrenName }
    )
    fillTreeNode(treeNode, node)
  }

  walkObject(obj, walkFn, { judgeIsLeaf, skipLeaf: true })
  return tree
}

/**
 * Get a object from tree struct
 * @param {*} treeRoot
 * @param {TreeStructDescription} options
 * @returns {object}
 */
function createObjectByTree(treeRoot, options = {}) {
  const {
    childNameKey = 'name',
    childrenName = 'children',
    branchProps = ['props'],
  } = options || {}
  const obj = {}
  const errorMessage = `Illegal Tree Object, all children node must contains '${childNameKey}' property`

  const walkFn = function (node, pathArray) {
    if (node.key && isFinite(node.key)) throw new Error(errorMessage)
    const path = [...pathArray, node].map((p) => p.key).filter(p => p !== '')
    const objNode = getFromObject(obj, path) || (setToObject(obj, path, {}) && getFromObject(obj, path))
    branchProps.forEach((p) => (objNode[p] = node.value[p]))
  }

  walkTree(treeRoot, walkFn, { childrenName, childNameKey })
  return obj
}

/**
 * Merge one or more tree-like objects to target
 * @param {object} target
 * @param {object} options Default Options: { branchProps: ['props'] }
 * @param {string[]} [options.branchProps=['props']]
 * @param  {object[]} sources
 */
function mergeTrees(target, options = {}, ...sources) {
  const { branchProps = ['props'] } = options || {}
  const mergeNode = function (targetNode, sourceNode) {
    branchProps.forEach((p) => {
      switch (getRealType(targetNode[p])) {
        case 'object':
          Object.assign(targetNode[p], sourceNode[p])
          break
        case 'array':
          targetNode[p] = [
            ...(sourceNode[p] instanceof Array ? sourceNode[p] : []),
          ]
        default:
          targetNode[p] = sourceNode[p]
      }
    })
  }
  sources.forEach((source) => {
    walkTree(source, (node, pathArray) => {
      const targetNode = ensureTreePath(
        target,
        [...pathArray, node].map((p) => p.key)
      )
      mergeNode(targetNode, node.value)
    })
  })
  return target
}

export {
  getFromTree,
  ensureTreePath,
  getPathValueMapArray,
  walkTree,
  walkObject,
  createTreeByObject,
  createObjectByTree,
  mergeTrees,
}