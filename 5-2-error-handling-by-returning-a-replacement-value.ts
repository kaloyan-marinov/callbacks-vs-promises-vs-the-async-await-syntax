import { getFruit } from "./3-0-utilities";

const badSmoothie = async () => {
  try {
    const a = getFruit("pineapple");
    const b = getFruit("strawberry");
    const smoothie = await Promise.all([a, b]);

    throw `[simulation of an error occurring "across multiple Promises"]`;

    return smoothie;
  } catch (err) {
    console.log({ err });
    return "[a replacement value]";
  }
};

const smoothiePromise = badSmoothie();

smoothiePromise
  .then((val) => console.log({ val }))
  .catch((error) => console.log({ error }));
