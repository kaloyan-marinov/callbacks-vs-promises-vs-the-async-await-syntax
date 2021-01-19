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

(b) if it's a microtask (like a resolved `Promise`), then it will be called back before the start of the next event loop.

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

so let's go
ahead and wrap this code in a `Promise`, so
we can get it off the main thread and
execute it as a micro task

this is one
tricky little way you might screw things
up
(
so we create a new `Promise` we add our
code inside that `Promise` and then we
have it resolved to that value when done

so you might think that because we're
wrapping this in a `Promise` that we're
going to execute this off the main
thread

but the actual creation of the
`Promise` and that big while loop is still
happening on the main thread, it's only
the resolving of the value that happens
as a micro task;
so the first synchronous line gets
logged right away and the second one
should too but there's still a 700
millisecond delay because that while
loop is still blocking on the main
thread
)

so to ensure that all of our
synchronous code runs as fast as
possible we'll ??refactor?? our code once
again to say `Promise` resolve,
then we'll
run the while loop inside of that result
`Promise`s callback

by putting this code
inside of a resolved `Promise` we can be
guaranteed that it will be executed
after all the synchronous code in the
current macro task has completed

if we
go ahead and run our script again you
can see we get our two console logs
right away and then finally the `Promise`
resolves after 700 milliseconds

so now
that you know all that stuff you should
be in the clear to use async await
responsibly

# The remainder

we already know that
`Promise`s are a huge improvement over
callbacks

but `Promise`s can still be
really hard to read and follow,
especially when you have a long chain of
multiple asynchronous events

async await
really just boils down to syntactic
sugar to make your asynchronous code
read like synchronous code

---

first let's
look at the async part of the equation
and see what that does

so here we have a
regular function that does nothing and,
if we put the async keyword in front of
it, we have a function that returns a
`Promise` of nothing

so whatever gets
returned inside this function will be a
`Promise` of that value

I'm going to reuse
this getFruit function throughout the
lesson just to simulate what a `Promise`
based API looks like

in this case the
user can pass in the name of a fruit and
then the function will resolve to the
value of the fruit emoji from this
object

and just to make this a little
more clear if we didn't use the async
keyword we could write this function by
just returning a `Promise` that resolves
to this value

so when you use the async
keyword the magic
that happens is that it takes the return
value and automatically resolves it as a
`Promise`

but that's not everything that
it does it also sets up a context for
you to use the await keyword

the real
power of an async function comes when
you combine it with the await keyword to
pause the execution of the function

now
I'm going to write a second async
function called make smoothie - what we
need to do is get multiple fruits and
then combine them together as a single
value

instead of chaining together a
bunch of then callbacks we can just have
a `Promise` resolve to the value of a
variable

await is like saying pause
the execution of this function until the
get fruit `Promise` results to a value at
which point we can use it as the
variable a

and then we'll move on to the
next line of code; after we get a
pineapple we can then get a strawberry
and then we'll return them together as an
array

one of the most annoying things
with `Promise`s is that it's kind of
difficult to share result values between
multiple steps in the `Promise` chain;
but
async/await solves this problem really
nicely

the code on the right is what
this would look like if we wrote it with
just regular `Promise`s, and as you can see
there's a lot more code and a lot more
complexity there;
now if you're already a
JavaScript expert then I'm kind of
trolling you because you know that the
code on the left is making the single
biggest mistake that people make when
using async await, and that is failing to
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
