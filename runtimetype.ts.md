[back](README.md)

# runtimetype

- [runtimetype](#runtimetype)
  - [Creating a runtimetype](#creating-a-runtimetype)
  - [Methods](#methods)
      - [cast](#cast)
      - [getunderlyingvalue](#getunderlyingvalue)
      - [isvalid](#isvalid)
      - [isnotvalid](#isnotvalid)
      - [maybe](#maybe)
      - [option](#option)
      - [result](#result)
      - [typeof](#typeof)
  - [isruntimeType typeguard](#isruntimetype-typeguard)
  - [deriving types from another](#deriving-types-from-another)

## Creating a runtimetype

```ts
import { runtimetype } from 'https://deno.land/x/deenvo';

runtimetype('isnumeric', value => typeof value === 'number');
```

## Methods

Maybe implements methods from

- [IAssertable](IAssertable.ts.md)
- [IImmediateComparisonConditional](IConditional.ts.md)
- [IUnwrappable](IUnwrappable.ts.md)

It also has it's own methods:

#### cast

Casts a type `T` to a type `U` and returns the cast operation as a `Result<RuntimeTypeLike<U>>`

#### getunderlyingvalue

Returns the underlying value as `unknown`. It may be not a valid type

#### isvalid

Returns true if `T` is a valid type, otherwise `false`

#### isnotvalid

Returns false if `T` is a valid type, otherwise `true`

#### maybe

Returns `Just<T>` if `T` is a valid type, otherwise returns `Nothing`

#### option

Returns `Option<T>` if `T` is a valid type, otherwise returns `None`

#### result

Returns `Ok<T>` if `T` is a valid type, otherwise returns `Err`

#### typeof

Returns underlying type name

## isruntimeType typeguard

```ts
import { isruntimeType, runtimetype } from 'https://deno.land/x/deenvo';

isruntimeType(10)                             // false
isruntimeType(runtimetype('yup', () => true)) // true
```

## deriving types from another

You can derive a type from another, inheriting the parent's typechecker function

```ts
import { runtimetype } from 'https://deno.land/x/deenvo';

const numeric = runtimetype<number>('numeric', arg => typeof arg === 'number');

// specifing the name, will cause the underlying type name to be
// [childtypename]_[parenttypename]
const positivenumber = numeric.derive('positive', arg => arg >= 0);             // typename is positive_numeric
const finitepositive = positivenumber.derive('finite', arg => arg < Infinity);  // typename is finite_positive_numeric
```