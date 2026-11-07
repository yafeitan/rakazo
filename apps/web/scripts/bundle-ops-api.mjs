import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

await esbuild.build({
  entryPoints: [path.join(webRoot, "src/ops-demo/server/node-handler.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: path.join(webRoot, "api/missbunny.js"),
});
