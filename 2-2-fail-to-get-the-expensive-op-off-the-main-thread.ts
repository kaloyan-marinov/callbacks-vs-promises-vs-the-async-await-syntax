const tick2: number = Date.now();

const logMessageWithElapsedTime2 = (msg: string) => {
  console.log(`elapsed: ${Date.now() - tick2}ms - ${msg}`);
};

const blockCode2 = (): string => {
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

const failToAvoidBlockingCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const s = blockCode2();
    resolve(s);
  });
};

logMessageWithElapsedTime2("log #1");

const p2: Promise<string> = failToAvoidBlockingCode();
p2.then((s) => logMessageWithElapsedTime2("log #2 - " + s));

logMessageWithElapsedTime2("log #3");
