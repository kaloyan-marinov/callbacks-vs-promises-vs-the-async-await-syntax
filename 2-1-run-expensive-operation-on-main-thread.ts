const tick1: number = Date.now();

const logMessageWithElapsedTime1 = (msg: string) => {
  console.log(`elapsed: ${Date.now() - tick1}ms - ${msg}`);
};

const blockCode = (): string => {
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

logMessageWithElapsedTime1("log #1");

const s: string = blockCode();
logMessageWithElapsedTime1("log #2 - " + s);

logMessageWithElapsedTime1("log #3");
