# Browser Extension Template w/ Preact Typescript [![Generic badge](https://img.shields.io/twitter/follow/KarmakarDebdut?style=social)](https://twitter.com/KarmakarDebdut)

![Generic badge](https://img.shields.io/badge/build-success-brightgreen.svg) ![Generic badge](https://img.shields.io/badge/tests-100%25-brightgreen.svg)

> _A Out of the Box 🎁 Browser Extension Template with support for Preact, React, Typescript _

## 🏡 Builtin

- Manifest V2
- Content Scripts
- Background Worker
- Popup
- Options Page

## 🎗 Supports

- Preact X
- React 17
- Typescript
- PostCSS
- GraphQL
- JSON Imports
- Sass
- Webpack 5

Simply remove or don't use the technologies you don't like.

## 👩🏻‍🏫 Notes

🥇 Content Scripts, Popup and Options Page support Preact

🥈 You can choose to not use preact in any of these, just remove the preact imports

🥉 React, Preact, Typescript or PostCSS are all optional -- for react builds

- `npm install react`
- Delete this line `"jsxImportSource": "preact"` in `tsconfig.json`
- Change preact imports to react

## Commands

```sh
# Live Build for specific browser
# browser_name: chrome | firefox | safari 
npm run start:<browser_name>

# Live Build for chrome
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
- [x] Edge (Chrome  Build)
- [x] Safari
