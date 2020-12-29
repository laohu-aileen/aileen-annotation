import assert from "power-assert";
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

describe("测试多元数反射查找", () => {
  it("获取所有注解的属性", async () => {
    const res1 = anno.getRefPropertys(Demo1);
    assert.deepEqual(res1, [{ key: "test3", type: String }]);

    const res2 = anno.getRefMethods(Demo1);
    assert.deepEqual(res2, [
      {
        key: "test2",
        return: undefined,
        parameters: [Number, String],
      },
      { key: "test1", return: String, parameters: [] },
    ]);
  });

  it("子类继承测试", async () => {
    let res = anno.getRefs(Demo1);
    assert.deepEqual(res, [
      {
        id: "id",
        name: "name",
      },
    ]);

    res = anno.getRefs(new Demo1());
    assert.deepEqual(res, [
      {
        id: "id",
        name: "name",
      },
    ]);

    res = anno.getRefs(Demo2);
    assert.deepEqual(res, [
      { id: "id1", name: "name1" },
      { id: "id", name: "name" },
    ]);

    res = anno.getRefs(Demo3);
    assert.deepEqual(res, [
      {
        id: "id",
        name: "name",
      },
    ]);
  });
});
