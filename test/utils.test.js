// @ts-nocheck

import { getRealType, findByKey, findIndexByKey } from '../src/utils'
const TEST_DATA = {
  arrayToFind: [{ name: 'a' }, { name: 'b' }],
  simpleTree: {
    name: 'node 1',
    children: [
      {
        name: 'node1_1',
        children: [{ name: 'node1_1_1' }, { name: 'node1_1_2' }],
      },
      {
        name: 'node1_2',
        children: [{ name: 'node1_2_1' }, { name: 'node1_2_2' }],
      },
    ],
  },
};

describe('getRealType', () => {
  const TEST_TABLE = [
    ['judge string', '', 'string'],
    ['judge number', 0, 'number'],
    ['judge object', {}, 'object'],
    ['judge array', [], 'array'],
    ['judge null', null, 'null'],
    ['judge undefined', undefined, 'undefined'],
  ];
  it.each(TEST_TABLE)('%s', (name, arg, result) => {
    expect(getRealType(arg)).toBe(result);
  });
});

describe('findByKey', () => {
  it('查找命中', () => {
    expect(findByKey(TEST_DATA.arrayToFind, 'name', 'b')).toMatchObject({
      name: 'b',
    });
  });
  it('查找未命中', () => {
    expect(findByKey(TEST_DATA.arrayToFind, 'name', 'c')).toBeUndefined();
  });
});

describe('findIndexByKey', () => {
  const TEST_TABLE = [
    ['查找命中', 'b', 1],
    ['查找未命中', 'c', -1],
  ];
  it.each(TEST_TABLE)('%s', (n, arg, result) => {
    expect(findIndexByKey(TEST_DATA.arrayToFind, 'name', arg)).toBe(result);
  });
});