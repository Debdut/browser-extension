import { GetInstalledBrowsers, BrowserPath } from "get-installed-browsers";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv.length < 3) {
  console.error("Usage: npm run build [<browser>...]");
  process.exit(1);
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

const dist = resolve(__dirname, "..", "dist");
const v2 = resolve(dist, "v2");
const v3 = resolve(dist, "v3");

function manifestVersion(browser: BrowserPath) {
  if (browser.type === "firefox") {
    return 2;
  } else if (browser.type === "chrome") {
    return 3;
  } else if (browser.type === "safari") {
    return 2;
  }

  return -1;
}


function Init() {
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

  if (matchedBrowsers.length === 0) {
    console.error("No browser found");
    process.exit(1);
  }

  const commands: string[] = [];
  const versions: Set<number> = new Set();

  for (const matchedBrowser of matchedBrowsers) {
    versions.add(manifestVersion(matchedBrowser));
  }

  for (const version of versions) {
    commands.unshift(`npm run build:v${version}`);
  }

  for (const matchedBrowser of matchedBrowsers) {
    const version = manifestVersion(matchedBrowser);
    const inputDir = version === 2 ? v2 : v3;
    const outDir = resolve(dist, toKebabCase(matchedBrowser.name));

    commands.push(`cp -r ${inputDir} ${outDir}` )
  }

  for (const command of commands) {
    console.log(command  + "\n\n");

    try {
      execSync(command, { stdio: "inherit" });      
    } catch (error) {
    }
  }
}

Init();
