export const tick: number = Date.now();

export const logMessageWithElapsedTime = (msg: any) => {
  console.log(`elapsed: ${Date.now() - tick}ms - ${msg}`);
};

export const blockCode = (): string => {
  /*
  If we run this on the main thread,
  it's going to block all other code from executing
  until 10**9 iterations have been completed.
  */
  let i = 0;
  while (i < 10 ** 9) {
    i++;
  }
  return "completed 10**9 (= 1 billion) iterations";
};
