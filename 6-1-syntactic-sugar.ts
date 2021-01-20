import { logMessageWithElapsedTime } from "./2-0-utilities";
import { getFruitWithDelay } from "./3-0-utilities";

const fruits = ["peach", "pineapple", "strawberry"];

const fruitLoop = async () => {
  for (const f of fruits) {
    const emoji = await getFruitWithDelay(f);
    logMessageWithElapsedTime(emoji);
  }
};

fruitLoop();
