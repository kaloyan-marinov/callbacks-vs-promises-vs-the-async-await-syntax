import { logMessageWithElapsedTime } from "./2-0-utilities";
import { getFruit } from "./3-0-utilities";

const makeSmoothie = async () => {
  const a = await getFruit("pineapple");
  const b = await getFruit("strawberry");

  const smoothie = [a, b];

  return smoothie;
};

const p = makeSmoothie();

p.then((v) => logMessageWithElapsedTime(`3-2-*.js - log #1 - ${v}`));

/*
The following function:
  (a) is equivalent to the previous one, but
  (b) does not use the `async`/`await` keywords, and
  (c) demonstrates that,
      when handling a `Promise` in this direct way,
      it's kind of difficult to share result values
      between multiple steps in a chain of `then` callbacks.
*/
const makeSmoothieWithoutAsyncAwait = () => {
  let a: string;

  const smoothie = getFruit("pineapple")
    .then((v) => {
      a = v;
      return getFruit("strawberry");
    })
    .then((v) => [a, v]);

  return smoothie;
};

const pWithoutAsyncAwait = makeSmoothieWithoutAsyncAwait();

pWithoutAsyncAwait.then((v) =>
  logMessageWithElapsedTime(`3-2-*.js - log #2 - ${v}`)
);
