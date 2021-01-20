import { logMessageWithElapsedTime, blockCode } from "./2-0-utilities";

logMessageWithElapsedTime("2-1-*.js - log #1");

const s: string = blockCode();
logMessageWithElapsedTime("2-1-*.js - log #2 - " + s);

logMessageWithElapsedTime("2-1-*.js - log #3");
