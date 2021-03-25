'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

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
  var type = _typeof(value);

  if (value instanceof Array) return 'array';
  if (value === null) return 'null';
  return type;
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
  return array.findIndex(function (f) {
    return f[key] === findValue;
  });
}

/**
  ____       _            _          _____                 _   _                 
 |  _ \ _ __(_)_   ____ _| |_ ___   |  ___|   _ _ __   ___| |_(_) ___  _ __  ___ 
 | |_) | '__| \ \ / / _` | __/ _ \  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 |  __/| |  | |\ V / (_| | ||  __/  |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 |_|   |_|  |_| \_/ \__,_|\__\___|  |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                                                 
*/

function normalizeObjectPath(path) {
  if (path instanceof Array) return path;
  return path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(function (p) {
    return p !== '';
  });
}

function normalizeTreePath(path, pathSeparator, childrenName) {
  if (path instanceof Array) return path;
  var fulllChildren = new RegExp(childrenName, 'gi');
  return path.replace(fulllChildren, '').replace(/\[(\d+)\]/g, '.$1').split(pathSeparator).filter(function (p) {
    return p !== '';
  });
}
/**
  ____        _     _ _         _____                 _   _                 
 |  _ \ _   _| |__ | (_) ___   |  ___|   _ _ __   ___| |_(_) ___  _ __  ___ 
 | |_) | | | | '_ \| | |/ __|  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 |  __/| |_| | |_) | | | (__   |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 |_|    \__,_|_.__/|_|_|\___|  |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                                            
*/

/**
 * Similar to lodash.get, but no defaultValue
 * @param {*} obj 
 * @param {*} path 
 * @returns value or undefined
 */


function getFromObject(obj, path) {
  var pathArray = normalizeObjectPath(path);
  return pathArray.reduce(function (node, pathPart) {
    if (!node) return node;
    return node[pathPart];
  }, obj);
}
/**
 * Similar to lodash.set
 * @param {*} obj 
 * @param {*} path 
 * @param {*} value 
 * @returns obj
 */


function setToObject(obj, path, value) {
  var pathArray = normalizeObjectPath(path);
  pathArray.reduce(function (node, pathPart, index, arr) {
    if (index + 1 === arr.length) {
      node[pathPart] = value;
      return;
    }

    if (node[pathPart]) return node[pathPart];
    return node[pathPart] = isFinite(arr[index + 1]) ? [] : {};
  }, obj);
  return obj;
}
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


function getFromTree(treeRoot, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = options || {},
      _ref$pathSeparator = _ref.pathSeparator,
      pathSeparator = _ref$pathSeparator === void 0 ? '.' : _ref$pathSeparator,
      _ref$childNameKey = _ref.childNameKey,
      childNameKey = _ref$childNameKey === void 0 ? 'name' : _ref$childNameKey,
      _ref$childrenName = _ref.childrenName,
      childrenName = _ref$childrenName === void 0 ? 'children' : _ref$childrenName;

  var pathNodes = normalizeTreePath(path, pathSeparator, childrenName);
  return pathNodes.reduce(function (branch, pathPart) {
    if (!branch) return branch;
    var children = branch[childrenName] || [];
    var childIndex = isFinite(pathPart) ? pathPart : findIndexByKey(children, childNameKey, pathPart);
    return children[childIndex];
  }, treeRoot);
}
/**
 * Ensure tree nodes on the path, If nodes are not exist then create them. \
 * Finially return the last node
 *
 * @param {object} treeRoot
 * @param {string|string[]} path
 * @param {TreePathOptions} options
 * @returns node of path
 */


