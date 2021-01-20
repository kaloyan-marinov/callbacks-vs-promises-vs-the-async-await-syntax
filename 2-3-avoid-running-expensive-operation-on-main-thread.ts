import { logMessageWithElapsedTime, blockCode } from "./2-0-utilities";

const avoidBlockingCode = (): Promise<string> => {
  return Promise.resolve().then(() => blockCode());
};

logMessageWithElapsedTime("log #1");

const p3: Promise<string> = avoidBlockingCode();
p3.then((s) => logMessageWithElapsedTime("log #2 - " + s));

logMessageWithElapsedTime("log #3");
