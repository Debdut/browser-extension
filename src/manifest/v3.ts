import pkg from '../../package.json';
import { ManifestTypeV3 } from './v3-type';

const manifest: ManifestTypeV3 = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  icons: {
    "128": "icon-128.png",
  },
  web_accessible_resources: [
    {
      resources: ["contentStyle.css", "icon-128.png", "icon-34.png"],
      matches: [],
    },
  ],
};

function getManifestV3(folders:string[]): ManifestTypeV3 {
  if (folders.length === 0) {
    return manifest;
  }
  
  if (folders.indexOf('options') > -1) {
    manifest.options_page = "src/pages/options/index.html";
  }
  
  if (folders.indexOf('background') > -1) {
    manifest.background = {
      service_worker: "src/pages/background/index.js",
      type: "module",
    };
  }
  
  if (folders.indexOf('popup') > -1) {
    manifest.action = {
      default_popup: "src/pages/popup/index.html",
      default_icon: "icon-34.png",
    };
  }
  
  if (folders.indexOf('newtab') > -1) {
    manifest.chrome_url_overrides = {
      newtab: "src/pages/newtab/index.html",
    };
  }
  
  if (folders.indexOf('bookmarks') > -1) {
    manifest.chrome_url_overrides = {
      bookmarks: "src/pages/bookmarks/index.html",
    };
  }
  
  if (folders.indexOf('history') > -1) {
    manifest.chrome_url_overrides = {
      history: "src/pages/history/index.html",
    };
  }
  
  if (folders.indexOf('content') > -1) {
    manifest.content_scripts = [
      {
        matches: ["http://*/*", "https://*/*", "<all_urls>"],
        js: ["src/pages/content/index.js"],
        css: ["contentStyle.css"],
      },
    ];
  }
  
  if (folders.indexOf('devtools') > -1) {
    manifest.devtools_page = "src/pages/devtools/index.html";
  }

  return manifest;
}

export default getManifestV3;