function ensureTreePath(treeRoot, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref2 = options || {},
      _ref2$pathSeparator = _ref2.pathSeparator,
      pathSeparator = _ref2$pathSeparator === void 0 ? '.' : _ref2$pathSeparator,
      _ref2$childNameKey = _ref2.childNameKey,
      childNameKey = _ref2$childNameKey === void 0 ? 'name' : _ref2$childNameKey,
      _ref2$childrenName = _ref2.childrenName,
      childrenName = _ref2$childrenName === void 0 ? 'children' : _ref2$childrenName;

  var pushEmptyChild = function pushEmptyChild(childrenArray, count) {
    for (var i = 0; i < count; i++) {
      var _childrenArray$push;

      childrenArray.push((_childrenArray$push = {}, _defineProperty(_childrenArray$push, childNameKey, undefined), _defineProperty(_childrenArray$push, childrenName, []), _childrenArray$push));
    }
  };

  var pathNodes = normalizeTreePath(path, pathSeparator, childrenName);
  return pathNodes.reduce(function (branch, pathPart) {
    if (pathPart === '') return branch;
    var children = branch[childrenName] = branch[childrenName] || [];
    var childIndex = isFinite(pathPart) ? pathPart : findIndexByKey(children, childNameKey, pathPart);

    if (childIndex === -1) {
      var _child;

      var child = (_child = {}, _defineProperty(_child, childNameKey, pathPart), _defineProperty(_child, childrenName, []), _child);
      children.push(child);
      return child;
    }

    if (childIndex >= children.length) {
      pushEmptyChild(children, childIndex - children.length + 1);
    }

    return children[childIndex];
  }, treeRoot);
}
/**
 * @typedef {object} WalkingNode
 * @property {string} key
 * @property {*} value
 * @property {string} [type] 'root' or 'branch' or 'leaf'
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


function walkObject(object, fn) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$judgeIsLeaf = options.judgeIsLeaf,
      judgeIsLeaf = _options$judgeIsLeaf === void 0 ? null : _options$judgeIsLeaf,
      _options$skipLeaf = options.skipLeaf,
      skipLeaf = _options$skipLeaf === void 0 ? true : _options$skipLeaf;
  var nodesToLoop = [{
    node: {
      key: '',
      type: 'root',
      value: object
    },
    pathArray: []
  }];

  var _loop = function _loop(i) {
    var _nodesToLoop$i = nodesToLoop[i],
        node = _nodesToLoop$i.node,
        pathArray = _nodesToLoop$i.pathArray;
    var isLeaf = _typeof(node.value) !== 'object' || judgeIsLeaf instanceof Function && judgeIsLeaf(node, node.pathArray);
    node.type = node.type || (isLeaf ? 'leaf' : 'branch');
    if (isLeaf && skipLeaf) return "continue";
    fn(node, pathArray);
    if (isLeaf) return "continue";
    Object.keys(node.value).forEach(function (key) {
      nodesToLoop.push({
        node: {
          key: key,
          value: node.value[key],
          type: ''
        },
        pathArray: [].concat(_toConsumableArray(pathArray), [node])
      });
    });
  };

  for (var i = 0; i < nodesToLoop.length; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }
}
/**
 * Traverse a tree-like Object
 * @param {*} treeRoot
 * @param {TraverseCallback} fn
 * @param {object} options Default Options: \
 *                 { childrenName: 'children', childNameKey: 'name' }
 * @param {string} [options.childrenName='children']
 * @param {string} [options.childNameKey='name']
 */


function walkTree(treeRoot, fn) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref3 = options || {},
      _ref3$childrenName = _ref3.childrenName,
      childrenName = _ref3$childrenName === void 0 ? 'children' : _ref3$childrenName,
      _ref3$childNameKey = _ref3.childNameKey,
      childNameKey = _ref3$childNameKey === void 0 ? 'name' : _ref3$childNameKey;

  var nodesToLoop = [{
    node: {
      key: '',
      type: 'root',
      value: treeRoot
    },
    pathArray: []
  }];

  var _loop2 = function _loop2(i) {
    var _nodesToLoop$i2 = nodesToLoop[i],
        node = _nodesToLoop$i2.node,
        pathArray = _nodesToLoop$i2.pathArray;
    fn(node, pathArray);
    if (node.type === 'leaf') return "continue";
    var children = node.value[childrenName] || [];
    children.forEach(function (child, index) {
      var nextNode = {
        key: _typeof(child) === 'object' ? child[childNameKey] || "".concat(index) : "".concat(index),
        value: child,
        type: _typeof(child) === 'object' && child[childrenName] instanceof Array && child[childrenName] && child[childrenName].length ? 'branch' : 'leaf'
      };
      nodesToLoop.push({
        node: nextNode,
        pathArray: [].concat(_toConsumableArray(pathArray), [node])
      });
    });
  };

  for (var i = 0; i < nodesToLoop.length; i++) {
    var _ret2 = _loop2(i);

    if (_ret2 === "continue") continue;
  }
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


function getPathValueMapArray(valueObject) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref4 = options || {},
      _ref4$separator = _ref4.separator,
      separator = _ref4$separator === void 0 ? '.' : _ref4$separator,
      judgeIsValue = _ref4.judgeIsValue;

  var traverseOptions = {
    judgeIsLeaf: judgeIsValue,
    skipLeaf: false
  };

  var walkFn = function walkFn(node, pathArray) {
    if (node.type !== 'leaf') return;
    var path = [].concat(_toConsumableArray(pathArray), [node]).map(function (n) {
      return n.key;
    }).filter(function (f) {
      return f;
    }).join(separator);
    pathValue.push({
      path: path,
      value: node.value
    });
  };

  var pathValue = [];
  walkObject(valueObject, walkFn, traverseOptions);
  return pathValue;
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


