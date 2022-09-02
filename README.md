# Browser Extension Template [![Generic badge](https://img.shields.io/twitter/follow/kdebdut?style=social)](https://twitter.com/KDebdut)

## w/ React Preact Typescript

![Generic badge](https://img.shields.io/badge/build-success-brightgreen.svg)

> A Out of the Box 🎁 Browser Extension Template with support for React, Preact, Typescript and Manifest V3 and builds on most browsers including Chrome, Firefox, Safari, Edge, Brave.

## 🏡 Builtin

- Manifest v3/v2
- Multi Browser build including Chrome, Firefox, Safari, Edge, Brave
- Content Script
- Background Page or Service Worker
- Popup Page
- Options Page
- Automatically opens browser
- Autoreloads browser
- Saves browser profiles for next start

## 🎗 Supports

- React 18
- Typescript
- Preact X
- PostCSS
- GraphQL
- JSON Imports
- Sass
- Webpack 5

Simply remove or don't use the technologies you don't like.

## Start Commands

```sh
npm install
npm run prebuild
npm run init:profile
npm run build:<browser_name> # brave | chrome | firefox
npm run start:<browser_name> # brave | chrome | firefox
```

After first run, you can just do `npm run start:<browser_name>`

## 👩🏻‍🏫 Notes

Browser binary paths needs to changed based on the OS and install locations in `package.json`. The default binary locations work for Mac OS.

- Locate `reload:chrome` command in `package.json`
- Change chrome path after `--chromium-binary` to chrome's path in your os
- Example, `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome`
- Do that for every browser

Similarly, you can change the starting pages in browsers by changing `--start-url` variable in `reload:<browser_name>` command

Content Scripts, Popup and Options Page support React

You can choose to not use react in any of these, just remove the react imports

React, Preact, Typescript or PostCSS are all optional

For Disabling TS

- Just change file extensions ts to js and tsx to jsx
- Change all ts to js and tsx to jsx in `webpack/base.js`

For Preact builds

- Disable TS using instructions above
- `npm install preact`
- Enable `{ "pragma":"h" }` in `webpack/base.js`
- Enable `"jsxImportSource": "preact"` in `tsconfig.json`
- Change react imports to preact

```js
import { render } from "react-dom";
import React from "react";

import { h, render } from "preact";
```

Default Builds use manifest v3 in chrome, v2 in firefox and safari. To build with manifest v2:

- Manifest versions are per browser basis
- For example, to change firefox build to v3
- Change `base/v2` require to `base/v3` in `src/manifest/firefox.js`

## Commands

```sh
# Initial Setup
# Install packages
npm install

# Prebuild
npm run prebuild

# Init dirs for browser profiles
npm run init:profile

# Live Build for specific browser
# browser_name: brave | chrome | firefox | safari
npm run watch:<browser_name>

# Live Build for chrome
npm run watch:chrome

# Live Build and Reload for specific browser
# browser_name: brave | chrome | firefox | safari
npm run start:<browser_name>

# Live Build and Reload for chrome
npm run start:chrome

# Build for all Browsers
npm run build

# Build for specific browser
# browser_name: chrome | firefox | safari
npm run build:<browser_name>

# Build for chrome
npm run build:chrome

# Run Tests with Mocha
npm run test

# Clean Builds
npm run clean
```

## Browser Support

- [x] Chrome
- [x] Firefox
- [x] Opera (Chrome Build)
- [x] Edge (Chrome Build)
- [x] Brave
- [x] Safari
