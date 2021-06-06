const base = require('./base');

module.exports = {
  ...base,
  browser_specific_settings: {
    gecko: {
      id: "preact@example.com",
      strict_min_version: "42.0"
    }
  }  
}