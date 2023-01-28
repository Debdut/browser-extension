import fs from "fs";
import { basename, dirname, relative, resolve } from "path";
import { fileURLToPath } from "url";

import fse from "fs-extra";
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

// get name from filename
// index.x.html -> index.x
function getName(path: string) {
  return basename(path).split(".").slice(0, -1).join(".");
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

async function buildHtmlPage(name: string, entry: string, outdir: string) {
  const prompt = `Building "${name}" from ${entry}:`;
  console.time(prompt);

  const out = await build({
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

  console.timeEnd(prompt);
  
  return out;
}

async function buildJSPage(name: string, entry: string, outdir: string) {
  const prompt = `Building "${name}" from ${entry}:`;
  console.time(prompt);

  const out =  await build({
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

  console.timeEnd(prompt);

  return out;
}

function getDistPagePath(name: string, path: string, version: 2 | 3): string {
  // src/pages/popup/index.html -> dist/v3/popup/index-<hash>.html
  const fileName = basename(path);
  const ext = getExtension(fileName);
  const distExt = (ext === "html") ? "html" : "js";
  const fileNameWOExt = getName(fileName);
  const regex = new RegExp(
    `${fileNameWOExt}(-[A-z0-9]*)?\.${distExt}`
  );
  
  const extDir = resolve(OutDir, `v${version}`);
  const pageDir = resolve(extDir, name);
  const pageFiles = fs.readdirSync(pageDir);
  const pageFile = pageFiles.find((file) => regex.test(file));
  if (!pageFile) {
    throw new Error(`Could not find generated entry for page ${name}`);
  }
  return relative(
    extDir,
    resolve(pageDir, pageFile)
  );
}

async function CopyPublicFiles(version: 2 | 3) {
  const extDir = resolve(OutDir, `v${version}`);

  await fse.copy(PublicDir, extDir);
}

function BuildManifest(version: 2 | 3, pageDirMap: { [x: string]: any }) {
  const extDir = resolve(OutDir, `v${version}`);
  const pageDistMap: { [x: string]: any } = {};

  for (const [name, entry] of Object.entries(pageDirMap)) {
    const entryRelative = relative(RootDir, entry);
    const pageDist = getDistPagePath(name, entryRelative, version);
    pageDistMap[name] = pageDist;
  }

  const manifest = getManifest(version, pageDistMap);

  fs.writeFileSync(
    resolve(extDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
}

async function BuildPages(version: 2 | 3,  pageDirMap: { [x: string]: any }) {
  const extDir = resolve(OutDir, `v${version}`);
  const promises: Promise<any>[] = [];

  for (const [name, entry] of Object.entries(pageDirMap)) {
    const entryRelative = relative(RootDir, entry);

    promises.push(
      buildPage(name, entryRelative, extDir)
    );
  }

  await Promise.all(promises);
}

async function Build(...versions: (2 | 3)[]) {
  const pageDirMap = getPageDirMap();

  if (versions.length === 0) {
    return;
  }

  let version = versions[0];

  await Promise.all([
    BuildPages(version, pageDirMap),
    CopyPublicFiles(version),
  ]);

  if (versions.length > 1) {
    version = versions[1];
    fse.copySync(
      resolve(OutDir, `v${versions[0]}`),
      resolve(OutDir, `v${version}`)
    );
  }

  for (const v of versions.slice(0, 2)) {
    BuildManifest(v, pageDirMap);
  }
}

Build(2, 3);