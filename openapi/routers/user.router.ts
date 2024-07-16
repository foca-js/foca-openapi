import { rule } from '@aomex/core';
import { Router } from '@aomex/router';
import { body, params, query, response } from '@aomex/web';

export const router = new Router();

const userItem = {
  id: rule.int(),
  name: rule.string().docs({ description: '用户名' }),
  age: rule.int().nullable(),
  address: rule.string().nullable().optional(),
  password: rule.string().docs({ deprecated: true, description: '即将删除' }),
};

router.get('/users', {
  mount: [
    query({
      page: rule.int().min(1).max(10).default(1),
      limit: rule.int().max(100).default(10).docs({ description: '每页返回的资源数量' }),
    }),
    response({
      statusCode: 200,
      content: {
        page: rule.int(),
        limit: rule.int(),
        total: rule.int(),
        result: rule.array(userItem),
      },
    }),
  ],
  action: () => {},
});

router.get('/users/:id', {
  mount: [
    params({
      id: rule.int().min(1),
    }),
    response({
      statusCode: 200,
      content: userItem,
    }),
    response({
      statusCode: 404,
      description: '用户不存在',
    }),
  ],
  action: () => {},
});

router.post('/users', {
  mount: [
    body({
      name: rule.string(),
      age: rule.int().optional(),
      address: rule.int().optional(),
    }),
    response({
      statusCode: 201,
      description: '创建成功',
      content: userItem,
    }),
  ],
  action: () => {},
});

router.post('/users/v1', {
  docs: {
    deprecated: true,
    description: '接口已弃用，请使用 /users',
  },
  mount: [
    body({
      name: rule.string(),
      age: rule.int().optional(),
      address: rule.int().optional(),
    }),
    response({
      statusCode: 201,
      description: '创建成功',
      content: userItem,
    }),
  ],
  action: () => {},
});

router.put('/users/:id', {
  mount: [
    params({
      id: rule.int().min(1),
    }),
    body({
      name: rule.string(),
      age: rule.int().optional(),
      address: rule.int().optional(),
    }),
    response({
      statusCode: 200,
      description: '更新成功',
      content: userItem,
    }),
    response({
      statusCode: 404,
      description: '用户不存在',
    }),
  ],
  action: () => {},
});

router.put('/users/avatar', {
  mount: [
    body({
      file: rule.file().mimeTypes('image/*'),
    }),
    response({
      statusCode: 201,
      content: {
        url: rule.string(),
      },
    }),
  ],
  action: () => {},
});

router.delete('/users/:id', {
  mount: [
    params({
      id: rule.int().min(1),
    }),
    response({
      statusCode: 204,
      description: '删除成功',
    }),
    response({
      statusCode: 404,
      description: '用户不存在',
    }),
  ],
  action: () => {},
});
