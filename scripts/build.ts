import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { build } from "esbuild";
import { html } from "@esbuilder/html";
import { root } from "postcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, "..");
const srcDir = resolve(rootDir, "src");
const pagesDir = resolve(srcDir, "pages");
const assetsDir = resolve(srcDir, "assets");
const outDir = resolve(__dirname, "..", "dist");
const publicDir = resolve(__dirname, "..", "public");

const pageDirs = fs.readdirSync(pagesDir);

function getPageInputs() {
  const input: { [x: string]: any } = {};
  const entryPoints = [
    "index.html",
    "index.ts",
    "index.tsx",
    "index.js",
    "index.jsx",
    "main.html",
    "main.ts",
    "main.tsx",
    "main.js",
    "main.jsx",
  ];

  const getFirstExistingFile = (folder: string): string | undefined => {
    for (const entryPoint of entryPoints) {
      const file = resolve(pagesDir, folder, entryPoint);
      if (fs.existsSync(file)) {
        return file;
      }
    }
  };

  pageDirs.forEach((folder) => {
    const pages = resolve(pagesDir, folder);
    if (!fs.statSync(pages).isDirectory()) {
      return;
    }
    const entry = getFirstExistingFile(folder)
      ?.replace(rootDir + "/", "");
    if (entry) {
      input[folder] = entry;
    }
  });

  return input;
}

// get extension from path
function getExtension(path: string) {
  return path.split(".").pop();
}

function buildPage(name: string, entry: string) {
  const ext = getExtension(entry);
  if (ext === "html") {
    if (name === "content") {
      throw new Error(`Content page cannot have a HTML entry: ${entry}`);
    }
    if (name === "background") {
      throw new Error(`Background page cannot have a HTML entry: ${entry}`);
    }

    return buildHtmlPage(name, entry);
  }
  if (ext === "ts"
   || ext === "tsx"
   || ext === "js"
   || ext === "jsx") {
    return buildJSPage(name, entry);
  }

  throw new Error(`Unknown entry point extension: ${entry} ${ext}`);
}

function buildHtmlPage(name: string, entry: string) {
  return build({
    entryPoints: [entry],
    bundle: true,
    outdir: `dist/${name}`,
    sourcemap: true,
    minify: true,
    target: ["chrome58", "firefox57", "safari11", "edge16"],
    loader: {
      ".png": "dataurl",
      ".webp": "dataurl",
      ".jpeg": "dataurl",
      ".svg": "dataurl",
      ".json": "json",
    },
    plugins: [
      html({
        entryNames: "[name]-[hash]",
      }),
    ],
  });
}

function buildJSPage(name: string, entry: string) {
  return build({
    entryPoints: [entry],
    bundle: true,
    outdir: `dist/${name}`,
    sourcemap: true,
    minify: true,
    target: ["chrome58", "firefox57", "safari11", "edge16"],
    loader: {
      ".png": "dataurl",
      ".webp": "dataurl",
      ".jpeg": "dataurl",
      ".svg": "dataurl",
      ".json": "json",
    },
  });
}

async function main() {
  for (const [name, entry] of Object.entries(getPageInputs())) {
    await buildPage(name, entry);
  }
}

main();