/*
The following function simulates what a `Promise`-based API looks like.
*/
export const getFruit = async (name: string): Promise<string> => {
  const fruits: { [key: string]: string } = {
    pineapple: "🍍",
    peach: "🍑",
    strawberry: "🍓",
  };

  return fruits[name];
};

/*
The following function:
  (a) is equivalent to the previous one, but
  (b) does not use the `async` keyword.
*/
export const getFruitWithoutAsync = (name: string): Promise<string> => {
  const fruits: { [key: string]: string } = {
    pineapple: "🍍",
    peach: "🍑",
    strawberry: "🍓",
  };

  return Promise.resolve(fruits[name]);
};

const delay = (milliseconds: number): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

/*
The following function:
  (a) is similar to the first function [within this file] in that
      the following function also simulates what a `Promise`-based API looks like, but
  (b) differs from the first function [within this file] in that
      the simulated `Promise`-based API is modeled/assumed to have about 1s of latency.
*/
export const getFruitWithDelay = async (name: string): Promise<string> => {
  const fruits: { [key: string]: string } = {
    pineapple: "🍍",
    peach: "🍑",
    strawberry: "🍓",
  };

  await delay(1000);

  return fruits[name];
};
