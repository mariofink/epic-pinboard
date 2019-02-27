const apiTokenInput = document.querySelector("#apitoken");

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    apitoken: apiTokenInput.value
  });
}

function restoreOptions() {
  browser.storage.sync.get("apitoken").then(res => {
    apiTokenInput.value = res.apitoken || "";
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
