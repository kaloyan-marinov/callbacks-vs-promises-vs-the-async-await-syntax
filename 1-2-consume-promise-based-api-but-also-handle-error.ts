import fetch from "node-fetch";

// (?) The next instruction puts a `Promise` on the microtask queue.
const promise = fetch("https://jsonplaceholder.typicode.com/todos/1");

// (?)
promise
  .then((res) => res.json())
  .then((todo) => {
    throw new Error("within one of the `then` callbacks");
    return todo;
  })
  .then((todo) => console.log(`log #1 - ${todo.title}`))
  .catch((err) => console.error(`err #1 - ${err}`));

// The next instruction gets executed right away,
console.log(`log #2 - synchronous`);
