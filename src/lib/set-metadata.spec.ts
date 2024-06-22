import { SetMetadata } from './set-metadata';

describe('(Unit) SetMetadata', () => {
  describe('#constructor() - initialization', () => {
    it('should create an instance of SetMetadata', () => {
      // Arrange
      // Act
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      // Assert
      expect(testMetadata).toBeInstanceOf(SetMetadata);
    });

    it('should accept a metadata key as a string', () => {
      // Arrange
      // Act
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });

    it('should accept a metadata key as a symbol', () => {
      // Arrange
      // Act
      const testMetadata = new SetMetadata<string>(Symbol('test:testMetadata'));
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });
  });

  describe('#init() - metadata initialization', () => {
    it('should initialize empty set on first access and persist it', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const metadata = testMetadata.getSet(TestClass);
      metadata.add('testValue');
      const metadata2 = testMetadata.getSet(TestClass);
      // Assert
      expect(metadata2).toEqual(new Set(['testValue']));
    });

    it('should inherit a metadata from parent class if set before initialization', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.init(ParentClass).add('testValue');
      const metadata = testMetadata.getSet(ChildClass);
      // Assert
      expect(metadata).toEqual(new Set(['testValue']));
    });

    it('should not affect child metadata if set after initialization', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.init(ParentClass).add('testValue');
      testMetadata.init(ChildClass).add('childValue');
      testMetadata.add(ParentClass, 'parentValue');
      const childMetadata = testMetadata.getSet(ChildClass);
      // Assert
      expect(childMetadata.has('testValue')).toBeTruthy();
      expect(childMetadata.has('childValue')).toBeTruthy();
      expect(childMetadata.has('parentValue')).toBeFalsy();
    });
  });

  describe('#add() - value adding', () => {
    it('should add a metadata on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      const metadata = testMetadata.getSet(TestClass);
      // Assert
      expect(metadata.has('testValue')).toBe(true);
    });

    it('should add a metadata on an instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.add(testInstance, 'testValue');
      const metadata = testMetadata.getSet(testInstance);
      // Assert
      expect(metadata.has('testValue')).toBe(true);
    });

    it('should add a metadata to an existing set', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.add(TestClass, 'testValue2');
      const metadata = testMetadata.getSet(TestClass);
      // Assert
      expect(metadata.has('testValue')).toBe(true);
      expect(metadata.has('testValue2')).toBe(true);
    });

    it('should not add duplicate metadata', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.add(TestClass, 'testValue');
      const metadata = testMetadata.getSet(TestClass);
      // Assert
      expect(metadata.size).toBe(1);
    });

    it('should add metadata to a parent class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.add(ParentClass, 'testValue');
      const metadata = testMetadata.getSet(ChildClass);
      // Assert
      expect(metadata.has('testValue')).toBe(true);
    });

    it('should add metadata to a parent instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      const childInstance = new ChildClass();
      // Act
      testMetadata.add(ParentClass, 'testValue');
      const metadata = testMetadata.getSet(childInstance);
      // Assert
      expect(metadata.has('testValue')).toBe(true);
    });

    it('should not affect parent metadata', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.add(ParentClass, 'testValue');
      testMetadata.add(ChildClass, 'childValue');
      const parentMetadata = testMetadata.getSet(ParentClass);
      // Assert
      expect(parentMetadata.has('testValue')).toBe(true);
      expect(parentMetadata.has('childValue')).toBe(false);
    });
  });

  describe('#has() - value checking', () => {
    it('should return false if no metadata is set on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const hasMetadata = testMetadata.has(TestClass, 'testValue');
      // Assert
      expect(hasMetadata).toBe(false);
    });

    it('should return false if no metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const hasMetadata = testMetadata.has(testInstance, 'testValue');
      // Assert
      expect(hasMetadata).toBe(false);
    });

    it('should return true if metadata is set on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      const hasMetadata = testMetadata.has(TestClass, 'testValue');
      // Assert
      expect(hasMetadata).toBe(true);
    });

    it('should return true if metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.add(testInstance, 'testValue');
      const hasMetadata = testMetadata.has(testInstance, 'testValue');
      // Assert
      expect(hasMetadata).toBe(true);
    });

    it('should return false if metadata is not set', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      const hasMetadata = testMetadata.has(TestClass, 'testValue2');
      // Assert
      expect(hasMetadata).toBe(false);
    });
  });

  describe('#delete() - value deleting', () => {
    it('should delete a metadata on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.delete(TestClass, 'testValue');
      const metadata = testMetadata.getSet(TestClass);
      // Assert
      expect(metadata.has('testValue')).toBe(false);
    });

    it('should delete a metadata on an instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.add(testInstance, 'testValue');
      testMetadata.delete(testInstance, 'testValue');
      const metadata = testMetadata.getSet(testInstance);
      // Assert
      expect(metadata.has('testValue')).toBe(false);
    });

    it('should return true if metadata was deleted', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      const wasDeleted = testMetadata.delete(TestClass, 'testValue');
      // Assert
      expect(wasDeleted).toBe(true);
    });

    it('should return false if metadata was not deleted', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      const wasDeleted = testMetadata.delete(TestClass, 'testValue2');
      // Assert
      expect(wasDeleted).toBe(false);
    });
  });

  describe('#clear() - metadata clearing', () => {
    it('should clear metadata on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.clear(TestClass);
      const metadata = testMetadata.getSet(TestClass);
      // Assert
      expect(metadata.size).toBe(0);
    });

    it('should clear metadata on an instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.add(testInstance, 'testValue');
      testMetadata.clear(testInstance);
      const metadata = testMetadata.getSet(testInstance);
      // Assert
      expect(metadata.size).toBe(0);
    });
  });

  describe('#getSize() - metadata size', () => {
    it('should return 0 if no metadata is set on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const size = testMetadata.getSize(TestClass);
      // Assert
      expect(size).toBe(0);
    });

    it('should return the size of the metadata set on a class', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.add(TestClass, 'testValue');
      testMetadata.add(TestClass, 'testValue2');
      const size = testMetadata.getSize(TestClass);
      // Assert
      expect(size).toBe(2);
    });

    it('should return 0 if no metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new SetMetadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const size = testMetadata.getSize(testInstance);
      // Assert
      expect(size).toBe(0);
    });
  });
});
