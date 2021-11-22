import {fillSchema} from '../../schema';

describe('Schema builder tests', () => {
  it('gives string schema by default', () => {
    const schema = fillSchema({});
    expect(schema).toStrictEqual({
      type: 'string',
      title: '',
      examples: {},
    });
  });

  it('gives object if has properties', () => {
    const schema = fillSchema({
      type: 'object',
      properties: {},
    });
    expect(schema).toStrictEqual({
      type: 'object',
      properties: {},
      title: '',
      examples: {},
    });
  });

  it('gives object recursively if has properties', () => {
    const schema = fillSchema({
      type: 'object',
      properties: {
        a: {type: 'string'},
      },
    });
    expect(schema).toStrictEqual({
      type: 'object',
      properties: {
        a: {type: 'string'},
      },
      title: '',
      examples: {},
    });
  });
});
