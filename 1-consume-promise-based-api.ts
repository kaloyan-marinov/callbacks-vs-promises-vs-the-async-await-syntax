import fetch from "node-fetch";

const promise = fetch("https://jsonplaceholder.typicode.com/todos/1");

promise
  .then((res) => res.json())
  .then((todo) => console.log(`log #1 - ${todo.title}`));

console.log(`log #2 - synchronous`);
