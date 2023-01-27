import pkg from "../../package.json";
import { ManifestTypeV2 } from "./v2-type";

const manifest: ManifestTypeV2 = {
  manifest_version: 2,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  icons: {
    "128": "icon-128.png",
  },
  web_accessible_resources: ["contentStyle.css", "icon-128.png", "icon-34.png", "assets/*"],
};

function getManifestV2(folders: string[]): ManifestTypeV2 {
  if (folders.length === 0) {
    return manifest;
  }

  if (folders.indexOf("options") > -1) {
    manifest.options_ui = {
      page: "src/pages/options/index.html"
    };
  }

  if (folders.indexOf("background") > -1) {
    manifest.background = {
      scripts: ["src/pages/background/index.js"],
    };
  }

  if (folders.indexOf("popup") > -1) {
    manifest.browser_action = {
      default_popup: "src/pages/popup/index.html",
      default_icon: "icon-34.png",
    };
  }

  if (folders.indexOf("content") > -1) {
    manifest.content_scripts = [
      {
        matches: ["http://*/*", "https://*/*", "<all_urls>"],
        js: ["src/pages/content/index.js"],
        css: ["contentStyle.css"],
        
      },
    ];
  }

  if (folders.indexOf("devtools") > -1) {
    manifest.devtools_page = "src/pages/devtools/index.html";
  }

  return manifest;
}

export default getManifestV2;
