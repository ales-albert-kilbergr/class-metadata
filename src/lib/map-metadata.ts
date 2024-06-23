/**
 * MapMetadata is a helper class that allows to store metadata in form of a Map
 * on a class.
 *
 * @typeParam K - Type of the key in the metadata map.
 * @typeParam V - Type of the value in the metadata map.
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
   * Initializes an empty map on a class or an instance. If the metadata is
   * already defined on a parent class, it will be copied to the new map.
   * The method will not modify the parent map. Later modification of the
   * parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata map. The map will be persisted on the class and it is
   *  safe to store values in it.
   */
  public init<TInstance extends object>(instance: TInstance): Map<K, V>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  public init<TFunction extends Function>(ctor: TFunction): Map<K, V>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  public init<ARG extends Function | object>(arg: ARG): Map<K, V> {
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
   * Get the metadata map from a class or. If the metadata map
   * is not defined, it will be initialized. If the metadata map is already
   * defined on a parent class, it will be copied to the new map. Later
   * modification of the parent map will not affect the new map.
   *
   * @param instance - Instance of a class. The method will look for the
   *  metadata on the instance's constructor or any parent class.
   * @returns Metadata map. The map will be persisted on the class and it is
   *  safe to store values in it.
   */
  public getMap<TInstance extends object>(instance: TInstance): Map<K, V>;
  /**
   * Get the metadata map from a class . If the metadata map
   * is not defined, it will be initialized. If the metadata map is already
   * defined on a parent class, it will be copied to the new map. Later
   * modification of the parent map will not affect the new map.
   *
   * @param ctor - Class constructor. The method will look for the metadata
   *  on the class itself or any parent class.
   * @returns Metadata map. The map will be persisted on the class and it is
   *  safe to store values in it.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getMap<TFunction extends Function>(ctor: TFunction): Map<K, V>;
  /**
   * Get the metadata map from a class or an instance. If the metadata map
   * is not defined, it will be initialized. If the metadata map is already
   * defined on a parent class, it will be copied to the new map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata map. The map will be persisted on the class and it is
   *  safe to store values in it.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getMap<ARG extends Function | object>(arg: ARG): Map<K, V> {
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
   * Get the metadata value from an instance. If the metadata map is not
   * defined, it will be initialized. If the metadata map is already defined
   * on a parent class, it will be copied to the new map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param instance - Instance of a class. The method will look for the
   *  metadata on the instance's constructor or any parent class.
   * @param key - Key in the metadata map.
   *
   * @returns Metadata value or `undefined` if no metadata is set under given
   *  key.
   */
  public get<TInstance extends object>(
    instance: TInstance,
    key: K,
  ): V | undefined;
  /**
   * Get the metadata value from a class. If the metadata map is not
   * defined, it will be initialized. If the metadata map is already defined
   * on a parent class, it will be copied to the new map. Later modification
   * of the parent map will not affect the new map.
   *
   * @param ctor - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @param key - Key in the metadata map.
   *
   * @returns Metadata value or `undefined` if no metadata is set under given
   *  key.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public get<TFunction extends Function>(
    ctor: TFunction,
    key: K,
  ): V | undefined;
  /**
   * Get the metadata value from a class or an instance. If the metadata map is
   * not defined, it will be initialized. If the metadata map is already defined
   * on a parent class, it will be copied to the new map. Later modification of
   * the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @param key - Key in the metadata map.
   *
   * @returns Metadata value or `undefined` if no metadata is set under given
   *  key.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public get<ARG extends Function | object>(arg: ARG, key: K): V | undefined {
    return this.getMap(arg).get(key);
  }
  /**
   * Set the metadata value on an instance. If the metadata map is not defined,
   * it will be initialized. If the metadata map is already defined on a parent
   * class, it will be copied to the new map. Later modification of the parent
   * map will not affect the new map.
   *
   * @param instance - Instance of a class. The metadata will be stored on the
   *  instance's constructor.
   * @param key - Key in the metadata map.
   * @param value - Metadata value to store.
   */
  public set<TInstance extends object>(
    instance: TInstance,
    key: K,
    value: V,
  ): void;
  /**
   * Set the metadata value on a class. If the metadata map is not defined,
   * it will be initialized. If the metadata map is already defined on a parent
   * class, it will be copied to the new map. Later modification of the parent
   * map will not affect the new map.
   *
   * @param ctor - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself.
   * @param key - Key in the metadata map.
   * @param value - Metadata value to store.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public set<TFunction extends Function>(
    ctor: TFunction,
    key: K,
    value: V,
  ): void;
  /**
   * Set the metadata value on a class or an instance. If the metadata map is
   * not defined, it will be initialized. If the metadata map is already defined
   * on a parent class, it will be copied to the new map. Later modification of
   * the parent map will not affect the new map.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself or the instance's constructor.
   * @param key - Key in the metadata map.
   * @param value - Metadata value to store.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public set<ARG extends Function | object>(arg: ARG, key: K, value: V): void {
    this.getMap(arg).set(key, value);
  }
  /**
   * Delete the metadata value from an instance. The deletion will affect only
   * the metadata map on the instance's constructor. The parent metadata map
   * will not be affected.
   *
   * @param instance - Instance of a class.
   * @param key - Key in the metadata map to delete.
   *
   * @returns `true` if the key was deleted, `false` if the key was not present.
   */
  public delete<TInstance extends object>(instance: TInstance, key: K): boolean;
  /**
   * Delete the metadata value from a class. The deletion will affect only
   * the metadata map on the class itself. The parent metadata map will not
   * be affected.
   *
   * @param ctor - Class constructor.
   * @param key - Key in the metadata map to delete.
   *
   * @returns `true` if the key was deleted, `false` if the key was not present.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public delete<TFunction extends Function>(ctor: TFunction, key: K): boolean;
  /**
   * Delete the metadata value from a class or an instance. The deletion will
   * affect only the metadata map on the class itself or the instance's
   * constructor. The parent metadata map will not be affected.
   *
   * @param arg - Class constructor or an instance of a class.
   * @param key - Key in the metadata map to delete.
   * @returns `true` if the key was deleted, `false` if the key was not present.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public delete<ARG extends Function | object>(arg: ARG, key: K): boolean {
    return this.getMap(arg).delete(key);
  }
  /**
   * Check if the metadata under given key is set on an instance.
   *
   * @param instance - Instance of a class.
   * @param key - Key in the metadata map.
   * @returns `true` if the metadata is set, `false` otherwise.
   */
  public has<TInstance extends object>(instance: TInstance, key: K): boolean;
  /**
   * Check if the metadata under given key is set on a class.
   *
   * @param ctor - Class constructor
   * @param key - Key in the metadata map.
   * @returns `true` if the metadata is set, `false` otherwise.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public has<TFunction extends Function>(ctor: TFunction, key: K): boolean;
  /**
   * Check if the metadata under given key is set on a class or an instance.
   *
   * @param arg - Class constructor
   * @param key - Key in the metadata map.
   * @returns `true` if the metadata is set, `false` otherwise.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public has<ARG extends Function | object>(arg: ARG, key: K): boolean {
    return this.getMap(arg).has(key);
  }
  /**
   * Clear the metadata map on an instance. The parent metadata map will not
   * be affected.
   *
   * @param instance - Instance of a class.
   */
  public clear<TInstance extends object>(instance: TInstance): void;
  /**
   * Clear the metadata map on a class. The parent metadata map will not
   * be affected.
   *
   * @param ctor - Class constructor
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public clear<TFunction extends Function>(ctor: TFunction): void;
  /**
   * Clear the metadata map on a class or an instance. The parent metadata map
   * will not be affected.
   *
   * @param arg - Class constructor
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public clear<ARG extends Function | object>(arg: ARG): void {
    this.getMap(arg).clear();
  }
  /**
   * Get all keys from the metadata map on an instance.
   *
   * @param instance - Instance of a class.
   * @returns Iterable of all keys in the metadata map.
   */
  public keys<TInstance extends object>(instance: TInstance): Iterable<K>;
  /**
   * Get all keys from the metadata map on a class.
   *
   * @param ctor - Class constructor
   * @returns Iterable of all keys in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public keys<TFunction extends Function>(ctor: TFunction): Iterable<K>;
  /**
   * Get all keys from the metadata map on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Iterable of all keys in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public keys<ARG extends Function | object>(arg: ARG): Iterable<K> {
    return this.getMap(arg).keys();
  }
  /**
   * Get all values from the metadata map on an instance.
   *
   * @param instance - Instance of a class.
   * @returns Iterable of all values in the metadata map.
   */
  public values<TInstance extends object>(instance: TInstance): Iterable<V>;
  /**
   * Get all values from the metadata map on a class.
   *
   * @param ctor - Class constructor.
   * @returns Iterable of all values in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public values<TFunction extends Function>(ctor: TFunction): Iterable<V>;
  /**
   * Get all values from the metadata map on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Iterable of all values in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public values<ARG extends Function | object>(arg: ARG): Iterable<V> {
    return this.getMap(arg).values();
  }
  /**
   * Get all entries from the metadata map on an instance.
   *
   * @param instance - Instance of a class.
   * @returns Iterable of all entries in the metadata map.
   */
  public entries<TInstance extends object>(
    instance: TInstance,
  ): Iterable<[K, V]>;
  /**
   * Get all entries from the metadata map on a class.
   *
   * @param ctor - Class constructor
   * @returns Iterable of all entries in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public entries<TFunction extends Function>(ctor: TFunction): Iterable<[K, V]>;
  /**
   * Get all entries from the metadata map on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Iterable of all entries in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public entries<ARG extends Function | object>(arg: ARG): Iterable<[K, V]> {
    return this.getMap(arg).entries();
  }
  /**
   * Get the size of the metadata map on an instance.
   *
   * @param instance - Instance of a class.
   * @returns Number of entries in the metadata map.
   */
  public getSize<TInstance extends object>(instance: TInstance): number;
  /**
   * Get the size of the metadata map on a class.
   *
   * @param ctor - Class constructor
   * @returns Number of entries in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getSize<TFunction extends Function>(ctor: TFunction): number;
  /**
   * Get the size of the metadata map on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Number of entries in the metadata map.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getSize<ARG extends Function | object>(arg: ARG): number {
    return this.getMap(arg).size;
  }
}
