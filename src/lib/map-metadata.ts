import { Constructor } from 'type-fest';

/**
 * MapMetadata is a helper class that allows to store metadata in form of a Map
 * on a class.
 *
 * @template K - Type of the key in the metadata map.
 * @template V - Type of the value in the metadata map.
 *
 * @example
 *
 * ```ts
 * const myMetadata = new MapMetadata<string, number>('myFeature:myMetadata');
 * class MyClass {}
 * myMetadata.set(MyClass, 'myKey', 42);
 * console.log(myMetadata.get(MyClass, 'myKey')); // 42
 * ```
 */
export class MapMetadata<K, V> {
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
   * Initializes an empty map on a class or an instance constructor.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata map. The map will be persisted on the class and it is
   *  safe to store values in it.
   * @template T - Class instance type.
   */
  public init<T extends object>(arg: T | Constructor<T>): Map<K, V> {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata = new Map();
    // There are metadata already defined somewhere on the prototype chain.
    // We will copy them to the new array and will disconnect the reference
    // to the parent array. This way we will not accidentally modify the parent
    // array when adding a new value to the metadata array. Later modification
    // of the parent array will not affect the new array.
    if (
      !Object.prototype.hasOwnProperty.call(ctor, this.metadataKey) &&
      Reflect.has(ctor, this.metadataKey)
    ) {
      const parentMetadata = Reflect.get(ctor, this.metadataKey) as Map<K, V>;
      parentMetadata.forEach((value, key) => metadata.set(key, value));
    }

    Reflect.set(ctor, this.metadataKey, metadata);

    return metadata;
  }
  /**
   * Get the metadata map from a class or an instance constructor.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata map. The map will be persisted on the class and it is
   *  safe to store values in it.
   * @template T - Class instance type.
   */
  public getMap<T extends object>(arg: T | Constructor<T>): Map<K, V> {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    // Check if the metadata is already defined on the parent class.
    const metadata = Object.prototype.hasOwnProperty.call(
      ctor,
      this.metadataKey,
    )
      ? Reflect.get(ctor, this.metadataKey)
      : this.init(arg);

    return metadata;
  }
  /**
   * Get the metadata value from a class or an instance constructor.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @param key - Key in the metadata map.
   * @returns Metadata value or `undefined` if no metadata is set under given
   *  key.
   * @template T - Class instance type.
   */
  public get<T extends object>(arg: T | Constructor<T>, key: K): V | undefined {
    return this.getMap(arg).get(key);
  }
  /**
   * Set the metadata value on a class or an instance constructor.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself or the instance's constructor.
   * @param key - Key in the metadata map.
   * @param value - Metadata value to store.
   * @template T - Class instance type.
   */
  public set<T extends object>(
    arg: T | Constructor<T>,
    key: K,
    value: V,
  ): void {
    this.getMap(arg).set(key, value);
  }
  /**
   * Delete the metadata value from a class or an instance constructor.
   *
   * The deletion will affect only the metadata map on the class itself or
   * the instance's constructor. The parent metadata map will not be affected.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class.
   * @param key - Key in the metadata map to delete.
   * @returns `true` if the key was deleted, `false` if the key was not present.
   * @template T - Class instance type.
   */
  public delete<T extends object>(arg: T | Constructor<T>, key: K): boolean {
    return this.getMap(arg).delete(key);
  }
  /**
   * Check if the metadata under given key is set on a class or an instance constructor.
   *
   * @param arg - Class constructor
   * @param key - Key in the metadata map.
   * @returns `true` if the metadata is set, `false` otherwise.
   * @template T - Class instance type.
   */
  public has<T extends object>(arg: T | Constructor<T>, key: K): boolean {
    return this.getMap(arg).has(key);
  }
  /**
   * Clear the metadata map on a class or an instance constructor.
   *
   * The parent metadata map will not be affected.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor
   * @template T - Class instance type.
   */
  public clear<T extends object>(arg: T | Constructor<T>): void {
    this.getMap(arg).clear();
  }
  /**
   * Get the size of the metadata map on a class or an instance constructor.
   *
   * If the metadata is already defined on a parent class, it will be copied to
   * the new map. The method will not modify the parent map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Number of entries in the metadata map.
   * @template T - Class instance type.
   */
  public getSize<T extends object>(arg: T | Constructor<T>): number {
    return this.getMap(arg).size;
  }
}
