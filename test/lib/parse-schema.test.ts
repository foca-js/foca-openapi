import { describe, expect, test } from 'vitest';
import { parseSchema } from '../../src/lib/parse-schema';
import { getBasicDocument } from '../mocks/get-basic-document';

const docs = getBasicDocument();

describe('常规', () => {
  test('数字', () => {
    expect(parseSchema(docs, { type: 'number' })).toMatchInlineSnapshot(`"(number)"`);
    expect(parseSchema(docs, { type: 'integer' })).toMatchInlineSnapshot(`"(number)"`);
  });

  test('字符串', () => {
    const type = parseSchema(docs, { type: 'string' });
    expect(type).toMatchInlineSnapshot(`"(string)"`);
  });

  test('布尔', () => {
    const type = parseSchema(docs, { type: 'boolean' });
    expect(type).toMatchInlineSnapshot(`"(boolean)"`);
  });

  test('数组', () => {
    const type = parseSchema(docs, { type: 'array', items: { type: 'string' } });
    expect(type).toMatchInlineSnapshot(`"(((string))[])"`);
  });

  test('对象数组', () => {
    const type = parseSchema(docs, {
      type: 'array',
      items: {
        type: 'object',
        properties: { foo: { type: 'string' } },
        required: ['foo'],
      },
    });
    expect(type).toMatchInlineSnapshot(`"((({ "foo": (string) }))[])"`);
  });

  test('对象', () => {
    const type = parseSchema(docs, {
      type: 'object',
      properties: { foo: { type: 'string' } },
    });
    expect(type).toMatchInlineSnapshot(`"({ "foo"?: (string) })"`);
  });

  test('对象属性包含描述', () => {
    const type = parseSchema(docs, {
      type: 'object',
      properties: { foo: { type: 'string', description: 'foo=bar' } },
    });
    expect(type).toMatchInlineSnapshot(`
      "({ 
      /**
      * foo=bar
      */
      "foo"?: (string) })"
    `);
  });

  test('对象属性包含特殊字符', () => {
    const type = parseSchema(docs, {
      type: 'object',
      properties: { '123foo': { type: 'string' } },
    });
    expect(type).toMatchInlineSnapshot(`"({ "123foo"?: (string) })"`);
  });

  test('空对象', () => {
    const type = parseSchema(docs, { type: 'object' });
    expect(type).toMatchInlineSnapshot(`"({  })"`);
  });

  test('文件', () => {
    const type = parseSchema(docs, { type: 'string', format: 'binary' });
    expect(type).toMatchInlineSnapshot(`"(Blob)"`);
  });

  test('枚举', () => {
    expect(
      parseSchema(docs, { enum: ['foo', 'bar', 'baz', 1, 2] }),
    ).toMatchInlineSnapshot(`"("foo" | "bar" | "baz" | 1 | 2)"`);
  });

  test('bigint转为字符串', () => {
    const type = parseSchema(docs, { type: 'integer', format: 'int64' });
    expect(type).toMatchInlineSnapshot(`"(string)"`);
  });

  test('动态对象属性', () => {
    expect(
      parseSchema(docs, { type: 'object', additionalProperties: { type: 'string' } }),
    ).toMatchInlineSnapshot(`"({  } & { [key: string]: (string) })"`);

    expect(
      parseSchema(docs, {
        type: 'object',
        properties: { foo: { type: 'string' }, bar: { type: 'boolean' } },
        additionalProperties: { type: 'string' },
      }),
    ).toMatchInlineSnapshot(
      `"({ "foo"?: (string);"bar"?: (boolean) } & { [key: string]: (string) })"`,
    );

    expect(
      parseSchema(docs, {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: { foo: { type: 'string' }, bar: { type: 'number' } },
        },
        nullable: true,
      }),
    ).toMatchInlineSnapshot(
      `"({  } & { [key: string]: ({ "foo"?: (string);"bar"?: (number) }) } | null)"`,
    );

    expect(
      parseSchema(docs, { type: 'object', additionalProperties: true }),
    ).toMatchInlineSnapshot(`"({  } & { [key: string]: unknown; })"`);

    expect(
      parseSchema(docs, { type: 'object', additionalProperties: false }),
    ).toMatchInlineSnapshot(`"({  })"`);

    expect(
      parseSchema(docs, { type: 'object', additionalProperties: undefined }),
    ).toMatchInlineSnapshot(`"({  })"`);
  });
});

