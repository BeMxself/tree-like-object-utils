// @ts-nocheck

import {
  getFromTree,
  ensureTreePath,
  getPathValueMapArray,
  walkTree,
  walkObject,
  createTreeByObject,
  createObjectByTree,
  mergeTrees,
} from '../src/tree-object-utils'

const TEST_DATA = {
  simpleTree: {
    name: 'node',
    children: [
      {
        name: 'child_0',
        children: [{ name: 'child_0_0' }, { name: 'child_0_1' }],
      },
      {
        name: 'child_1',
        children: [{ name: 'child_1_0' }, { name: 'child_1_1' }],
      },
    ],
  },
}

describe('getFromTree', () => {
  const testTree = TEST_DATA.simpleTree
  it('get ""', () => {
    expect(getFromTree(testTree, '')).toMatchObject(testTree)
  })
  it('get child_0.child_0_1', () => {
    expect(getFromTree(testTree, 'child_0.child_0_1')).toMatchObject(
      testTree.children[0].children[1]
    )
  })
  it('get children[1].children[1]', () => {
    expect(getFromTree(testTree, 'children[1].children[1]')).toMatchObject(
      testTree.children[1].children[1]
    )
  })
  it('get child_0.children[1]', () => {
    expect(getFromTree(testTree, 'child_0.children[1]')).toMatchObject(
      testTree.children[0].children[1]
    )
  })
  it('get child_0[1]', () => {
    expect(getFromTree(testTree, 'child_0[1]')).toMatchObject(
      testTree.children[0].children[1]
    )
  })
})

describe('ensureTreePath', () => {
  it('ensur {} ""', () => {
    const tree = {}
    ensureTreePath(tree, '')
    expect(tree).toMatchObject({})
  })
  it('ensur {} "childA"', () => {
    const tree = {}
    ensureTreePath(tree, 'childA')
    expect(tree).toMatchObject({children: [{name: 'childA'}]})
  })
  it('ensur {} "childA.childA1"', () => {
    const tree = {}
    ensureTreePath(tree, 'childA.childA1')
    expect(tree).toMatchObject({children: [{name: 'childA', children: [{name: 'childA1'}]}]})
  })
  it('ensur {} "children[0].childA1"', () => {
    const tree = {}
    ensureTreePath(tree, 'children[0].childA1')
    expect(tree).toMatchObject({children: [{name: undefined, children: [{name: 'childA1'}]}]})
  })

})

describe('getPathValueMapArray', () => {
  const TEST_TABLE = [
    [{ a: '1' }, [{ path: 'a', value: '1' }]],
    [
      { a: '1', b: '2' },
      [
        { path: 'a', value: '1' },
        { path: 'b', value: '2' },
      ],
    ],
    [{ a: { b: '1' } }, [{ path: 'a.b', value: '1' }]],
    [
      { a: { b: '1' }, c: '1' },
      [
        { path: 'c', value: '1' },
        { path: 'a.b', value: '1' },
      ],
    ],
    [{ 'children[0]': '1' }, [{ path: 'children[0]', value: '1' }]],
    [{ a: { 'children[0]': '1' } }, [{ path: 'a.children[0]', value: '1' }]],
    [
      { a: { 'children[0]': { b: '1' } } },
      [{ path: 'a.children[0].b', value: '1' }],
    ],
  ]
  it.each(TEST_TABLE)('test:%j', (arg, result) => {
    expect(getPathValueMapArray(arg)).toMatchObject(result)
  })
})

describe('walkTree', () => {
  var TEST_TABLE = [
    [
      { props: {} },
      (branch) => (branch.value.footprint = 1),
      { props: {}, footprint: 1 },
    ],
    [
      { children: [{}, {}] },
      (branch) => (branch.value.footprint = 1),
      { footprint: 1, children: [{ footprint: 1 }, { footprint: 1 }] },
    ],
    [
      { children: [{ children: [{}] }, {}] },
      (branch) => (branch.value.footprint = 1),
      {
        footprint: 1,
        children: [
          { footprint: 1, children: [{ footprint: 1 }] },
          { footprint: 1 },
        ],
      },
    ],
  ]
  it.each(TEST_TABLE)('test:%j', (root, fn, result) => {
    walkTree(root, fn)
    expect(root).toMatchObject(result)
  })
})

