// Put all the javascript code here, that you want to execute in background.

function loadOptions(options) {
  const apikey = options.apikey;
  if (typeof apikey !== "undefined") {
    console.log("loaded apikey", apikey);
  } else {
    console.log("no apikey found");
  }
}

// Fires on startup
browser.storage.local.get().then(loadOptions, err => {
  console.error("error local storage");
});