describe('oneOf', () => {
  test('没有type', () => {
    const type = parseSchema(docs, {
      oneOf: [{ type: 'string' }, { type: 'boolean' }, { type: 'integer' }],
    });
    expect(type).toMatchInlineSnapshot(`"(((((string) | (boolean) | (number)))))"`);
  });

  test('对象', () => {
    const type = parseSchema(docs, {
      type: 'object',
      oneOf: [
        {
          properties: { foo: { type: 'string' } },
        },
        {
          properties: { bar: { type: 'string' } },
          required: ['bar'],
        },
      ],
    });
    expect(type).toMatchInlineSnapshot(
      `"((((({ "foo"?: (string) }) | ({ "bar": (string) })))))"`,
    );
  });

  test('过滤相同的类型', () => {
    const type = parseSchema(docs, {
      oneOf: [{ type: 'string' }, { type: 'string' }],
    });
    expect(type).toMatchInlineSnapshot(`"(((((string)))))"`);
  });
});

describe('anyOf', () => {
  test('没有type', () => {
    const type = parseSchema(docs, {
      anyOf: [{ type: 'string' }, { type: 'boolean' }, { type: 'integer' }],
    });
    expect(type).toMatchInlineSnapshot(`"(((((string) | (boolean) | (number)))))"`);
  });

  test('对象', () => {
    const type = parseSchema(docs, {
      type: 'object',
      anyOf: [
        {
          properties: { foo: { type: 'string' } },
        },
        {
          properties: { bar: { type: 'string' } },
          required: ['bar'],
        },
      ],
    });
    expect(type).toMatchInlineSnapshot(
      `"((((({ "foo"?: (string) }) | ({ "bar": (string) })))))"`,
    );
  });

  test('过滤相同的类型', () => {
    const type = parseSchema(docs, {
      anyOf: [{ type: 'string' }, { type: 'string' }],
    });
    expect(type).toMatchInlineSnapshot(`"(((((string)))))"`);
  });
});

describe('allOf', () => {
  test('没有type', () => {
    const type = parseSchema(docs, {
      allOf: [{ type: 'string' }, { type: 'boolean' }, { type: 'integer' }],
    });
    expect(type).toMatchInlineSnapshot(`"((((string) & (boolean) & (number))))"`);
  });

  test('对象', () => {
    const type = parseSchema(docs, {
      type: 'object',
      allOf: [
        {
          properties: { foo: { type: 'string' } },
        },
        {
          properties: { bar: { type: 'string' } },
          required: ['bar'],
        },
      ],
    });
    expect(type).toMatchInlineSnapshot(
      `"(((({ "foo"?: (string) }) & ({ "bar": (string) }))))"`,
    );
  });

  test('过滤相同的类型', () => {
    const type = parseSchema(docs, {
      allOf: [{ type: 'string' }, { type: 'string' }],
    });
    expect(type).toMatchInlineSnapshot(`"((((string))))"`);
  });
});

describe('allOf + anyOf + oneOf', () => {
  test('同时生效', () => {
    const type = parseSchema(docs, {
      type: 'object',
      allOf: [
        { properties: { foo: { type: 'string' } }, required: ['foo'] },
        { properties: { bar: { type: 'string' } } },
      ],
      anyOf: [
        { properties: { foo1: { type: 'string' } }, required: ['foo'] },
        { properties: { bar1: { type: 'string' } } },
      ],
      oneOf: [
        { properties: { foo2: { type: 'string' } }, required: ['foo'] },
        { properties: { bar2: { type: 'string' } } },
      ],
    });
    expect(type).toMatchInlineSnapshot(
      `"((((({ "foo2"?: (string) }) | ({ "bar2"?: (string) })) | (({ "foo1"?: (string) }) | ({ "bar1"?: (string) }))) & (({ "foo": (string) }) & ({ "bar"?: (string) }))))"`,
    );
  });

  test('oneOf = anyOf', () => {
    const type = parseSchema(docs, {
      type: 'object',
      allOf: [{ properties: { foo2: { type: 'string' } }, required: ['foo'] }],
      anyOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
      oneOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
    });
    expect(type).toMatchInlineSnapshot(
      `"((((({ "foo": (string) }))) & (({ "foo2"?: (string) }))))"`,
    );
  });

  test('oneOf = allOf', () => {
    const type = parseSchema(docs, {
      type: 'object',
      allOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
      anyOf: [{ properties: { foo2: { type: 'string' } }, required: ['foo'] }],
      oneOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
    });
    expect(type).toMatchInlineSnapshot(`"((((({ "foo": (string) })))))"`);
  });

  test('anyOf = allOf', () => {
    const type = parseSchema(docs, {
      type: 'object',
      allOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
      anyOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
      oneOf: [{ properties: { foo2: { type: 'string' } }, required: ['foo'] }],
    });
    expect(type).toMatchInlineSnapshot(`"((((({ "foo": (string) })))))"`);
  });

  test('oneOf = anyOf = allOf', () => {
    const type = parseSchema(docs, {
      type: 'object',
      allOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
      anyOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
      oneOf: [{ properties: { foo: { type: 'string' } }, required: ['foo'] }],
    });
    expect(type).toMatchInlineSnapshot(`"((((({ "foo": (string) })))))"`);
  });
});

