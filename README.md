# Introduction

JavaScript is a single-threaded programming language.

Yet everything we do on the web tends to be blocking or time-consuming, which means that _asynchronous programming_ is an essential skill for any JavaScript developer.

The end goal of this repository is illustrate how to use the amazing syntactic sugar provided by `async`/`await`. But, but before we can get there, we really need to understand things from the ground up:

(a) starting with the browser or Node.js _event loop_,

(b) callbacks

(c) `Promise`s

(d) and then finally `async`/`await`

# 0. The Event Loop

In order to understand anything async, you really need to first understand the event loop.

(I'm going to give you the general overview, but I highly recommend you watch this talk from Jake
Archibald: (Jake Archibald: In The Loop - JSConf.Asia) on YouTube.)

So what is the event loop **and what does it have to do with `async`/`await`**?

Both the browser and Node.js are always running a single-threaded event loop to run your code.

On the first go around:

(a) it will run all of your synchronous code, but

(b) it might also queue up asynchronous events to be _called back_ later.

You say, "Here's a function that I need to run, but first I need to go get some data from the network." The event loop says, "Okay, I'll keep doing my thing, while you do your thing in a separate thread pool." Then, at some point in the future, `getData` will finish and let the event loop know that it's ready to be called back - now this is where things get interesting:

(a) if it's a macrotask (like a `setTimeout` or `setInterval`), it will be executed on the next
event loop, but

(b) if it's a micro-task (like a resolved `Promise`), then it will be called back before the start of the next event loop.

To witness the above-described nature of the event loop, you should issue:

```
$ node 0-event-loop.ts
```

So now that you know how the event loop works, we can start looking at `Promise`s.

# 1. How a `Promise`-based API might be consumed

`fetch` is a browser-based API, but it's also available on Node.js via the `node-fetch` library, and it allows us to hit an HTTP endpoint and have the response - or, to be precise, a `Promise` of the response! - returned to us.

Fetching data from a remote HTTP server is always going to be async, so let us give some examples of how one can do that.

1. Example of how to consume a `Promise`-based API

   (a) we can queue up a `Promise` that represents a request made to a remote HTTP server, then

   (b) provide it with a callback to map it to JSON.

   (c) Mapping to JSON is also a `Promise`, so we can return that `Promise` from the first `then` callback, and provide that `Promise` with its own `then` callback that will return a plain JavaScript object (matching the actual JSON data within the body of the response).

   To witness the above-described nature of the event loop, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 1-1-consume-promise-based-api.ts
   $ node 1-1-consume-promise-based-api.js
   ```

2. Example of how to consume a `Promise`-based API as well as how to handle errors

   One convenient aspect of using `Promise`s for asynchronous operations in our code is that we can catch all errors within our asynchronous code (= _anywhere_ within the chain of `then` callbacks) with a single function. (If we instead use callbacks for asynchronous operations in our code, you have to have a separate error handler for every single one of the asynchronous operations.)

   We can do this by appending `catch` to (the end of) the chain of `then` callbacks, and by providing an `(err) => { ... }` callback as input to the `catch` method. The provided `catch` callback will handle errors that happen anywhere within our asynchronous code (= _anywhere_ within the chain of `then` callbacks).

   So, if an error is thrown anywhere in our asynchronous code, it's going to bypass all of the subsequent `then` callbacks and go straight to the `catch` callback.

   To witness the above-described nature of the event loop, plus how to handle errors when consuming a `Promise`-based API, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 1-2-consume-promise-based-api-but-also-handle-error.ts
   $ node 1-2-consume-promise-based-api-but-also-handle-error.js
   ```

# 2. How to create a `Promise`

When you start creating `Promise`s, that's when you're more likely to screw things up.

1. Example of running an expensive operation on the main thread

   To witness that running an expensive operation on the main thread results in essentially freezing the execution, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 2-1-run-expensive-operation-on-main-thread.ts
   $ 2-1-run-expensive-operation-on-main-thread.js
   ```

2. Example of a subtly incorrect use of `Promise`s - wrapping the expensive operation in a `Promise` does not get an expensive operation off the main thread

   (a) we create a new `Promise`,

   (b) we perform our expensive operation _inside_ that `Promise`, and

   (c) we resolve the `Promise` to a suitable value.

   The problem with this approach is:

   - it performs _both_ the actual creation of the `Promise` _and_ the expensive operation on the main thread;
   - it's only the resolving of the value that happens as a micro-task.

   To witness that wrapping an expensive operation in a `Promise` still executes that operation on the main thread, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 2-2-fail-to-get-the-expensive-op-off-the-main-thread.ts
   $ node 2-2-fail-to-get-the-expensive-op-off-the-main-thread.js
   ```

