import OrderedDict from '../ordered-dict';

test('Orderdict insert at index replaces key', () => {
  const unorderedDict = {
    a: 'abc',
    b: 'bcd',
  };
  var orderDict = new OrderedDict(unorderedDict);
  const keyIndex = orderDict.findIndex('a');
  orderDict.insert(keyIndex, 'd', 'def');
  orderDict.remove('a');
  const keyOrder = Object.keys(orderDict.toDict());
  expect(keyOrder).toStrictEqual(['d', 'b']);
});

test('FindIndex works', () => {
  const unorderedDict = {
    a: 'abc',
    b: 'bcd',
  };
  var orderDict = new OrderedDict(unorderedDict);
  const aIndex = orderDict.findIndex('a');
  expect(aIndex).toBe(0);

  const unorderedDict2 = {
    a: 'abc',
    b: 'bcd',
    c: 'lmn',
  };
  var orderDict2 = new OrderedDict(unorderedDict2);
  expect(orderDict2.findIndex('c')).toBe(2);
  expect(orderDict2.findIndex('b')).toBe(1);
  expect(orderDict2.findIndex('not_found')).toBe(-1);
  expect(orderDict2.findIndex('not      found')).toBe(-1);
});

test('insert at index works', () => {
  const unorderedDict = {
    a: 'abc',
    b: 'bcd',
  };
  var orderDict = new OrderedDict(unorderedDict);
  orderDict.insert(1, 'd', 'def');
  expect(orderDict.toDict()).toStrictEqual({a: 'abc', d: 'def', b: 'bcd'});
  expect(Object.keys(orderDict.toDict())).toStrictEqual(['a', 'd', 'b']);
});

test('remove works', () => {
  const unorderedDict = {
    a: 'abc',
    b: 'bcd',
  };
  var orderDict = new OrderedDict(unorderedDict);
  orderDict.remove('a');
  expect(orderDict.toDict()).toStrictEqual({b: 'bcd'});
  expect(Object.keys(orderDict.toDict())).toStrictEqual(['b']);

  var orderDict2 = new OrderedDict({});
  orderDict2.remove('a');
  expect(orderDict2.toDict()).toStrictEqual({});
  expect(Object.keys(orderDict2.toDict())).toStrictEqual([]);
});
