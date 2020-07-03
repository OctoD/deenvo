[back](README.md)

# safe

- [safe](#safe)
  - [Using safe](#using-safe)

## Using safe

A functional approach to try/catch

```ts
import { safe, safeasync, none } from 'https://deno.land/x/deenvo';

// Executes a synchronous function FnTry, and returns a Result<T> where T is the ReturnType of that function 
safe(() => none().unwrap())       // Err();
safe(() => none().unwrapOr('10')) // Ok('10');

const apicall()

safeasync(window.fetch, 'nonexistingaddress') // Err('TypeError: Failed to fetch');
```

Note, passed functions are called with apply, so if you are passing a class method, you will have to bind it to it's owner.