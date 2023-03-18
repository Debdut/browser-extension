import fs from "fs";
import { basename, dirname, relative, resolve, sep } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "node:module";

import fse from "fs-extra";
import { build } from "esbuild";
import { html } from "@esbuilder/html";
import concurrently from "concurrently";
import { GetInstalledBrowsers, BrowserPath } from "get-installed-browsers";
import stylePlugin from "esbuild-style-plugin";
import watch from "node-watch";

import { getManifest } from "../src/manifest/index.mjs";

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RootDir = resolve(__dirname, "..");
const SrcDir = resolve(RootDir, "src");
const pagesDir = resolve(SrcDir, "pages");
const AssetsDir = resolve(SrcDir, "assets");
const OutDir = resolve(__dirname, "..", "dist");
const PublicDir = resolve(__dirname, "..", "public");

const pageDirs = fs.readdirSync(pagesDir);

function getPageEntry(folder: string) {
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

  for (const entryPoint of entryPoints) {
    const file = resolve(pagesDir, folder, entryPoint);
    if (fs.existsSync(file)) {
      return file;
    }
  }
}

function getPageDirMap() {
  const pageDirMap: { [x: string]: any } = {};

  pageDirs.forEach((folder) => {
    const pages = resolve(pagesDir, folder);
    if (!fs.statSync(pages).isDirectory()) {
      return;
    }
    const entry = getPageEntry(folder);
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

function buildPage(name: string, entry: string, outdir: string, dev = false) {
  const ext = getExtension(entry);

  if (ext === "html") {
    if (name === "content") {
      throw new Error(`Content page cannot have a HTML entry: ${entry}`);
    }
    if (name === "background") {
      throw new Error(`Background page cannot have a HTML entry: ${entry}`);
    }

    return buildHtmlPage(name, entry, outdir, dev);
  }
  
  if (ext === "ts"
   || ext === "tsx"
   || ext === "js"
   || ext === "jsx") {
    return buildJSPage(name, entry, outdir, dev);
  }

  throw new Error(`Unknown entry point extension: ${entry} ${ext}`);
}

async function buildHtmlPage(name: string, entry: string, outdir: string, dev = false) {
  const prompt = `Building "${name}" from ${entry}`;
  console.time(prompt);

  const out = await build({
    entryPoints: [entry],
    bundle: true,
    outdir: resolve(outdir, name),
    sourcemap: dev,
    minify: true,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
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
      stylePlugin({
        postcss: {
          plugins: [
            require("postcss-import"),
            require("tailwindcss"),
            require("autoprefixer"),
          ],
        }
      }),
    ],
  });

  console.timeEnd(prompt);
  
  return out;
}

async function buildJSPage(name: string, entry: string, outdir: string, dev: boolean = false) {
  const prompt = `Building "${name}" from ${entry}:`;
  console.time(prompt);

  const out =  await build({
    entryPoints: [entry],
    bundle: true,
    outdir: resolve(outdir, name),
    sourcemap: dev,
    minify: true,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
    loader: {
      ".png": "dataurl",
      ".webp": "dataurl",
      ".jpeg": "dataurl",
      ".svg": "dataurl",
      ".json": "json",
    },
    plugins: [
      stylePlugin({
        postcss: {
          plugins: [
            require("postcss-import"),
            require("tailwindcss"),
            require("autoprefixer"),
          ],
        }
      }),
    ],
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

function getDistCSSPath(name: string, path: string, version: 2 | 3): string[] {
  const extDir = resolve(OutDir, `v${version}`);
  const pageDir = resolve(extDir, name);
  const pageFiles = fs.readdirSync(pageDir);
  const cssPaths: string[] = [];

  for (const file of pageFiles) {
    if (file.endsWith(".css")) {
      cssPaths.push(relative(
        extDir, resolve(pageDir, file)
      ));
    }
  }

  return cssPaths;
}

async function CopyPublicFiles(version: 2 | 3) {
  const prompt = `Copying public files for v${version}`;
  console.time(prompt);

  const extDir = resolve(OutDir, `v${version}`);
  const extPublicDir = resolve(extDir, "public");

  await fse.copy(PublicDir, extPublicDir);

  console.timeEnd(prompt);
}

function BuildManifest(version: 2 | 3, pageDirMap: { [x: string]: any }) {
  const prompt = `Building manifest for v${version}`;
  console.time(prompt);

  const extDir = resolve(OutDir, `v${version}`);
  const pageDistMap: { [x: string]: any } = {};

  for (const [name, entry] of Object.entries(pageDirMap)) {
    const entryRelative = relative(RootDir, entry);
    const pageDist = getDistPagePath(name, entryRelative, version);
    const cssDist = getDistCSSPath(name, entryRelative, version);

    pageDistMap[name] = pageDist;
    pageDistMap[`${name}-css`] = cssDist;
  }

  const manifest = getManifest(version, pageDistMap);

  fs.writeFileSync(
    resolve(extDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.timeEnd(prompt);
}

async function BuildPages(version: 2 | 3,  pageDirMap: { [x: string]: any }, dev: boolean = false) {
  const extDir = resolve(OutDir, `v${version}`);
  const promises: Promise<any>[] = [];

  for (const [name, entry] of Object.entries(pageDirMap)) {
    const entryRelative = relative(RootDir, entry);

    promises.push(
      buildPage(name, entryRelative, extDir, dev)
    );
  }

  await Promise.all(promises);
}

async function BuildVersionedExt(versions: (2 | 3)[], dev: boolean = false) {
  const pageDirMap = getPageDirMap();

  if (versions.length === 0) {
    return;
  }

  let version = versions[0];

  await Promise.all([
    BuildPages(version, pageDirMap, dev),
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

function Clean(version?: 2 | 3) {
  if (version) {
    const extDir = resolve(OutDir, `v${version}`);
    fse.removeSync(extDir);

    return;
  }

  fse.removeSync(OutDir);
}

async function DevVersionedExt(versions: (2 | 3)[]) {
  if (versions.length === 0) {
    return;
  }

  let version = versions[0];

  console.clear();

  Clean();
  try {
    await BuildVersionedExt(versions, true);
  } catch (error) {
    console.error(error);
  }

  console.log("Watching for changes...\n");

  watch(PublicDir, { recursive: true }, async (event, filePath) => {
    const relativeFilePath = filePath.replace(PublicDir + sep, "");

    const extDir = resolve(OutDir, `v${version}`);
    const extPublicDir = resolve(extDir, "public");
    const outFile = resolve(extPublicDir, relativeFilePath);

    console.clear();

    if (fs.existsSync(outFile)) {
      fse.removeSync(outFile);
    }

    if (event == "remove") {
      console.log("Removed public file or folder: ", filePath.replace(RootDir, "").substring(1));
      return;
    }

    fse.copySync(filePath, outFile);
    console.log("Copied public file or folder: ", filePath.replace(RootDir, "").substring(1));

    console.log("Watching for changes...\n");
  });

  watch(SrcDir, { recursive: true }, async (event, filePath) => {
    const relativeFilePath = filePath.replace(SrcDir + sep, "");

    let root = [relativeFilePath
      .split(sep)[0]];
    
    if (root[0] === "pages") {
      root.push(relativeFilePath
        .split(sep)[1]);

      const isDir = fs.lstatSync(resolve(SrcDir, ...root))
        .isDirectory();
      
      if (!isDir) {
        return;
      }

      const extDir = resolve(OutDir, `v${version}`);
      const entry = getPageEntry(root[1]);

      if (!entry) {
        return;
      }

      const entryRelative = relative(RootDir, entry);

      console.clear();

      fse.removeSync(resolve(extDir, root[1]));

      await buildPage(
        root[1],
        entryRelative,
        extDir,
        true
      );

      if (versions.length === 1) {
        return;
      }

      version = versions[1];

      fse.removeSync(resolve(OutDir, `v${version}`, root[1]));

      fse.copySync(
        resolve(OutDir, `v${versions[0]}`, root[1]),
        resolve(OutDir, `v${version}`, root[1])
      );

      console.log("Watching for changes...\n");

      version = versions[0];
    }
  });
}

function toKebabCase(str: string) {
  return str.replace(/([a-z]) ([A-Z])/g, "$1-$2").toLowerCase();
}

function manifestVersion(browser: BrowserPath): 2 | 3 {
  if (browser.type === "chrome") {
    return 3;
  }

  return 2;
}

function GetArgs(): { browsers: string[], dev: boolean } {
  if (process.argv.length < 3) {
    console.log("Usage: npm run build [<browser>...]");
    process.exit(1);
  }
  
  // TODO: A non-crude way to run : npm run start with no browsers.
  // if (process.argv[2] === "--dev"
  //   && process.argv.length < 4) {
  //   console.log("Usage: npm run start [<browser>...]");
  //   process.exit(0);
  // }
  
  let browsers: string[];
  let dev = false;
  
  if (process.argv[2] === "--dev") {
    browsers = process.argv
      .splice(3);
    dev = true;
  } else {
    browsers = process.argv
      .splice(2);
  }
  
  // uniq browsers
  browsers = browsers
    .reduce((acc, browser) => {
      const browserName = browser.toLowerCase();
      if (acc.indexOf(browserName) === -1) {
        acc.push(browserName);
      }
      return acc;
    }, [] as string[]);

  return {
    browsers,
    dev,
  };
}

function MatchInstalledBrowsers(browsers: string[]) {
  const availableBrowsers = GetInstalledBrowsers();
  const matchedBrowsers: BrowserPath[] = [];
  
  for (const availableBrowser of availableBrowsers) {
    const availableBrowserName = toKebabCase(availableBrowser.name);
    for (const browser of browsers) {
      if (availableBrowserName === browser) {
        matchedBrowsers.push(availableBrowser);
      }
    }
  }

  return matchedBrowsers;
}

function MatchExtVersions(browsers: BrowserPath[]) {
  const versions: Set<2|3> = new Set();

  for (const browser of browsers) {
    versions.add(manifestVersion(browser));
  }

  return Array.from(versions);
}

function BuildBrowserExt(browsers: string[]) {
  const matchedBrowsers = MatchInstalledBrowsers(browsers);

  if (matchedBrowsers.length === 0) {
    console.error("No browser found");
    process.exit(1);
  }

  const versions = MatchExtVersions(matchedBrowsers);

  BuildVersionedExt(versions);

  for (const matchedBrowser of matchedBrowsers) {
    const version = manifestVersion(matchedBrowser);
    const inputDir = resolve(OutDir, `v${version}`);
    const outDir = resolve(OutDir, toKebabCase(matchedBrowser.name));

    fse.copySync(inputDir, outDir);
  }
}

function CreateProfileRoot() {
  // create tmp directory if not exists
  const tmpDir = resolve(__dirname, "..", "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const profileRoot = resolve(tmpDir, "profiles");
  if (!fs.existsSync(profileRoot)) {
    fs.mkdirSync(profileRoot);
  }

  return profileRoot;
}

function createProfile(browser: string, profileRoot: string) {
  const profileDir = resolve(profileRoot, browser);

  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
  }

  return profileDir;
}

function getCommand(command: string, args: Record<string, string | null>) {
  let fullCommand = command;

  for (const [key, value] of Object.entries(args)) {
    if (value) {
      fullCommand += ` --${key}=${value}`;
    } else {
      fullCommand += ` --${key}`;
    }
  }

  return fullCommand;
}

function LaunchCommand(browser: BrowserPath, profileDir: string) {
  let command = "web-ext run";
  const args: Record<string, string | null> = {
    "start-url": "example.com",
    "profile-create-if-missing": null,
    "browser-console": null,
    "keep-profile-changes": null,
  };

  if (browser.type === "firefox") {
    args["source-dir"] = `"${resolve(__dirname, "..", "dist", "v2")}"`;
    args["firefox-binary"] = `"${browser.path}"`;
    args["firefox-profile"] = `"${profileDir}"`;

    return getCommand(command, args);
  }

  if (browser.type === "chrome") {
    args["source-dir"] = `"${resolve(__dirname, "..", "dist", "v3")}"`;
    args["target"] = "chromium";
    args["chromium-binary"] = `"${browser.path}"`;
    args["chromium-profile"] = `"${profileDir}"`;

    return getCommand(command, args);
  }

  if (browser.type === "safari") {
    return "echo 'Safari reloading is not supported. Build in XCode and reload manually!'";
  }

  return;
}

function DevBrowserExt(browsers: string[]) {
  const matchedBrowsers = MatchInstalledBrowsers(browsers);

  let versions: (2 | 3)[] = [];
  if (matchedBrowsers.length === 0) {
    versions = [2, 3];
  } else {
    versions = MatchExtVersions(matchedBrowsers);
  }

  DevVersionedExt(versions);

  const profileRoot = CreateProfileRoot();
  const commands: string[] = [];

  for (const matchedBrowser of matchedBrowsers) {
    const profileDir = createProfile(toKebabCase(matchedBrowser.name), profileRoot);
    const command = LaunchCommand(matchedBrowser, profileDir);

    if (command) {
      commands.push(command);
    }
  }

  if (matchedBrowsers.length === 0) {
    commands.push("sleep 100000"); // TODO: A more elegant way of doing nothing?
  }

  const { result } = concurrently(commands);

  result
    .then(() => {
      console.log("All processes exited");
      process.exit(0);
    })
    .catch((err) => {
      for (const { command, exitCode } of err) {
        if (exitCode !== 0) {
          console.error(`${command.command}:\n exited with code ${exitCode}\n`);
          throw new Error(command.error);
        }
      }
    });
}

function Init() {
  const { browsers, dev } = GetArgs();

  if (dev) {
    DevBrowserExt(browsers);
  } else {
    BuildBrowserExt(browsers);
  }
}

Init();