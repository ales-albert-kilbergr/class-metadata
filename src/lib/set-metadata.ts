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
   * @param ctor - Class constructor or an instance of a class.
   * @returns Metadata set.
   */
  public init<TInstance extends object>(ctor: TInstance): Set<V>;
  public init<TFunction extends Function>(ctor: TFunction): Set<V>;
  public init<ARG extends Function | object>(arg: ARG): Set<V> {
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

  public getSet<TInstance extends object>(instance: TInstance): Set<V>;
  public getSet<TFunction extends Function>(ctor: TFunction): Set<V>;
  public getSet<ARG extends Function | object>(arg: ARG): Set<V> {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata = Object.prototype.hasOwnProperty.call(
      ctor,
      this.metadataKey,
    )
      ? Reflect.get(ctor, this.metadataKey)
      : this.init(arg);

    return metadata;
  }

  public add<TInstance extends object>(instance: TInstance, value: V): void;
  public add<TFunction extends Function>(ctor: TFunction, value: V): void;
  public add<ARG extends Function | object>(arg: ARG, value: V): void {
    const metadata = this.getSet(arg);
    metadata.add(value);
  }

  public has<TInstance extends object>(instance: TInstance, value: V): boolean;
  public has<TFunction extends Function>(ctor: TFunction, value: V): boolean;
  public has<ARG extends Function | object>(arg: ARG, value: V): boolean {
    const metadata = this.getSet(arg);
    return metadata.has(value);
  }

  public delete<TInstance extends object>(
    instance: TInstance,
    value: V,
  ): boolean;
  public delete<TFunction extends Function>(ctor: TFunction, value: V): boolean;
  public delete<ARG extends Function | object>(arg: ARG, value: V): boolean {
    const metadata = this.getSet(arg);
    return metadata.delete(value);
  }

  public clear<TInstance extends object>(instance: TInstance): void;
  public clear<TFunction extends Function>(ctor: TFunction): void;
  public clear<ARG extends Function | object>(arg: ARG): void {
    const metadata = this.getSet(arg);
    metadata.clear();
  }

  public keys<TInstance extends object>(
    instance: TInstance,
  ): IterableIterator<V>;
  public keys<TFunction extends Function>(ctor: TFunction): IterableIterator<V>;
  public keys<ARG extends Function | object>(arg: ARG): IterableIterator<V> {
    const metadata = this.getSet(arg);
    return metadata.keys();
  }

  public values<TInstance extends object>(
    instance: TInstance,
  ): IterableIterator<V>;
  public values<TFunction extends Function>(
    ctor: TFunction,
  ): IterableIterator<V>;
  public values<ARG extends Function | object>(arg: ARG): IterableIterator<V> {
    const metadata = this.getSet(arg);
    return metadata.values();
  }

  public getSize<TInstance extends object>(instance: TInstance): number;
  public getSize<TFunction extends Function>(ctor: TFunction): number;
  public getSize<ARG extends Function | object>(arg: ARG): number {
    const metadata = this.getSet(arg);
    return metadata.size;
  }

  public entries<TInstance extends object>(
    instance: TInstance,
  ): IterableIterator<[V, V]>;
  public entries<TFunction extends Function>(
    ctor: TFunction,
  ): IterableIterator<[V, V]>;
  public entries<ARG extends Function | object>(
    arg: ARG,
  ): IterableIterator<[V, V]> {
    const metadata = this.getSet(arg);
    return metadata.entries();
  }
}
