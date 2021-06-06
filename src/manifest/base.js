const { version } = require('./version.json');

module.exports = {
  version,
  manifest_version: 2,
  name: "Browser Extension",
  short_name: "A Default Template",
  description: "A Default Template",
  permissions: [
    "storage",
    "unlimitedStorage",
    "tabs",
    "activeTab",
    "identity", 
    "alarms",
    "https://*/*",
    "windows",
    "contextMenus"
  ],
  browser_action: {
    "default_title": "Browser Extension",
    "default_popup": "assets/html/popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      // "css": ["myStyles.css"],
      "js": ["content.js"]
    }
  ],
  icons: {
    "128": "assets/images/logo.png"
  },
  background: {
    "scripts": ["background.js"]
  },
  web_accessible_resources: [
    "assets/**"
  ],
  // ...(process.env.NODE_ENV === 'development' ? {
  //   content_security_policy: "script-src 'self' 'unsafe-eval'; font-src 'self' data: https://fonts.gstatic.com/s/dmsans; object-src 'self';"
  // } : {})
};