describe('nullable', () => {
  test('数字', () => {
    expect(parseSchema(docs, { type: 'number', nullable: true })).toMatchInlineSnapshot(
      `"(number | null)"`,
    );
  });

  test('字符串', () => {
    expect(parseSchema(docs, { type: 'string', nullable: true })).toMatchInlineSnapshot(
      `"(string | null)"`,
    );
  });

  test('布尔', () => {
    expect(parseSchema(docs, { type: 'boolean', nullable: true })).toMatchInlineSnapshot(
      `"(boolean | null)"`,
    );
  });

  test('数组', () => {
    expect(
      parseSchema(docs, { type: 'array', items: { type: 'string' }, nullable: true }),
    ).toMatchInlineSnapshot(`"(((string))[] | null)"`);
  });

  test('数组内', () => {
    expect(
      parseSchema(docs, { type: 'array', items: { type: 'string', nullable: true } }),
    ).toMatchInlineSnapshot(`"(((string | null))[])"`);
  });

  test('对象', () => {
    expect(parseSchema(docs, { type: 'object', nullable: true })).toMatchInlineSnapshot(
      `"({  } | null)"`,
    );
  });

  test('对象内', () => {
    expect(
      parseSchema(docs, {
        type: 'object',
        properties: { foo: { type: 'string', nullable: true } },
      }),
    ).toMatchInlineSnapshot(`"({ "foo"?: (string | null) })"`);
  });

  test('二进制', () => {
    expect(
      parseSchema(docs, { type: 'string', format: 'binary', nullable: true }),
    ).toMatchInlineSnapshot(`"(Blob | null)"`);
  });

  test('枚举', () => {
    expect(
      parseSchema(docs, { enum: ['foo', 'bar', 'baz'], nullable: true }),
    ).toMatchInlineSnapshot(`"("foo" | "bar" | "baz" | null)"`);
  });

  test('oneOf', () => {
    expect(
      parseSchema(docs, {
        oneOf: [{ type: 'number' }, { type: 'string' }],
        nullable: true,
      }),
    ).toMatchInlineSnapshot(`"(((((number) | (string)))) | null)"`);
  });

  test('anyOf', () => {
    expect(
      parseSchema(docs, {
        anyOf: [{ type: 'number' }, { type: 'string' }],
        nullable: true,
      }),
    ).toMatchInlineSnapshot(`"(((((number) | (string)))) | null)"`);
  });

  test('allOf', () => {
    expect(
      parseSchema(docs, {
        allOf: [{ type: 'number' }, { type: 'string' }],
        nullable: true,
      }),
    ).toMatchInlineSnapshot(`"((((number) & (string))) | null)"`);
  });

  test('xxxOf存在不一致的nullable时，需分开处理', () => {
    expect(
      parseSchema(docs, {
        allOf: [{ type: 'number' }, { type: 'string', nullable: true }],
      }),
    ).toMatchInlineSnapshot(`"((((number) & (string | null))))"`);
  });
});

test('未知类型', () => {
  const type = parseSchema(docs, {});
  expect(type).toMatchInlineSnapshot(`"unknown"`);
});
