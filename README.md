# aileen-anntation

## 快速开始

### 安装
``` bash
npm i aileen-annotation -S
```

### 基础用法
```ts
import { Annotation } from "aileen-annotation";

// 创建注解
const anno = new Annotation<{
  id : string;
  name : string;
}>()

@anno.decorator({
  id: "id",
  name: "name",
})
class Demo {
  @anno.decorator({
    id: "test",
    name: "test",
  })
  test(
    @anno.decorator({
      id: "args",
      name: "args",
    })
    args: any
  ) {
    console.log(args);
  }
}

// 判断是否有注解
const exist = anno.hasRef(Demo);
// true


// 获取类注解信息
const refClass = anno.getRef(Demo);
// {
//    "id":"id",
//    "name":"name"
// }

// 通过实例获取
const refObjectClass = anno.getRef(new Demo());
// {
//    "id":"id",
//    "name":"name"
// }

// 获取方法注解信息
const refProperty = anno.getRefs(Demo, "test");
// {
//    "id":"test",
//    "name":"test"
// }

// 获取参数注解信息
const refArg= anno.getRefCompose(Demo, "test", 0);
// {
//    "id":"args",
//    "name":"args"
// }
```

### 多重注解
```ts
import { Annotation } from "aileen-annotation";

// 创建注解
const anno = new Annotation<{
  id? : string;
  name? : string;
}>()

/**
 * 演示类
 */
@anno.decorator({
  id: "id"
})
@anno.decorator({
  name: "name"
})
class Demo {}

// 获取默认注解（第一个）
const ref = anno.getRef(Demo);
// {
//    "id":"id"
// }

// 获取所有注解
const refs = anno.getRef(Demo);
// [
//   {
//      "id":"id"
//   },
//   {
//      "name":"name"
//   }
// ]

// 合并多注解
const refCompose = anno.getRefCompose(Demo);
// {
//    "id":"id",
//    "name":"name"
// }
```

### 反射属性/方法
```ts
import { Annotation } from "../src/annotation";

/**
 * 测试用注解
 */
const anno = new Annotation<{
  id?: string;
  name?: string;
}>();

/**
 * 演示类
 */
@anno.decorator({
  id: "id",
  name: "name",
})
class Demo {
  @anno.decorator({})
  test1(): string {
    return "hello";
  }

  @anno.decorator({})
  test2(id: number, name: string) {
    console.log(id, name);
  }

  @anno.decorator({})
  test3: string;
}

const res1 = anno.getRefPropertys(Demo);
// [{ key: "test3", type: String }]

const res2 = anno.getRefMethods(Demo);
// [
//   {
//     key: "test2",
//     return: undefined,
//     parameters: [Number, String],
//   },
//   { 
//     key: "test1", 
//     return: String, 
//     parameters: [] 
//   },
// ]
```

### 类继承关系
```ts
import { Annotation } from "aileen-annotation";

// 创建注解
const anno = new Annotation<{
  id? : string;
  name? : string;
}>()

@anno.decorator({
  id: "id",
  name: "name",
})
class Demo1 {
  @anno.decorator({})
  test1(): string {
    return "hello";
  }

  @anno.decorator({})
  test2(id: number, name: string) {
    console.log(id, name);
  }

  @anno.decorator({})
  test3: string;
}

@anno.decorator({
  id: "id1",
  name: "name1",
})
class Demo2 extends Demo1 {}

class Demo3 extends Demo1 {}

const res1 = anno.getRefs(Demo1);
assert.deepEqual(res1, [
  {
    id: "id",
    name: "name",
  },
]);

const res2 = anno.getRefs(new Demo1());
assert.deepEqual(res2, [
  {
    id: "id",
    name: "name",
  },
]);

const res3 = anno.getRefs(Demo2);
assert.deepEqual(res3, [
  { id: "id1", name: "name1" },
  { id: "id", name: "name" },
]);

const res4 = anno.getRefs(Demo3);
assert.deepEqual(res4, [
  {
    id: "id",
    name: "name",
  },
]);
```