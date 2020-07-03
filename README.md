# deenvo 🦕

Data structures and data types for Deno.

- [deenvo 🦕](#deenvo-)
  - [install](#install)
  - [docs](#docs)
  - [testing](#testing)
  - [contributing](#contributing)

## install

```ts
import { option } from 'https://deno.land/x/deenvo';

export interface IMyObject {
  name: string;
}

export default function myfunction(maybeobject?: IMyObject): string {
  return option(maybevalue).map(a => a.name).unwrapOr('invalid name');
}
```

## docs

Types

- [list](list.ts.md)
- [maybe](maybe.ts.md)
- [option](option.ts.md)
- [pushsub](pushsub.ts.md)
- [result](result.ts.md)
- [runtimetype](runtimetype.ts.md)
  - [wellknowntypes](runtimetypes.wellknown.ts.md)
- [safe](safe.ts.md)
- [tuple](tuple.ts.md)

Interfaces

- [IAssertable](IAssertable.ts.md)
- [IConditional](IConditional.ts.md)
- [IFilterable](IFilterable.ts.md)
- [IInsertable](IInsertable.ts.md)
- [IMappable](IMappable.ts.md)
- [IUnwrappable](IUnwrappable.ts.md)

## testing

Before testing, ensure to cache the assert modules

```bash
deno cache ./mod.test.ts
```

Then run the test suite

```bash
deno test ./mod.test.ts
```

## contributing

Every contribution is welcome, please feel free to open pull request or fill issues.