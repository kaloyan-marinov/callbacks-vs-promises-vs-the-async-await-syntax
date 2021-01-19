/*
Nothing here has any actual time delay
so intuitively I would think that
each line of code would be executed one by one
- but that's not how things work in the event loop.
*/

// The next instruction gets executed right away,
// because it's running on the main thread.
console.log("line #1 - synchronous");

// The next instruction gets queued for a future task.
setTimeout(() => console.log(`line #2 - timeout`), 0);

// a `Promise` that resolves right away
// ... gets queued to run in the microtask queue, immediately after this current task.
Promise.resolve().then(() => console.log("line #3 - resolved Promise"));

// The next instruction gets executed right away,
console.log("line #4 - synchronous");
