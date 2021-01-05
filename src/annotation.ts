import "reflect-metadata";
import lodash from "lodash";
import callsite from "callsite";
import { Decorator, PrototypeMeta, RefPrototype, RefMethod } from "./interface";

/**
 * 注解基础类
 */
export class Annotation<T extends Object> {
  /**
   * 唯一标识
   */
  public readonly id: symbol;

  /**
   * 装饰器包装
   */
  protected warps: Array<(option: T) => Decorator> = [];

  /**
   * 创建注解实例
   */
  constructor() {
    const name = callsite()[1].getFileName();
    this.id = Symbol(name);
  }

  /**
   * 获取注解原型
   * @param target
   */
  protected getPrototype(target: Function | Object): Function {
    if (target instanceof Function) return target;
    return target.constructor;
  }

  /**
   * 获取自己的元数据
   * @param target
   */
  protected getOwnerMetas(target: Function | Object): PrototypeMeta<T>[] {
    const constructor = this.getPrototype(target);
    if (!constructor) return [];
    let metas = Reflect.getOwnMetadata(this.id, constructor);

    // 首次设置
    if (!metas) {
      metas = [];
      Reflect.defineMetadata(this.id, metas, constructor);
    }

    // 返回元数据
    return metas;
  }

  /**
   * 获取父亲注解
   * @param target
   */
  protected getSuperMetas(target: Function | Object): PrototypeMeta<T>[] {
    const constructor = this.getPrototype(target);
    if (!constructor) return [];
    const metas = Reflect.getMetadata(
      this.id,
      constructor.prototype.__proto__.constructor
    );
    return metas ? metas : [];
  }

  /**
   * 获取元数据
   * @param target
   */
  protected getMetas(target: Function | Object): PrototypeMeta<T>[] {
    const ownerMetas = this.getOwnerMetas(target);
    const superMetas = this.getSuperMetas(target);
    return [...ownerMetas, ...superMetas];
  }

  /**
   * 导出注解
   */
  public decorator(option: T): Decorator {
    return (
      target: Function | Object,
      propertyKey?: string | symbol,
      info?: TypedPropertyDescriptor<any> | number
    ) => {
      // 生成元数据
      const data: PrototypeMeta<T> = { option, property: propertyKey };
      if (typeof info === "number") data.index = info;

      // 写入元数据
      const metas = this.getOwnerMetas(target);
      metas.unshift(data);

      // 执行包装器
      this.warps
        .map((warp) => warp(option))
        .map((decorator) => decorator(target, propertyKey, <any>info));
    };
  }

  /**
   * 获取反射元数据
   * @param target
   */
  public getRefs(
    target: Function | Object,
    property?: string | symbol,
    index?: number
  ): T[] {
    return this.getMetas(target)
      .filter((item) => item.property === property && item.index === index)
      .map((item) => item.option);
  }

  /**
   * 获取反射元数据
   * @param target
   */
  public getRef(
    target: Function | Object,
    property?: string | symbol,
    index?: number
  ): T {
    const meta = this.getMetas(target).find(
      (item) => item.property === property && item.index === index
    );
    if (meta) return meta.option;
    return null;
  }

  /**
   * 获取反射组合
   * @param target
   * @param property
   * @param index
   */
  public getRefCompose(
    target: Function | Object,
    property?: string | symbol,
    index?: number
  ): T {
    const options = this.getRefs(target, property, index);
    if (!options.length) return null;
    return Object.assign({}, ...options);
  }

  /**
   * 是否有注解
   * @param target
   * @param property
   * @param index
   */
  public hasRef(
    target: Function | Object,
    property?: string | symbol,
    index?: number
  ): boolean {
    const options = this.getRefs(target, property, index);
    return options.length > 0;
  }

  /**
   * 获取类中进行了注解的属性
   * @param target
   */
  public getRefPropertys(target: Function | Object): RefPrototype[] {
    const constructor = this.getPrototype(target);
    let keys = this.getMetas(target)
      .filter((item) => item.property !== undefined && item.index === undefined)
      .map((item) => item.property);
    return lodash
      .uniq(keys)
      .map((key) => {
        const type = Reflect.getMetadata(
          "design:type",
          constructor.prototype,
          key
        );
        if (type === Function) return;
        return { key, type };
      })
      .filter((item) => item);
  }

  /**
   * 获取类中进行了注解的方法
   * @param target
   */
  public getRefMethods(target: Function | Object): RefMethod[] {
    const constructor = this.getPrototype(target);
    let keys = this.getMetas(target)
      .filter((item) => item.property !== undefined && item.index === undefined)
      .map((item) => item.property);
    return lodash
      .uniq(keys)
      .map((key) => {
        const type = Reflect.getMetadata(
          "design:type",
          constructor.prototype,
          key
        );
        if (type !== Function) return;
        const returnType = Reflect.getMetadata(
          "design:returntype",
          constructor.prototype,
          key
        );
        const params = Reflect.getMetadata(
          "design:paramtypes",
          constructor.prototype,
          key
        );
        return { key, return: returnType, parameters: params };
      })
      .filter((item) => item);
  }

  /**
   * 包装其他装饰器
   * @param decorator
   */
  public warp(decorator: (option: T) => Decorator) {
    this.warps.push(decorator);
  }
}
