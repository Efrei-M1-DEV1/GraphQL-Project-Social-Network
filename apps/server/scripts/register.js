import { register } from "node:module";
import { setUncaughtExceptionCaptureCallback } from "node:process";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL("./"));
setUncaughtExceptionCaptureCallback((err) => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error(err);
  process.exit(1);
});
