# Browser Extension Template

## w/ React Preact Typescript ESBuild

![Generic badge](https://img.shields.io/badge/build-success-brightgreen.svg)

> Browser Extension Template with ESbuild builds, support for React, Preact, Typescript, Tailwind, Manifest V3/V2 support and multi browser build including Chrome, Firefox, Safari, Edge, Brave.

## Builtin

- Fast 100ms builds: ESBuild
- Manifest v3/v2 in TS
- 17+ Browsers Support
- 8+ Pages: content, bookmarks, popup, ...
- Auto Opens Browser
- Run Multiple Browsers in Parallel
- Autoreloads Browser
- Isolated Browser Profiles

 ## Commands

```sh
# Install packages
npm install

# Live Dev for multiple browsers
npm run start [browser]
# npm run start chrome firefox safari

# Build for multiple browsers
npm run build [browser]
# npm run build chrome firefox safari
```

That's it, if you got the browsers in the start command installed, it automatically builds for that, starts all of them, loads the extensions and reloads them on change. ESBuild makes sure the builds and reloads are really fast.

See browser support below.

## Supports

- ESBuild
- React 18
- Typescript
- Preact X
- PostCSS
- TailwindCSS
- CSS Modules

Simply remove or don't use the technologies you don't like.

Scripts & Pages (located in `src/pages`):

- background
- content
- history
- options
- popup
- bookmarks  
- devtools   
- newtab
- panel

Just delete the folders of pages you don't require, the builds scripts detects automatically what's in there and adjusts the manifest automatically.

Browsers:
- arc
- brave
- chrome
- chrome-beta
- chrome-canary
- chromium
- edge
- firefox
- firefox-developer-editon
- firefox
- opera
- orion *
- safari *
- safari-beta *
- safari-technical-preview *
- sidekick
- vivaldi

Browsers with * stars get a build, but needs to be launched manually, and extension needs to loaded manually with Xcode.

## Notes

If you want webpack build, checkout the webpack branch.

In each of the pages folder, the target main script is the first of

- index.html
- index.ts
- index.tsx
- index.js
- index.jsx
- main.html
- main.ts
- main.tsx
- main.js
- main.jsx

Put your injecting scripts in `public` directory that needs to imported via the `chrome.runtime.getURL` API.

## Credits

V2 wouldn't have been possible without my brilliant friend [Sayan Naskar](https://github.com/nascarsayan), the more credit we give him is less!
