import { Constructor } from 'type-fest';

/**
 * Define a simple metadata value on a class. The metadata are stored under
 * unique symbol on the class itself. In case of an instance, the metadata are
 * stored on the instance's constructor.
 *
 * The metadata key can be passed as string or a known symbol.
 *
 * @template V - Metadata value type.
 * @example
 *
 * ```ts
 * const myMetadata = new Metadata<string>('myFeature:myMetadata');
 * class MyClass {}
 * myMetadata.set(MyClass, 'myValue');
 * console.log(myMetadata.get(MyClass)); // 'myValue'
 * ```
 */
export class Metadata<V> {
  /**
   * Unique symbol used to store metadata on a class.
   */
  public readonly metadataKey: symbol;
  /**
   * Creates a metadata with a unique symbol key and exposes methods to
   * interact with the metadata on a class or an instance.
   *
   * @param key - Metadata key used to store the metadata on a class.
   *    If a string is passed, it will be converted to a symbol.
   */
  constructor(key: string | symbol) {
    this.metadataKey = typeof key === 'symbol' ? key : Symbol(key);
  }
  /**
   * Get the metadata value from a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata value or `undefined` if no metadata is set.
   * @template T - Class instance type.
   */
  public get<T extends object>(arg: T | Constructor<T>): V | undefined {
    const ctor = arg instanceof Function ? arg : arg.constructor;

    return Reflect.get(ctor, this.metadataKey);
  }
  /**
   * Set the metadata value on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *   be stored on the class itself or the instance's constructor.
   * @param value - Metadata value to store.
   * @template T - Class instance type.
   */
  public set<T extends object, V>(arg: T | Constructor<T>, value: V): void {
    const ctor = arg instanceof Function ? arg : arg.constructor;

    Reflect.set(ctor, this.metadataKey, value);
  }
  /**
   * Check if the metadata is set on an instance.
   *
   * @param instance - Instance of a class. The method will look for the
   *   metadata on the instance's constructor or any parent class.
   * @returns `true` if the metadata is set, `false` otherwise.
   */
  public has<TInstance extends object>(instance: TInstance): boolean;
  /**
   * Check if the metadata is set on a class.
   *
   * @param ctor - Class constructor. The method will look for the metadata
   *  on the class itself or any parent class.
   * @returns `true` if the metadata is set, `false` otherwise.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public has<TFunction extends Function>(ctor: TFunction): boolean;
  /**
   * Check if the metadata is set on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns `true` if the metadata is set, `false` otherwise.
   * @template T - Class instance type.
   */
  public has<T extends object>(arg: T | Constructor<T>): boolean {
    const ctor = arg instanceof Function ? arg : arg.constructor;

    return Reflect.has(ctor, this.metadataKey);
  }
  /**
   * Delete the metadata from a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns `true` if the metadata was deleted, `false` otherwise.
   * @template T - Class instance type.
   */
  public delete<T extends object>(arg: T | Constructor<T>): boolean {
    if (arg instanceof Function) {
      if (!Reflect.has(arg, this.metadataKey)) {
        return false;
      }
      return Reflect.deleteProperty(arg, this.metadataKey);
    } else {
      if (!Reflect.has(arg.constructor, this.metadataKey)) {
        return false;
      }
      return Reflect.deleteProperty(arg.constructor, this.metadataKey);
    }
  }
}
