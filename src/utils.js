// @flow
import React from 'react';

export const ContentTypes = {
  json: 'application/json',
  xml: 'application/xml',
  form: 'application/x-www-form-urlencoded',
  multipart: 'multipart/form-data',
  text: 'text/plain; charset=utf-8',
  html: 'text/html',
  pdf: 'application/pdf',
  png: 'image/png',
};

export const defaultSchema = {
  string: {type: 'string'},
  boolean: {type: 'boolean'},
  number: {type: 'number'},
  integer: {type: 'integer'},
  array: {type: 'array', items: {type: 'string'}},
  object: {type: 'object', properties: {}, required: []},
};

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

export const highlightText = (text: string, query: string) => {
  if (!text || typeof text != 'string') {
    return [];
  }
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};

export const getLongestIndex = (items: Array, pattern: String) => {
  let longestIndex = 0;
  items
    .filter((x) => !!x)
    .forEach((key) => {
      const matches = Array.from(key.matchAll(pattern), (m) => m[1]);
      let idx = matches.length ? parseInt(matches[0]) : -1;
      idx = isNaN(idx) ? -1 : idx;
      if (idx >= 0) longestIndex = Math.max(idx, longestIndex);
    });
  return longestIndex;
};

export const generateExampleName = (examples: Object) => {
  const longestIndex = getLongestIndex(
    Object.keys(examples),
    /example-([\d]+)/g,
  );
  return `example-${longestIndex + 1}`;
};

export const generateHeaderName = (headers: Object) => {
  const longestIndex = getLongestIndex(Object.keys(headers), /header-([\d]+)/g);
  return `header-${longestIndex + 1}`;
};
