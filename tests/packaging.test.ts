/**
 * @file tests/packaging.test.ts
 * @desc What ships: every source file has the header, relative imports end in .js, next is
 *       imported with a .js suffix, every file using hooks or browser-only React APIs (or
 *       importing recharts, which ships no directive) starts with "use client" right after its
 *       header (and no other file does), and the main barrel never reaches recharts.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(process.cwd(), "src/");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(p) ? [p] : [];
  });
const files = walk(root).map((path) => ({ path, src: readFileSync(path, "utf8") }));
// Any hook call (generic or not) except useId (server-safe), or a portal.
const CLIENT_API = /\buse(?!Id\()[A-Z]\w*(?:<[^>]*>)?\(|\bcreatePortal\(/;
const firstStatement = (src: string): string =>
  src.replace(/^\/\*\*[\s\S]*?\*\/\s*/, "").split("\n")[0] ?? "";

describe("packaging", () => {
  it("finds the sources", () => {
    expect(files.length).toBeGreaterThan(80);
  });

  it("starts every file with the JSDoc header", () => {
    for (const { path, src } of files) {
      expect(src.startsWith(`/**\n * @file src/${path.slice(root.length)}`), path).toBe(true);
      expect(src, path).toMatch(/@author David @dvhsh \(https:\/\/dvh\.sh\)/);
      expect(src, path).toMatch(/@modified \w{3} \w{3} \d{1,2}, \d{4}/);
    }
  });

  it("ends every relative import in .js and imports next with .js", () => {
    for (const { path, src } of files) {
      for (const m of src.matchAll(/from "(\.[^"]+|next\/[^"]+)"/g)) {
        expect(m[1], path).toMatch(/\.js$/);
      }
    }
  });

  it('marks exactly the files that use client-only APIs with a leading "use client"', () => {
    for (const { path, src } of files) {
      const client = firstStatement(src) === '"use client";';
      const needs =
        (CLIENT_API.test(src.replace(/import[^;]+;/g, "")) || src.includes('from "recharts"')) &&
        !path.endsWith("/index.ts");
      expect(client, path).toBe(needs);
    }
  });

  it("keeps recharts out of everything but src/charts", () => {
    for (const { path, src } of files) {
      if (!path.includes("/src/charts/")) expect(src, path).not.toContain('"recharts"');
    }
    expect(readFileSync(join(root, "index.ts"), "utf8")).not.toMatch(/from "\.\/charts/);
  });

  it("keeps hex colors out of class strings", () => {
    for (const { path, src } of files) {
      for (const m of src.matchAll(/className=\{?[`"]([^`"]*)[`"]/g)) {
        expect(m[1], path).not.toMatch(/#[0-9a-f]{3,6}\b/i);
      }
    }
  });
});
