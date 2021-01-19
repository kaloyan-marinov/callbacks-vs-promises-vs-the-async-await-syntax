JavaScript is a single-threaded
programming language

yet everything we
do on the web tends to be blocking or
time-consuming, which means that
asynchronous programming is an essential
skill for any JavaScript developer

today's video will focus primarily on
the amazing syntactic sugar provided by
async/await

but before we can get there
we really need to understand things from
the ground up:
(a) starting with the browser or nodejs event loop,
(b) callbacks
(c) `Promise`s
(d) and then finally async/await

in order
to understand anything async you really
need to first understand the event loop

I'm going to give you
the general overview (but I highly
recommend you watch this talk from Jake
Archibald which is the best explanation
of the event loop that I've ever seen):

so what is the
event loop and what does it have to do
with async/await?

both the browser and
nodejs are always running a single
threaded event loop to run your code

on
the first go around it will run all of
your synchronous code, but it might also
queue up asynchronous events to be
called back later

you say here's a
function that I need to run but first I
need to go get some data from the
network

the event loop says okay I'll
keep doing my thing

while you do your
thing in a separate thread pool

then at
some point in the future getData will
finish and let the event loop know that
it's ready to be called back

now this is
where things get interesting
if it's a
macrotask like a setTimeout or setInterval
it will be executed on the next
event loop
but if it's a microtask like
a fulfilled `Promise` then it will be
called back before the start of the next
event loop

let's look at the
implications of this by writing some
actual code first we will write a
console log which is synchronous then
we'll throw in a set timeout but give it
a time delay of zero milliseconds then
we'll have a `Promise` that resolves right
away and lastly we will add another
console log for one more synchronous
line of code so

nothing here has any
actual time delay so intuitively I would
think that
each line of code would be executed one
by one

but that's not how things work in
the event loop

if we execute this code
you can see that first line gets logged
up right away because it's running on
the main thread

then if we run the
second line it's being queued for a
future task

then the `Promise` is being
queued to run in the microtask queue,
immediately after this current task

and
finally the last console log gets
executed right away

so even though the
setTimeout callback was queued up
before the `Promise`, the `Promise` still
gets executed first because of the
priority of the microtask queue

so now
that you know how the event loop works,
we can start looking at `Promise`s

first
I'll show you how a `Promise` based API
might be consumed
and then we'll look at
how we actually create our own `Promise`s
from scratch

so fetch is a browser-based
API but it's also available on node via
the `node-fetch` library, and it allows us
to hit an HTTP endpoint and have the
response returned to us as a `Promise` of
the response

fetching data from a remote
server is always going to be async, so
we can queue up the `Promise`, then provide
it with a callback to map it to JSON

the
great thing about `Promise`s is that we
can chain them together

mapping to JSON
is also a `Promise` so we can return that
`Promise` from the original then callback
and then in the next one we'll have the
actual user data as a plain JavaScript
object

if we go ahead and run this code
you'll see it runs our console log first
and then it retrieves the data from the
API and console logs that afterwards

the
great thing about `Promise`s is that you
can catch all errors in the chain with a
single function

we can do this by adding
catch to the bottom of our `Promise` chain
and it will handle errors that happen
anywhere within our asynchronous code

if
this code were callback based we'd have
to have a separate error handler for
every single one of the asynchronous
operations

so if an error is thrown
anywhere in our code it's going to
bypass all of the future `then` callbacks
and go straight to the `catch` callback

---

when you start creating `Promise`s that's
when you're more likely to screw things
up

first I'm setting up a log function
so I can show you the elapsed time
between each line of code

up

a while
loop that loops a billion times
arbitrarily

if we run this on the main
thread it's going to block all of their
code from executing until the billion
loops are done

so we'll do one console
log, run our while loop, and then do
another console log after that;
and you
can see it takes about seven hundred
milliseconds to finish the while loop;
our script is essentially frozen until
that while loop is complete;

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

---

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
