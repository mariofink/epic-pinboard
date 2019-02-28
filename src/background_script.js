import PinboardService from "./services/pinboardService";
const baseApiUrl = "https://api.pinboard.in/v1";
const svc = new PinboardService(baseApiUrl);

function retrieveApiToken() {
  return new Promise((resolve, reject) => {
    browser.storage.sync.get("apitoken").then(res => {
      resolve(res.apitoken);
    });
  });
}

async function login() {
  const token = await retrieveApiToken();
  return svc.login(token);
}

async function loadBookmarks() {
  const token = await retrieveApiToken();
  return svc.loadRecent(token);
}

window.loadBookmarks = loadBookmarks;
window.login = login;
