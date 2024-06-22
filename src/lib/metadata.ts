/**
 * Define a simple metadata value on a class. The metadata are stored under
 * unique symbol on the class itself. In case of an instance, the metadata are
 * stored on the instance's constructor.
 *
 * The metadata key can be passed as string or a known symbol.
 *
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
   * Get the metadata value from an instance.
   *
   * @param instance - Instance of a class. The method will look for the
   *   metadata on the instance's constructor or any parent class.
   * @returns Metadata value or `undefined` if no metadata is set.
   */
  public get<TInstance extends object>(instance: TInstance): V | undefined;
  /**
   * Get the metadata value from a class.
   *
   * @param ctor - Class constructor. The method will look for the metadata
   *  on the class itself or any parent class.
   * @returns Metadata value or `undefined` if no metadata is set.
   *
   */
  public get<TFunction extends Function>(ctor: TFunction): V | undefined;
  /**
   * Get the metadata value from a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method will
   *  look for the metadata on the class itself or any parent class.
   * @returns Metadata value or `undefined` if no metadata is set.
   */
  public get<ARG extends Function | object>(arg: ARG): V | undefined {
    if (arg instanceof Function) {
      return Reflect.get(arg, this.metadataKey) as V | undefined;
    } else {
      return Reflect.get(arg.constructor, this.metadataKey) as V | undefined;
    }
  }
  /**
   * Set the metadata value on an instance.
   *
   * @param instance - Instance of a class. The metadata will be stored on the
   *   instance's constructor.
   * @param value - Metadata value to store.
   */
  public set<TInstance extends object, V>(instance: TInstance, value: V): void;
  /**
   * Set the metadata value on a class.
   *
   * @param ctor - Class constructor. The metadata will be stored on the class
   *  itself.
   * @param value - Metadata value to store.
   */
  public set<TFunction extends Function, V>(ctor: TFunction, value: V): void;
  /**
   * Set the metadata value on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *   be stored on the class itself or the instance's constructor.
   * @param value - Metadata value to store.
   */
  public set<ARG extends Function | object, V>(arg: ARG, value: V): void {
    if (arg instanceof Function) {
      Reflect.set(arg, this.metadataKey, value);
    } else {
      Reflect.set(arg.constructor, this.metadataKey, value);
    }
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
  public has<TFunction extends Function>(ctor: TFunction): boolean;
  /**
   * Check if the metadata is set on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns `true` if the metadata is set, `false` otherwise.
   */
  public has<ARG extends Function | object>(arg: ARG): boolean {
    if (arg instanceof Function) {
      return Reflect.has(arg, this.metadataKey);
    } else {
      return Reflect.has(arg.constructor, this.metadataKey);
    }
  }
  /**
   * Delete the metadata from an instance.
   *
   * @param instance - Instance of a class. The method will look for the
   *  metadata on the instance's constructor or any parent class.
   * @returns `true` if the metadata was deleted, `false` otherwise.
   */
  public delete<TInstance extends object>(instance: TInstance): boolean;
  /**
   * Delete the metadata from a class.
   *
   * @param ctor - Class constructor. The method will look for the metadata
   *   on the class itself or any parent class.
   * @returns `true` if the metadata was deleted, `false` otherwise.
   */
  public delete<TFunction extends Function>(ctor: TFunction): boolean;
  /**
   * Delete the metadata from a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns `true` if the metadata was deleted, `false` otherwise.
   */
  public delete<ARG extends Function | object>(arg: ARG): boolean {
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
