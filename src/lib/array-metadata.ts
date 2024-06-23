/**
 * Helper class to store metadata in an array.
 * The metadata can be stored on a class or an instance of a class.
 *
 * @typeParam V - Type of the metadata value.
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
   * Initialize an empty metadata array on an instance.
   *
   * @param instance - Instance of a class. The method will look for the
   *  metadata on the instance's constructor or any parent class.
   * @returns Initialized metadata array.
   */
  public init<TInstance extends object>(instance: TInstance): V[];
  /**
   * Initialize an empty metadata array on a class.
   *
   * @param ctor - Class constructor. The method will look for the metadata
   *  on the class itself or any parent class.
   * @returns Initialized metadata array.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public init<TFunction extends Function>(ctor: TFunction): V[];
  /**
   * Initialize an empty metadata array on a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Initialized metadata array.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public init<ARG extends Function | object>(arg: ARG): V[] {
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
   * Get the metadata array from an instance. If no metadata is set, an empty
   * array will be initialized and persisted. It is safe to call "push" on the
   * returned array. (It will actually add the value to the metadata array.)
   *
   * @param instance - Instance of a class. The method will look for the
   *  metadata on the instance's constructor or any parent class.
   * @returns Metadata array.
   */
  public get<TInstance extends object>(instance: TInstance): V[];
  /**
   * Get the metadata array from a class. If no metadata is set, an empty
   * array will be initialized and persisted. It is safe to call "push" on the
   * returned array. (It will actually add the value to the metadata array.)
   *
   * @param ctor - Class constructor. The method will look for the metadata
   *  on the class itself or any parent class.
   * @returns Metadata array.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public get<TFunction extends Function>(ctor: TFunction): V[];
  /**
   * Get the metadata array from a class or an instance. If no metadata is set,
   * an empty array will be initialized and persisted. It is safe to call "push"
   * on the returned array. (It will actually add the value to the metadata array.)
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Metadata array.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public get<ARG extends Function | object>(arg: ARG): V[] {
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
   * Set a new metadata array on an instance. If the metadata array already
   * exists, it will be overwritten with the new value.
   *
   * @param instance - Instance of a class. The metadata will be stored on the
   *   instance's constructor.
   * @param value - Metadata array to store.
   */
  public set<TInstance extends object>(instance: TInstance, value: V[]): void;
  /**
   * Set a new metadata array on a class. If the metadata array already exists,
   * it will be overwritten with the new value.
   *
   * @param ctor - Class constructor. The metadata will be stored on the class
   *  itself.
   * @param value - Metadata array to store.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public set<TFunction extends Function>(ctor: TFunction, value: V[]): void;
  /**
   * Set a new metadata array on a class or an instance. If the metadata array
   * already exists, it will be overwritten with the new value.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *   be stored on the class itself or the instance's constructor.
   * @param value - Metadata array to store.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public set<ARG extends Function | object>(arg: ARG, value: V[]): void {
    const ctor = arg instanceof Function ? arg : arg.constructor;

    Reflect.set(ctor, this.metadataKey, value);
  }
  /**
   * Add a new value to the metadata array on an instance. If the metadata array
   * exists somewhere on the prototype chain, a new array will be created and
   * stored on the instance's constructor and the values from the parent array
   * will be copied to the new array. The new value will be added to the new array.
   * The parent array will not be modified.
   *
   * @param instance - Instance of a class. The metadata will be stored on the
   *  instance's constructor.
   * @param value - Metadata value to add.
   */
  public add<TInstance extends object>(
    instance: TInstance,
    ...value: V[]
  ): void;
  /**
   * Add a new value to the metadata array on a class. If the metadata array
   * exists somewhere on the prototype chain, a new array will be created and
   * stored on the class itself and the values from the parent array will be
   * copied to the new array. The new value will be added to the new array.
   * The parent array will not be modified.
   *
   * @param ctor - Class constructor. The metadata will be stored on the class
   *  itself.
   * @param value - Metadata value to add.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public add<TFunction extends Function>(ctor: TFunction, ...value: V[]): void;
  /**
   * Add a new value to the metadata array on a class or an instance. If the
   * metadata array exists somewhere on the prototype chain, a new array will
   * be created and stored on the class itself or the instance's constructor
   * and the values from the parent array will be copied to the new array.
   * The new value will be added to the new array. The parent array will not
   * be modified.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself or the instance's constructor.
   * @param value - Metadata value to add.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public add<ARG extends Function | object>(arg: ARG, ...values: V[]): void {
    const ctor = arg instanceof Function ? arg : arg.constructor;
    const metadata = this.get(ctor);
    metadata.push(...values);

    this.set(ctor, metadata);
  }
  /**
   * Get the size of the metadata array from an instance.
   *
   * @param instance - Instance of a class. The method will look for the
   *  metadata on the instance's constructor or any parent class.
   * @returns Size of the metadata array.
   */
  public getSize<TInstance extends object>(instance: TInstance): number;
  /**
   * Get the size of the metadata array from a class.
   *
   * @param ctor - Class constructor to get the metadata from.
   * @returns Size of the metadata array.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getSize<TFunction extends Function>(ctor: TFunction): number;
  /**
   * Get the size of the metadata array from a class or an instance.
   *
   * @param arg - Class constructor or an instance of a class. The method
   *  will look for the metadata on the class itself or any parent class.
   * @returns Size of the metadata array.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getSize<ARG extends Function | object>(arg: ARG): number {
    return this.get(arg).length;
  }
  /**
   * Clear the metadata array on an instance. If the metadata array exists
   * somewhere on the prototype chain, a new empty array will be created and
   * stored on the instance's constructor. The parent array will not be modified.
   * The method will not affect the metadata array on the parent class.
   *
   * @param instance - Instance of a class. The metadata will be stored on the
   *  instance's constructor.
   */
  public clear<TInstance extends object>(instance: TInstance): void;
  /**
   * Clear the metadata array on a class. If the metadata array exists somewhere
   * on the prototype chain, a new empty array will be created and stored on the
   * class itself. The parent array will not be modified. The method will not
   * affect the metadata array on the parent class.
   *
   * @param ctor - Class constructor. The metadata will be stored on the class
   *  itself.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public clear<TFunction extends Function>(ctor: TFunction): void;
  /**
   * Clear the metadata array on a class or an instance. If the metadata array
   * exists somewhere on the prototype chain, a new empty array will be created
   * and stored on the class itself or the instance's constructor. The parent
   * array will not be modified. The method will not affect the metadata array
   * on the parent class.
   *
   * @param arg - Class constructor or an instance of a class. The metadata will
   *  be stored on the class itself or the instance's constructor.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public clear<ARG extends Function | object>(arg: ARG): void {
    this.set(arg, []);
  }
}
