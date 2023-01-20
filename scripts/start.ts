import { GetInstalledBrowsers } from "get-installed-browsers";
import fs from "fs";
import { resolve } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv.length < 3) {
  console.error("Usage: npm run start [<browser>...]");
  process.exit(1);
}

interface Browser {
  name: string;
  type: string;
  path: string;
}

const browsers = process.argv
  .splice(2)
  .reduce((acc, browser) => {
    const browserName = browser.toLowerCase();
    if (acc.indexOf(browserName) === -1) {
      acc.push(browserName);
    }
    return acc;
  }, [] as string[]);

function toKebabCase(str: string) {
  return str.replace(/([a-z]) ([A-Z])/g, "$1-$2").toLowerCase();
}

// create tmp directory if not exists
const tmpDir = resolve(__dirname, "../tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

function createProfile(browser: string) {
  const profileDir = resolve(tmpDir, browser);
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
  }
  return profileDir;
}

function launch(browser: Browser, profileDir: string) {
  if (browser.type === "firefox") {
    return `web-ext --source-dir=dist/v2 run --firefox ${browser.path} --start-url example.com --firefox-profile ${profileDir} --profile-create-if-missing --keep-profile-changes`;
  }
  if (browser.type === "chrome") {
    return `web-ext --source-dir=dist/v3 run -t chromium --chromium-binary ${browser.path} --start-url example.com --chromium-profile ${profileDir} --profile-create-if-missing --keep-profile-changes`
  }
  return;
}

(async function Init() {
  const availableBrowsers = await GetInstalledBrowsers();
  const matchedBrowsers: Browser[] = [];
  
  for (const availableBrowser of availableBrowsers) {
    const availableBrowserName = toKebabCase(availableBrowser.name);
    for (const browser of browsers) {
      if (availableBrowserName === browser) {
        matchedBrowsers.push(availableBrowser);
      }
    }
  }

  for (const matchedBrowser of matchedBrowsers) {
    const profileDir = createProfile(toKebabCase(matchedBrowser.name));
    const command = launch(matchedBrowser, profileDir);
    console.log(command + "\n");
  }
})();