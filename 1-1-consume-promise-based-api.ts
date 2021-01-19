import fetch from "node-fetch";

// (?) The next instruction puts a `Promise` on the microtask queue.
const promise = fetch("https://jsonplaceholder.typicode.com/todos/1");

// (?)
promise
  .then((res) => res.json())
  .then((todo) => console.log(`log #1 - ${todo.title}`));

// The next instruction gets executed right away,
console.log(`log #2 - synchronous`);
