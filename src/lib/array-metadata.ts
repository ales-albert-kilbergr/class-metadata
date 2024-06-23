import { Constructor } from 'type-fest';

/**
 * Helper class to store metadata in an array.
 * The metadata can be stored on a class or an instance of a class.
 *
 * @template V - Metadata value type.
 *
 * @example
 *
 * ```ts
 * const testMetadata = new ArrayMetadata<string>('test:testMetadata');
 * const testInstance = new TestClass();
 *
 * testMetadata.add(testInstance, 'a');
 * testMetadata.add(testInstance, 'b');
 * testMetadata.add(testInstance, 'c');
 *
 * console.log(testMetadata.get(testInstance)); // ['a', 'b', 'c']
 * ```
 */
export class ArrayMetadata<V> {
  /**
   * Unique symbol used to store metadata on a class.
   */
  public readonly metadataKey: symbol;
  /**
   * @param key - Metadata key used to store the metadata on a class.
   *  If a string is passed, it will be converted to a symbol.
   */
  constructor(key: string | symbol) {
    this.metadataKey = typeof key === 'symbol' ? key : Symbol(key);
  }
  /**
   * Initialize an empty metadata array on a class or an instance constructor.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Initialized metadata array.
   * @template T - Class instance type.
   */
  public init<T extends object>(arg: T | Constructor<T>): V[] {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata: V[] = [];
    // There are metadata already defined somewhere on the prototype chain.
    // We will copy them to the new array and will disconnect the reference
    // to the parent array. This way we will not accidentally modify the parent
    // array when adding a new value to the metadata array. Later modification
    // of the parent array will not affect the new array.
    if (
      !Object.prototype.hasOwnProperty.call(ctor, this.metadataKey) &&
      Reflect.has(ctor, this.metadataKey)
    ) {
      const parentMetadata = Reflect.get(ctor, this.metadataKey) as V[];
      metadata.push(...parentMetadata);
    }

    Reflect.set(ctor, this.metadataKey, metadata);

    return metadata;
  }
  /**
   * Get the metadata array from a class or an instance constructor.
   *
   * If no metadata is set, an empty array will be initialized and persisted.
   * If the metadata array is already defined on a parent class, it will be
   * copied to the new array. Later modification of the parent array will not
   * affect the new array.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata array. It is safe to call "push" on the returned array.
   * @template T - Class instance type.
   */
  public get<T extends object>(arg: T | Constructor<T>): V[] {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    // Persist the empty array for future access. (It could happened that
    // someone will try to push a value to the array and will expect that
    // next `get` call will return the same array with the value.)
    const metadata = Object.prototype.hasOwnProperty.call(
      ctor,
      this.metadataKey,
    )
      ? Reflect.get(ctor, this.metadataKey)
      : this.init(arg);

    return metadata;
  }
  /**
   * Set a new metadata array on a class or an instance constructor.
   *
   * If the metadata array already exists, it will be overwritten with the new value.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *   be stored on the class itself or the instance's constructor.
   * @param value - Metadata array to store.
   * @template T - Class instance type.
   */
  public set<T extends object>(arg: T | Constructor<T>, value: V[]): void {
    const ctor = arg instanceof Function ? arg : arg.constructor;

    Reflect.set(ctor, this.metadataKey, value);
  }
  /**
   * Add a new value to the metadata array on a class or an instance constructor.
   *
   * If no metadata is set, an empty array will be initialized and persisted.
   * If the metadata array is already defined on a parent class, it will be
   * copied to the new array. Later modification of the parent array will not
   * affect the new array.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself or the instance's constructor.
   * @param value - Metadata value to add.
   * @template T - Class instance type.
   */
  public add<T extends object>(arg: T | Constructor<T>, ...values: V[]): void {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata = this.get(ctor);
    metadata.push(...values);

    this.set(ctor, metadata);
  }
  /**
   * Get the size of the metadata array from a class or an instance constructor.
   *
   * If no metadata is set, an empty array will be initialized and persisted.
   * If the metadata array is already defined on a parent class, it will be
   * copied to the new array. Later modification of the parent array will not
   * affect the new array.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Size of the metadata array.
   * @template T - Class instance type.
   */
  public getSize<T extends object>(arg: T | Constructor<T>): number {
    return this.get(arg).length;
  }
  /**
   * Clear the metadata array on a class or an instance constructor.
   *
   * If no metadata is set, an empty array will be initialized and persisted.
   * If the metadata array is already defined on a parent class, it will be
   * copied to the new array. Later modification of the parent array will not
   * affect the new array.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself or the instance's constructor.
   * @template T - Class instance type.
   */
  public clear<T extends object>(arg: T | Constructor<T>): void {
    this.set(arg, []);
  }
}
