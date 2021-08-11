# tree-like-object-utils 中文文档

本函数库的目的是操作树形结构的 js 对象。

## 概念

### 树形结构

一个树形结构：

```json
{
  "name": "root",
  "children": [
    {
      "name": "childA"
    },
    {
      "name": "childB",
      "children": [
        {
          "name": "childB_0"
        }
      ]
    }
  ]
}
```

### 树形结构的路径

为了更简短的表达路径，本函数库采用类 lodash 表示对象路径的格式来描述子节点位置。

例子：

- 上面树形结构的根节点表示为： `''` _空字符串_
- 上面树形结构的第一个子节点表示为：`'childA'`
- 上面树形结构的第二个子节点的唯一一个子节点表示为：`'childB.childB_0'`

索引表示法：

- 上面树形结构的第一个子节点表示为：`'[0]'`
- 上面树形结构的第二个子节点的唯一一个子节点表示为：`'[1][0]'`

两种表示法可以混合使用：

- 上面树形结构的第二个子节点的唯一一个子节点表示为：`'[1].childB_0'`

## 安装

npm

```bash
npm install -S tree-like-object-utils
```

yarn

```bash
yarn add tree-like-object-utils
```

## 使用

```js
import {
  getFromTree,
  ensureTreePath,
  getPathValueMapArray,
  walkTree,
  walkObject,
  createTreeByObject,
  createObjectByTree,
  mergeTrees,
  getFromObject,
  setToObject,
} from 'tree-like-object-utils'
```

### getFromTree 根据路径取树的节点或节点上的值

```js
getFromTree(treeRoot, path, options?)
```

options:

```js
/**
 * @typedef {object} TreePathOptions
 * @property {string} [pathSeparator='.']       分割节点名的分隔符，默认为 '.'
 * @property {string} [childNameKey='name']     用作表示节点名字的属性，默认为 'name'
 * @property {string} [childrenName='children'] 存放子节点数组的属性名，默认为 'children'
 */
```

### ensureTreePath 根据路径取树的节点，若不存在则创建节点

```js
ensureTreePath(treeRoot, path, options?)
```

options: _同上_

### getPathValueMapArray 把一个 js object 值对象转化成 { path, value } 数组

```js
getPathValueMapArray(valueObject, options?)
```

主要用途是用于为框架的客户程序员提供一种能力：用一个普通的 js 对象来承载对树的注入修改，表达方式更加简洁

options:

```js
/**
 * @typedef OptionsDefine
 * @property {string} [options.separator]              生成的路径的分隔符，默认为 '.'
 * @property {WalkingNodeJudge} [options.judgeIsValue] 判断节点是否为值的回调函数，如果判断是一个值的话就不再深入遍历，定义见下
 *
 * @callback WalkingNodeJudge         判断节点回调函数，返回布尔值
 * @param {WalkingNode} node          当前节点
 * @param {WalkingNode[]} pathArray   从根到当前的路径上的各级父节点
 * @returns {boolean}
 *
 * @typedef {object} WalkingNode      节点定义
 * @property {string} key             该节点在父节点上的属性名或数组下标
 * @property {*} value                节点对象/值
 * @property {string} [type]          'root' or 'branch' or 'leaf'
 */
```

### walkTree 遍历树形对象

```js
/**
 * @callback TraverseCallback       遍历树的回调函数
 * @param {WalkingNode} node        当前节点
 * @param {WalkingNode[]} pathArray 从根到当前的路径上的各级父节点
 */

/**
 * Traverse a tree-like Object
 * @param {*} treeRoot              树形对象
 * @param {TraverseCallback} fn     遍历函数
 * @param {object} options          指定存放节点名称的属性名和存放子节点数组的属性名
 * @param {string} [options.childrenName='children']
 * @param {string} [options.childNameKey='name']
 */

walkTree(treeRoot, fn, options?)
```

遍历一棵树，使用方法详见 JSDoc 注释

### findTree 在树形对象中查找节点
```js
/**
 * Find node in a tree-like Object
 * @param {*} treeRoot
 * @param {string|TraverseCallback} finder name or TraverseCallback
 * @param {object} options Default Options: \
 *                 { childrenName: 'children', childNameKey: 'name' }
 * @param {string} [options.childrenName='children']
 * @param {string} [options.childNameKey='name']
 * @returns {{key, value, type}|null}
 */
```

查找树中的节点，使用方法详见 JSDoc 注释

### walkObject 遍历普通 js 对象

```js
/**
 * Traverse an Object
 * @param {*} object
 * @param {TraverseCallback} fn
 * @param {object} options Default Options: { skipLeaf: true }
 * @param {WalkingNodeJudge} [options.judgeIsLeaf]
 * @param {boolean} [options.skipLeaf=true]
 */
walkObject(object, fn, options)
```

用法与 walkTree 差不多，只是增加了一个判断当前节点是否是叶节点的回调函数`judgeIsLeaf`，和是否跳过叶节点的选项`skipLeaf`。
默认只要对象的属性值类型是 object 或者 array 就继续遍历，当需要在某种条件下不继续遍历，通过指定`judgeIsLeaf`来判断，并保持`skipLeaf`为`true`

### createTreeByObject 通过一个普通对象创建树形对象

```js
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
function createTreeByObject(obj, options = {})
```

觉得可能有用就写了，但是貌似没用上 😂
如果要用的话就是一个 option 需要注意，branchProps 是用于指定哪些属性要作为当前节点的属性而不要把它转变成子节点（对象和数组直接引用赋值，没有拷贝）。

### createObjectByTree 通过一个树形对象创建普通对象

上面函数的逆向参数雷同

### mergeTrees 合并多个树形对象

```js
/**
 * Merge one or more tree-like objects to target
 * @param {object} target
 * @param {object} options
 * @param {string} [options.childrenName='children']            略
 * @param {string} [options.childNameKey='name']                略
 * @param {(targetNode, sourceNode) => void} [options.mergeFn]  自定义合并方式的回调函数
 * @param  {object[]} sources
 * @returns {object}
 */
mergeTrees(target, options?, ...sources)
```

需要注意：

1. 默认合并方式是数组直接覆盖，对象用 Object.assign 的方式复写，都是浅拷贝，需要指定`options.mergeFn`回调函数。
2. `mergeFn`的参数是节点，并不是`WalkingNode`类型的包裹了节点类型等信息的对象。

### getFromObject 类似于 lodash.get（无 defaultValue 参数）

### setToObject 类似于 lodash.set

这两个函数是为了缩减打包大小重新实现的 lodash 的两个方法，用法与 lodash 的两个方法一样。
