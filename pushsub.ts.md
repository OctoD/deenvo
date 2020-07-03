[back](README.md)

# pushsub

- [pushsub](#pushsub)
  - [Creating a pushsub type](#creating-a-pushsub-type)
  - [methods](#methods)
      - [notify](#notify)
      - [subscribe](#subscribe)

## Creating a pushsub type

```ts
import { pushsub } from 'https://deno.land/x/deenvo';

pushsub<(arg: number) => any>();
```

## methods

#### notify

Notifies subscribed functions `Fn`

#### subscribe

Subscribes a function `Fn`. Returns an unsubscriber function.

