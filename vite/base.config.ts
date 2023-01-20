import fs from "fs";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import makeManifest from "./utils/plugins/make-manifest";
import copyContentStyle from "./utils/plugins/copy-content-style";

const root = resolve(__dirname, "..", "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "..", "dist");
const publicDir = resolve(__dirname, "..", "public");

const folders = fs.readdirSync(pagesDir);

function getInput() {
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

  folders.forEach((folder) => {
    const pages = resolve(pagesDir, folder);
    if (!fs.statSync(pages).isDirectory()) {
      return;
    }
    const entry = getFirstExistingFile(folder);
    if (entry) {
      input[folder] = entry;
    }
  });

  return input;
}

export default function (version: 2 | 3) {
  const versionOutDir = resolve(outDir, `v${version}`);
  const versionPublicDir = resolve(publicDir, `v${version}`);
  
  return {
    resolve: {
      alias: {
        "@src": root,
        "@assets": assetsDir,
        "@pages": pagesDir,
      },
    },
    plugins: [react(), makeManifest(folders, version), copyContentStyle(version)],
    publicDir: versionPublicDir,
    build: {
      outDir: versionOutDir,
      sourcemap: process.env.__DEV__ === "true",
      rollupOptions: {
        input: getInput(),
        output: {
          entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
        },
        watch: {
          exclude: ["node_modules/**"],
        },
      },
    },
  };
};
