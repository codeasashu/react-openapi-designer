import React from 'react';
import * as utils from '../../utils';

test('highlight works on matched strings', () => {
  let highlighted = utils.highlightText('abc', 'ab');
  expect(highlighted).toHaveLength(2);
  expect(highlighted[0].type).toEqual('strong');
  expect(highlighted[0].props.children).toEqual('ab');
  expect(highlighted[1]).toStrictEqual('c');
});

test('unmatched strings are not highlighted', () => {
  let highlighted = utils.highlightText('abc', 'def');
  expect(highlighted).toHaveLength(1);
  expect(highlighted[0].type).toBeUndefined();
  expect(highlighted[0]).toBe('abc');
});

test('highlight doesnot work on undefined or nan strings', () => {
  let highlighted = utils.highlightText(undefined, 'def');
  expect(highlighted).toHaveLength(0);
});

test('longest example index works', () => {
  let longestIndex = utils.getLongestIndex(
    ['example-0', 'example-1', 'example-2', 'example-5'],
    /example-([\d]+)/g,
  );

  expect(longestIndex).toBe(5);

  let li2 = utils.getLongestIndex(
    ['example-0', 'test', 'pp', null, undefined],
    /example-([\d]+)/g,
  );

  expect(li2).toBe(0);

  let li3 = utils.getLongestIndex(
    ['lllap', 'test', 'pp', null, undefined],
    /example-([\d]+)/g,
  );

  expect(li3).toBe(0);
});

test('generate example name correctly generates new names with index', () => {
  let name1 = utils.generateExampleName({'example-0': {}, 'example-1': {}});
  expect(name1).toBe('example-2');

  let name2 = utils.generateExampleName({'test-3': {}, 'example-1': {}});
  expect(name2).toBe('example-2');

  let name3 = utils.generateExampleName({ppp1: {}, oop1: {}});
  expect(name3).toBe('example-1');
});

test('generate header name correctly generates new names with index', () => {
  let name1 = utils.generateHeaderName({'header-0': {}, 'header-1': {}});
  expect(name1).toBe('header-2');

  let name2 = utils.generateHeaderName({'test-3': {}, 'header-1': {}});
  expect(name2).toBe('header-2');

  let name3 = utils.generateHeaderName({ppp1: {}, oop1: {}});
  expect(name3).toBe('header-1');
});
