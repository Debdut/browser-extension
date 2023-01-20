import * as fs from "fs";
import * as path from "path";
import colorLog from "../log";
import { getManifestV2, getManifestV3 } from "../../../src/manifest";
import { PluginOption } from "vite";

const { resolve } = path;

const outDir = resolve(__dirname, "..", "..", "..", "public");
console.log(outDir);

export default function makeManifest(folders: string[], version: 2 | 3): PluginOption {
  let manifest: any;
  let versionOutDir = resolve(outDir, `v${version}`);
  
  if (version === 2) {
    manifest = getManifestV2(folders);
  } else if (version === 3) {
    manifest = getManifestV3(folders);
  } else {
    throw new Error("Invalid version");
  }

  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      if (!fs.existsSync(versionOutDir)) {
        fs.mkdirSync(versionOutDir);
      }

      const manifestPath = resolve(versionOutDir, "manifest.json");

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    },
  };
}
