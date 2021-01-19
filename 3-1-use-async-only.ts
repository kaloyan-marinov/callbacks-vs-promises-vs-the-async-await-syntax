/*
We are going to reuse the following function in subsequent files,
just to simulate what a `Promise`-based API looks like.
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
  (a) does not use the `async` keyword, but
  (b) is equivalent to the previous one.
*/
const getFruitWithoutAsync = (name: string): Promise<string> => {
  const fruits: { [key: string]: string } = {
    pineapple: "🍍",
    peach: "🍑",
    strawberry: "🍓",
  };

  return Promise.resolve(fruits[name]);
};

getFruit("peach").then((v) => console.log(v));
getFruitWithoutAsync("pineapple").then((v) => console.log(v));
