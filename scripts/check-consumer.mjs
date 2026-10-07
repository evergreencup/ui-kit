/**
 * @file scripts/check-consumer.mjs
 * @desc The consumer check: packs the kit, installs it into a throwaway copy of the demo app in
 *       demo/, runs `next build` (which prerenders every page, so a server component handing a
 *       client one something unserializable fails here), then checks the built CSS holds the
 *       theme's tokens and utilities, proving `@source "./"` reaches dist/. With `--out <dir>`
 *       it also copies the static export there: that is the GitHub Pages build.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const dir = mkdtempSync(join(tmpdir(), "egc-consumer-"));
const outFlag = process.argv.indexOf("--out");
const out = outFlag === -1 ? null : resolve(process.argv[outFlag + 1] ?? "demo-out");
const run = (cmd, args, cwd = dir) => execFileSync(cmd, args, { cwd, stdio: "inherit" });

try {
  run("bun", ["run", "build"], root);
  run("bun", ["pm", "pack", "--destination", dir], root);
  const tarball = readdirSync(dir).find((f) => f.endsWith(".tgz"));
  cpSync(join(root, "demo"), dir, { recursive: true });
  const dev = pkg.devDependencies;
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      name: "egc-consumer",
      private: true,
      type: "module",
      dependencies: {
        [pkg.name]: `file:./${tarball}`,
        "@tailwindcss/postcss": dev.tailwindcss,
        next: dev.next,
        react: dev.react,
        "react-dom": dev["react-dom"],
        tailwindcss: dev.tailwindcss,
        typescript: "5.9.3",
        "@types/react": dev["@types/react"],
        "@types/node": dev["@types/node"],
      },
    }),
  );
  run("bun", ["install"]);
  run("bunx", ["next", "build"]);
  const cssDir = join(dir, ".next/static");
  const css = readdirSync(cssDir, { recursive: true })
    .filter((f) => String(f).endsWith(".css"))
    .map((f) => readFileSync(join(cssDir, String(f)), "utf8"))
    .join("\n");
  const expected = [
    "--color-evergreen-500",
    ".bg-evergreen-500",
    ".text-fog-300",
    ".diag-stripes",
    ".font-display",
    ".parallax-layer",
    "active-underline",
    "1\\.2fr_repeat\\(var\\(--cols\\)",
    "pointer:coarse",
    "has-focus-visible",
    "not-disabled",
  ];
  const missing = expected.filter((needle) => !css.includes(needle));
  if (missing.length > 0) throw new Error(`built CSS is missing: ${missing.join(", ")}`);
  console.log(`consumer check passed (${expected.length} CSS checks)`);
  if (out) {
    rmSync(out, { recursive: true, force: true });
    cpSync(join(dir, "out"), out, { recursive: true });
    writeFileSync(join(out, ".nojekyll"), "");
    console.log(`demo written to ${out}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
