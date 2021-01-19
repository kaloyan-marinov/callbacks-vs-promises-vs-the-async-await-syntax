const tick3: number = Date.now();

const logMessageWithElapsedTime3 = (msg: string) => {
  console.log(`elapsed: ${Date.now() - tick3}ms - ${msg}`);
};

const blockCode3 = (): string => {
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

const avoidBlockingCode = (): Promise<string> => {
  return Promise.resolve().then(() => blockCode3());
};

logMessageWithElapsedTime3("log #1");

const p3: Promise<string> = avoidBlockingCode();
p3.then((s) => logMessageWithElapsedTime3("log #2 - " + s));

logMessageWithElapsedTime3("log #3");