3. Example of how to get an expensive operation off the main thread (and thus and execute it as a micro-task) with the help of a `Promise`

   By putting an expensive operation inside of a resolved `Promise`['s callback][?], we can be guaranteed that the expensive operation will be executed after all the synchronous code in the current macro-task has completed.

   To witness this, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 2-3-avoid-running-expensive-operation-on-main-thread.ts
   $ node 2-3-avoid-running-expensive-operation-on-main-thread.js
   ```

   [?]:

   - https://stackoverflow.com/questions/37977589/promise-resolve-with-no-argument-passed-in
   - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
   - https://appdividend.com/2019/01/03/javascript-promise-resolve-example-promise-resolve-tutorial/ >> "Difference between Promise.resolve() and new Promise()"
   - https://www.freecodecamp.org/news/javascript-promise-tutorial-how-to-resolve-or-reject-promises-in-js/ >> The Promise.resolve/reject methods

# 3. How to use the `async`/`await` syntax

Having understood the previous sections, you should be in the clear to use the `async`/`await` syntax responsibly.

We already know that
`Promise`s are a huge improvement over callbacks. But `Promise`s can still be
really hard to read and follow, especially when you have a long chain of
multiple asynchronous operations such as:

```
function promiseHell() {
  // Define `db` as an API to a database.
  let userId;
  let postId;

  db.then(u => {
    return db.user().then((v) => v.json());
  }).then(u => {
    const userId = u.id;
    return db.posts(userId).then((v) => v.json());
  }).then(p => {
    const postId = p.id;
    return db.comments(postId).then((v) => v.json());
  })
}
```

The `async`/`await` syntax really just boils down to syntactic sugar, which makes your asynchronous code read like synchronous code.

1. Example of using the `async` keyword when you define function (without using the `await` keyword in the function body)

   If you define a function, using the `async` keyword in the definition achieves the following effect: when the function is called, it will return a `Promise` of whatever value follows the executed `return` statement within the function body.

   To demonstrate this, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 3-1-use-async-only.ts
   $ node 3-1-use-async-only.js
   ```

2. Example of using both the `async` keyword and the `await` keyword when you define a function

   The previous example explained that using the `async` keyword when defining the function causes to return a `Promise`.

   But that's not everything that using `async` does - it also sets up a context for you to use the `await` keyword. Using the `await` keyword enables you to pause the execution of the function.

   When using `async` and `await` together, you should take care to avoid the following very common pitfall: failing to run your asynchronous code concurrently.

   To demonstrate how to use `async` and `await` together as well as to make explicit the nature of mentioned pitfall, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 3-2-use-async-and-await-but-fail-to-run-concurrently.ts
   $ node 3-2-use-async-and-await-but-fail-to-run-concurrently.js
   ```

# 4. How to use the `async`/`await` syntax, as well as to avoid the very common pitfall mentioned in the previous section

You really only need to `await` thing B _after_ thing A if the second value is dependent on the first value - for example, if you need to get a user ID before you can then retrieve some user-specific data from a database (or other persistent storage).

If your situation does not meet that criterion, then the whole point of the event loop is to avoid blocking code (like `await`ing the second asynchronous operation _after_ `await`ing the first one). We now know that an async function always returns a `Promise`, so instead of `await`ing a whole bunch of individual `Promise`s, we can:

1. add both (or several) of our `Promise`s to an array,
2. pass that array to `Promise.all`, and
3. `await` the `Promise.all` call;

this will tell all the `Promise`s in the array to run concurrently; `await`ing the `Promise.all` call itself will return an array; and each index of that array will be populated with the value resolved[/rejected][?] from the corresponding `Promise` in the input array.

To witness that this approach doubles the speed of the previous example, you should issue:

```
$ node_modules/typescript/bin/tsc 4-1-use-async-and-await-responsibly.ts
$ node 4-1-use-async-and-await-responsibly.js
```

This is something that you should always be thinking about when working with async functions: _you don't want to [accidentally] pause function unnecessarily_.

# 5. Error handling

Another nice benefit of the `async`/`await` syntax is error handling. Instead of
chaining a `catch` callback to our `Promise` chain, we can just wrap our code in a
`try`-`catch` block. This offers much better flexibility when handling errors that
might occur across multiple `Promise`s.

In the `catch` block, you can either throw another error, or return a value. Your decision here will dictate the control flow for the consumer of this `Promise`:

- if you throw an error inside of your `catch` block, it will break the consumer's `Promise` chain and be handled by their `catch` callback;

- if you return a value, it's basically like ignoring the error and then providing some replacement value, so the consumer of the `Promise` won't get an error but instead they'll get the result value inside of their `then` callback.

It would be instructive to compare this section's examples side-by-side (because they differ in only 1 instruction).

1. Example of error handling by throwing an error in your `catch` block

   To witness this approach, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 5-1-error-handling-by-throwing-another-error.ts
   $ node 5-1-error-handling-by-throwing-another-error.js
   ```

2. Example of error handling by returning a replacement value

   To witness this appraoch, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 5-2-error-handling-by-returning-a-replacement-value.ts
   $ node 5-2-error-handling-by-returning-a-replacement-value.js
   ```

---

The remainder of this section is optional, and applies only if you are using VS Code. An alternative way of running this section's examples is through VS Code.

- Firstly, issue

```
$ node_modules/typescript/bin/tsc 5-1-error-handling-by-throwing-another-error.ts
$ node_modules/typescript/bin/tsc 5-2-error-handling-by-returning-a-replacement-value.ts
```

- Next, click on the "Run" icon in VS Code's side panel.
- Then, select the "Launch 5-1" configuration or the "Launch 5-2" configuration from the dropdown menu.
- Finally, click on the "Start Debugging" icon (which looks like a green triangle).

# 6. Syntactic sugars

1. If you want to run a loop, have every iteration in that loop `await` a `Promise`, and do the `await`ing sequentially, you need to use a traditional `for` loop.

   To witness this approach, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 6-1-*.ts
   $ node 6-1-*.js
   ```

2. If you want to run a loop, have every iteration in that loop `await` a `Promise`, and do the `await`ing concurrently, you have 2 options.

   To witness this approach, you should issue:

   ```
   $ node_modules/typescript/bin/tsc 6-2-1-*.ts
   $ node 6-2-1-syntactic-sugar.js

   $ node_modules/typescript/bin/tsc 6-2-2-*.ts
   $ node 6-2-2-syntactic-sugar.js
   ```

   To elaborate on the second option, using `async`/`await` in the higher-order array methods `map` or `forEach` will pause the callback function but not the iteration.
