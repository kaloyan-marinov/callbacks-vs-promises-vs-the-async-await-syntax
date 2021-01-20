import { logMessageWithElapsedTime, blockCode } from "./2-0-utilities";

const failToAvoidBlockingCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const s = blockCode();
    resolve(s);
  });
};

logMessageWithElapsedTime("log #1");

const p2: Promise<string> = failToAvoidBlockingCode();
p2.then((s) => logMessageWithElapsedTime("log #2 - " + s));

logMessageWithElapsedTime("log #3");
