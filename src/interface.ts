/**
 * 注解数据设置器
 */
export type Decorator = ClassDecorator &
  PropertyDecorator &
  MethodDecorator &
  ParameterDecorator;

/**
 * 原型元数据
 */
export interface PrototypeMeta<T> {
  property?: string | symbol;
  index?: number;
  option: T;
}

/**
 * 注解属性反射
 */
export interface RefPrototype {
  key: string | symbol;
  type: any;
}

/**
 * 注解方法反射
 */
export interface RefMethod {
  key: string | symbol;
  return: any;
  parameters: any[];
}
