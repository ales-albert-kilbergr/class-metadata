# Metadata

A helper class to define and manage metadata on classes and constructors. The
library provides some cases of metadata such as maps, arrays and sets. They
deal with a unique metadata key to prevent collisions and with the inheritance
of metadata.

The metadata library will be mostly used for defining custom classes or property
decorators.

The package supports **ES6** and **CommonJS** module systems.

## Importing

```ts
import { Metadata } from '@kilbergr/metadata';
```

## Usage

### Metadata

Simple metadata allows to definition of any kind of value on a class or
constructor under a given key. (The key will always be unique. If a string is
provided, it will be converted to a symbol.) This metadata type does not support
inheritance. This means that if a parent class defines the same metadata it
will be available to the child class. If the metadata is some kind of a structure
it will be shared between the parent and child classes. For this reason,
the `Metadata` class is recommended for primitive values or structures which
are meant to be immutable. Check the `MapMetadata`, `ArrayMetadata`
and `SetMetadata` classes for mutable structured metadata.

```ts
const myMetadata = new Metadata<string>('myMetadata:myKey');
class MyClass {}

myMetadata.define(MyClass, 'myValue');

console.log(myMetadata.get(MyClass)); // 'myValue'
```

The metadata can be used to build a class decorator. The following example
defines a string metadata but it can be any kind of value.

```ts
// my-decorator.ts
const metadata = new Metadata<string>('myMetadata:myKey');

export function MyDecorator(value: string) {
  return function (target: Function) {
    myMetadata.define(target, value);
  };
}
MyDecorator.metadata = metadata;

// my-class.ts
@MyDecorator('myValue')
class MyClass {}

console.log(MyDecorator.metadata.get(MyClass)); // 'myValue'
```

### MapMetadata

The `MapMetadata` class allows to define of a map of metadata on a class or
constructor under a given key. The key will always be unique. If a string is
provided, it will be converted to a symbol. This metadata type supports
inheritance. This means that if a parent class defines the same metadata it
will be copied over to the child class. (Changes made to the parent after
the initialization of child metadata will not be reflected in the child.) The
`MapMetadata` class is recommended for mutable structured metadata such as
a list of property decorators.

```ts
// my-property.decorator.ts
const metadata = new MapMetadata<string, unknown>('myMapMetadata:myKey');

export function MyPropertyDecorator(value: string) {
  return function (target: any, propertyKey: string) {
    metadata.define(target.constructor, propertyKey, value);
  };
}

MyPropertyDecorator.metadata = metadata;

// my-class.ts
class MyClass {
  @MyPropertyDecorator('myValue')
  public myProperty: string;

  @MyPropertyDecorator('myOtherValue')
  public myOtherProperty: string;
}

console.log(MyPropertyDecorator.metadata.get(MyClass, 'myProperty')); // 'myValue'
console.log(MyPropertyDecorator.metadata.get(MyClass, 'myOtherProperty')); // 'myOtherValue'
```

### SetMetadata

The `SetMetadata` class allows to define of a set of metadata on a class or
constructor under a given key. The key will always be unique. If a string is
provided, it will be converted to a symbol. This metadata type supports
inheritance. This means that if a parent class defines the same metadata it
will be copied over to the child class. (Changes made to the parent after
the initialization of child metadata will not be reflected in the child.) The
`SetMetadata` class is recommended for mutable structured metadata such as
an array of some sort of handler.

```ts
// my-disposable.decorator.ts
const metadata = new SetMetadata<Function>('mySetMetadata:myKey');

export function Disposable(target: any, propertyKey: string) {
  metadata.add(target, target[propertyKey]);
}

Disposable.metadata = metadata;

// my-class.ts
class MyParentClass {
  @Disposable
  public disposeParent() {
    console.log('Disposed Parent');
  }
}

class MyClass extends MyParentClass {
  @Disposable
  public disposeChild() {
    console.log('Disposed Child');
  }

  @Disposable
  public disposeOther() {
    console.log('Disposed other');
  }

  public dispose() {
    Disposable.metadata.forEach(this, (fn) => fn());
  }
}
// Dispose all functions
new MyClass().dispose(); // 'Disposed Parent', 'Disposed Child', 'Disposed other'
```

### ArrayMetadata

The `ArrayMetadata` class allows to define of an array of metadata on a class or
constructor under a given key. The key will always be unique. If a string is
provided, it will be converted to a symbol. This metadata type supports inheritance.

The usage is similar to the `SetMetadata` class but it allows to store the same
value multiple times.

## Development