describe('walkObject', () => {
  var TEST_TABLE = [
    [{}, (branch) => (branch.value.footprint = 1), { footprint: 1 }],
    [
      { b: {}, c: 1, d: {} },
      (branch) => (branch.value.footprint = 1),
      { b: { footprint: 1 }, c: 1, footprint: 1, d: { footprint: 1 } },
    ],
    [
      { b: { b1: {} }, c: 1 },
      (branch) => (branch.value.footprint = 1),
      { b: { footprint: 1, b1: { footprint: 1 } }, c: 1, footprint: 1 },
    ],
  ]
  it.each(TEST_TABLE)('test:%j', (root, fn, result) => {
    walkObject(root, fn)
    expect(root).toMatchObject(result)
  })
  it('test path {}', () => {
    var path = null
    function updatePath(node, pathArray) {
      path = pathArray.map((p) => p.key).join('.')
    }
    walkObject({}, updatePath)
    expect(path).toBe('')
  })
  it('test path {a: {}}', () => {
    var path = null
    function updatePath(node, pathArray) {
      path = [...pathArray, node]
        .map((p) => p.key)
        .filter((f) => f)
        .join('.')
    }
    walkObject({ a: { b: {} } }, updatePath)
    expect(path).toBe('a.b')
  })
})

describe('createTreeByObject', () => {
  it('{props: 1} => {props: 1}', () => {
    expect(createTreeByObject({})).toMatchObject({})
  })

  it('{childA: {}} => {children: [{name: "childA"}]}', () => {
    expect(createTreeByObject({ childA: {} })).toMatchObject({
      children: [{ name: 'childA' }],
    })
  })

  it('{childA: {childA1: {}}} => {children: [{name: "childA", children: [{name: "childA1"}]}]}', () => {
    expect(createTreeByObject({ childA: { childA1: {} } })).toMatchObject({
      children: [{ name: 'childA', children: [{ name: 'childA1' }] }],
    })
  })
})

describe('createObjectByTree', () => {
  it('{props: 1} => {props: 1}', () => {
    expect(createObjectByTree({ props: 1 })).toMatchObject({ props: 1 })
  })

  it('{props: 1, children: [{}]} => except', () => {
    expect(() => createObjectByTree({ props: 1, children: [{}] })).toThrowError(
      /Illegal Tree Object, all children node must contains/
    )
  })

  it('{props: 1, children: [{name: "childA", props: 2}]} => {props: 1, childA: {props: 2}}', () => {
    expect(
      createObjectByTree({ props: 1, children: [{ name: 'childA', props: 2 }] })
    ).toMatchObject({ props: 1, childA: { props: 2 } })
  })
})

describe('mergeTrees', () => {
  it(`merge: {} <= {children: [{name: 'a', props: {prop1: 'b'}}]}`, () => {
    expect(
      mergeTrees({}, {}, { children: [{ name: 'a', props: { prop1: 'b' } }] })
    ).toMatchObject({ children: [{ name: 'a', props: { prop1: 'b' } }] })
  })
  it(`merge: {} <= {children: [{name: 'a', props: {prop1: 'b'}}]}, {children: [{name: 'a', props: {prop1: 'c'}}]}`, () => {
    expect(
      mergeTrees(
        {},
        {},
        { children: [{ name: 'a', props: { prop1: 'b' } }] },
        { children: [{ name: 'a', props: { prop1: 'c' } }] }
      )
    ).toMatchObject({ children: [{ name: 'a', props: { prop1: 'c' } }] })
  })
  it(`merge: {} <= {children: [{name: 'a', props: {prop1: 'b'}}]}, {props: {d: 2}}`, () => {
    expect(
      mergeTrees(
        {},
        {},
        { children: [{ name: 'a', props: { prop1: 'b' } }] },
        { props: { d: 2 } }
      )
    ).toMatchObject({
      props: { d: 2 },
      children: [{ name: 'a', props: { prop1: 'b' } }],
    })
  })
})
