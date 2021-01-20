import { logMessageWithElapsedTime } from "./2-0-utilities";
import { getFruitWithDelay } from "./3-0-utilities";

const fruits = ["peach", "pineapple", "strawberry"];

const fruitLoop = async () => {
  const emojiPromises = fruits.map((f) => getFruitWithDelay(f));

  for await (const emoji of emojiPromises) {
    logMessageWithElapsedTime(emoji);
  }
};

fruitLoop();
