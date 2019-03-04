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

async function addBookmark(bookmark) {
  const token = await retrieveApiToken();
  return svc.addBookmark(token, bookmark);
}

async function getSuggestedTagsForUrl(bookmarkUrl) {
  const token = await retrieveApiToken();
  return svc.getSuggestedTagsForUrl(token, bookmarkUrl);
}

window.retrieveApiToken = retrieveApiToken;
window.loadBookmarks = loadBookmarks;
window.login = login;
window.addBookmark = addBookmark;
window.getSuggestedTagsForUrl = getSuggestedTagsForUrl;
