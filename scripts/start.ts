import { GetInstalledBrowsers, BrowserPath } from "get-installed-browsers";
import fs from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import concurrently from "concurrently";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv.length < 3) {
  console.error("Usage: npm run start [<browser>...]");
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

// create tmp directory if not exists
const tmpDir = resolve(__dirname, "..", "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const tmpProfileDir = resolve(tmpDir, "profiles");
if (!fs.existsSync(tmpProfileDir)) {
  fs.mkdirSync(tmpProfileDir);
}

function createProfile(browser: string) {
  const profileDir = resolve(tmpProfileDir, browser);
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
  }
  return profileDir;
}

function GetCommand(command: string, args: Record<string, string | null>) {
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

function launchCommand(browser: BrowserPath, profileDir: string) {
  let command = "web-ext run";
  const args: Record<string, string | null> = {
    "start-url": "example.com",
    "profile-create-if-missing": null,
    "browser-console": null,
    "keep-profile-changes": null,
    "verbose": null,
  };

  if (browser.type === "firefox") {
    args["source-dir"] = `"${resolve(__dirname, "..", "dist", "v2")}"`;
    args["firefox-binary"] = `"${browser.path}"`;
    args["firefox-profile"] = `"${profileDir}"`;

    return GetCommand(command, args);
  }
  if (browser.type === "chrome") {
    args["source-dir"] = `"${resolve(__dirname, "..", "dist", "v3")}"`;
    args["target"] = "chromium";
    args["chromium-binary"] = `"${browser.path}"`;
    args["chromium-profile"] = `"${profileDir}"`;

    return GetCommand(command, args);
  }
  if (browser.type === "safari") {
    return "echo 'Safari reloading is not supported. Build in XCode and reload manually!'";
  }

  return;
}

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

  const commands: string[] = [];
  const versions: Set<number> = new Set();

  for (const matchedBrowser of matchedBrowsers) {
    const profileDir = createProfile(toKebabCase(matchedBrowser.name));
    const command = launchCommand(matchedBrowser, profileDir);

    if (command) {
      commands.push(command);
    }

    versions.add(manifestVersion(matchedBrowser));
  }

  if (commands.length === 0) {
    console.error("No browser found");
    process.exit(1);
  }

  for (const version of versions) {
    commands.unshift(`npm run dev:v${version}`);
    execSync(`npm run build:v${version}`, { stdio: "inherit" });
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

Init();
