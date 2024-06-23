import { Constructor } from 'type-fest';
/**
 * A metadata helper to store a set of values on a class or an instance constructor.
 *
 * @template V - Metadata value type.
 */
export class SetMetadata<V> {
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
   * Initialize metadata on a class. If metadata is already defined on a parent
   * class, it will be copied to the new set and disconnected from the parent
   * set. This way, modifying the parent set will not affect the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Metadata set.
   * @template T - Class instance type.
   */
  public init<T extends object>(arg: T | Constructor<T>): Set<V> {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata = new Set<V>();
    // There are metadata already defined somewhere on the prototype chain.
    // We will copy them to the new array and will disconnect the reference
    // to the parent array. This way we will not accidentally modify the parent
    // array when adding a new value to the metadata array. Later modification
    // of the parent array will not affect the new array.
    if (
      !Object.prototype.hasOwnProperty.call(ctor, this.metadataKey) &&
      Reflect.has(ctor, this.metadataKey)
    ) {
      const parentMetadata = Reflect.get(ctor, this.metadataKey) as Set<V>;
      parentMetadata.forEach((value) => metadata.add(value));
    }

    Reflect.set(ctor, this.metadataKey, metadata);

    return metadata;
  }
  /**
   * Return the metadata set from a class or an instance constructor.
   *
   * If the metadata set is not defined, it will be initialized. If the metadata
   * set is already defined on a parent class, it will be copied to the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Metadata set.
   * @template T - Class instance type.
   */
  public getSet<T extends object>(arg: T | Constructor<T>): Set<V> {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata = Object.prototype.hasOwnProperty.call(
      ctor,
      this.metadataKey,
    )
      ? Reflect.get(ctor, this.metadataKey)
      : this.init(arg);

    return metadata;
  }
  /**
   * Add a new value to the metadata set on a class or an instance constructor.
   *
   * If the metadata set is not defined, it will be initialized. If the metadata
   * set is already defined on a parent class, it will be copied to the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param arg - Class constructor or an instance of a class.
   * @param value - Metadata value to store.
   * @template T - Class instance type.
   */
  public add<T extends object>(arg: T | Constructor<T>, value: V): void {
    const metadata = this.getSet(arg);
    metadata.add(value);
  }
  /**
   * Check if the metadata is set on a class or an instance constructor.
   *
   * If the metadata set is not defined, it will be initialized. If the metadata
   * set is already defined on a parent class, it will be copied to the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param arg - Class constructor or an instance of a class.
   * @param value - Metadata value to check.
   * @returns `true` if the metadata is set, `false` otherwise.
   * @template T - Class instance type.
   */
  public has<T extends object>(arg: T | Constructor<T>, value: V): boolean {
    const metadata = this.getSet(arg);
    return metadata.has(value);
  }
  /**
   * Delete the metadata value from the set on a class or an instance constructor.
   *
   * If the metadata set is not defined, it will be initialized. If the metadata
   * set is already defined on a parent class, it will be copied to the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param instance - Class instance or an instance of a class.
   * @param value - Metadata value to delete.
   * @returns `true` if the metadata was deleted, `false` otherwise.
   * @template T - Class instance type.
   */
  public delete<T extends object>(arg: T | Constructor<T>, value: V): boolean {
    const metadata = this.getSet(arg);
    return metadata.delete(value);
  }
  /**
   * Clear the metadata set on a class or an instance constructor.
   *
   * If the metadata set is not defined, it will be initialized. If the metadata
   * set is already defined on a parent class, it will be copied to the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param arg - Class constructor or an instance of a class.
   * @template T - Class instance type.
   */
  public clear<T extends object>(arg: T | Constructor<T>): void {
    const metadata = this.getSet(arg);
    metadata.clear();
  }
  /**
   * Get the size of the metadata set on a class or an instance constructor.
   *
   * If the metadata set is not defined, it will be initialized. If the metadata
   * set is already defined on a parent class, it will be copied to the new set.
   * Later modification of the parent set will not affect the new set.
   *
   * @param arg - Class constructor or an instance of a class.
   * @returns Size of the metadata set.
   * @template T - Class instance type.
   */
  public getSize<T extends object>(arg: T | Constructor<T>): number {
    const metadata = this.getSet(arg);
    return metadata.size;
  }
}
