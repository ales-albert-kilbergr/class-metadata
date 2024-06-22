import { MapMetadata } from './map-metadata';

describe('(Unit) MapMetadata', () => {
  describe('#constructor() - initialization', () => {
    it('should create an instance of MapMetadata', () => {
      // Arrange
      // Act
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      // Assert
      expect(testMetadata).toBeInstanceOf(MapMetadata);
    });

    it('should accept a metadata key as a string', () => {
      // Arrange
      // Act
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });

    it('should accept a metadata key as a symbol', () => {
      // Arrange
      // Act
      const testMetadata = new MapMetadata<string, string>(
        Symbol('test:testMetadata'),
      );
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });
  });

  describe('#init() - metadata initialization', () => {
    it('should initialize empty map on first access and persist it', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      const metadata = testMetadata.getMap(TestClass);
      metadata.set('key', 'testValue');
      const metadata2 = testMetadata.getMap(TestClass);
      // Assert
      expect(metadata2.get('key')).toBe('testValue');
    });

    it('should inherit a metadata from parent class if set before initialization', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.init(ParentClass);
      testMetadata.set(ParentClass, 'key', 'testValue');
      const value = testMetadata.get(ChildClass, 'key');
      // Assert
      expect(value).toBe('testValue');
    });

    it('should not affect child metadata if set after initialization', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.init(ParentClass);
      testMetadata.set(ParentClass, 'keyOne', 'test');
      testMetadata.init(ChildClass);
      testMetadata.set(ParentClass, 'keyTwo', 'parentValue');

      const hasKeyOne = testMetadata.has(ChildClass, 'keyOne');
      const hasKeyTwo = testMetadata.has(ChildClass, 'keyTwo');
      // Assert
      expect(hasKeyOne).toBeTruthy();
      expect(hasKeyTwo).toBeFalsy();
    });
  });

  describe('#getMap() - value getting', () => {
    it('should get a metadata on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      const metadata = testMetadata.getMap(TestClass);
      // Assert
      expect(metadata.get('key')).toBe('testValue');
    });

    it('should get a metadata on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      const metadata = testMetadata.getMap(testInstance);
      // Assert
      expect(metadata.get('key')).toBe('testValue');
    });

    it('should inherit a metadata from parent class if set before initialization', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      const metadata = testMetadata.getMap(ChildClass);
      // Assert
      expect(metadata.get('key')).toBe('testValue');
    });
  });

  describe('#get() - value getting', () => {
    it('should return undefined if no metadata under given key is set on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      const metadata = testMetadata.get(TestClass, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should return undefined if no metadata under given key is set on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const metadata = testMetadata.get(testInstance, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should get a metadata on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      const metadata = testMetadata.get(TestClass, 'key');
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should get a metadata on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      const metadata = testMetadata.get(testInstance, 'key');
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should read a metadata from parent class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      const metadata = testMetadata.get(ChildClass, 'key');
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should read a parent metadata from child instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      const childInstance = new ChildClass();
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      const metadata = testMetadata.get(childInstance, 'key');
      // Assert
      expect(metadata).toBe('testValue');
    });
  });

  describe('#set() - metadata setting', () => {
    it('should set a metadata on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      const metadata = testMetadata.get(TestClass, 'key');
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should set a metadata on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, 'key', 'testValue');
      const metadata = testMetadata.get(testInstance, 'key');
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should not affect parent metadata when setting child metadata', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      testMetadata.set(ChildClass, 'key', 'testValueChild');
      const metadata = testMetadata.get(ChildClass, 'key');
      // Assert
      expect(metadata).toBe('testValueChild');
    });

    it('should not add new key to parent metadata when setting child metadata', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ChildClass, 'key', 'testValueChild');
      const metadata = testMetadata.get(ParentClass, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });
  });

  describe('#has() - metadata checking', () => {
    it('should return false if no metadata under given key is set on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      const hasMetadata = testMetadata.has(TestClass, 'key');
      // Assert
      expect(hasMetadata).toBeFalsy();
    });

    it('should return false if no metadata under given key is set on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const hasMetadata = testMetadata.has(testInstance, 'key');
      // Assert
      expect(hasMetadata).toBeFalsy();
    });

    it('should return true if metadata under given key is set on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      const hasMetadata = testMetadata.has(TestClass, 'key');
      // Assert
      expect(hasMetadata).toBeTruthy();
    });
  });

  describe('#delete() - metadata deletion', () => {
    it('should delete a metadata on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      testMetadata.delete(TestClass, 'key');
      const metadata = testMetadata.get(TestClass, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should delete a metadata on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      testMetadata.delete(testInstance, 'key');
      const metadata = testMetadata.get(testInstance, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should not affect parent metadata when deleting child metadata', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      testMetadata.set(ChildClass, 'key', 'testValueChild');
      testMetadata.delete(ChildClass, 'key');
      const parentMetadata = testMetadata.get(ParentClass, 'key');
      // Assert
      expect(parentMetadata).toBe('testValue');
    });

    it('should not delete parent metadata when deleting child metadata', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      testMetadata.delete(ChildClass, 'key');
      const parentMetadata = testMetadata.get(ParentClass, 'key');
      // Assert
      expect(parentMetadata).toBe('testValue');
    });
  });

  describe('#clear() - metadata clearing', () => {
    it('should clear metadata on a class', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      testMetadata.clear(TestClass);
      const metadata = testMetadata.get(TestClass, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should clear metadata on an instance', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(TestClass, 'key', 'testValue');
      testMetadata.clear(testInstance);
      const metadata = testMetadata.get(testInstance, 'key');
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should not affect parent metadata when clearing child metadata', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      testMetadata.set(ChildClass, 'key', 'testValueChild');
      testMetadata.clear(ChildClass);
      const parentMetadata = testMetadata.get(ParentClass, 'key');
      // Assert
      expect(parentMetadata).toBe('testValue');
    });

    it('should not clear parent metadata when clearing child metadata', () => {
      // Arrange
      const testMetadata = new MapMetadata<string, string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'key', 'testValue');
      testMetadata.clear(ChildClass);
      const parentMetadata = testMetadata.get(ParentClass, 'key');
      // Assert
      expect(parentMetadata).toBe('testValue');
    });
  });
});
