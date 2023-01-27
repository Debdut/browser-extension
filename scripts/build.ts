import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { build } from "esbuild";
import { html } from "@esbuilder/html";

import { getManifest } from "../src/manifest/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RootDir = resolve(__dirname, "..");
const SrcDir = resolve(RootDir, "src");
const pagesDir = resolve(SrcDir, "pages");
const AssetsDir = resolve(SrcDir, "assets");
const OutDir = resolve(__dirname, "..", "dist");
const PublicDir = resolve(__dirname, "..", "public");

const pageDirs = fs.readdirSync(pagesDir);

function getPageDirMap() {
  const pageDirMap: { [x: string]: any } = {};
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
    const entry = getFirstExistingFile(folder);
    if (entry) {
      pageDirMap[folder] = entry;
    }
  });

  return pageDirMap;
}

// get extension from path
function getExtension(path: string) {
  return path.split(".").pop();
}

function buildPage(name: string, entry: string, outdir: string) {
  const ext = getExtension(entry);
  if (ext === "html") {
    if (name === "content") {
      throw new Error(`Content page cannot have a HTML entry: ${entry}`);
    }
    if (name === "background") {
      throw new Error(`Background page cannot have a HTML entry: ${entry}`);
    }

    return buildHtmlPage(name, entry, outdir);
  }
  if (ext === "ts"
   || ext === "tsx"
   || ext === "js"
   || ext === "jsx") {
    return buildJSPage(name, entry, outdir);
  }

  throw new Error(`Unknown entry point extension: ${entry} ${ext}`);
}

function buildHtmlPage(name: string, entry: string, outdir: string) {
  return build({
    entryPoints: [entry],
    bundle: true,
    outdir: resolve(outdir, name),
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

function buildJSPage(name: string, entry: string, outdir: string) {
  return build({
    entryPoints: [entry],
    bundle: true,
    outdir: resolve(outdir, name),
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

async function Build(version: 2 | 3) {
  const outdir = resolve(OutDir, `v${version}`);
  const pageDirMap = getPageDirMap();
  const manifest = getManifest(version, pageDirMap);

  for (const [name, entry] of Object.entries(pageDirMap)) {
    const entryRelative = entry
      ?.replace(RootDir + "/", "");

    console.log(`Building ${name} from ${entryRelative}:`);
    console.time(name);

    await buildPage(name, entryRelative, outdir);

    console.timeEnd(name);
  }

  fs.writeFileSync(
    resolve(outdir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
}

Build(3);
