[back](README.md)

# wellknown runtime types

- [wellknown runtime types](#wellknown-runtime-types)
  - [Using wellknown types](#using-wellknown-types)
  - [list of types](#list-of-types)
      - [any](#any)
      - [array](#array)
      - [bigint](#bigint)
      - [binaryfn](#binaryfn)
      - [boolean](#boolean)
      - [byte](#byte)
      - [char](#char)
      - [chararray](#chararray)
      - [defined](#defined)
      - [float](#float)
      - [floatarray](#floatarray)
      - [fn](#fn)
      - [struct](#struct)
      - [int](#int)
      - [intarray](#intarray)
      - [nullable](#nullable)
      - [object](#object)
      - [plainobject](#plainobject)
      - [string](#string)
      - [stringarray](#stringarray)
      - [ubigint](#ubigint)
      - [ufloat](#ufloat)
      - [ufloatarray](#ufloatarray)
      - [uint](#uint)
      - [uintarray](#uintarray)
      - [unaryfn](#unaryfn)

## Using wellknown types

```ts
import { types } from 'https://deno.land/x/deenvo';

types.int(10).isvalid();    // true   
types.uint(-10).isvalid();  // false
```

## list of types

#### any

Accepts any kind of data

#### array

Accepts any kind of array

#### bigint

Accepts only bigints

#### binaryfn

Derived from [fn](#fn)

Accepts only binary functions

#### boolean

Accepts only booleans

#### byte

Accepts only numbers between `-128` and `127`

#### char

Accepts only chars

#### chararray

Derived from [array](#array)

Accepts only arrays of [char](#char)

#### defined

Accepts only defined values (null is accepted)

#### float

Accepts only floats

#### floatarray

Derived from [array](#array)

Accepts only arrays of [float](#float)

#### fn

Accept any function

#### struct

Derived from [plainobject](#plainobject)

Is used to determine a complex data type.

```ts
import { types } from 'https://deno.land/x/deenvo';

const address = types.struct({
  buildingnumber: types.string,
  city: types.string,
  street: types.string,
  zipcode: types.uint,
});

const mycomplextype = types.struct({
  age: types.uint,
  name: types.string,
  surname: types.string,
  address,
});

mycomplextype({
  age: 40,
  name: 'John',
  surname: 'Doe',
  address: {
    buildingnumber: '12/A',
    city: 'Milan',
    street: 'Via col vento',
    zipcode: 12345,
  }
}).isvalid() // true
```

#### int

Accepts only ints

#### intarray

Derived from [array](#array)

Accepts only array of [int](#int)

#### nullable

Accepts any `typeof object`

#### object

Accepts any `typeof object` excepts `null` values

#### plainobject

Derived from [object](#object)

Accepts any plain object

#### string

Accepts any string

#### stringarray

Derived from [array](#array)

Accepts any array of [string](#string)

#### ubigint

Derived from [bigint](#bigint)

Accepts only unsigned bigints

#### ufloat

Derived from [float](#float)

Accepts only unsigned floats

#### ufloatarray

Derived from [array](#array)

Accepts only array of [ufloat](#ufloat)

#### uint

Derived from [int](#int)

Accepts only unsigned ints

#### uintarray

Derived from [array](#array)

Accepts only array of [uint](#uint)

#### unaryfn

Derived from [fn](#fn)

Accepts only unary functions

