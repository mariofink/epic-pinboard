const pkg = require("../../package.json");

const manifestInput = {
  manifest_version: 2,
  name: "Epic Pinboard",
  version: pkg.version,

  icons: {
    "16": "assets/icons/icon.png",
    "32": "assets/icons/pinboard-icon_32.png",
    "48": "assets/icons/pinboard-icon_48.png",
    "128": "assets/icons/pinboard-icon_128.png",
  },

  description: "Browser extension for Pinboard.in",
  homepage_url: "https://github.com/mariofink/epic-pinboard",
  short_name: "Epic Pinboard",

  permissions: [
    "*://api.pinboard.in/*",
    "activeTab",
    "tabs",
    "menus",
    "notifications",
    "storage",
  ],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

  __firefox__applications: {
    gecko: { id: "epic-pinboard@mariofink.de" },
  },

  "__chrome|firefox__author": "mariofink",

  __chrome__minimum_chrome_version: "49",

  page_action: {
    show_matches: ["*://*/*"],
    browser_style: true,
    default_icon: {
      "16": "assets/icons/icon.png",
      "32": "assets/icons/pinboard-icon_32.png",
      "48": "assets/icons/pinboard-icon_48.png",
      "128": "assets/icons/pinboard-icon_128.png",
    },
    default_popup: "popup.html",
    default_title: "Bookmark on Pinboard",
  },

  "__chrome|opera__options_page": "options.html",

  options_ui: {
    page: "options.html",
    open_in_tab: true,
    __chrome__chrome_style: false,
  },

  background: {
    scripts: ["js/background.bundle.js"],
    "__chrome|opera__persistent": false,
  },

  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["js/contentScript.bundle.js"],
    },
  ],

  commands: {
    _execute_page_action: {
      suggested_key: {
        default: "Alt+P",
      },
      description: "Add bookmark to Pinboard",
    },
  },
};

module.exports = manifestInput;
