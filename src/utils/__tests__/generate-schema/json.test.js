/* eslint-disable */
import GenerateSchema from '../../generate-schema';
var simple = require('./fixtures/simple');
var advanced = require('./fixtures/advanced');

describe('JSON', function () {
  describe('Schema Checks', function () {
    var schema;

    beforeEach(function () {
      schema = GenerateSchema(simple);
    });

    it('.$schema should not exist', function () {
      expect(schema).not.toHaveProperty('$schema');
    });

    it('.type should exist', function () {
      expect(schema).toHaveProperty('type');
    });
  });

  describe('Item Checks', function () {
    var schema;

    beforeEach(function () {
      schema = GenerateSchema(advanced);
    });

    it('.items should be an object', function () {
      expect(schema.items).toBeObject();
    });

    it('.items.required should be an array', function () {
      expect(schema.items.required).toBeArray();
      expect(schema.items.required).toStrictEqual([
        'id',
        'name',
        'price',
        'dimensions',
        'warehouseLocation',
      ]);
    });

    it('.items.properties.tags should be an object', function () {
      expect(schema.items.properties.tags).toBeObject();
    });

    it('.items.properties.id should be of type [integer]', function () {
      expect(schema.items.properties.id.type).toBe('integer');
    });

    it('.items.properties.price should be of type [number]', function () {
      expect(schema.items.properties.price.type).toBe('number');
    });

    it('.items.properties.dimensions.properties.length should be of type [integer, number]', function () {
      expect(
        schema.items.properties.dimensions.properties.length.type,
      ).toStrictEqual(['integer', 'number']);
    });
  });

  describe('Property Checks', function () {
    var schema;

    beforeEach(function () {
      schema = GenerateSchema(simple);
    });

    it('.properties should exist', function () {
      expect(schema).toHaveProperty('properties');
    });

    it('.properties should be an object', function () {
      expect(schema.properties).toBeObject();
    });

    it('.properties.id should be of type [integer]', function () {
      expect(schema.properties.id.type).toBe('integer');
    });

    it('.properties.slug should be of type [string]', function () {
      expect(schema.properties.slug.type).toBe('string');
    });

    it('.properties.admin should be of type [boolean]', function () {
      expect(schema.properties.admin.type).toBe('boolean');
    });

    it('.properties.avatar should be of type [null]', function () {
      expect(schema.properties.avatar.type).toBe('null');
    });

    it('.properties.date should be of type [string]', function () {
      expect(schema.properties.date.type).toBe('string');
      expect(schema.properties.date.format).toBe('date-time');
    });

    it('.properties.article should be of type [object]', function () {
      expect(schema.properties.article.type).toBe('object');
    });

    it('.properties.article.properties should be of type [object]', function () {
      expect(schema.properties.article.properties).toBeObject();
    });

    it('.properties.article.properties.title should be of type [string]', function () {
      expect(schema.properties.article.properties.title.type).toBe('string');
    });

    it('.properties.article.properties.description should be of type [string]', function () {
      expect(schema.properties.article.properties.description.type).toBe(
        'string',
      );
    });

    it('.properties.article.properties.body should be of type [string]', function () {
      expect(schema.properties.article.properties.body.type).toBe('string');
    });

    it('.properties.comments should be of type [array]', function () {
      expect(schema.properties.comments.type).toBe('array');
    });

    it('.properties.comments.items should be of type [object]', function () {
      expect(schema.properties.comments.items).toBeObject();
    });

    it('.properties.comments.items.properties.body should be of type [string, null]', function () {
      expect(schema.properties.comments.items.properties.body.type[0]).toBe(
        'string',
      );
      expect(schema.properties.comments.items.properties.body.type[1]).toBe(
        'null',
      );
    });
  });
});
