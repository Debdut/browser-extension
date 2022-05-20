const { version } = require('../version.json');
const permissions = require('../permissions');
const { name, short_name, description } = require('../app_info');

module.exports = {
  version,
  manifest_version: 3,
  name,
  short_name,
  description,
  permissions,
  host_permissions: ["<all_urls>"],
  action: {
    default_title: name,
    default_popup: "assets/html/popup.html",
    default_icon: "assets/images/logo.png"
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      // css: ["styles.css"],
      js: ["content.js"]
    }
  ],
  icons: {
    "128": "assets/images/logo.png"
  },
  background: {
    service_worker: "background.js"
  },
  web_accessible_resources: [{
    resources: ["assets/**"],
    matches: ["<all_urls>"]
  }]
};
