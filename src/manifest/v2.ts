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

function getManifestV2(pageDirMap: { [x: string]: any }): ManifestTypeV2 {
  const pages = Object.keys(pageDirMap);

  if (pages.length === 0) {
    return manifest;
  }

  if (pages.indexOf("options") > -1) {
    manifest.options_ui = {
      page: pageDirMap["options"],
    };
  }

  if (pages.indexOf("background") > -1) {
    manifest.background = {
      scripts: [pageDirMap["background"]],
    };
  }

  if (pages.indexOf("popup") > -1) {
    manifest.browser_action = {
      default_popup: pageDirMap["popup"],
      default_icon: "icon-34.png",
    };
  }

  if (pages.indexOf("content") > -1) {
    manifest.content_scripts = [
      {
        matches: ["http://*/*", "https://*/*", "<all_urls>"],
        js: [pageDirMap["content"]],
      },
    ];
  }

  if (pages.indexOf("devtools") > -1) {
    manifest.devtools_page = pageDirMap["devtools"];
  }

  return manifest;
}

export default getManifestV2;
