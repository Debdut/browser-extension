import * as fs from "fs";
import * as path from "path";
import colorLog from "../log";
import { PluginOption } from "vite";

const { resolve } = path;

const root = resolve(__dirname, "..", "..", "..");
const contentStyle = resolve(root, "src", "pages", "content", "style.css");
const outDir = resolve(__dirname, "..", "..", "..", "public");

export default function copyContentStyle(version: 2|3): PluginOption {
  let versionOutDir = resolve(outDir, `v${version}`);

  return {
    name: "copy-content-style",
    buildEnd() {
      fs.copyFileSync(contentStyle, resolve(versionOutDir, "contentStyle.css"));

      colorLog("contentStyle copied", "success");
    },
  };
}
