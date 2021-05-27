import { logMessageWithElapsedTime } from "./2-0-utilities";
import { getFruitWithDelay } from "./3-0-utilities";

const fruits = ["peach", "pineapple", "strawberry"];

const emojis = fruits.map(async (f) => {
  const emoji = await getFruitWithDelay(f);
  logMessageWithElapsedTime(emoji);
  return emoji;
});
