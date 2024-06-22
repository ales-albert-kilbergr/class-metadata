import { ArrayMetadata } from './array-metadata';

describe('(Unit) ArrayMetadata', () => {
  describe('#constructor() - initialization', () => {
    it('should create an instance of ArrayMetadata', () => {
      // Arrange
      // Act
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      // Assert
      expect(testMetadata).toBeInstanceOf(ArrayMetadata);
    });

    it('should accept a metadata key as a string', () => {
      // Arrange
      // Act
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });

    it('should accept a metadata key as a symbol', () => {
      // Arrange
      // Act
      const testMetadata = new ArrayMetadata<string>(
        Symbol('test:testMetadata'),
      );
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });
  });

  describe('#init() - metadata initialization', () => {
    it('should initialize empty array on first access and persist it', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const metadata = testMetadata.get(TestClass);
      metadata.push('testValue');
      const metadata2 = testMetadata.get(TestClass);
      // Assert
      expect(metadata2).toEqual(['testValue']);
    });

    it('should inherit a metadata from parent class if set before initialization', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, ['testValue']);
      const metadata = testMetadata.get(ChildClass);
      // Assert
      expect(metadata).toEqual(['testValue']);
    });

    it('should not affect child metadata if set after initialization', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.init(ChildClass);
      testMetadata.set(ParentClass, ['testValue']);
      const metadata = testMetadata.get(ChildClass);
      // Assert
      expect(metadata).toEqual([]);
    });
  });

  describe('#get() - metadata retrieval', () => {
    it('should return an empty array if no metadata is set on a class', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toEqual([]);
    });

    it('should return an empty array if no metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toEqual([]);
    });

    it('should get a metadata on an instance', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(TestClass, ['testValue']);
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toEqual(['testValue']);
    });

    it('should get a copy of the metadata from the parent class', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, ['testValue']);
      const childMetadata = testMetadata.get(ChildClass);
      const parentMetadata = testMetadata.get(ParentClass);
      // Assert
      expect(childMetadata).toEqual(parentMetadata);
      expect(childMetadata).toEqual(['testValue']);
      expect(parentMetadata).not.toBe(childMetadata);
    });

    it('should not reflect changes in parent metadata', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, ['testValue']);
      const childMetadata = testMetadata.get(ChildClass);
      testMetadata.add(ChildClass, 'testValue2');
      const parentMetadata = testMetadata.get(ParentClass);
      // Assert
      expect(childMetadata).toEqual(['testValue', 'testValue2']);
      expect(parentMetadata).toEqual(['testValue']);
    });
  });

  describe('#set() - metadata setting', () => {
    it('should set a metadata on a class', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, ['testValue']);
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toEqual(['testValue']);
    });

    it('should set a metadata on an instance', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, ['testValue']);
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toEqual(['testValue']);
    });

    it('should not affect parent metadata when setting child metadata', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, ['testValue']);
      testMetadata.set(ChildClass, ['testValueChild']);
      const parentMetadata = testMetadata.get(ParentClass);
      // Assert
      expect(parentMetadata).toEqual(['testValue']);
    });
  });

  describe('#add() - metadata extending', () => {
    it('should add multiple metadata entries', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.add(TestClass, 'testValue2');
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toEqual(['testValue', 'testValue2']);
    });

    it('should add multiple metadata entries to an instance', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.add(testInstance, 'testValue');
      testMetadata.add(testInstance, 'testValue2');
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toEqual(['testValue', 'testValue2']);
    });

    it('should add multiple metadata entries in one call', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue', 'testValue2');
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toEqual(['testValue', 'testValue2']);
    });
  });

  describe('#getSize() - metadata size', () => {
    it('should return 0 if no metadata is set', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const size = testMetadata.getSize(TestClass);
      // Assert
      expect(size).toBe(0);
    });

    it('should return the size of the metadata array', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.add(TestClass, 'testValue2');
      const size = testMetadata.getSize(TestClass);

      // Assert
      expect(size).toBe(2);
    });
  });

  describe('#clear() - metadata clearing', () => {
    it('should clear metadata on a class', () => {
      // Arrange
      const testMetadata = new ArrayMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      const metadataBefore = testMetadata.get(TestClass);
      testMetadata.clear(TestClass);
      const metadataAfter = testMetadata.get(TestClass);
      // Assert
      expect(metadataBefore).toEqual(['testValue']);
      expect(metadataAfter).toEqual([]);
    });
  });
});
