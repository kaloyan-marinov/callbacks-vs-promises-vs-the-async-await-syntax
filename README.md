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

# The remainder

---

now if you're already a
JavaScript expert, then I'm kind of
trolling you, because you know that the
code on the left is making the single
biggest mistake that people make when
using `async` `await`, and that is failing to
run the code concurrently:

- if we go back
  to the code on the left you can see that
  we're waiting for a pineapple to resolve
  and then we're getting a strawberry
  afterwards;
- but we could get both of
  these things at the same time (you really
  only need to await one thing after the
  other if the second value is dependent
  on the first value; for example if you
  need to get a user ID before you can
  then retrieve some data from the
  database)

let's imagine we're making
these calls from a remote API and
there's about a second of latency:
if we
run this code again with a delay you can
see it takes a full second to get the
first fruit and then a full second to
get the second fruit;
but the whole point
of the event loop is to avoid blocking
code like this so we know that an async
function always returns a `Promise`, so
instead of doing one after the other we
can add both of our `Promise`s to `Promise`.all

- this will tell all the `Promise`s in
  the array to run concurrently and then
  have the resolved values be at that
  index in the array

so this is something
that you should always be thinking about
when working with async functions, you
don't want to accidentally pause
function unnecessarily

so instead of
awaiting a whole bunch of individual
`Promise`s, you might want to add all your
`Promise`s to an array and then await that
`Promise`.all call and as you can see here
we've doubled the speed of the original
function

---

another nice benefit of async
await is error handling

instead of
chaining a catch callback to our `Promise`
chain we can just wrap our code in a
try-catch block

this offers much better
flexibility when handling errors that
might occur across multiple `Promise`s

if
we take our code from the last example
and throw an error in the middle of it
we can then catch that error down here
in the catch block

the first thing we'll
probably want to do here is console.log
the error and then we can either catch
the error and throw another error, or we
can catch the error and return a value
(
your decision here will dictate the
control flow for the consumer of this
`Promise`;
if you return a value it's
basically like ignoring the error and
then providing some replacement value so
the consumer the `Promise` won't get an
error but instead they'll get the result
value inside of the then callback;
in
contrast if we throw an error inside of
our catch block it will break the
consumers `Promise` chain and be handled
by their catch callback
)

---

now I want to
show you a couple of tricks to make your
code as sweet as possible let's imagine
we have a string of IDs and then we want
to retrieve all these ideas from the
database

we can use a ray map to convert
them to an array of `Promise`s and then
resolve them all concurrently using
`Promise`.all

that looks great but you
need to be careful when using
async/await
in a map or for each loop
because it
won't actually pause the function in
this context

so normally we would expect
this loop to stop if we do await getFruit
but that's actually not what
happens in this case

instead it will run
all these `Promise`s concurrently so that
might not be the behavior that you're
expecting

if you want to run a loop and
have every iteration in that loop a way
to `Promise`, you need to use a traditional
for loop

so you can write async
functions and then write a for loop
inside that function and then use the
await keyword inside the loop - when you
write your code like this it will pause
each step of a loop until that `Promise`
is resolved;
but more often than not
you'll probably want to run everything
concurrently and a cool thing you can do
is use the await keyword directly in a
for loop

if you have a `Promise` that you
know resolves to an array you can
actually just use the await keyword
directly in your loop
(so you can say for
await in your code what
we'll await the array of items to
resolve and then loop over them
immediately after)

and as you can
probably imagine you can also use the
await keyword directly in your conditionals:
on the left side of the conditional we can
await the result value from a `Promise`
and then we can see if it's equal to
some other value
(
so that gives you a
super concise way to write conditional
expressions when working with `Promise`s
)

---

hopefully that gives you some ideas on
what you can do with async await in ES 7
or typescript

it is truly one of the
sweetest things to ever happen to
JavaScript

if this video helped you
please like and subscribe and make sure
to join the live stream next week for
the t-shirt giveaway

and if you want to
take your development to the next level
consider becoming a pro member at
angular firebase.com - you'll get access
to all kinds of advanced content
designed to help you build and ship your
app faster

thanks for watching and I'll
talk to you soon
