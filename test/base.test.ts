import assert from "power-assert";
import { Annotation } from "../src/annotation";

/**
 * 测试用注解
 */
const anno = new Annotation<{
  id: string;
  name: string;
}>();

class Demo0 {}

/**
 * 演示类
 */
@anno.decorator({
  id: "id",
  name: "name",
})
class Demo1 {
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

/**
 * 演示类
 */
@anno.decorator({
  id: "id1",
  name: "name1",
})
@anno.decorator({
  id: "id2",
  name: "name2",
})
class Demo2 {}

describe("基础用法测试", () => {
  it("测试类注解", async () => {
    assert(!anno.hasRef(Demo0));
    assert(anno.hasRef(Demo1));
    assert(anno.hasRef(Demo2));

    // 无注解类
    const ref0 = anno.getRef(Demo0);
    assert(ref0 === null);
    const refs0 = anno.getRefs(Demo0);
    assert(refs0.length === 0);
    const refCompose0 = anno.getRefCompose(Demo0);
    assert(refCompose0 === null);

    // 单个注解
    const ref1 = anno.getRef(Demo1);
    assert.deepEqual(ref1, { id: "id", name: "name" });
    const refs1 = anno.getRefs(Demo1);
    assert(refs1.length === 1);
    assert.deepEqual(refs1, [
      {
        id: "id",
        name: "name",
      },
    ]);
    const refCompose1 = anno.getRefCompose(Demo1);
    assert.deepEqual(refCompose1, {
      id: "id",
      name: "name",
    });

    // 多个注解
    const ref2 = anno.getRef(Demo2);
    assert.deepEqual(ref2, { id: "id1", name: "name1" });
    const refs2 = anno.getRefs(Demo2);
    assert.deepEqual(refs2, [
      {
        id: "id1",
        name: "name1",
      },
      {
        id: "id2",
        name: "name2",
      },
    ]);
    const refCompose2 = anno.getRefCompose(Demo2);
    assert.deepEqual(refCompose2, {
      id: "id2",
      name: "name2",
    });
  });

  it("测试对象反射", async () => {
    const ref1 = anno.getRef(new Demo1());
    assert.deepEqual(ref1, { id: "id", name: "name" });
    const refs1 = anno.getRefs(new Demo1());
    assert(refs1.length === 1);
    assert.deepEqual(refs1, [
      {
        id: "id",
        name: "name",
      },
    ]);
    const refCompose1 = anno.getRefCompose(new Demo1());
    assert.deepEqual(refCompose1, {
      id: "id",
      name: "name",
    });
  });

  it("测试方法注解", async () => {
    const ref = anno.getRef(Demo1, "test");
    assert.deepEqual(ref, { id: "test", name: "test" });
    const refs = anno.getRefs(Demo1, "test");
    assert.deepEqual(refs, [
      {
        id: "test",
        name: "test",
      },
    ]);
    const refCompose = anno.getRefCompose(Demo1, "test");
    assert.deepEqual(refCompose, {
      id: "test",
      name: "test",
    });
  });

  it("测试参数注解", async () => {
    const ref = anno.getRef(Demo1, "test", 0);
    assert.deepEqual(ref, { id: "args", name: "args" });
    const refs = anno.getRefs(Demo1, "test", 0);
    assert.deepEqual(refs, [
      {
        id: "args",
        name: "args",
      },
    ]);
    const refCompose = anno.getRefCompose(Demo1, "test", 0);
    assert.deepEqual(refCompose, {
      id: "args",
      name: "args",
    });
  });
});
