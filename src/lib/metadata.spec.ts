import { Metadata } from './metadata';

describe('(Unit) Metadata', () => {
  describe('#constructor() - initialization', () => {
    it('should create an instance of Metadata', () => {
      // Arrange
      // Act
      const testMetadata = new Metadata<string>('test:testMetadata');
      // Assert
      expect(testMetadata).toBeInstanceOf(Metadata);
    });

    it('should accept a metadata key as a string', () => {
      // Arrange
      // Act
      const testMetadata = new Metadata<string>('test:testMetadata');
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });

    it('should accept a metadata key as a symbol', () => {
      // Arrange
      // Act
      const testMetadata = new Metadata<string>(Symbol('test:testMetadata'));
      // Assert
      expect(typeof testMetadata.metadataKey).toBe('symbol');
    });

    it('should not collide if two metadata uses same string as a key', () => {
      // Arrange
      // Act
      const testMetadata1 = new Metadata<string>('test:testMetadata');
      const testMetadata2 = new Metadata<string>('test:testMetadata');
      // Assert
      expect(testMetadata1.metadataKey).not.toBe(testMetadata2.metadataKey);
    });

    it('should use the metadata in a class decorator', () => {
      // Arrange
      const myMetadata = new Metadata<string>('test:myMetadata');
      const MyDecorator = (value: string): ClassDecorator => {
        return (target) => {
          myMetadata.set(target, value);
        };
      };
      // Act
      @MyDecorator('testValue')
      class TestClass {}

      const metadata = myMetadata.get(TestClass);
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should use the metadata in a property decorator', () => {
      // Arrange
      const myPropMetadata = new Metadata<string>('test:myPropMetadata');
      const MyDecorator = (value: string): PropertyDecorator => {
        return (target) => {
          myPropMetadata.set(target, value);
        };
      };

      class TestClass {
        @MyDecorator('testValue')
        testProp?: string;
      }

      // Act
      const metadata = myPropMetadata.get(TestClass);
      // Assert
      expect(metadata).toBe('testValue');
    });
  });
  describe('#set() - value setting', () => {
    it('should set a metadata on a class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'testValue');
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should set a metadata on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, 'testValue');
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should set a metadata on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, 'testValue');
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should override a metadata on child instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      const childInstance = new ChildClass();
      // Act
      testMetadata.set(ParentClass, 'testValue');
      testMetadata.set(ChildClass, 'testValueChild');
      const metadata = testMetadata.get(childInstance);
      // Assert
      expect(metadata).toBe('testValueChild');
    });

    it('should override a metadata on child class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'testValue');
      testMetadata.set(ChildClass, 'testValueChild');
      const metadata = testMetadata.get(ChildClass);
      // Assert
      expect(metadata).toBe('testValueChild');
    });
  });

  describe('#get() - value getting', () => {
    it('should return undefined if no metadata is set on a class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should return undefined if no metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should get a metadata on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(TestClass, 'testValue');
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should read a metadata from parent class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      // Act
      testMetadata.set(ParentClass, 'testValue');
      const metadata = testMetadata.get(ChildClass);
      // Assert
      expect(metadata).toBe('testValue');
    });

    it('should read a metadata from parent instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class ParentClass {}
      class ChildClass extends ParentClass {}
      const childInstance = new ChildClass();
      // Act
      testMetadata.set(ParentClass, 'testValue');
      const metadata = testMetadata.get(childInstance);
      // Assert
      expect(metadata).toBe('testValue');
    });
  });

  describe('#has() - value checking', () => {
    it('should return false if no metadata is set on a class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const hasMetadata = testMetadata.has(TestClass);
      // Assert
      expect(hasMetadata).toBe(false);
    });

    it('should return false if no metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const hasMetadata = testMetadata.has(testInstance);
      // Assert
      expect(hasMetadata).toBe(false);
    });

    it('should return true if metadata is set on a class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'testValue');
      const hasMetadata = testMetadata.has(TestClass);
      // Assert
      expect(hasMetadata).toBe(true);
    });

    it('should return true if metadata is set on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, 'testValue');
      const hasMetadata = testMetadata.has(testInstance);
      // Assert
      expect(hasMetadata).toBe(true);
    });
  });

  describe('#delete() - value deleting', () => {
    it('should delete a metadata on a class', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'testValue');
      testMetadata.delete(TestClass);
      const metadata = testMetadata.get(TestClass);
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should delete a metadata on an instance', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, 'testValue');
      testMetadata.delete(testInstance);
      const metadata = testMetadata.get(testInstance);
      // Assert
      expect(metadata).toBeUndefined();
    });

    it('should return true if metadata was deleted', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      testMetadata.set(TestClass, 'testValue');
      const wasDeleted = testMetadata.delete(TestClass);
      // Assert
      expect(wasDeleted).toBe(true);
    });

    it('should return false if metadata was not deleted', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      // Act
      const wasDeleted = testMetadata.delete(TestClass);
      // Assert
      expect(wasDeleted).toBe(false);
    });

    it('should return true if metadata on instance was deleted', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      testMetadata.set(testInstance, 'testValue');
      const wasDeleted = testMetadata.delete(testInstance);
      // Assert
      expect(wasDeleted).toBe(true);
    });

    it('should return false if metadata on instance was not deleted', () => {
      // Arrange
      const testMetadata = new Metadata<string>('test:testMetadata');
      class TestClass {}
      const testInstance = new TestClass();
      // Act
      const wasDeleted = testMetadata.delete(testInstance);
      // Assert
      expect(wasDeleted).toBe(false);
    });
  });
});
