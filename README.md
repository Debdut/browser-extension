# Browser Extension Template [![Generic badge](https://img.shields.io/twitter/follow/kdebdut?style=social)](https://twitter.com/KDebdut)

## w/ React Preact Typescript

![Generic badge](https://img.shields.io/badge/build-success-brightgreen.svg)

> An out of the box, Browser Extension Template with fast Vite builds, support for React, Preact, Typescript, Manifest V3/V2 support and multi browser build including Chrome, Firefox, Safari, Edge, Brave.

## Builtin

- Manifest v3/v2
- Multi Browser build including Chrome, Firefox, Safari, Edge, Brave
- Content Script
- Background Page or Service Worker
- Popup Page
- Options Page
- Devtools Page
- Newtab Page
- Automatically opens browser
- Runs multiple browsers in parallel
- Autoreloads browser
- Saves browser profiles for next start

 ## Start Commands

```sh
npm install
npm run start [browsers]
# example
# npm run start chrome firefox brave safari
```

That's it, if you got the browsers in the start command installed, it automatically builds for that, starts all of them, loads the extensions and reloads them on change. Vite makes sure the builds and reloads are really fast.

See browser support below.

## Supports

- Vite 3
- React 18
- Typescript
- Preact X
- PostCSS

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

Just delete the folders of pages you don't require, the builds scripts detects automatically what's in there and adjusts the manifest automatically. In each of the pages folder, the target main script is the first of

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

Updates:

- Webpack to Vite: 5x faster builds
- Detects all browsers automatically
- Automatic Manifest
- All Extension Pages and Scripts Support
- 17 browsers support

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

# Clean Builds
npm run clean
```

## Credits

V2 wouldn't have been possible without my brilliant friend [Sayan Naskar](https://github.com/nascarsayan), the more credit we give him is less!
