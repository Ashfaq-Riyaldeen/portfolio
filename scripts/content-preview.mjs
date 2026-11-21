import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const command = process.argv[2] ?? "dev";
if (!["dev", "build", "start"].includes(command)) throw new Error("Expected dev, build, or start.");
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), command, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: {...process.env, PORTFOLIO_CONTENT_SOURCE: "local"},
});
child.on("exit", (code) => { process.exitCode = code ?? 1; });
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
