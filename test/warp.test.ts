import assert from "power-assert";
import { Annotation } from "../src/annotation";

/**
 * 测试用注解
 */
const anno1 = new Annotation<{
  id?: string;
}>();

/**
 * 测试用注解
 */
const anno2 = new Annotation<{
  id?: string;
  name?: string;
}>();

/**
 * 包装其他注解
 */
anno2.warp((option) => anno1.decorator({ id: option.id }));

/**
 * 演示类
 */
@anno2.decorator({
  id: "id",
  name: "name",
})
class Demo {}

describe("测试注解包装", () => {
  it("包装其他注解", async () => {
    const res1 = anno1.getRef(Demo);
    assert.deepEqual(res1, { id: "id" });
    const res2 = anno2.getRefs(Demo);
    assert.deepEqual(res2, [{ id: "id", name: "name" }]);
  });
});