function createTreeByObject(obj) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref5 = options || {},
      _ref5$childNameKey = _ref5.childNameKey,
      childNameKey = _ref5$childNameKey === void 0 ? 'name' : _ref5$childNameKey,
      _ref5$childrenName = _ref5.childrenName,
      childrenName = _ref5$childrenName === void 0 ? 'children' : _ref5$childrenName,
      _ref5$branchProps = _ref5.branchProps,
      branchProps = _ref5$branchProps === void 0 ? ['props'] : _ref5$branchProps;

  var tree = {};

  var fillTreeNode = function fillTreeNode(treeNode, objNode) {
    treeNode.name = objNode.key;
    branchProps.forEach(function (p) {
      return treeNode[p] = objNode.value[p];
    });
  };

  var judgeIsLeaf = function judgeIsLeaf(node) {
    return branchProps.includes(node.key);
  };

  var walkFn = function walkFn(node, pathArray) {
    var treeNode = ensureTreePath(tree, [].concat(_toConsumableArray(pathArray), [node]).map(function (p) {
      return p.key;
    }), {
      childNameKey: childNameKey,
      childrenName: childrenName
    });
    fillTreeNode(treeNode, node);
  };

  walkObject(obj, walkFn, {
    judgeIsLeaf: judgeIsLeaf,
    skipLeaf: true
  });
  return tree;
}
/**
 * Get a object from tree struct
 * @param {*} treeRoot
 * @param {TreeStructDescription} options
 * @returns {object}
 */


function createObjectByTree(treeRoot) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref6 = options || {},
      _ref6$childNameKey = _ref6.childNameKey,
      childNameKey = _ref6$childNameKey === void 0 ? 'name' : _ref6$childNameKey,
      _ref6$childrenName = _ref6.childrenName,
      childrenName = _ref6$childrenName === void 0 ? 'children' : _ref6$childrenName,
      _ref6$branchProps = _ref6.branchProps,
      branchProps = _ref6$branchProps === void 0 ? ['props'] : _ref6$branchProps;

  var obj = {};
  var errorMessage = "Illegal Tree Object, all children node must contains '".concat(childNameKey, "' property");

  var walkFn = function walkFn(node, pathArray) {
    if (node.key && isFinite(node.key)) throw new Error(errorMessage);
    var path = [].concat(_toConsumableArray(pathArray), [node]).map(function (p) {
      return p.key;
    }).filter(function (p) {
      return p !== '';
    });
    var objNode = getFromObject(obj, path) || setToObject(obj, path, {}) && getFromObject(obj, path);
    branchProps.forEach(function (p) {
      return objNode[p] = node.value[p];
    });
  };

  walkTree(treeRoot, walkFn, {
    childrenName: childrenName,
    childNameKey: childNameKey
  });
  return obj;
}
/**
 * Merge one or more tree-like objects to target
 * @param {object} target
 * @param {object} options
 * @param {string} [options.childrenName='children']
 * @param {string} [options.childNameKey='name']
 * @param {(targetNode, sourceNode) => void} [options.mergeFn]
 * @param  {object[]} sources
 */


function mergeTrees(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref7 = options || {},
      _ref7$childrenName = _ref7.childrenName,
      childrenName = _ref7$childrenName === void 0 ? 'children' : _ref7$childrenName,
      _ref7$childNameKey = _ref7.childNameKey,
      childNameKey = _ref7$childNameKey === void 0 ? 'name' : _ref7$childNameKey,
      mergeFn = _ref7.mergeFn;

  var mergeNode = mergeFn || function (targetNode, sourceNode) {
    Object.keys(sourceNode).filter(function (key) {
      return ![childrenName, childNameKey].includes(key);
    }).forEach(function (p) {
      switch (getRealType(targetNode[p])) {
        case 'object':
          Object.assign(targetNode[p], sourceNode[p]);
          break;

        case 'array':
          targetNode[p] = _toConsumableArray(sourceNode[p] instanceof Array ? sourceNode[p] : []);

        default:
          targetNode[p] = sourceNode[p];
      }
    });
  };

  for (var _len = arguments.length, sources = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    sources[_key - 2] = arguments[_key];
  }

  sources.forEach(function (source) {
    walkTree(source, function (node, pathArray) {
      var targetNode = ensureTreePath(target, [].concat(_toConsumableArray(pathArray), [node]).map(function (p) {
        return p.key;
      }), {
        childNameKey: childNameKey,
        childrenName: childrenName
      });
      mergeNode(targetNode, node.value);
    }, {
      childNameKey: childNameKey,
      childrenName: childrenName
    });
  });
  return target;
}

exports.createObjectByTree = createObjectByTree;
exports.createTreeByObject = createTreeByObject;
exports.ensureTreePath = ensureTreePath;
exports.getFromObject = getFromObject;
exports.getFromTree = getFromTree;
exports.getPathValueMapArray = getPathValueMapArray;
exports.mergeTrees = mergeTrees;
exports.setToObject = setToObject;
exports.walkObject = walkObject;
exports.walkTree = walkTree;
