import { logMessageWithElapsedTime } from "./2-0-utilities";
import { getFruitWithDelay } from "./3-0-utilities";

const makeSmoothieDelay = async () => {
  const a = getFruitWithDelay("pineapple");
  const b = getFruitWithDelay("strawberry");

  const smoothie = await Promise.all([a, b]);

  return smoothie;
};

const p = makeSmoothieDelay();

console.log(`log #1 - ...`);
console.log(p);

p.then((v) => logMessageWithElapsedTime(`log #2 - ${v}`));
