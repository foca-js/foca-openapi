# Changelog

## [2.3.4](https://github.com/foca-js/foca-openapi/compare/2.3.3...2.3.4) (2025-08-25)


### Bug Fixes

* 布尔值在枚举类型中被解析为字符串类型 ([1861a48](https://github.com/foca-js/foca-openapi/commit/1861a48c3e4aee10bab60278405f9d8d57e7cf7c))

## [2.3.3](https://github.com/foca-js/foca-openapi/compare/2.3.2...2.3.3) (2025-06-20)


### Bug Fixes

* 生成的文档注释在特定情况下可能提前结束 ([0d8f63e](https://github.com/foca-js/foca-openapi/commit/0d8f63e4a684ef751f0ba007847683446531e70e))

## [2.3.2](https://github.com/foca-js/foca-openapi/compare/2.3.1...2.3.2) (2025-05-22)


### Bug Fixes

* 使用axios代替fetch以防止请求出错 ([26dc344](https://github.com/foca-js/foca-openapi/commit/26dc34400999ec5313ceee50ab7f7fb55dfec4a0))

## [2.3.1](https://github.com/foca-js/foca-openapi/compare/2.3.0...2.3.1) (2025-04-23)


### Bug Fixes

* 修正生成模板中的可选URI格式 ([59ffa65](https://github.com/foca-js/foca-openapi/commit/59ffa655e2b90a0c476c2cc17374b94cee5e61f7))

# [2.3.0](https://github.com/foca-js/foca-openapi/compare/2.2.0...2.3.0) (2025-04-19)


### Features

* 添加looseInputNumber配置，支持将number类型解析为number | string ([fcd8540](https://github.com/foca-js/foca-openapi/commit/fcd8540fc0e899c60b71c1209b60931a518e6a2d))

# [2.2.0](https://github.com/foca-js/foca-openapi/compare/2.1.1...2.2.0) (2025-04-19)


### Features

* 使用项目内的prettier配置对生成的文件进行格式化 ([4f53541](https://github.com/foca-js/foca-openapi/commit/4f5354196fd8beb0c40f89aad60800d36cfa43c5))

## [2.1.1](https://github.com/foca-js/foca-openapi/compare/2.1.0...2.1.1) (2025-02-12)


### Bug Fixes

* rest模式下生成了错误的method ([e1f1437](https://github.com/foca-js/foca-openapi/commit/e1f143731cb0906a544578be15fc1f22a5ff0b9f))

# [2.1.0](https://github.com/foca-js/foca-openapi/compare/2.0.2...2.1.0) (2025-01-02)


### Features

* 允许配置rpc方法名的生成规则 ([38e55c0](https://github.com/foca-js/foca-openapi/commit/38e55c08829abf87acc182c6e0437236b5c2aa28))

## [2.0.2](https://github.com/foca-js/foca-openapi/compare/2.0.1...2.0.2) (2025-01-01)


### Bug Fixes

* 未正确区分esm和cjs ([9e1356e](https://github.com/foca-js/foca-openapi/commit/9e1356e695ba4af495519722b43e3dc186978e6d))

## [2.0.1](https://github.com/foca-js/foca-openapi/compare/2.0.0...2.0.1) (2025-01-01)


### Bug Fixes

* rpc-group模式下方法丢失context ([c6bf3ae](https://github.com/foca-js/foca-openapi/commit/c6bf3aeb6278a660d98d3edc7f420053bb576e78))
* 未导入string命名空间 ([b98a31e](https://github.com/foca-js/foca-openapi/commit/b98a31e5bb3bc7df71066929b5d226512cb5bcb1))

# [2.0.0](https://github.com/foca-js/foca-openapi/compare/1.3.0...2.0.0) (2025-01-01)


### Features

* 输出文件放到src目录 ([35863bc](https://github.com/foca-js/foca-openapi/commit/35863bc7b40478d93804edad97ee83a06dd3cae5))


### BREAKING CHANGES

* client服务改为从相对路径引用

# [1.3.0](https://github.com/foca-js/foca-openapi/compare/1.2.0...1.3.0) (2024-10-20)


### Features

* 为特殊格式增加别名 ([431d551](https://github.com/foca-js/foca-openapi/commit/431d55196178f98cdbfa58d3b974658e8ea1ebbf))
* 对象动态属性布尔值判断 ([0d4ccec](https://github.com/foca-js/foca-openapi/commit/0d4ccec49f284463c36086b3c4a50f6e62e8c601))

# [1.2.0](https://github.com/foca-js/foca-openapi/compare/1.1.7...1.2.0) (2024-10-20)


### Features

* 增加静默模式 ([a2aab8e](https://github.com/foca-js/foca-openapi/commit/a2aab8e38ffa8bac1d756960b1db39d23c3d0a5d))

## [1.1.7](https://github.com/foca-js/foca-openapi/compare/1.1.6...1.1.7) (2024-10-17)


### Bug Fixes

* 多客户端场景下，cjs文件语法错误 ([9bf8846](https://github.com/foca-js/foca-openapi/commit/9bf884626d33efc278f9239cb49428c5cbd4ca6d))

## [1.1.6](https://github.com/foca-js/foca-openapi/compare/1.1.5...1.1.6) (2024-10-17)


### Bug Fixes

* 数组配置只生成了最后一个客户端 ([9751a58](https://github.com/foca-js/foca-openapi/commit/9751a58c39aa033282e1c0235a8c27bdc4231bcc))

## [1.1.5](https://github.com/foca-js/foca-openapi/compare/1.1.4...1.1.5) (2024-10-14)


### Bug Fixes

* 转义后的中文无法正确寻找ref源 ([1dbf737](https://github.com/foca-js/foca-openapi/commit/1dbf7374d4e6629ade5c6c82532c70f99a6dccb1))

## [1.1.4](https://github.com/foca-js/foca-openapi/compare/1.1.3...1.1.4) (2024-10-07)


### Bug Fixes

* axios适配器不兼容foca-axios ([31642aa](https://github.com/foca-js/foca-openapi/commit/31642aa7509ace876fba85a6be96959926462bf6))
* pnpm安装时，相同的文件会使用同一个inode变成硬链接 ([5fc3343](https://github.com/foca-js/foca-openapi/commit/5fc3343f013e64194d5a2cb100bfbd0ca9bc7fd5))

## [1.1.3](https://github.com/foca-js/foca-openapi/compare/1.1.2...1.1.3) (2024-10-07)

## [1.1.2](https://github.com/foca-js/foca-openapi/compare/1.1.1...1.1.2) (2024-10-05)

## [1.1.1](https://github.com/foca-js/foca-openapi/compare/1.1.0...1.1.1) (2024-10-05)


### Bug Fixes

* cli脚本文字错误 ([c2227d7](https://github.com/foca-js/foca-openapi/commit/c2227d7172c61d24748fb921237833332b2f5eb2))

# [1.1.0](https://github.com/foca-js/foca-openapi/compare/1.0.0...1.1.0) (2024-10-01)


### Features

* **bin:** 未提供env参数时，优先使用NODE_ENV变量 ([491b793](https://github.com/foca-js/foca-openapi/commit/491b79333a93e764ff8ec730fe4afc24c2302a10))

# [1.0.0](https://github.com/foca-js/foca-openapi/compare/0.8.0...1.0.0) (2024-10-01)


### Bug Fixes

* **adapter:** keep object type body ([e905a04](https://github.com/foca-js/foca-openapi/commit/e905a0481e8572c671b68731d50bea712e0b10cc))
* bigint响应为字符串 ([d86eca6](https://github.com/foca-js/foca-openapi/commit/d86eca6d34333636a2414f2430c9e73425982ab0))


### Code Refactoring

* bin名称从foca-openapi改为openapi ([658b4e8](https://github.com/foca-js/foca-openapi/commit/658b4e8276619986dfdf19a32cef365e1aaf6da3))
* 配置名path重命名为url ([cfa4232](https://github.com/foca-js/foca-openapi/commit/cfa4232299683f30c0cf073c677fdcee20d63896))


### Features

* 支持动态对象 ([bc0d0c2](https://github.com/foca-js/foca-openapi/commit/bc0d0c265aadfe196079af83a6b39ccd5b499cae))
* 支持根据env动态配置 ([101fe88](https://github.com/foca-js/foca-openapi/commit/101fe88fb9e8a3c8541326254aa7b493b65ca0f4))


### BREAKING CHANGES

* bin名称从foca-openapi改为openapi
* 配置名path改为url

# [0.8.0](https://github.com/foca-js/foca-openapi/compare/0.7.2...0.8.0) (2024-08-10)


### Features

* 文档注释增加uri和method ([615e787](https://github.com/foca-js/foca-openapi/commit/615e7873b9d053065bbe6632ff893db811197767))

## [0.7.2](https://github.com/foca-js/foca-openapi/compare/0.7.1...0.7.2) (2024-07-28)


### Bug Fixes

* 对象结构中可能包含特殊字符，需要使用引号包裹 ([db14ff4](https://github.com/foca-js/foca-openapi/commit/db14ff4e379ece4315abc8e40a7d41e494bdaa5f))

## [0.7.1](https://github.com/foca-js/foca-openapi/compare/0.7.0...0.7.1) (2024-07-28)


### Bug Fixes

* xxxOf可能与任意结构组合 ([0e5533a](https://github.com/foca-js/foca-openapi/commit/0e5533ae898c992218c82c091c3af8017fbb4aa9))

# [0.7.0](https://github.com/foca-js/foca-openapi/compare/0.6.0...0.7.0) (2024-07-27)


### Features

* 解析nullable属性 ([7440ed0](https://github.com/foca-js/foca-openapi/commit/7440ed01d694d5836b8c904dca1628001b4c0938))
* 解析枚举值 ([39643b7](https://github.com/foca-js/foca-openapi/commit/39643b7c3bf373c3a819b930bb9084b47df1d412))

# [0.6.0](https://github.com/foca-js/foca-openapi/compare/0.5.1...0.6.0) (2024-07-22)


### Features

* classMode增加rpc-group模式 ([0c4301a](https://github.com/foca-js/foca-openapi/commit/0c4301a47d9b2498c4bd878fc59fc6e1d0825c85))
* 文档js内容也增加注释 ([664c26f](https://github.com/foca-js/foca-openapi/commit/664c26febbe8b5fc8daaad38f8cfc71d602ecb5b))

## [0.5.1](https://github.com/foca-js/foca-openapi/compare/0.5.0...0.5.1) (2024-07-21)


### Performance Improvements

* 优化文档保存方案 ([c9735c6](https://github.com/foca-js/foca-openapi/commit/c9735c6d5a5c123764b9ef8c30625a50d86180b3))

# [0.5.0](https://github.com/foca-js/foca-openapi/compare/0.4.1...0.5.0) (2024-07-20)


### Features

* 增加onBeforeRequest回调函数 ([4818999](https://github.com/foca-js/foca-openapi/commit/481899901c2d51d5f3eeb4678372cd8b584b9df2))
* 处理taro和uniapp的异常场景 ([9aedd7d](https://github.com/foca-js/foca-openapi/commit/9aedd7d16c021840303c4a7396a824c8ab39be2f))

## [0.4.1](https://github.com/foca-js/foca-openapi/compare/0.4.0...0.4.1) (2024-07-20)


### Bug Fixes

* 唯一值使用路由转换才符合直觉 ([f5d6537](https://github.com/foca-js/foca-openapi/commit/f5d65374f5097724ca0352cd8eba6b96fc1e1fef))
* 执行请求时this上下文指向错误 ([49c9196](https://github.com/foca-js/foca-openapi/commit/49c9196e63a56c5cc3d92ea85bc4df7fada3aa36))

# [0.4.0](https://github.com/foca-js/foca-openapi/compare/0.3.0...0.4.0) (2024-07-20)


### Features

* uniapp请求适配器 ([505dbfc](https://github.com/foca-js/foca-openapi/commit/505dbfcafc632011cfe6d9ae3a36286f6296f089))
* 新增文档加载事件 ([fea1c80](https://github.com/foca-js/foca-openapi/commit/fea1c8080f77fe9ba114f36c0783a20453822132))

# [0.3.0](https://github.com/foca-js/foca-openapi/compare/0.2.2...0.3.0) (2024-07-20)


### Bug Fixes

* 对象属性未生成注释 ([8c958d3](https://github.com/foca-js/foca-openapi/commit/8c958d3428820242aa6d5a330dfe36235c6e59e1))


### Features

* uri模式下支持分组 ([78a55b4](https://github.com/foca-js/foca-openapi/commit/78a55b46d7945e7930b08bfc1e9a3f617335d51f))
* 新增method+uri生成方法 ([15677f6](https://github.com/foca-js/foca-openapi/commit/15677f6caa30c0edb721ed44a549e298e7bc79ed))

## [0.2.2](https://github.com/foca-js/foca-openapi/compare/0.2.1...0.2.2) (2024-07-19)


### Bug Fixes

* 缺失patch方法 ([8ee603e](https://github.com/foca-js/foca-openapi/commit/8ee603ea2c13dd5ee1d5445dbdfa2a644a528e17))
* 获取contentType时key拼接错误 ([1531c99](https://github.com/foca-js/foca-openapi/commit/1531c99ff7d0c04d59801cd4ac8376958c7e8b5b))

## [0.2.1](https://github.com/foca-js/foca-openapi/compare/0.2.0...0.2.1) (2024-07-19)


### Bug Fixes

* taro适配器中requestOptions是可选的 ([90e1789](https://github.com/foca-js/foca-openapi/commit/90e1789db43ec44a69e8a0d03875f05f9a64cb86))

# [0.2.0](https://github.com/foca-js/foca-openapi/compare/0.1.1...0.2.0) (2024-07-19)


### Bug Fixes

* exports指向了错误的路径 ([5004541](https://github.com/foca-js/foca-openapi/commit/5004541ad044db4cf6fec0a6689b19e4a882bf30))


### Features

* taro适配器 ([bea3e4c](https://github.com/foca-js/foca-openapi/commit/bea3e4c024e0d837760113de2b9c26e4b99e2b0e))

## [0.1.1](https://github.com/foca-js/foca-openapi/compare/0.1.0...0.1.1) (2024-07-19)


### Bug Fixes

* 重新打包时无法生成.d.ts ([f4174c8](https://github.com/foca-js/foca-openapi/commit/f4174c88f6142fa5406718ee3a340561d379b49d))

# 0.1.0 (2024-07-18)


### Bug Fixes

* cjs项目读取配置失败 ([5e59ac5](https://github.com/foca-js/foca-openapi/commit/5e59ac5f9d03b9eba08afb23d38e4319cba40571))
* 打包时未过滤第三方库 ([7870610](https://github.com/foca-js/foca-openapi/commit/787061041fab148c365de864e0a66c41509443c8))
* 项目安装当前包失败 ([8e06437](https://github.com/foca-js/foca-openapi/commit/8e0643727c7d3733f05c446d2575fc167577f8f8))


### Features

* 初始化 ([7350225](https://github.com/foca-js/foca-openapi/commit/73502250bec4a69a79a70259d4835ead37670e06))
